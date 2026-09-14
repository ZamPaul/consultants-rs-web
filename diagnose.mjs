/**
 * Registry diagnosis. No dependencies, no network call without a hard timeout,
 * so this finishes in well under a minute even when everything is broken.
 *
 *   node diagnose.mjs
 *
 * It walks the same path `npm i -g pnpm` walks, one layer at a time, and stops
 * being vague at the layer that actually fails: config, DNS, TCP, TLS, the
 * small manifest fetch, then the large tarball fetch. A hang on the last of
 * those is a very different problem from a hang on the first.
 */
import dns from 'node:dns';
import net from 'node:net';
import tls from 'node:tls';
import https from 'node:https';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const PNPM = '10.34.5';
const ok = (s) => `  OK    ${s}`;
const bad = (s) => `  FAIL  ${s}`;
const info = (s) => `        ${s}`;
const head = (s) => `\n=== ${s} ===`;

function ms(t) {
  return `${Math.round(t)}ms`;
}
function withTimeout(promise, msLimit, label) {
  return Promise.race([
    promise,
    new Promise((res) => setTimeout(() => res({ timeout: true, label }), msLimit)),
  ]);
}

/* ---------------------------------------------------------------- 1. env */
console.log(head('environment'));
console.log(info(`node        ${process.version}  ${process.platform}/${process.arch}`));
const npmv = spawnSync('npm', ['--version'], {
  encoding: 'utf8',
  shell: true,
  timeout: 15000,
});
console.log(info(`npm         ${(npmv.stdout || '').trim() || '(no answer in 15s)'}`));
const prefix = spawnSync('npm', ['prefix', '-g'], {
  encoding: 'utf8',
  shell: true,
  timeout: 15000,
});
const globalPrefix = (prefix.stdout || '').trim();
console.log(info(`global dir  ${globalPrefix || '(unknown)'}`));
if (/program files/i.test(globalPrefix)) {
  console.log(
    bad('global installs target Program Files, which needs an elevated terminal'),
  );
}
for (const k of [
  'HTTP_PROXY',
  'HTTPS_PROXY',
  'http_proxy',
  'https_proxy',
  'NO_PROXY',
  'NODE_OPTIONS',
  'NODE_EXTRA_CA_CERTS',
]) {
  if (process.env[k]) console.log(info(`${k} = ${process.env[k]}`));
}

/* ------------------------------------------------------------- 2. .npmrc */
console.log(head('.npmrc files (read directly, npm not involved)'));
const candidates = [
  path.join(process.cwd(), '.npmrc'),
  path.join(os.homedir(), '.npmrc'),
  globalPrefix ? path.join(globalPrefix, 'etc', 'npmrc') : null,
  'C:\\Program Files\\nodejs\\node_modules\\npm\\npmrc',
].filter(Boolean);
let sawProxy = false;
for (const f of candidates) {
  if (!fs.existsSync(f)) continue;
  console.log(info(`--- ${f}`));
  for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith(';')) continue;
    const redacted = t.replace(/(_auth(Token)?|_password)\s*=.*/i, '$1=<redacted>');
    console.log(info(`    ${redacted}`));
    if (/^(proxy|https-proxy)\s*=/i.test(t)) sawProxy = true;
  }
}
if (sawProxy) {
  console.log(
    bad('a proxy is configured in .npmrc. If it is dead, npm hangs exactly like this.'),
  );
}

/* ---------------------------------------------------------------- 3. DNS */
console.log(head('DNS'));
for (const fam of [4, 6]) {
  const t0 = performance.now();
  const r = await withTimeout(
    new Promise((res) =>
      dns[`resolve${fam}`]('registry.npmjs.org', (e, a) =>
        res(e ? { err: e.code } : { a }),
      ),
    ),
    5000,
  );
  const dt = ms(performance.now() - t0);
  if (r.timeout) console.log(bad(`IPv${fam} lookup timed out after 5s`));
  else if (r.err) console.log(info(`IPv${fam} none (${r.err}) ${dt}`));
  else console.log(ok(`IPv${fam} ${r.a.slice(0, 3).join(', ')} ${dt}`));
}

/* ---------------------------------------------------------------- 4. TCP */
console.log(head('TCP 443'));
const t1 = performance.now();
const tcp = await withTimeout(
  new Promise((res) => {
    const s = net.connect(443, 'registry.npmjs.org', () => {
      s.destroy();
      res({ ok: true });
    });
    s.on('error', (e) => res({ err: e.code }));
  }),
  8000,
);
if (tcp.timeout)
  console.log(bad('connect timed out after 8s. Packets are being dropped, not refused.'));
else if (tcp.err) console.log(bad(`connect failed: ${tcp.err}`));
else console.log(ok(`connected in ${ms(performance.now() - t1)}`));

/* ---------------------------------------------------------------- 5. TLS */
console.log(head('TLS handshake and certificate chain'));
const chain = await withTimeout(
  new Promise((res) => {
    const s = tls.connect(
      {
        host: 'registry.npmjs.org',
        port: 443,
        servername: 'registry.npmjs.org',
        rejectUnauthorized: false,
      },
      () => {
        const out = [];
        let c = s.getPeerCertificate(true);
        const seen = new Set();
        while (c && c.fingerprint && !seen.has(c.fingerprint)) {
          seen.add(c.fingerprint);
          out.push(
            `${c.subject?.CN ?? '?'}  <-  ${c.issuer?.CN ?? '?'}${c.issuer?.O ? ` (${c.issuer.O})` : ''}`,
          );
          if (c.issuerCertificate === c) break;
          c = c.issuerCertificate;
        }
        s.destroy();
        res({ out });
      },
    );
    s.on('error', (e) => res({ err: e.message }));
  }),
  10000,
);
if (chain.timeout) console.log(bad('handshake timed out after 10s'));
else if (chain.err) console.log(bad(chain.err));
else {
  chain.out.forEach((l) => console.log(info(l)));
  const issuer = chain.out.at(-1) ?? '';
  const publicCA =
    /ISRG|DigiCert|GlobalSign|Amazon|Sectigo|Let's Encrypt|Baltimore|USERTrust/i.test(
      issuer,
    );
  console.log(
    publicCA
      ? ok('chain terminates at a public CA')
      : bad('chain does NOT terminate at a public CA. Something is intercepting TLS.'),
  );
}

/* ----------------------------------------------------- 6. manifest fetch */
async function get(url, limitMs, label) {
  const t = performance.now();
  const r = await withTimeout(
    new Promise((res) => {
      const req = https.get(url, (resp) => {
        let bytes = 0;
        resp.on('data', (d) => (bytes += d.length));
        resp.on('end', () => res({ status: resp.statusCode, bytes }));
      });
      req.on('error', (e) => res({ err: e.code || e.message }));
    }),
    limitMs,
  );
  const dt = performance.now() - t;
  if (r.timeout) {
    console.log(bad(`${label} timed out after ${limitMs / 1000}s`));
    return null;
  }
  if (r.err) {
    console.log(bad(`${label} ${r.err}`));
    return null;
  }
  const kbs = r.bytes / 1024 / (dt / 1000);
  console.log(
    ok(
      `${label} ${r.status}, ${(r.bytes / 1024).toFixed(0)} KB in ${ms(dt)}${r.bytes > 200_000 ? ` (${kbs.toFixed(0)} KB/s)` : ''}`,
    ),
  );
  return { kbs, bytes: r.bytes };
}

console.log(head('HTTPS fetches'));
await get('https://registry.npmjs.org/pnpm/10.34.5', 20000, 'manifest  ');

/* ------------------------------------------------------- 7. tarball fetch */
// This is the step `npm i -g pnpm` actually stalls on. The manifest is a few
// KB and usually sails through even on a bad link; the tarball is megabytes,
// and that is where throttling, antivirus scanning and dead proxies show up.
const tar = await get(
  `https://registry.npmjs.org/pnpm/-/pnpm-${PNPM}.tgz`,
  45000,
  'pnpm tarball',
);

/* --------------------------------------------------- 8. alternate routes */
console.log(head('alternate routes (is it npmjs specifically?)'));
await get('https://registry.npmmirror.com/pnpm/10.34.5', 20000, 'npmmirror ');
await get('https://github.com/pnpm/pnpm/releases', 20000, 'github    ');

/* ------------------------------------------------------------ 9. verdict */
console.log(head('verdict'));
if (tar && tar.kbs > 150) {
  console.log(info('The tarball downloads fine from this process. If `npm i -g` still'));
  console.log(
    info('hangs, the problem is npm itself: run it with --loglevel=silly, and'),
  );
  console.log(info('check the global dir permission line above.'));
} else if (tar) {
  console.log(
    info(`Tarball came through at ${tar.kbs.toFixed(0)} KB/s. That is slow enough to`),
  );
  console.log(info('look like a hang. Something is throttling or scanning the stream.'));
} else {
  console.log(
    info('The tarball is the failing layer. Look at which earlier steps passed:'),
  );
  console.log(info('  TCP timed out        -> network level block, use a VPN'));
  console.log(info('  chain not public CA  -> TLS inspection, see check-tls.mjs'));
  console.log(
    info('  manifest OK, tar not -> throttling or antivirus scanning the stream'),
  );
  console.log(
    info('  npmmirror worked     -> npmjs is being singled out, switch registry'),
  );
}
