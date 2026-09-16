import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export type SenderReceiptProps = {
  ref: string;
  name: string;
  service: string;
  message: string;
  phone: string;
  email: string;
};

/**
 * The confirmation the enquirer gets. Its job is to prove the message
 * arrived, say what happens next without inventing a promise, and give a
 * phone number for anyone who does not want to wait.
 */
export function SenderReceipt({
  ref,
  name,
  service,
  message,
  phone,
  email,
}: SenderReceiptProps) {
  const first = name.trim().split(/\s+/)[0] ?? name;
  return (
    <Html lang="en">
      <Head />
      <Preview>{`We have your message. Reference ${ref}.`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>Consultants RS LLC</Text>
          <Heading style={h1}>Thanks, {first}.</Heading>
          <Text style={lede}>
            Your message reached us and one of us will read it personally. We are a team
            of two, so the reply comes from a person rather than a queue.
          </Text>

          <Section style={card}>
            <Text style={label}>What you sent</Text>
            <Text style={metaLine}>{service}</Text>
            <Text style={quote}>{message}</Text>
            <Text style={refLine}>Reference {ref}</Text>
          </Section>

          <Text style={lede}>
            If it is urgent, call{' '}
            <Link href={`tel:${phone.replace(/[^\d+]/g, '')}`} style={link}>
              {phone}
            </Link>{' '}
            rather than waiting on email.
          </Text>

          <Hr style={hr} />
          <Text style={foot}>
            Consultants RS LLC · 268 Post Road, Suite 200, Fairfield, CT 06824 ·{' '}
            <Link href={`mailto:${email}`} style={link}>
              {email}
            </Link>
            <br />
            You are receiving this because you sent us a message. We do not add enquirers
            to a mailing list.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default SenderReceipt;

const body = {
  backgroundColor: '#f5f0eb',
  margin: 0,
  padding: '28px 0',
  fontFamily: 'Helvetica, Arial, sans-serif',
};
const container = {
  backgroundColor: '#ffffff',
  maxWidth: '560px',
  margin: '0 auto',
  padding: '32px 34px',
  border: '1px solid #e2dace',
};
const brand = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  color: '#8a6736',
  margin: '0 0 18px',
};
const h1 = {
  fontSize: '26px',
  fontWeight: 400,
  letterSpacing: '-0.02em',
  color: '#17171a',
  margin: '0 0 12px',
};
const lede = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: '#5a5855',
  margin: '0 0 20px',
};
const card = {
  backgroundColor: '#f8f5f1',
  border: '1px solid #e2dace',
  padding: '18px 20px',
  margin: '0 0 22px',
};
const label = {
  fontSize: '10.5px',
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: '#8a847b',
  margin: '0 0 10px',
};
const metaLine = {
  fontSize: '13px',
  fontWeight: 700,
  color: '#17171a',
  margin: '0 0 10px',
};
const quote = {
  fontSize: '14.5px',
  lineHeight: '1.7',
  color: '#17171a',
  whiteSpace: 'pre-wrap' as const,
  margin: '0 0 14px',
};
const refLine = {
  fontSize: '11.5px',
  letterSpacing: '0.1em',
  color: '#8a847b',
  margin: 0,
};
const link = { color: '#8a6736', textDecoration: 'underline' };
const hr = { borderColor: '#e2dace', margin: '26px 0 16px' };
const foot = { fontSize: '12px', lineHeight: '1.65', color: '#8a847b', margin: 0 };
