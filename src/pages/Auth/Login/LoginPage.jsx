import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithEmailAndPassword, signInWithPopup } from "../../../firebase/firebase"; // Adjust folder import path as needed

const LoginPage = () => {
  const navigate = useNavigate();
  
  // State variables for capturing form inputs and status events
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Pipeline A: Secure Google Authentication Integration
   */
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log("🚀 Google Sign-In Success Object:", user);
      
      // Save minimal metadata reference tokens to tracking state arrays if desired
      localStorage.setItem("userToken", user.accessToken);
      localStorage.setItem("userName", user.displayName);

      // Route authenticated grocery shopper automatically back to the homepage
      navigate("/");
    } catch (error) {
      console.error("❌ Google Integration Error:", error);
      setErrorMessage("Google configuration authentication stream handshake broken.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Pipeline B: Traditional Email / Password Form Authentication Handler
   */
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setErrorMessage("Please fill out all credential verification parameters.");
    }

    try {
      setLoading(true);
      setErrorMessage("");
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("userToken", result.user.accessToken);
      
      navigate("/");
    } catch (error) {
      console.error("❌ Email Sign-In Error:", error);
      setErrorMessage("Invalid credentials. Please verify your email or password properties.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4 antialiased">
      
      {/* Central Login Card Container Frame */}
      <div className="w-full max-w-[440px] bg-white border border-[#E5E7EB] rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-8 py-10 text-center">
        
        {/* Core Header text blocks */}
        <h1 className="text-[28px] font-extrabold text-[#111827] tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="text-sm font-medium text-[#6B7280] mb-8">
          Sign in to continue shopping.
        </p>

        {/* Operational System Processing Feedback Alerts */}
        {errorMessage && (
          <div className="w-full bg-[#FFF1F2] border border-[#FDA4AF] text-[#E11D48] text-xs font-semibold py-2.5 px-3 rounded-xl mb-4 text-left">
            {errorMessage}
          </div>
        )}

        {/* 1. Google Single-Sign-On Open Authentication Streamline CTA */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-[#F9FAFB] active:scale-[0.99] border border-[#E5E7EB] text-[#374151] font-bold text-sm py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          {/* Custom Native Scalable Vector Graphic Google 'G' Brand Icon Logo */}
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.055 14.982 0 12 0 7.354 0 3.307 2.67 1.242 6.577l4.024 3.188z"
            />
            <path
              fill="#4285F4"
              d="M23.74 12.273c0-.827-.074-1.623-.21-2.395H12v4.541h6.586a5.63 5.63 0 0 1-2.443 3.693l3.879 3.007c2.269-2.091 3.577-5.176 3.577-8.846z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235 1.242 17.42A11.966 11.966 0 0 0 12 24c2.933 0 5.735-1.043 7.834-2.83l-3.879-3.006A7.114 7.114 0 0 1 12 19.091c-3.136 0-5.836-2.136-6.734-4.856z"
            />
            <path
              fill="#34A853"
              d="M1.242 6.577A11.948 11.948 0 0 0 0 12c0 1.943.461 3.777 1.242 5.422l4.024-3.187C4.945 13.143 4.79 12.586 4.79 12c0-.586.155-1.143.477-1.657L1.242 6.577z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Visual Content Structural Boundary Segmentation Divider Bar */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-[#E5E7EB]"></div>
          <span className="text-[11px] font-black tracking-widest text-[#9CA3AF] px-3 uppercase">
            OR
          </span>
          <div className="flex-grow border-t border-[#E5E7EB]"></div>
        </div>

        {/* 2. Traditional Email Form Access Processing Core Block */}
        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-5 text-left">
          
          {/* Email Processing Input Segment block */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="w-full border border-[#E5E7EB] focus:border-[#00B058] focus:ring-1 focus:ring-[#00B058] rounded-xl py-3 px-4 text-sm font-medium text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF]"
            />
          </div>

          {/* Password Processing Input Segment block */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              disabled={loading}
              className="w-full border border-[#E5E7EB] focus:border-[#00B058] focus:ring-1 focus:ring-[#00B058] rounded-xl py-3 px-4 text-sm font-medium text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF]"
            />
          </div>

          {/* Primary Submit Action CTA Button - Signature BazarDash Green */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#00B058] hover:bg-[#008A45] active:scale-[0.98] disabled:bg-[#9CA3AF] disabled:scale-100 text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm text-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Interface Navigation Conversion Footer Redirection Link row */}
        <p className="mt-8 text-sm font-semibold text-[#6B7280]">
          New to BazarDash?{" "}
          <Link
            to="/register"
            className="text-[#00B058] hover:text-[#008A45] font-bold hover:underline transition-all"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;