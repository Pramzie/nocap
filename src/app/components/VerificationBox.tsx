// ============================================================
//  VerificationBox.tsx  –  Replace your existing file
//  Changes from original:
//    • handleVerify now calls the real API (verifyText / verifyImage)
//    • passes structured response to VerificationReport
//    • shows a proper error state instead of a silent failure
// ============================================================

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Upload, Link as LinkIcon, FileText,
  Image as ImageIcon, X, Loader2, AlertCircle,
} from 'lucide-react';
import { VerificationReport } from './VerificationReport';
import { verifyText, verifyImage, VerificationResponse } from '../services/api';

type VerificationType = 'text' | 'image';

export function VerificationBox() {
  const [verificationType, setVerificationType] = useState<VerificationType>('text');
  const [textInput, setTextInput]   = useState('');
  const [urlInput, setUrlInput]     = useState('');
  const [imageContext, setImageContext] = useState('');
  const [isVerifying, setIsVerifying]  = useState(false);
  const [dragActive, setDragActive]    = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // ── Result state now uses the full API response ──
  const [verificationResult, setVerificationResult] =
    useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Drag-and-drop handlers (unchanged) ──────────
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleImageFile(e.dataTransfer.files[0]);
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ── Core: calls the real backend ────────────────
  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    setError(null);

    try {
      let response: VerificationResponse;

      if (verificationType === 'text') {
        // ── TEXT PATH ──
        response = await verifyText({ text: textInput || undefined, url: urlInput || undefined });
      } else {
        // ── IMAGE PATH ──
        response = await verifyImage({
          imageBase64: uploadedImage ?? undefined,
          context: imageContext || undefined,
        });
      }

      setVerificationResult(response);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const canSubmit =
    !isVerifying &&
    (verificationType === 'text'
      ? !!(textInput || urlInput)
      : !!uploadedImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="relative">
        {/* Box tape strips */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-400 border-2 border-yellow-600 opacity-80 z-10" />
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-400 border-2 border-yellow-600 opacity-80 z-10" />

        <div
          className="bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-100 border-4 border-amber-800 rounded-lg shadow-2xl p-8 relative"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(217,119,6,0.1) 1px, transparent 1px),
              linear-gradient(rgba(217,119,6,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        >
          {/* Fragile sticker */}
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-black rotate-3 border-2 border-red-700">
            FRAGILE ⚠
          </div>

          {/* Type Selector */}
          <div className="flex gap-4 mb-6">
            {(['text', 'image'] as VerificationType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setVerificationType(t); setVerificationResult(null); setError(null); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                  verificationType === t
                    ? 'bg-yellow-400 text-amber-900 shadow-lg scale-105'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                {t === 'text' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Text Verification */}
          {verificationType === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-amber-900 font-bold mb-2">
                  Paste your text or article
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter the text you want to verify..."
                  className="w-full h-40 p-4 rounded-lg border-3 border-amber-600 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-amber-900 font-bold mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Or paste URL (optional)
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full p-4 rounded-lg border-3 border-amber-600 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
                />
              </div>
            </div>
          )}

          {/* Image Verification */}
          {verificationType === 'image' && (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-4 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive ? 'border-yellow-400 bg-yellow-50' : 'border-amber-600 bg-white hover:border-yellow-400'
                }`}
              >
                {uploadedImage ? (
                  <div className="relative">
                    <img src={uploadedImage} alt="Uploaded" className="max-h-64 mx-auto rounded-lg" />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-16 h-16 mx-auto mb-4 text-amber-600" />
                    <p className="text-amber-900 font-bold mb-2">Drag and drop your image here</p>
                    <p className="text-amber-700 text-sm mb-4">or</p>
                    <label className="inline-block bg-yellow-400 text-amber-900 px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-yellow-300 transition-all">
                      Browse Files
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => { if (e.target.files?.[0]) handleImageFile(e.target.files[0]); }}
                      />
                    </label>
                  </>
                )}
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-2">
                  Add context for the image (optional)
                </label>
                <textarea
                  value={imageContext}
                  onChange={(e) => setImageContext(e.target.value)}
                  placeholder="Describe what this image is about..."
                  className="w-full h-24 p-4 rounded-lg border-3 border-amber-600 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400 resize-none"
                />
              </div>
            </div>
          )}

          {/* Verify Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVerify}
            disabled={!canSubmit}
            className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 py-4 rounded-lg font-black text-xl shadow-lg hover:shadow-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border-4 border-amber-900"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify Content'
            )}
          </motion.button>

          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-3 bg-red-50 border-2 border-red-400 rounded-lg p-4 text-red-700"
            >
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="font-semibold">{error}</span>
            </motion.div>
          )}

          {/* Verification Report — now receives the full response */}
          {verificationResult && (
            <VerificationReport
              result={verificationResult.result}
              type={verificationType}
              confidence={verificationResult.confidence}
              aiProbability={verificationResult.aiProbability}
              humanProbability={verificationResult.humanProbability}
              analysisTime={verificationResult.analysisTime}
              detectionMethod={verificationResult.detectionMethod}
              findings={verificationResult.findings}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
