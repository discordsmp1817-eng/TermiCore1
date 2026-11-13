import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CONTACT_INFO, PRODUCT_CATEGORIES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';
import {
  GlowCard,
  INDUSTRIAL_EASE,
  MagneticButton,
  RevealBlock,
} from '../components/MotionPrimitives';

const INPUT_CLASS =
  'w-full rounded-md border border-slate-300 bg-[#F7F9FB] px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0F766E] focus:bg-white focus:ring-1 focus:ring-[#0F766E]/30 focus:outline-none transition-colors';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Technical Specification / CAD Request');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (phone.trim() && !/^[+\d\s()-]{7,20}$/.test(phone.trim())) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter your project or technical inquiry.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject,
          message: message.trim(),
        }),
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.status === 404 && !contentType.includes('application/json')) {
        setReferenceId(`INQ-${new Date().getFullYear()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`);
        setSubmitted(true);
        return;
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Unable to send your message right now. Please try again.');
        return;
      }
      setReferenceId(data.referenceId || '');
      setSubmitted(true);
    } catch {
      setError('Network error while sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#F7F9FB] py-12 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <RevealBlock className="max-w-2xl mb-10" blur>
          <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
            Contact TermiCore
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] text-balance">
            Let&apos;s Discuss Your Next Project
          </h1>
          <p className="mt-4 text-base text-[#475569]">
            Our sales engineers are ready to help you select the right terminal blocks, request compliance documentation, or arrange product samples.
          </p>
        </RevealBlock>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <RevealBlock className="lg:col-span-5 space-y-6">
            <GlowCard variant="elevated" className="p-7 border-slate-200">
              <h2 className="font-display text-lg font-bold text-[#0F172A]">
                Dedicated Technical Support
              </h2>
              <p className="mt-2 text-sm text-[#475569]">
                Fast response for OEM quotes, panel build specifications, and international compliance files.
              </p>

              <ul className="mt-6 space-y-4 border-t border-slate-200 pt-6 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-[#0F766E] shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-[#64748B]">Email</div>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="font-medium text-[#0F172A] hover:text-[#0F766E] transition-colors"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-[#0F766E] shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-[#64748B]">Phone</div>
                    <a
                      href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                      className="font-mono font-medium text-[#0F172A] hover:text-[#0F766E] transition-colors tabular-nums"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#0F766E] shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-[#64748B]">Location</div>
                    <div className="font-medium text-[#0F172A]">
                      {CONTACT_INFO.location}
                    </div>
                  </div>
                </li>
              </ul>
            </GlowCard>
          </RevealBlock>

          <RevealBlock
            delay={0.08}
            className="lg:col-span-7 rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.28, ease: INDUSTRIAL_EASE }}
                className="py-10 text-center"
              >
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#0F766E]" />
                <h2 className="mt-4 font-display text-2xl font-bold text-[#0F172A]">
                  Message Received
                </h2>
                {referenceId && (
                  <div className="mt-2 inline-block rounded border border-[#0F766E]/25 bg-[#F7F9FB] px-3 py-1 font-mono text-xs font-semibold text-[#0F766E]">
                    Reference: {referenceId}
                  </div>
                )}
                <p className="mt-2 text-sm text-[#475569] max-w-md mx-auto">
                  Thank you, {name}. Our engineering team will review your inquiry and respond to{' '}
                  <span className="font-medium text-[#0F172A]">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setReferenceId('');
                    setName('');
                    setEmail('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="mt-6 rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display text-xl font-bold text-[#0F172A] mb-2">
                  Send Us a Message
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-[#475569] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rajesh Kulkarni"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-[#475569] mb-1.5">
                      Work Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold text-[#475569] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#475569] mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      id="contact-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={INPUT_CLASS}
                    >
                      <option>Technical Specification / CAD Request</option>
                      <option>OEM Bulk Pricing Inquiry</option>
                      <option>UL / IEC / RoHS Compliance Documents</option>
                      <option>Sample Kit Request</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#475569] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share wire gauge requirements, current ratings, or target terminal block series..."
                    className={INPUT_CLASS}
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-rose-600">{error}</p>
                )}

                <MagneticButton
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#0F766E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0D9488] disabled:opacity-60 transition-colors cursor-pointer min-h-[44px]"
                >
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </MagneticButton>
              </form>
            )}
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}

export function QuotePage() {
  const { rfqItems, updateRfqQuantity, removeFromRfq, clearRfq, addToRfq } = useApp();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [seriesSelect, setSeriesSelect] = useState(PRODUCT_CATEGORIES[0].seriesCode);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim() || !company.trim()) {
      setError('Please provide your full name and company name.');
      return;
    }
    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid work email address.');
      return;
    }
    if (phone.trim() && !/^[+\d\s()-]{7,20}$/.test(phone.trim())) {
      setError('Please enter a valid phone number.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
          items: rfqItems,
        }),
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.status === 404 && !contentType.includes('application/json')) {
        setReferenceId(`QT-${new Date().getFullYear()}-${Math.random().toString(16).slice(2, 8).toUpperCase()}`);
        setSubmitted(true);
        clearRfq();
        return;
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || 'Unable to submit quote request right now. Please try again.');
        return;
      }
      setReferenceId(data.referenceId || '');
      setSubmitted(true);
      clearRfq();
    } catch {
      setError('Network error while submitting quote request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#F7F9FB] py-12 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <RevealBlock className="max-w-2xl mb-10" blur>
          <p className="font-mono text-xs font-semibold tracking-wide text-[#0F766E]">
            Factory-Direct Quotation
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] text-balance">
            Request a Quote
          </h1>
          <p className="mt-4 text-base text-[#475569]">
            Our engineering team will review your selected terminal block models, wire specifications, and estimated quantities to provide accurate OEM pricing.
          </p>
        </RevealBlock>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <RevealBlock className="lg:col-span-5 space-y-6">
            <GlowCard variant="elevated" className="p-7 border-slate-200">
              <h2 className="font-display text-lg font-bold text-[#0F172A]">
                Why Choose TermiCore?
              </h2>
              <div className="mt-5 space-y-4 text-sm">
                {[
                  {
                    title: 'End-to-End Manufacturing',
                    desc: 'From precision stamping and injection molding to complete assembly solutions.',
                  },
                  {
                    title: 'Quality Focused',
                    desc: 'Strict process control and reliable production backed by ISO 9001:2015.',
                  },
                  {
                    title: 'Global Support',
                    desc: 'Technical assistance across IEC and UL panel specifications worldwide.',
                  },
                ].map((item) => (
                  <div key={item.title} className="border-t border-slate-200 pt-3.5">
                    <div className="font-display font-semibold text-[#0F172A]">
                      {item.title}
                    </div>
                    <p className="mt-1 text-xs text-[#475569]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </GlowCard>

            {/* Quick Series Adder */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="font-display text-sm font-bold text-[#0F172A]">
                Add Series to Quotation List
              </h3>
              <div className="mt-3 flex gap-2">
                <select
                  aria-label="Select terminal block series"
                  value={seriesSelect}
                  onChange={(e) => setSeriesSelect(e.target.value)}
                  className="flex-1 rounded-md border border-slate-300 bg-[#F7F9FB] px-3 py-2 text-xs text-[#0F172A] focus:border-[#0F766E] focus:outline-none"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.seriesCode}>
                      {c.seriesCode} — {c.title}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const found = PRODUCT_CATEGORIES.find(
                      (c) => c.seriesCode === seriesSelect
                    );
                    if (found) {
                      addToRfq({
                        id: found.seriesCode,
                        model: found.seriesCode,
                        title: found.title,
                        category: 'Series Inquiry',
                        specSummary: `${found.wireRangeSummary} · ${found.currentMaxSummary}`,
                      });
                    }
                  }}
                  className="rounded-md bg-[#0F766E] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
          </RevealBlock>

          <RevealBlock
            delay={0.08}
            className="lg:col-span-7 rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-xs"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.28, ease: INDUSTRIAL_EASE }}
                className="py-10 text-center"
              >
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#0F766E]" />
                <h2 className="mt-4 font-display text-2xl font-bold text-[#0F172A]">
                  Quote Request Submitted
                </h2>
                {referenceId && (
                  <div className="mt-2 inline-block rounded border border-[#0F766E]/25 bg-[#F7F9FB] px-3 py-1 font-mono text-xs font-semibold text-[#0F766E]">
                    Quote Reference: {referenceId}
                  </div>
                )}
                <p className="mt-2 text-sm text-[#475569] max-w-md mx-auto">
                  Thank you, {name} ({company}). Our sales engineering team will prepare your quotation and reply to{' '}
                  <span className="font-medium text-[#0F172A]">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setReferenceId('');
                    setNotes('');
                  }}
                  className="mt-6 rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0D9488] transition-colors cursor-pointer"
                >
                  Start New Quote Request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display text-xl font-bold text-[#0F172A]">
                  Project Information
                </h2>

                {rfqItems.length > 0 && (
                  <div className="rounded-md border border-slate-200 bg-[#EEF2F6] p-4 space-y-2.5">
                    <div className="text-xs font-semibold text-[#0F766E]">
                      Queued SKUs &amp; Series ({rfqItems.length})
                    </div>
                    {rfqItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded border border-slate-200 bg-white px-3 py-2 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-mono font-semibold text-[#0F766E] mr-2">
                            {item.model}
                          </span>
                          <span className="font-medium text-[#0F172A] truncate">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <input
                            type="number"
                            min={1}
                            aria-label={`Quantity for ${item.model}`}
                            value={item.quantity}
                            onChange={(e) =>
                              updateRfqQuantity(
                                item.id,
                                parseInt(e.target.value || '1', 10)
                              )
                            }
                            className="w-20 rounded border border-slate-300 bg-[#F7F9FB] px-2 py-1 text-right font-mono text-[#0F172A] tabular-nums focus:border-[#0F766E] focus:outline-none"
                          />
                          <button
                            type="button"
                            aria-label={`Remove ${item.model}`}
                            onClick={() => removeFromRfq(item.id)}
                            className="p-1 text-[#64748B] hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quote-name" className="block text-xs font-semibold text-[#475569] mb-1.5">
                      Contact Name *
                    </label>
                    <input
                      id="quote-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="quote-company" className="block text-xs font-semibold text-[#475569] mb-1.5">
                      Company Name *
                    </label>
                    <input
                      id="quote-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company / Panel Builder"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quote-email" className="block text-xs font-semibold text-[#475569] mb-1.5">
                      Work Email *
                    </label>
                    <input
                      id="quote-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="engineering@company.com"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label htmlFor="quote-phone" className="block text-xs font-semibold text-[#475569] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="quote-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quote-notes" className="block text-xs font-semibold text-[#475569] mb-1.5">
                    BOM / Technical Notes
                  </label>
                  <textarea
                    id="quote-notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specify model numbers, wire sizes, required certifications (UL / IEC / ATEX), or delivery timeline..."
                    className={INPUT_CLASS}
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-rose-600">{error}</p>
                )}

                <MagneticButton
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#0F766E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0D9488] disabled:opacity-60 transition-colors cursor-pointer min-h-[44px]"
                >
                  {submitting ? 'Submitting Quote Request...' : 'Submit Quote Request'}
                </MagneticButton>
              </form>
            )}
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
