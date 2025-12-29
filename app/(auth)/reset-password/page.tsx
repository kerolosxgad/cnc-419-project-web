"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword, resendOTP } from "@/services/auth";
import { Shield, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await resendOTP(formData.email);
      setSuccess("Verification code sent to your email");
      setStep("reset");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-blue/20 rounded-2xl mb-4 glow">
            <Shield className="w-8 h-8 text-accent-blue" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400">
            {step === "email" ? "Enter your email to receive a verification code" : "Enter the code and your new password"}
          </p>
        </div>

        {/* Reset Form */}
        <div className="card">
          {step === "email" ? (
            <form onSubmit={handleRequestOTP} className="space-y-6">
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
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    className="input pl-10"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending code...
                  </span>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
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
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "") })}
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="newPassword"
                    type="password"
                    required
                    className="input pl-10"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    className="input pl-10"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
