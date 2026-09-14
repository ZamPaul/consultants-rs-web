import { z } from 'zod';

/**
 * One schema, used by react-hook-form in the browser and again by the server
 * action. The server never trusts the client's copy; it re-parses the payload.
 *
 * Name and message are required here and were optional in the prototype.
 * An enquiry carrying only an email address is a bot, not a lead.
 */
export const SERVICES = [
  'Business Launch & Setup',
  'Marketing & Promotion',
  'Advertising Campaigns',
  'Not sure yet',
] as const;

export type Service = (typeof SERVICES)[number];

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name.').max(120),
  email: z.email('That email address does not look right.').max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  service: z.enum(SERVICES),
  message: z
    .string()
    .trim()
    .min(10, 'A sentence or two about the business is enough.')
    .max(4000),
  /** Honeypot. Real people never fill this; it is hidden and unlabelled. */
  company: z.literal('').optional(),
  turnstileToken: z.string().min(1, 'Please complete the verification.'),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const ENQUIRY_STATUSES = ['new', 'contacted', 'won', 'lost', 'spam'] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

/**
 * The select shows display strings and the database stores enum values.
 * Mapping them here, once, is what stops a copy change in the UI from
 * silently becoming a new database value.
 */
export const SERVICE_DB = {
  'Business Launch & Setup': 'business_launch',
  'Marketing & Promotion': 'marketing',
  'Advertising Campaigns': 'advertising',
  'Not sure yet': 'unsure',
} as const satisfies Record<Service, string>;

export const SERVICE_LABEL = Object.fromEntries(
  Object.entries(SERVICE_DB).map(([label, value]) => [value, label]),
) as Record<(typeof SERVICE_DB)[Service], Service>;
