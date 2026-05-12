import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, githubProvider } from '../firebase/FirebaseConfig'; // T-aked mn smiyat l-folder
import { GoogleAuthProvider, signInWithEmailAndPassword,signInWithPopup } from 'firebase/auth';
import './SignIn.css';


export const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



  const handleSignIn=async(e:React.FormEvent)=>{
      e.preventDefault();
      setLoading(true);
      setError('');
      try{
        const userCredential=await signInWithEmailAndPassword(auth,email,password);
        const user=userCredential.user;

        console.log("user m-connecter:",user.uid);
        navigate(from, { replace: true });
      }catch(err:any){
        setLoading(false);
        if(err.code==="auth/invalid-credential"){
          setError("Email ou mot de passe Incorrect");
        }
        console.error(err.message);
      }
  }

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
}
  const handleGithub =async()=>{
    console.log("Provider check",githubProvider);
    try{
      const result =await signInWithPopup(auth,githubProvider);
      const user =result.user;
      alert(`Welcome ${user.displayName}`);
    }
    catch (error: any) {
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
  }
  const handleResetPassword=()=>{
      navigate('/signin/reset');
  }
   const handleGoHome=()=>{
      navigate('/');
  }
  return (
    <div className="signin-page">
      {/* Background */}
      <div className="signin-bg">
        <div className="signin-bg-grid" />
        <div className="signin-bg-orb signin-bg-orb-1" />
        <div className="signin-bg-orb signin-bg-orb-2" />
      </div>

      {/* Card */}
      <div className="signin-card">

        {/* Logo */}
        <div className="signin-logo">
          <div className="signin-logo-icon">🎮</div>
          <span className="signin-logo-name" onClick={handleGoHome}>EntertainHub</span>
        </div>

        {/* Heading */}
        <div className="signin-heading">
          <h1>Welcome <span>back!</span></h1>
          <p>Sign in to continue your entertainment journey</p>
        </div>

        {/* Form */}
        <div className="signin-form">
          {error && <div className="signin-error">{error}</div>}

          {/* Email */}
          <div className="signin-field">
            <label className="signin-label">Email</label>
            <div className="signin-input-wrap">
              <input
                className="signin-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignIn(e)}
              />
              <span className="signin-input-icon"><i className="fas fa-envelope" aria-hidden="true" /></span>
            </div>
          </div>

          {/* Password */}
          <div className="signin-field">
            <label className="signin-label">Password</label>
            <div className="signin-input-wrap">
              <input
                className="signin-input"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: 38 }}
                onKeyDown={e => e.key === 'Enter' && handleSignIn(e)}
              />
              <span className="signin-input-icon"><i className="fas fa-lock" aria-hidden="true" /></span>
              <button className="signin-eye" onClick={() => setShowPw(v => !v)} type="button">
                <i className={showPw ? 'fas fa-eye-slash' : 'fas fa-eye'} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="signin-forgot-row">
            <button className="signin-forgot" onClick={handleResetPassword}>Forgot password?</button>
          </div>

          {/* Submit */}
          <button className="signin-btn" onClick={handleSignIn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>

          {/* Divider */}
          <div className="signin-divider">
            <div className="signin-divider-line" />
            <span className="signin-divider-text">or continue with</span>
            <div className="signin-divider-line" />
          </div>

          {/* Social */}
          <div className="signin-social">
            <button className="signin-social-btn" onClick={handleGoogle}><i className="fab fa-google" aria-hidden="true" /> Google</button>
            <button className="signin-social-btn" onClick={handleGithub}><i className="fab fa-github" aria-hidden="true"  /> GitHub</button>
          </div>
        </div>

        {/* Footer */}
        <div className="signin-footer">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup', { state: { from: location.pathname } })}>Create one</button>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
