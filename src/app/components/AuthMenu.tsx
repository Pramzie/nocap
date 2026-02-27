import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, LogIn, UserPlus, X } from 'lucide-react';

export function AuthMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      {/* Auth Button */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
        className="fixed top-20 right-8 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 text-amber-900 px-6 py-3 rounded-full shadow-2xl border-4 border-amber-900 font-black text-lg flex items-center gap-2 hover:shadow-yellow-400/50 transition-all duration-300"
        >
          <User className="w-6 h-6" />
          <span>Account</span>
        </motion.button>
      </motion.div>

      {/* Auth Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-3xl shadow-2xl border-4 border-amber-900 p-8 relative overflow-hidden">
                {/* Decorative corner tape */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400 opacity-20 rotate-45 translate-x-12 -translate-y-12" />
                
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-amber-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-amber-900" />
                </button>

                {/* Toggle Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setShowLogin(true)}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                      showLogin
                        ? 'bg-yellow-400 text-amber-900 shadow-lg'
                        : 'bg-amber-200 text-amber-700 hover:bg-amber-300'
                    }`}
                  >
                    <LogIn className="w-5 h-5 inline mr-2" />
                    Login
                  </button>
                  <button
                    onClick={() => setShowLogin(false)}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                      !showLogin
                        ? 'bg-yellow-400 text-amber-900 shadow-lg'
                        : 'bg-amber-200 text-amber-700 hover:bg-amber-300'
                    }`}
                  >
                    <UserPlus className="w-5 h-5 inline mr-2" />
                    Sign Up
                  </button>
                </div>

                {/* Form */}
                <form className="space-y-4">
                  {!showLogin && (
                    <div>
                      <label className="block text-amber-900 font-bold mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full p-3 rounded-lg border-3 border-amber-600 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-amber-900 font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full p-3 rounded-lg border-3 border-amber-600 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-900 font-bold mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full p-3 rounded-lg border-3 border-amber-600 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    />
                  </div>

                  {showLogin && (
                    <div className="text-right">
                      <button
                        type="button"
                        className="text-amber-700 hover:text-amber-900 font-bold text-sm"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 py-4 rounded-lg font-black text-xl shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 border-4 border-amber-900"
                  >
                    {showLogin ? 'Login' : 'Create Account'}
                  </motion.button>
                </form>

                {/* Social Login */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-amber-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-700 font-bold">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 bg-white border-3 border-amber-600 rounded-lg py-3 hover:bg-amber-50 transition-colors font-bold text-amber-900">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                        <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"/>
                        <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"/>
                        <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"/>
                      </svg>
                      Google
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white border-3 border-amber-600 rounded-lg py-3 hover:bg-amber-50 transition-colors font-bold text-amber-900">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}