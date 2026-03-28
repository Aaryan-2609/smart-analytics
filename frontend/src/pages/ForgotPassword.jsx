import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email"); // email, otp, reset
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setStep("otp");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setStep("success");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setOtp("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setStep("email");
    setMessage("");
    setError("");
  };

  if (step === "success") {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
          <p className="text-gray-400 mb-6">
            Your password has been reset successfully. You can now login with your new password.
          </p>
          <button
            onClick={resetForm}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded mb-3"
          >
            Back to Login
          </button>
          <Link
            to="/"
            className="block text-center text-blue-400 hover:underline"
          >
            Go to Login Page
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-white mb-2">Reset your password</h2>
      
      {step === "email" && (
        <>
          <p className="text-gray-400 mb-6">
            We'll send you an OTP to reset your password.
          </p>
          
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-6 rounded bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
          />

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-400 text-sm mb-4">{message}</p>}

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-semibold py-2 rounded mb-3"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <p className="text-gray-400 mb-6">
            Enter the 6-digit OTP sent to {email}
          </p>
          
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full px-4 py-2 mb-4 rounded bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:outline-none text-center text-xl tracking-widest"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 mb-6 rounded bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
          />

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-400 text-sm mb-4">{message}</p>}

          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-semibold py-2 rounded mb-3"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            onClick={handleResendOTP}
            disabled={loading}
            className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-semibold py-2 rounded mb-3"
          >
            {loading ? "Sending..." : "Resend OTP"}
          </button>
        </>
      )}

      {/* Navigation Links */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          Back to{" "}
          <Link to="/" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
        {step === "otp" && (
          <button
            onClick={() => setStep("email")}
            className="text-sm text-gray-400 hover:text-white mt-2"
          >
            ← Change Email
          </button>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
