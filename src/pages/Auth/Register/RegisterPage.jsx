import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, signInWithPopup } from "../../../firebase/firebase"; // Adjust folder path based on your project tree

const RegisterPage = () => {
  const navigate = useNavigate();

  // State parameters for form input capturing and validation mechanics
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Pipeline A: Secure Google Authentication Registration Integration
   */
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save metadata authentication parameters locally
      localStorage.setItem("userToken", user.accessToken);
      localStorage.setItem("userName", user.displayName);

      // Instantly route user directly to the primary home view
      navigate("/");
    } catch (error) {
      console.error("❌ Google Auth Stream Integration Break:", error);
      setErrorMessage("Google account linking handshake failed.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Pipeline B: Native Email / Password Core Account Creation Handler
   */
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    
    // Fallback client validation checks
    if (!fullName || !email || !password) {
      return setErrorMessage("Please complete all necessary registration parameters.");
    }
    if (password.length < 6) {
      return setErrorMessage("Password parameters must contain at least 6 characters.");
    }

    try {
      setLoading(true);
      setErrorMessage("");

      // 1. Establish the authentic security record row inside Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Attach the user's full name data property directly to their account profile
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // 3. Complete user token handoffs
      localStorage.setItem("userToken", userCredential.user.accessToken);
      localStorage.setItem("userName", fullName);

      // Route the newly registered customer straight into the BazarDash application framework
      navigate("/");
    } catch (error) {
      console.error("❌ Firebase Registration Error Node:", error);
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("This email address is already tied to an existing account profile.");
      } else {
        setErrorMessage("Account record generation system error. Please retry.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4 antialiased">
      
      {/* Central Interactive Custom Card Box Frame */}
      <div className="w-full max-w-[440px] bg-white border border-[#E5E7EB] rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-8 py-10 text-center">
        
        {/* Core Schematic Typography Text Labels */}
        <h1 className="text-[28px] font-extrabold text-[#111827] tracking-tight mb-1">
          Create your account
        </h1>
        <p className="text-sm font-medium text-[#6B7280] mb-8">
          Join BazarDash to get groceries delivered fast.
        </p>

        {/* Dynamic System State Validation Error Alerts */}
        {errorMessage && (
          <div className="w-full bg-[#FFF1F2] border border-[#FDA4AF] text-[#E11D48] text-xs font-semibold py-2.5 px-3 rounded-xl mb-4 text-left">
            {errorMessage}
          </div>
        )}

        {/* 1. Google Single-Sign-On Account Initiation Stream CTA */}
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

        {/* Layout Structural Visual Differentiation Splitter Element */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-[#E5E7EB]"></div>
          <span className="text-[11px] font-black tracking-widest text-[#9CA3AF] px-3 uppercase">
            OR
          </span>
          <div className="flex-grow border-t border-[#E5E7EB]"></div>
        </div>

        {/* 2. Structured Email Account Record Input Matrix Fields */}
        <form onSubmit={handleEmailRegister} className="flex flex-col gap-5 text-left">
          
          {/* Form Input Block: Full Name Parameter Set */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#374151] uppercase tracking-wider">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rahim Ahmed"
              disabled={loading}
              className="w-full border border-[#E5E7EB] focus:border-[#00B058] focus:ring-1 focus:ring-[#00B058] rounded-xl py-3 px-4 text-sm font-medium text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF]"
            />
          </div>

          {/* Form Input Block: Email Address Data Parameter Set */}
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

          {/* Form Input Block: Secret Security Password Parameter Set */}
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

          {/* Core App Main Form Registration CTA - Signature Brand Accent Color */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#00B058] hover:bg-[#008A45] active:scale-[0.98] disabled:bg-[#9CA3AF] disabled:scale-100 text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-sm text-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        {/* Interface Navigation Route Converter Footer Link Text */}
        <p className="mt-8 text-sm font-semibold text-[#6B7280]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#00B058] hover:text-[#008A45] font-bold hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;