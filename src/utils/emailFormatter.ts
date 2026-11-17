export const OWNER_INBOX_EMAIL = 'gaurangambulkar@gmail.com';

export interface EmailLineItem {
  id: string;
  model: string;
  title: string;
  category: string;
  specSummary: string;
  quantity: number;
}

export interface QuoteEmailPayload {
  referenceId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes: string;
  items: EmailLineItem[];
  totalUnits: number;
  createdAt: string;
}

export interface ContactEmailPayload {
  referenceId: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface RfqEmailPayload {
  referenceId: string;
  company: string;
  email: string;
  items: EmailLineItem[];
  totalUnits: number;
  createdAt: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatItemsSummary(items: EmailLineItem[]): string {
  if (!items.length) {
    return 'No individual SKU items attached (General Quote Inquiry)';
  }
  return items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.model} — ${item.title} (${item.specSummary || item.category}) × ${item.quantity} pcs`
    )
    .join('\n');
}

export function buildQuoteEmailContent(payload: QuoteEmailPayload) {
  const subject = `[TermiCore Quote ${payload.referenceId}] ${payload.company} — ${payload.name}`;
  const itemsText = formatItemsSummary(payload.items);

  const text = [
    `New Quote Request (${payload.referenceId})`,
    `Submitted At: ${payload.createdAt}`,
    '',
    `Contact Name: ${payload.name}`,
    `Company Name: ${payload.company}`,
    `Work Email: ${payload.email}`,
    `Phone Number: ${payload.phone || 'Not provided'}`,
    '',
    `Selected Models / Series (${payload.items.length} line items, ${payload.totalUnits} total pcs):`,
    itemsText,
    '',
    `BOM / Technical Notes:`,
    payload.notes || 'None provided',
  ].join('\n');

  const itemsHtmlRows = payload.items.length
    ? payload.items
        .map(
          (item) => `
          <tr>
            <td style="padding:8px 10px;border:1px solid #e2e8f0;font-family:monospace;font-weight:600;color:#0f766e;">${escapeHtml(item.model)}</td>
            <td style="padding:8px 10px;border:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(item.title)}</td>
            <td style="padding:8px 10px;border:1px solid #e2e8f0;color:#475569;">${escapeHtml(item.specSummary || item.category)}</td>
            <td style="padding:8px 10px;border:1px solid #e2e8f0;text-align:right;font-family:monospace;font-weight:600;">${item.quantity} pcs</td>
          </tr>`
        )
        .join('')
    : `<tr><td colspan="4" style="padding:10px;border:1px solid #e2e8f0;color:#64748b;">No specific SKU line items queued (general project inquiry).</td></tr>`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#0f172a;line-height:1.5;">
      <div style="background:#0f766e;color:#ffffff;padding:18px 24px;border-radius:8px 8px 0 0;">
        <div style="font-size:12px;opacity:0.9;font-family:monospace;">Reference: ${escapeHtml(payload.referenceId)}</div>
        <h2 style="margin:4px 0 0;font-size:20px;">New TermiCore Quote Request</h2>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;background:#ffffff;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px;">
          <tr><td style="padding:6px 0;color:#64748b;width:140px;">Contact Name</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(payload.name)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Company</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(payload.company)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Work Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(payload.email)}" style="color:#0f766e;">${escapeHtml(payload.email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Phone</td><td style="padding:6px 0;">${escapeHtml(payload.phone || 'Not provided')}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Total Quantity</td><td style="padding:6px 0;font-weight:600;">${payload.totalUnits} pcs (${payload.items.length} line items)</td></tr>
        </table>
        <h3 style="margin:0 0 8px;font-size:14px;color:#0f172a;">Queued Terminal Blocks &amp; Series</h3>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
          <thead>
            <tr style="background:#eef2f6;">
              <th style="padding:8px 10px;border:1px solid #e2e8f0;text-align:left;">Model</th>
              <th style="padding:8px 10px;border:1px solid #e2e8f0;text-align:left;">Product</th>
              <th style="padding:8px 10px;border:1px solid #e2e8f0;text-align:left;">Specifications</th>
              <th style="padding:8px 10px;border:1px solid #e2e8f0;text-align:right;">Qty</th>
            </tr>
          </thead>
          <tbody>${itemsHtmlRows}</tbody>
        </table>
        <h3 style="margin:0 0 6px;font-size:14px;color:#0f172a;">BOM / Technical Notes</h3>
        <div style="background:#f7f9fb;border:1px solid #e2e8f0;border-radius:6px;padding:12px;font-size:13px;white-space:pre-wrap;">${escapeHtml(payload.notes || 'None provided')}</div>
      </div>
    </div>
  `;

  const formSubmitPayload: Record<string, string> = {
    _subject: subject,
    _replyto: payload.email,
    _template: 'table',
    _captcha: 'false',
    Reference_ID: payload.referenceId,
    Contact_Name: payload.name,
    Company_Name: payload.company,
    Work_Email: payload.email,
    Phone_Number: payload.phone || 'Not provided',
    Total_Units: `${payload.totalUnits} pcs (${payload.items.length} items)`,
    Queued_Items: itemsText,
    Technical_Notes: payload.notes || 'None provided',
    Submitted_At: payload.createdAt,
  };

  return { subject, text, html, formSubmitPayload };
}

export function buildContactEmailContent(payload: ContactEmailPayload) {
  const subject = `[TermiCore Contact ${payload.referenceId}] ${payload.subject} — ${payload.name}`;

  const text = [
    `New Technical Contact Inquiry (${payload.referenceId})`,
    `Submitted At: ${payload.createdAt}`,
    '',
    `Full Name: ${payload.name}`,
    `Work Email: ${payload.email}`,
    `Phone Number: ${payload.phone || 'Not provided'}`,
    `Topic: ${payload.subject}`,
    '',
    `Message:`,
    payload.message,
  ].join('\n');

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#0f172a;line-height:1.5;">
      <div style="background:#0f766e;color:#ffffff;padding:18px 24px;border-radius:8px 8px 0 0;">
        <div style="font-size:12px;opacity:0.9;font-family:monospace;">Reference: ${escapeHtml(payload.referenceId)}</div>
        <h2 style="margin:4px 0 0;font-size:20px;">New Contact Inquiry</h2>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;background:#ffffff;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:18px;font-size:14px;">
          <tr><td style="padding:6px 0;color:#64748b;width:130px;">Full Name</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(payload.name)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Work Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(payload.email)}" style="color:#0f766e;">${escapeHtml(payload.email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Phone</td><td style="padding:6px 0;">${escapeHtml(payload.phone || 'Not provided')}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Topic</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(payload.subject)}</td></tr>
        </table>
        <h3 style="margin:0 0 6px;font-size:14px;color:#0f172a;">Inquiry Message</h3>
        <div style="background:#f7f9fb;border:1px solid #e2e8f0;border-radius:6px;padding:12px;font-size:13px;white-space:pre-wrap;">${escapeHtml(payload.message)}</div>
      </div>
    </div>
  `;

  const formSubmitPayload: Record<string, string> = {
    _subject: subject,
    _replyto: payload.email,
    _template: 'table',
    _captcha: 'false',
    Reference_ID: payload.referenceId,
    Full_Name: payload.name,
    Work_Email: payload.email,
    Phone_Number: payload.phone || 'Not provided',
    Inquiry_Topic: payload.subject,
    Message: payload.message,
    Submitted_At: payload.createdAt,
  };

  return { subject, text, html, formSubmitPayload };
}

export function buildRfqEmailContent(payload: RfqEmailPayload) {
  const subject = `[TermiCore Quick RFQ ${payload.referenceId}] ${payload.company} (${payload.totalUnits} pcs)`;
  const itemsText = formatItemsSummary(payload.items);

  const text = [
    `New Quick RFQ Submission (${payload.referenceId})`,
    `Submitted At: ${payload.createdAt}`,
    '',
    `Company / Panel Builder: ${payload.company}`,
    `Work Email: ${payload.email}`,
    `Total Units: ${payload.totalUnits} pcs`,
    '',
    `Queued Items:`,
    itemsText,
  ].join('\n');

  const itemsHtmlRows = payload.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 10px;border:1px solid #e2e8f0;font-family:monospace;font-weight:600;color:#0f766e;">${escapeHtml(item.model)}</td>
        <td style="padding:8px 10px;border:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(item.title)}</td>
        <td style="padding:8px 10px;border:1px solid #e2e8f0;color:#475569;">${escapeHtml(item.specSummary || item.category)}</td>
        <td style="padding:8px 10px;border:1px solid #e2e8f0;text-align:right;font-family:monospace;font-weight:600;">${item.quantity} pcs</td>
      </tr>`
    )
    .join('');

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#0f172a;line-height:1.5;">
      <div style="background:#0f766e;color:#ffffff;padding:18px 24px;border-radius:8px 8px 0 0;">
        <div style="font-size:12px;opacity:0.9;font-family:monospace;">Reference: ${escapeHtml(payload.referenceId)}</div>
        <h2 style="margin:4px 0 0;font-size:20px;">New Quick RFQ Queue Submission</h2>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;background:#ffffff;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:18px;font-size:14px;">
          <tr><td style="padding:6px 0;color:#64748b;width:150px;">Company</td><td style="padding:6px 0;font-weight:600;">${escapeHtml(payload.company)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Work Email</td><td style="padding:6px 0;"><a href="mailto:${escapeHtml(payload.email)}" style="color:#0f766e;">${escapeHtml(payload.email)}</a></td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Total Units</td><td style="padding:6px 0;font-weight:600;">${payload.totalUnits} pcs</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#eef2f6;">
              <th style="padding:8px 10px;border:1px solid #e2e8f0;text-align:left;">Model</th>
              <th style="padding:8px 10px;border:1px solid #e2e8f0;text-align:left;">Product</th>
              <th style="padding:8px 10px;border:1px solid #e2e8f0;text-align:left;">Specifications</th>
              <th style="padding:8px 10px;border:1px solid #e2e8f0;text-align:right;">Qty</th>
            </tr>
          </thead>
          <tbody>${itemsHtmlRows}</tbody>
        </table>
      </div>
    </div>
  `;

  const formSubmitPayload: Record<string, string> = {
    _subject: subject,
    _replyto: payload.email,
    _template: 'table',
    _captcha: 'false',
    Reference_ID: payload.referenceId,
    Company: payload.company,
    Work_Email: payload.email,
    Total_Units: `${payload.totalUnits} pcs`,
    Queued_Items: itemsText,
    Submitted_At: payload.createdAt,
  };

  return { subject, text, html, formSubmitPayload };
}

export function buildMailtoHref(
  recipient: string,
  subject: string,
  body: string
): string {
  const safeBody = body.length > 1500 ? `${body.slice(0, 1497)}...` : body;
  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(safeBody)}`;
}
