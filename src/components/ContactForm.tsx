'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Script from 'next/script';
import { submitEnquiry } from '@/app/actions/enquiry';
import { Arrow } from '@/components/Icons';
import { enquirySchema, SERVICES_OPTIONS, type EnquiryInput } from '@/lib/schema';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; ref: string }
  | { kind: 'failed'; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { service: SERVICES_OPTIONS[0], company: '' },
  });

  async function onSubmit(values: EnquiryInput) {
    setStatus({ kind: 'sending' });

    // Turnstile injects its own hidden input into the form. Read it from the
    // DOM at submit time; the form has a stable id, so no ref is needed.
    const token = document.querySelector<HTMLInputElement>(
      '#ctForm [name="cf-turnstile-response"]',
    )?.value;

    const result = await submitEnquiry({ ...values, turnstileToken: token });

    if (result.ok) {
      setStatus({ kind: 'sent', ref: result.ref });
      reset();
      return;
    }
    for (const [field, message] of Object.entries(result.fields ?? {})) {
      setError(field as keyof EnquiryInput, { message });
    }
    setStatus({ kind: 'failed', message: result.error });
  }

  if (status.kind === 'sent') {
    return (
      <div className="form" data-stagger>
        <div className="ok" role="status">
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9.5" />
            <path d="M7.6 12.3l3 3 5.8-6" />
          </svg>
          <div>
            <b>Got it. We will be in touch.</b>
            <p>
              A copy is on its way to your inbox. Your reference is{' '}
              <strong>{status.ref}</strong>, worth quoting if you call before we reply.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {SITE_KEY ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      ) : null}
      <form
        className="form"
        data-stagger
        id="ctForm"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="f">
          <label htmlFor="f-name">
            Name <b aria-hidden="true">*</b>
          </label>
          <input
            id="f-name"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'e-name' : undefined}
            {...register('name')}
          />
          {errors.name ? (
            <small className="fe" id="e-name">
              {errors.name.message}
            </small>
          ) : null}
        </div>

        <div className="f">
          <label htmlFor="f-email">
            Email <b aria-hidden="true">*</b>
          </label>
          <input
            id="f-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'e-email' : undefined}
            {...register('email')}
          />
          {errors.email ? (
            <small className="fe" id="e-email">
              {errors.email.message}
            </small>
          ) : null}
        </div>

        <div className="f">
          <label htmlFor="f-phone">Phone</label>
          <input
            id="f-phone"
            type="tel"
            placeholder="(000) 000-0000"
            autoComplete="tel"
            {...register('phone')}
          />
        </div>

        <div className="f">
          <label htmlFor="f-svc">What do you need</label>
          <select id="f-svc" {...register('service')}>
            {SERVICES_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="f f--full">
          <label htmlFor="f-msg">
            Tell us about it <b aria-hidden="true">*</b>
          </label>
          <textarea
            id="f-msg"
            placeholder="Where your business is now, and where you want it to be."
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'e-msg' : undefined}
            {...register('message')}
          />
          {errors.message ? (
            <small className="fe" id="e-msg">
              {errors.message.message}
            </small>
          ) : null}
        </div>

        {/* Hidden from sight and from assistive tech, never autofilled. */}
        <div className="hp" aria-hidden="true">
          <label htmlFor="f-company">Company</label>
          <input
            id="f-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('company')}
          />
        </div>

        {SITE_KEY ? (
          <div className="f--full">
            <div
              className="cf-turnstile"
              data-sitekey={SITE_KEY}
              data-theme="dark"
              data-size="flexible"
            />
          </div>
        ) : null}

        {status.kind === 'failed' ? (
          <div className="form-err f--full" role="alert">
            {status.message}
          </div>
        ) : null}

        <div className="form-end">
          <button
            className="btn btn--gold"
            type="submit"
            disabled={status.kind === 'sending'}
          >
            <span>
              {status.kind === 'sending' ? 'Sending' : 'Send It Over'} <Arrow />
            </span>
          </button>
          <small>
            Your details stay with Consultants RS LLC. We do not sell, share, or add you
            to a mailing list.
          </small>
        </div>
      </form>
    </>
  );
}
