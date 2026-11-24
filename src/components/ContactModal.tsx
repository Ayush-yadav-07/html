import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'general',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState(initialTopic);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-display font-medium text-xl text-[#0a1b33]">
                  Get in touch
                </h3>
                <p className="font-sans text-xs text-[#64748b] mt-0.5">
                  We'll reply within 24 hours.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-display font-medium text-lg text-[#0a1b33]">
                  Message received
                </h4>
                <p className="font-sans text-xs text-[#64748b] mt-1">
                  Thank you for reaching out. We will connect soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block font-sans text-xs font-medium text-slate-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ayush Yadav"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a152d]/10 focus:border-[#0a152d] transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ayush@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a152d]/10 focus:border-[#0a152d] transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block font-sans text-xs font-medium text-slate-700 mb-1.5">
                    Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a152d]/10 focus:border-[#0a152d] transition-all font-sans bg-white"
                  >
                    <option value="general">General Inquiries</option>
                    <option value="enterprise">Enterprise Solutions</option>
                    <option value="partnerships">Ecosystem & Partnerships</option>
                    <option value="developers">Developer Documentation & API</option>
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-xs font-medium text-slate-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project or use case..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a152d]/10 focus:border-[#0a152d] transition-all font-sans resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-5 rounded-full bg-[#0a152d] text-white text-sm font-medium hover:bg-[#132347] transition-colors cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
