import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OWNER_INBOX_EMAIL,
  buildContactEmailContent,
  buildMailtoHref,
  buildQuoteEmailContent,
  buildRfqEmailContent,
  escapeHtml,
} from './emailFormatter';

test('escapeHtml neutralizes HTML injection characters', () => {
  assert.equal(
    escapeHtml('<script>alert("x")</script> & \'test\''),
    '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;test&#39;'
  );
});

test('buildQuoteEmailContent formats subject, line items, and FormSubmit fields', () => {
  const result = buildQuoteEmailContent({
    referenceId: 'QT-2026-AB12CD',
    name: 'Aarav Patel',
    company: 'Apex Switchgear',
    email: 'aarav@apex.example',
    phone: '+91 98765 43210',
    notes: 'Need UL 1059 datasheet',
    items: [
      {
        id: 'TSC 4',
        model: 'TSC 4',
        title: 'TSC 4 Feed-Through Block',
        category: 'Spring Cage Connection',
        specSummary: '0.2 - 4.0 mm² · 32 A · 800 V',
        quantity: 250,
      },
    ],
    totalUnits: 250,
    createdAt: '2026-11-14T08:30:00.000Z',
  });

  assert.equal(OWNER_INBOX_EMAIL, 'gaurangambulkar@gmail.com');
  assert.match(result.subject, /QT-2026-AB12CD/);
  assert.match(result.subject, /Apex Switchgear/);
  assert.match(result.text, /TSC 4 — TSC 4 Feed-Through Block/);
  assert.match(result.text, /250 pcs/);
  assert.match(result.html, /Apex Switchgear/);
  assert.equal(result.formSubmitPayload._replyto, 'aarav@apex.example');
  assert.equal(result.formSubmitPayload.Company_Name, 'Apex Switchgear');
});

test('buildContactEmailContent handles empty phone safely', () => {
  const result = buildContactEmailContent({
    referenceId: 'INQ-2026-112233',
    name: 'Meera Nair',
    email: 'meera@panel.example',
    phone: '',
    subject: 'Sample Kit Request',
    message: 'Please send TSC 2.5 samples.',
    createdAt: '2026-11-14T08:31:00.000Z',
  });

  assert.match(result.text, /Phone Number: Not provided/);
  assert.match(result.text, /Please send TSC 2\.5 samples\./);
  assert.equal(result.formSubmitPayload.Inquiry_Topic, 'Sample Kit Request');
});

test('buildRfqEmailContent includes item summary and quantity', () => {
  const result = buildRfqEmailContent({
    referenceId: 'RFQ-2026-998877',
    company: 'Delta Controls',
    email: 'buyer@delta.example',
    items: [
      {
        id: 'TBC 50',
        model: 'TBC 50',
        title: 'TBC 50 Stud Terminal Block',
        category: 'Bolt Connection',
        specSummary: '50 mm² · 150 A',
        quantity: 40,
      },
    ],
    totalUnits: 40,
    createdAt: '2026-11-14T08:32:00.000Z',
  });

  assert.match(result.subject, /40 pcs/);
  assert.match(result.html, /TBC 50/);
});

test('buildMailtoHref creates encoded mailto link', () => {
  const href = buildMailtoHref('gaurangambulkar@gmail.com', 'Quote QT-1', 'Line 1\nLine 2');
  assert.ok(href.startsWith('mailto:gaurangambulkar%40gmail.com?subject=Quote%20QT-1&body='));
});
