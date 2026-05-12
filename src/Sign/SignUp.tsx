import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// @ts-ignore
import { auth, db, githubProvider } from "../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./SignUp.css";

/* ── Password strength helper ── */
function getStrength(pw: string) {
  if (!pw) return { score: 0, label: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return { score: s, label: ["", "Weak", "Fair", "Good", "Strong"][s] };
}

export const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if(form.password!=form.confirm){
      setError("password do not match ");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${form.firstName} ${form.lastName}`,
      });

      await setDoc(doc(db, "users", user.uid), {});

      /* await setDoc(doc(db, "users", user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        createdAt: new Date(),
      }); */

      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate(from, { replace: true }), 1500);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        console.error("Error signing up :", error.message);
        alert(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const strength = getStrength(form.password);

  const segClass = (i: number) => {
    if (!form.password) return "signup-strength-seg";
    const map: Record<number, string> = { 1: "weak", 2: "medium", 3: "medium", 4: "strong" };
    return i <= strength.score
      ? `signup-strength-seg ${map[strength.score] || "medium"}`
      : "signup-strength-seg";
  };
  const handleGoogle = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log(result.user);

      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
    }
  };
  const handleGithub = async () => {
    console.log("Provider check", githubProvider);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      alert(`Welcome ${user.displayName}`);
    } catch (error: any) {
      console.error("Full error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      switch (error.code) {
        case "auth/popup-blocked":
          alert("Popup was blocked. Please allow popups for this site.");
          break;
        case "auth/popup-closed-by-user":
          alert("Popup closed before completing sign-in.");
          break;
        case "auth/unauthorized-domain":
          alert("This domain is not authorized in Firebase Console.");
          break;
        case "auth/account-exists-with-different-credential":
          alert("An account already exists with the same email.");
          break;
        default:
          alert(`Error (${error.code}): ${error.message}`);
      }
    }
  };
  const handleGoHome = () => {
    navigate("/");
  };
  if (success)
    return (
      <div className="signup-page">
        <div className="signup-bg">
          <div className="signup-bg-grid" />
          <div className="signup-bg-orb signup-bg-orb-1" />
          <div className="signup-bg-orb signup-bg-orb-2" />
        </div>
        <div className="signup-card">
          <div className="signup-success">
            <div className="signup-success-icon">🎉</div>
            <h2>You're in, {form.firstName}!</h2>
            <p>
              Your account has been created.
              <br />
              Start exploring your favorites.
            </p>
            <button
              className="signup-btn"
              style={{ marginTop: 28 }}
              onClick={() => navigate("/signin", { state: { from: location.pathname } })}
            >
              Go to Sign In →
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="signup-page">
      {/* Background */}
      <div className="signup-bg">
        <div className="signup-bg-grid" />
        <div className="signup-bg-orb signup-bg-orb-1" />
        <div className="signup-bg-orb signup-bg-orb-2" />
      </div>

      {/* Card */}
      <div className="signup-card">
        {/* Logo */}
        <div className="signup-logo">
          <div className="signup-logo-icon">🎮</div>
          <span className="signup-logo-name" onClick={handleGoHome}>
            EntertainHub
          </span>
        </div>

        {/* Heading */}
        <div className="signup-heading">
          <h1>
            Join the <span>Hub</span>
          </h1>
          <p>Create your free account and start exploring</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp}>
        <div className="signup-form">
          {error && <div className="signup-error">{error}</div>}

          {/* Name row */}
          <div className="signup-row">
            <div className="signup-field">
              <label className="signup-label">First Name</label>
              <div className="signup-input-wrap">
                <input
                  className="signup-input"
                  placeholder="Alex"
                  value={form.firstName}
                  onChange={set("firstName")}
                  required
                />
                <span className="signup-input-icon">
                  <i className="fas fa-user" aria-hidden="true" />
                </span>
              </div>
            </div>
            <div className="signup-field">
              <label className="signup-label">Last Name</label>
              <div className="signup-input-wrap">
                <input
                  className="signup-input"
                  placeholder="Rivera"
                  value={form.lastName}
                  onChange={set("lastName")}
                />
                <span className="signup-input-icon">
                  <i className="fas fa-user" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="signup-field">
            <label className="signup-label">Email</label>
            <div className="signup-input-wrap">
              <input
                className="signup-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
              />
              <span className="signup-input-icon">
                <i className="fas fa-envelope" aria-hidden="true" />
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="signup-field">
            <label className="signup-label">Password</label>
            <div className="signup-input-wrap">
              <input
                className="signup-input"
                type={showPw ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={set("password")}
                style={{ paddingRight: 38 }}
              />
              <span className="signup-input-icon">
                <i className="fas fa-lock" aria-hidden="true" />
              </span>
              <button
                className="signup-eye"
                onClick={() => setShowPw((v) => !v)}
                type="button"
              >
                <i
                  className={showPw ? "fas fa-eye-slash" : "fas fa-eye"}
                  aria-hidden="true"
                />
              </button>
            </div>
            {form.password && (
              <>
                <div className="signup-strength">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={segClass(i)} />
                  ))}
                </div>
                <div className="signup-strength-label">
                  {strength.label} password
                </div>
              </>
            )}
          </div>

          {/* Confirm password */}
          <div className="signup-field">
            <label className="signup-label">Confirm Password</label>
            <div className="signup-input-wrap">
              <input
                className="signup-input"
                type={showCf ? "text" : "password"}
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={set("confirm")}
                style={{ paddingRight: 38 }}
                required
              />
              <span className="signup-input-icon">
                <i className="fas fa-lock" aria-hidden="true" />
              </span>
              <button
                className="signup-eye"
                onClick={() => setShowCf((v) => !v)}
                type="button"
              >
                <i
                  className={showCf ? "fas fa-eye-slash" : "fas fa-eye"}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="signup-terms">
            <input
              className="signup-terms-check"
              type="checkbox"
              id="terms"
              checked={form.terms}
              onChange={set("terms")}
              required
            />
            <label className="signup-terms-text" htmlFor="terms">
              I agree to the <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </label>
          </div>

                  <button
                    className="signup-btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating account…" : "Create Account →"}
                  </button>
          {/* Divider */}
          <div className="signup-divider">
            <div className="signup-divider-line" />
            <span className="signup-divider-text">or sign up with</span>
            <div className="signup-divider-line" />
          </div>


          {/* Social */}
          <div className="signup-social">
            <button className="signup-social-btn" onClick={handleGoogle}>
              <i className="fab fa-google" aria-hidden="true" /> Google
            </button>
            <button className="signup-social-btn" onClick={handleGithub}>
              <i className="fab fa-github" aria-hidden="true" /> GitHub
            </button>
          </div>
        </div>
        </form>

        {/* Footer */}
        <div className="signup-footer">
          Already have an account?{" "}
          <button onClick={() => navigate("/signin", { state: { from: location.pathname } })}>Sign in</button>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
