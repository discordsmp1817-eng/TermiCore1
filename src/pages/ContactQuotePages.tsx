import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, Trash2 } from 'lucide-react';
import { CONTACT_INFO, PRODUCT_CATEGORIES } from '../data/termicoreData';
import { useApp } from '../context/AppContext';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Technical Specification / CAD Request');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
    setSubmitted(true);
  };

  return (
    <section className="bg-[#F8FAFC] py-12 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
            Contact TermiCore
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 text-balance">
            Let&apos;s Discuss Your Next Project
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Our sales engineers are ready to help you select the right terminal blocks, request compliance documentation, or arrange product samples.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg bg-[#0F172A] p-7 text-white">
              <h2 className="font-display text-lg font-bold">
                Dedicated Technical Support
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Fast response for OEM quotes, panel build specifications, and international compliance files.
              </p>

              <ul className="mt-6 space-y-4 border-t border-slate-800 pt-6 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-sky-400 shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-slate-400">Email</div>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="font-medium text-white hover:text-sky-300"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-sky-400 shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-slate-400">Phone</div>
                    <a
                      href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                      className="font-mono font-medium text-white hover:text-sky-300 tabular-nums"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-slate-400">Location</div>
                    <div className="font-medium text-white">
                      {CONTACT_INFO.location}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#0284C7]" />
                <h2 className="mt-4 font-display text-2xl font-bold text-slate-950">
                  Message Received
                </h2>
                <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, {name}. Our engineering team will review your inquiry and respond to <span className="font-medium text-slate-900">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="mt-6 rounded-lg bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-display text-xl font-bold text-slate-950 mb-2">
                  Send Us a Message
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rajesh Kulkarni"
                      className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      id="contact-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900"
                    >
                      <option>Technical Specification / CAD Request</option>
                      <option>OEM Bulk Pricing Inquiry</option>
                      <option>UL / IEC / RoHS Compliance Documents</option>
                      <option>Sample Kit Request</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share wire gauge requirements, current ratings, or target terminal block series..."
                    className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-rose-700">{error}</p>
                )}

                <button
                  type="submit"
                  className="rounded-lg bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors cursor-pointer min-h-[44px]"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
    setSubmitted(true);
    clearRfq();
  };

  return (
    <section className="bg-[#F8FAFC] py-12 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
            Factory-Direct Quotation
          </p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 text-balance">
            Request a Quote
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Our engineering team will review your selected terminal block models, wire specifications, and estimated quantities to provide accurate OEM pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg bg-[#0F172A] p-7 text-white">
              <h2 className="font-display text-lg font-bold">
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
                  <div key={item.title} className="border-t border-slate-800 pt-3.5">
                    <div className="font-display font-semibold text-white">
                      {item.title}
                    </div>
                    <p className="mt-1 text-xs text-slate-300">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Series Adder */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="font-display text-sm font-bold text-slate-950">
                Add Series to Quotation List
              </h3>
              <div className="mt-3 flex gap-2">
                <select
                  aria-label="Select terminal block series"
                  value={seriesSelect}
                  onChange={(e) => setSeriesSelect(e.target.value)}
                  className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900"
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
                  className="rounded-md bg-[#0F172A] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#0284C7]" />
                <h2 className="mt-4 font-display text-2xl font-bold text-slate-950">
                  Quote Request Submitted
                </h2>
                <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, {name} ({company}). Our sales engineering team will prepare your quotation and reply to <span className="font-medium text-slate-900">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setNotes('');
                  }}
                  className="mt-6 rounded-lg bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
                >
                  Start New Quote Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display text-xl font-bold text-slate-950">
                  Project Information
                </h2>

                {rfqItems.length > 0 && (
                  <div className="rounded-md border border-slate-200 bg-[#F8FAFC] p-4 space-y-2.5">
                    <div className="text-xs font-semibold text-slate-700">
                      Queued SKUs &amp; Series ({rfqItems.length})
                    </div>
                    {rfqItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded border border-slate-200 bg-white px-3 py-2 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-mono font-semibold text-[#0284C7] mr-2">
                            {item.model}
                          </span>
                          <span className="font-medium text-slate-900 truncate">
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
                            className="w-20 rounded border border-slate-300 px-2 py-1 text-right font-mono tabular-nums"
                          />
                          <button
                            type="button"
                            aria-label={`Remove ${item.model}`}
                            onClick={() => removeFromRfq(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
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
                    <label htmlFor="quote-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Contact Name *
                    </label>
                    <input
                      id="quote-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="quote-company" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company Name *
                    </label>
                    <input
                      id="quote-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company / Panel Builder"
                      className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quote-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      id="quote-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="engineering@company.com"
                      className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="quote-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="quote-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quote-notes" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    BOM / Technical Notes
                  </label>
                  <textarea
                    id="quote-notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Specify model numbers, wire sizes, required certifications (UL / IEC / ATEX), or delivery timeline..."
                    className="w-full rounded-md border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900"
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-rose-700">{error}</p>
                )}

                <button
                  type="submit"
                  className="rounded-lg bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF] transition-colors cursor-pointer min-h-[44px]"
                >
                  Submit Quote Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
