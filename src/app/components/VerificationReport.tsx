// ============================================================
//  VerificationReport.tsx  –  Replace your existing file
//  Changes from original:
//    • Props now accept real values from the API
//      (aiProbability, humanProbability, analysisTime,
//       detectionMethod, findings) instead of computing them
//      locally from random numbers
// ============================================================

import React from 'react';
import { motion } from 'motion/react';
import {
  Check, X, AlertTriangle, TrendingUp,
  Eye, FileText, Image as ImageIcon, Clock, Shield,
} from 'lucide-react';

interface VerificationReportProps {
  result: 'authentic' | 'fake' | null;
  type: 'text' | 'image';
  confidence: number;
  // ── new props from real API ──
  aiProbability?: number;
  humanProbability?: number;
  analysisTime?: string;
  detectionMethod?: string;
  findings?: string[];
}

export function VerificationReport({
  result,
  type,
  confidence,
  aiProbability,
  humanProbability,
  analysisTime,
  detectionMethod,
  findings,
}: VerificationReportProps) {
  if (!result) return null;

  const isAuthentic = result === 'authentic';

  // Fall back to computed values if API didn't return them
  const aiPct      = aiProbability      ?? (isAuthentic ? 100 - confidence : confidence);
  const humanPct   = humanProbability   ?? 100 - aiPct;
  const timeLabel  = analysisTime       ?? '—';
  const methodLabel = detectionMethod   ?? (type === 'text' ? 'Pattern Recognition' : 'Metadata Analysis');
  const bulletPoints: string[] = findings ?? (
    type === 'text'
      ? [
          `Linguistic pattern analysis: ${isAuthentic ? 'Natural variation detected' : 'Repetitive patterns found'}`,
          `Vocabulary distribution: ${isAuthentic ? 'Human-like diversity' : 'AI-typical consistency'}`,
          `Sentence structure: ${isAuthentic ? 'Varied and natural' : 'Uniform and formulaic'}`,
        ]
      : [
          `Metadata analysis: ${isAuthentic ? 'Original source markers found' : 'AI generation signatures detected'}`,
          `Pixel consistency: ${isAuthentic ? 'Natural imperfections present' : 'Artificial smoothing detected'}`,
          `Compression artifacts: ${isAuthentic ? 'Standard camera patterns' : 'AI generation traces'}`,
        ]
  );

  const metrics = [
    { icon: Shield,    label: 'Authenticity Score', value: `${confidence}%`, color: isAuthentic ? 'text-green-600' : 'text-red-600' },
    { icon: type === 'text' ? FileText : ImageIcon, label: 'Content Type', value: type === 'text' ? 'Text Analysis' : 'Image Analysis', color: 'text-amber-700' },
    { icon: Eye,  label: 'Detection Method', value: methodLabel, color: 'text-blue-600' },
    { icon: Clock, label: 'Analysis Time',   value: timeLabel,   color: 'text-purple-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`mt-8 rounded-3xl border-4 overflow-hidden ${
        isAuthentic
          ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-600'
          : 'bg-gradient-to-br from-red-50 to-rose-100 border-red-600'
      }`}
    >
      {/* Header */}
      <div className={`p-6 ${isAuthentic ? 'bg-green-500' : 'bg-red-500'}`}>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
          >
            {isAuthentic
              ? <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
              : <X    className="w-10 h-10 text-red-600"   strokeWidth={3} />}
          </motion.div>
          <div className="flex-1">
            <h3 className="text-3xl font-black text-white mb-1">
              {isAuthentic ? 'Content Appears Authentic' : 'Potentially AI-Generated'}
            </h3>
            <p className="text-white/90 text-lg">
              {isAuthentic
                ? 'Our analysis suggests this content is likely genuine'
                : 'Warning: This content may be AI-generated or manipulated'}
            </p>
          </div>
        </div>
      </div>

      {/* AI vs Human */}
      <div className="p-6 bg-white/50">
        <h4 className="text-xl font-black text-amber-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Content Origin Analysis
        </h4>
        <div className="space-y-4">
          {[
            { label: 'AI-Generated',  pct: aiPct,    color: 'from-red-400 to-red-600',     tag: 'AI'    },
            { label: 'Human-Created', pct: humanPct, color: 'from-green-400 to-green-600', tag: 'Human' },
          ].map(({ label, pct, color, tag }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-900">{label}</span>
                <span className="font-black text-2xl text-amber-900">{pct}%</span>
              </div>
              <div className="relative h-8 bg-amber-200 rounded-full overflow-hidden border-3 border-amber-600">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${color} flex items-center justify-end pr-3`}
                >
                  {pct > 10 && <span className="text-white font-bold text-sm">{tag}</span>}
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl border-3 border-amber-600"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-amber-100 ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-amber-700 font-bold mb-1">{metric.label}</div>
                <div className="text-lg font-black text-amber-900">{metric.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Findings */}
      <div className="p-6 border-t-4 border-amber-300 bg-white/30">
        <h4 className="text-xl font-black text-amber-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          Detailed Findings
        </h4>
        <ul className="space-y-2">
          {bulletPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-amber-800">
              <span className="text-yellow-500 mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="p-6 flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 py-3 rounded-lg font-black border-3 border-amber-900 hover:shadow-lg transition-all"
        >
          Download Report
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-white text-amber-900 py-3 rounded-lg font-black border-3 border-amber-600 hover:bg-amber-50 transition-all"
        >
          Share Results
        </motion.button>
      </div>
    </motion.div>
  );
}
