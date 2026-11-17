import {
  ContactEmailPayload,
  EmailLineItem,
  OWNER_INBOX_EMAIL,
  QuoteEmailPayload,
  RfqEmailPayload,
  buildContactEmailContent,
  buildMailtoHref,
  buildQuoteEmailContent,
  buildRfqEmailContent,
} from './emailFormatter';

export type EmailDeliveryStatus = 'sent' | 'activation_required' | 'queued_locally';

export interface InquirySubmitResult {
  referenceId: string;
  emailStatus: EmailDeliveryStatus;
  emailMessage?: string;
  recipientEmail: string;
  mailtoHref: string;
}

/**
 * On static hosts such as Hostinger shared hosting (with Apache .htaccess SPA fallback),
 * POST /api/* endpoints return either 404/405 HTML error pages or 200 text/html (index.html)
 * instead of JSON from Express. Treat any non-JSON or unreachable /api/* response as a
 * static hosting environment and relay the submission via FormSubmit.
 */
export function shouldFallbackToStaticRelay(contentType: string | null | undefined): boolean {
  return !(contentType || '').toLowerCase().includes('application/json');
}

function makeClientReference(prefix: 'QT' | 'INQ' | 'RFQ'): string {
  const year = new Date().getFullYear();
  const suffix = Math.random().toString(16).slice(2, 8).toUpperCase().padEnd(6, '0');
  return `${prefix}-${year}-${suffix}`;
}

async function postJsonOrNull(url: string, body: unknown): Promise<Response | null> {
  try {
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return null;
  }
}

async function relayViaFormSubmit(
  formSubmitPayload: Record<string, string>,
  recipientEmail: string
): Promise<{ status: EmailDeliveryStatus; message?: string }> {
  try {
    const res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formSubmitPayload),
      }
    );
    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean | string;
      message?: string;
    };

    const isSuccess = data.success === true || data.success === 'true';
    if (res.ok && isSuccess) {
      return { status: 'sent' };
    }

    const msg = String(data.message || '');
    if (msg.toLowerCase().includes('activat')) {
      return {
        status: 'activation_required',
        message: `One-time inbox activation sent to ${recipientEmail}. Check your inbox and click Activate Form to receive future submissions automatically.`,
      };
    }

    return {
      status: 'queued_locally',
      message: msg || 'Email relay could not confirm delivery. You can also send directly via your email app below.',
    };
  } catch {
    return {
      status: 'queued_locally',
      message: 'Could not reach email relay from this browser. Use the direct email backup button below.',
    };
  }
}

export async function submitQuoteInquiry(input: {
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  items: EmailLineItem[];
}): Promise<InquirySubmitResult> {
  const totalUnits = input.items.reduce((sum, item) => sum + item.quantity, 0);
  const createdAt = new Date().toISOString();

  const response = await postJsonOrNull('/api/quote', input);
  const contentType = response?.headers.get('content-type') || '';

  if (!response || shouldFallbackToStaticRelay(contentType)) {
    const referenceId = makeClientReference('QT');
    const payload: QuoteEmailPayload = { ...input, referenceId, totalUnits, createdAt };
    const { subject, text, formSubmitPayload } = buildQuoteEmailContent(payload);
    const relay = await relayViaFormSubmit(formSubmitPayload, OWNER_INBOX_EMAIL);
    return {
      referenceId,
      emailStatus: relay.status,
      emailMessage: relay.message,
      recipientEmail: OWNER_INBOX_EMAIL,
      mailtoHref: buildMailtoHref(OWNER_INBOX_EMAIL, subject, text),
    };
  }

  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    referenceId?: string;
    emailStatus?: EmailDeliveryStatus;
    emailMessage?: string;
    recipientEmail?: string;
  };

  if (!response.ok) {
    throw new Error(data.error || 'Unable to submit quote request right now. Please try again.');
  }

  const referenceId = data.referenceId || makeClientReference('QT');
  const recipientEmail = data.recipientEmail || OWNER_INBOX_EMAIL;
  const { subject, text } = buildQuoteEmailContent({
    ...input,
    referenceId,
    totalUnits,
    createdAt,
  });

  return {
    referenceId,
    emailStatus: data.emailStatus || 'queued_locally',
    emailMessage: data.emailMessage,
    recipientEmail,
    mailtoHref: buildMailtoHref(recipientEmail, subject, text),
  };
}

export async function submitContactInquiry(input: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<InquirySubmitResult> {
  const createdAt = new Date().toISOString();

  const response = await postJsonOrNull('/api/contact', input);
  const contentType = response?.headers.get('content-type') || '';

  if (!response || shouldFallbackToStaticRelay(contentType)) {
    const referenceId = makeClientReference('INQ');
    const payload: ContactEmailPayload = { ...input, referenceId, createdAt };
    const { subject, text, formSubmitPayload } = buildContactEmailContent(payload);
    const relay = await relayViaFormSubmit(formSubmitPayload, OWNER_INBOX_EMAIL);
    return {
      referenceId,
      emailStatus: relay.status,
      emailMessage: relay.message,
      recipientEmail: OWNER_INBOX_EMAIL,
      mailtoHref: buildMailtoHref(OWNER_INBOX_EMAIL, subject, text),
    };
  }

  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    referenceId?: string;
    emailStatus?: EmailDeliveryStatus;
    emailMessage?: string;
    recipientEmail?: string;
  };

  if (!response.ok) {
    throw new Error(data.error || 'Unable to send your message right now. Please try again.');
  }

  const referenceId = data.referenceId || makeClientReference('INQ');
  const recipientEmail = data.recipientEmail || OWNER_INBOX_EMAIL;
  const { subject, text } = buildContactEmailContent({
    ...input,
    referenceId,
    createdAt,
  });

  return {
    referenceId,
    emailStatus: data.emailStatus || 'queued_locally',
    emailMessage: data.emailMessage,
    recipientEmail,
    mailtoHref: buildMailtoHref(recipientEmail, subject, text),
  };
}

export async function submitQuickRfqInquiry(input: {
  company: string;
  email: string;
  items: EmailLineItem[];
}): Promise<InquirySubmitResult> {
  const totalUnits = input.items.reduce((sum, item) => sum + item.quantity, 0);
  const createdAt = new Date().toISOString();

  const response = await postJsonOrNull('/api/rfq', input);
  const contentType = response?.headers.get('content-type') || '';

  if (!response || shouldFallbackToStaticRelay(contentType)) {
    const referenceId = makeClientReference('RFQ');
    const payload: RfqEmailPayload = { ...input, referenceId, totalUnits, createdAt };
    const { subject, text, formSubmitPayload } = buildRfqEmailContent(payload);
    const relay = await relayViaFormSubmit(formSubmitPayload, OWNER_INBOX_EMAIL);
    return {
      referenceId,
      emailStatus: relay.status,
      emailMessage: relay.message,
      recipientEmail: OWNER_INBOX_EMAIL,
      mailtoHref: buildMailtoHref(OWNER_INBOX_EMAIL, subject, text),
    };
  }

  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    referenceId?: string;
    emailStatus?: EmailDeliveryStatus;
    emailMessage?: string;
    recipientEmail?: string;
  };

  if (!response.ok) {
    throw new Error(data.error || 'Unable to submit RFQ right now. Please try again.');
  }

  const referenceId = data.referenceId || makeClientReference('RFQ');
  const recipientEmail = data.recipientEmail || OWNER_INBOX_EMAIL;
  const { subject, text } = buildRfqEmailContent({
    ...input,
    referenceId,
    totalUnits,
    createdAt,
  });

  return {
    referenceId,
    emailStatus: data.emailStatus || 'queued_locally',
    emailMessage: data.emailMessage,
    recipientEmail,
    mailtoHref: buildMailtoHref(recipientEmail, subject, text),
  };
}
