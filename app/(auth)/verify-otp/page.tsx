"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyOTP, resendOTP } from "@/services/auth";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await verifyOTP({ email, otp });
      setSuccess(response.message_en);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      const response = await resendOTP(email);
      setSuccess("Verification code resent successfully");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-blue/20 rounded-2xl mb-4 glow">
            <Shield className="w-8 h-8 text-accent-blue" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Verify Your Account</h1>
          <p className="text-gray-400">Enter the verification code sent to your email</p>
        </div>

        {/* Verify Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-severity-critical/10 border border-severity-critical/50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-severity-critical flex-shrink-0 mt-0.5" />
                <p className="text-sm text-severity-critical">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-severity-low/10 border border-severity-low/50 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-severity-low flex-shrink-0 mt-0.5" />
                <p className="text-sm text-severity-low">{success}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                id="otp"
                type="text"
                required
                className="input text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-400">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-accent-blue hover:text-blue-400 transition-colors disabled:opacity-50"
              >
                {resending ? "Resending..." : "Resend"}
              </button>
            </p>

            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-400 transition-colors block">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" /></div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
