import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does noCap verify content?',
      answer: 'noCap uses advanced AI algorithms to analyze text patterns, linguistic markers, image metadata, and other authenticity indicators. Our system compares content against known AI-generated patterns and manipulation techniques to provide a confidence score.'
    },
    {
      question: 'What types of content can I verify?',
      answer: 'Currently, you can verify text articles, news content, and images. We support both direct uploads and URL-based verification. Our system works with most common image formats (JPG, PNG, WebP) and can analyze text of any length.'
    },
    {
      question: 'How accurate is the verification?',
      answer: 'Our system maintains a 94% accuracy rate across millions of verifications. However, no automated system is perfect. We recommend using noCap as one tool in your verification toolkit, especially for critical content.'
    },
    {
      question: 'Is my uploaded content stored or shared?',
      answer: 'No. All content verification happens in real-time and is immediately discarded after analysis. We do not store, log, or share any content you upload or verify through noCap.'
    },
    {
      question: 'Can noCap detect all AI-generated content?',
      answer: 'While our detection capabilities are industry-leading, AI generation technology is constantly evolving. We regularly update our algorithms to detect new AI models and techniques. Very recent or highly sophisticated AI content may occasionally evade detection.'
    },
    {
      question: 'Is noCap free to use?',
      answer: 'Yes! noCap is currently free for all users as part of our mission to promote digital trust and content authenticity. We may introduce premium features in the future, but core verification will remain free.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-black text-amber-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-amber-700">
          Everything you need to know about content verification
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-900 rounded-2xl overflow-hidden shadow-lg"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-yellow-100 transition-colors"
            >
              <span className="text-xl font-black text-amber-900 pr-4">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-6 h-6 text-amber-900 flex-shrink-0" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-amber-800 text-lg border-t-2 border-amber-200">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}