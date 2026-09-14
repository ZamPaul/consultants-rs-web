import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';

export type TeamAlertProps = {
  ref: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  receivedAt: string;
};

/**
 * The internal alert. Built to be scanned in three seconds on a phone, which
 * is where it will actually be read: who, what they want, and how to reply,
 * before anything else. The reply-to on the send is the enquirer's own
 * address, so hitting reply in any mail client answers the customer directly.
 */
export function TeamAlert(props: TeamAlertProps) {
  const { ref, name, email, phone, service, message, receivedAt } = props;
  return (
    <Html lang="en">
      <Head />
      <Preview>{`${name} · ${service} · ${ref}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={eyebrow}>New enquiry</Text>
          <Heading style={h1}>{name}</Heading>
          <Text style={lede}>{service}</Text>

          <Section style={card}>
            <Row>
              <Column style={label}>Email</Column>
              <Column style={value}>
                <Link href={`mailto:${email}`} style={link}>
                  {email}
                </Link>
              </Column>
            </Row>
            {phone ? (
              <Row>
                <Column style={label}>Phone</Column>
                <Column style={value}>
                  <Link href={`tel:${phone.replace(/[^\d+]/g, '')}`} style={link}>
                    {phone}
                  </Link>
                </Column>
              </Row>
            ) : null}
            <Row>
              <Column style={label}>Reference</Column>
              <Column style={value}>{ref}</Column>
            </Row>
            <Row>
              <Column style={label}>Received</Column>
              <Column style={value}>{receivedAt}</Column>
            </Row>
          </Section>

          <Text style={label}>Message</Text>
          <Text style={quote}>{message}</Text>

          <Hr style={hr} />
          <Text style={foot}>
            Reply to this email to answer {name} directly. The enquiry is stored against
            reference {ref}.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default TeamAlert;

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
const eyebrow = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: '#8a6736',
  margin: '0 0 10px',
};
const h1 = {
  fontSize: '26px',
  fontWeight: 400,
  letterSpacing: '-0.02em',
  color: '#17171a',
  margin: '0 0 4px',
};
const lede = { fontSize: '15px', color: '#5a5855', margin: '0 0 24px' };
const card = {
  backgroundColor: '#f8f5f1',
  border: '1px solid #e2dace',
  padding: '16px 18px',
  marginBottom: '24px',
};
const label = {
  fontSize: '10.5px',
  fontWeight: 700,
  letterSpacing: '0.16em',
  textTransform: 'uppercase' as const,
  color: '#8a847b',
  padding: '6px 14px 6px 0',
  width: '96px',
  verticalAlign: 'top' as const,
  margin: '0 0 8px',
};
const value = {
  fontSize: '14.5px',
  color: '#17171a',
  padding: '6px 0',
  verticalAlign: 'top' as const,
};
const link = { color: '#8a6736', textDecoration: 'underline' };
const quote = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: '#17171a',
  whiteSpace: 'pre-wrap' as const,
  borderLeft: '2px solid #c39b69',
  paddingLeft: '16px',
  margin: '8px 0 0',
};
const hr = { borderColor: '#e2dace', margin: '28px 0 16px' };
const foot = { fontSize: '12.5px', lineHeight: '1.6', color: '#8a847b', margin: 0 };
