import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, Check } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-black text-amber-900 mb-4">
          Get in Touch
        </h2>
        <p className="text-xl text-amber-700">
          Have questions? We'd love to hear from you.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-br from-amber-100 to-yellow-100 border-4 border-amber-900 rounded-2xl p-8 shadow-2xl"
      >
        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-900" />
            </div>
            <h3 className="text-3xl font-black text-amber-900 mb-2">
              Message Sent!
            </h3>
            <p className="text-lg text-amber-700">
              We'll get back to you as soon as possible.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-amber-900 font-bold mb-2">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full p-4 rounded-lg border-3 border-amber-600 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-amber-900 font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full p-4 rounded-lg border-3 border-amber-600 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-amber-900 font-bold mb-2">
                Message
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what's on your mind..."
                rows={6}
                className="w-full p-4 rounded-lg border-3 border-amber-600 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400 resize-none"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 py-4 rounded-lg font-black text-xl shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 border-4 border-amber-900 flex items-center justify-center gap-2"
            >
              <Send className="w-6 h-6" />
              Send Message
            </motion.button>
          </form>
        )}

        {/* Contact Info */}
        {!submitted && (
          <div className="mt-8 pt-8 border-t-4 border-amber-200">
            <div className="flex items-center justify-center gap-2 text-amber-800">
              <Mail className="w-5 h-5" />
              <span className="font-bold">contact@nocap.com</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 text-center text-amber-700"
      >
        <p className="text-lg">
          © 2026 noCap. Digital Trust & Rapid Prototyping.
        </p>
        <p className="mt-2">
          Building a more trustworthy digital world, one verification at a time.
        </p>
      </motion.div>
    </div>
  );
}
