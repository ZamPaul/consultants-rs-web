/**
 * Registry TLS preflight.
 *
 * `UNABLE_TO_VERIFY_LEAF_SIGNATURE` from corepack or pnpm means Node does not
 * trust the certificate chain it is being served for registry.npmjs.org.
 * Node ships its own CA bundle and ignores the Windows certificate store, so
 * anything doing HTTPS inspection (antivirus, a corporate proxy, some VPNs)
 * breaks Node while leaving browsers working perfectly.
 *
 * This prints who is actually issuing the certificate, and whether trusting
 * the OS store fixes it.
 *
 *   node check-tls.mjs
 *
 * Delete this file once the registry works.
 */
import tls from 'node:tls';
import https from 'node:https';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HOST = 'registry.npmjs.org';
const isChild = process.argv.includes('--child');

function chain() {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: HOST, port: 443, servername: HOST, rejectUnauthorized: false },
      () => {
        const out = [];
        let cert = socket.getPeerCertificate(true);
        const seen = new Set();
        while (cert && cert.fingerprint && !seen.has(cert.fingerprint)) {
          seen.add(cert.fingerprint);
          out.push({
            subject: cert.subject?.CN ?? '(none)',
            issuer: cert.issuer?.CN ?? '(none)',
            org: cert.issuer?.O ?? '',
          });
          if (cert.issuerCertificate === cert) break;
          cert = cert.issuerCertificate;
        }
        socket.end();
        resolve(out);
      },
    );
    socket.on('error', (e) => resolve([{ error: e.message }]));
  });
}

function fetchOk() {
  return new Promise((resolve) => {
    https
      .get(`https://${HOST}/pnpm`, (res) => {
        res.resume();
        resolve({ ok: true, status: res.statusCode });
      })
      .on('error', (e) => resolve({ ok: false, code: e.code, message: e.message }));
  });
}

const verdict = await fetchOk();

if (isChild) {
  console.log(
    verdict.ok
      ? `  with --use-system-ca:  OK (${verdict.status})`
      : `  with --use-system-ca:  FAILED (${verdict.code})`,
  );
  process.exit(verdict.ok ? 0 : 1);
}

console.log(`node            ${process.version} on ${process.platform}`);
console.log(`NODE_EXTRA_CA_CERTS  ${process.env.NODE_EXTRA_CA_CERTS ?? '(not set)'}`);
console.log(`NODE_OPTIONS         ${process.env.NODE_OPTIONS ?? '(not set)'}`);
console.log(
  `proxy vars           ${
    ['HTTPS_PROXY', 'https_proxy', 'HTTP_PROXY', 'http_proxy']
      .filter((k) => process.env[k])
      .join(', ') || '(none)'
  }`,
);

console.log(`\ncertificate chain served for ${HOST}:`);
for (const link of await chain()) {
  if (link.error) console.log(`  error: ${link.error}`);
  else
    console.log(
      `  ${link.subject}\n     issued by  ${link.issuer}${link.org ? ` (${link.org})` : ''}`,
    );
}

console.log('\nplain https GET:');
console.log(
  verdict.ok
    ? `  default CA bundle:     OK (${verdict.status})`
    : `  default CA bundle:     FAILED (${verdict.code})`,
);

if (!verdict.ok) {
  const self = fileURLToPath(import.meta.url);
  const r = spawnSync(process.execPath, ['--use-system-ca', self, '--child'], {
    stdio: 'inherit',
  });
  if (r.status === null || r.error) {
    console.log('  with --use-system-ca:  flag not supported by this Node build');
  }
  console.log(
    '\nIf the chain above is issued by anything other than a public CA ' +
      '(ISRG, DigiCert, GlobalSign, Amazon), that is the thing intercepting you.',
  );
}
