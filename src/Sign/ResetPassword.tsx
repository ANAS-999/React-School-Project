import { sendPasswordResetEmail } from "firebase/auth";
import {auth} from "../firebase/FirebaseConfig" 
import "./ResetPassword.css"


export default function ResetPassword(){
    const handleSubmit=async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const emailVal=(e.target as HTMLFormElement).email.value;
        sendPasswordResetEmail(auth,emailVal).then(()=>{
            alert("checkyour Email")
        }).catch(err=>{
            alert(err.code)
        })
    }
   return (
  <div className="reset-password-page">
    <div className="reset-password-container">

      {/* Icon Badge */}
      <div className="reset-password-icon-badge">🔑</div>

      {/* Title */}
      <div className="reset-password-header">
        <h1 className="reset-password-title">
          Reset Your <span>Password</span>
        </h1>
        <p className="reset-password-subtitle">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form className="reset-password-form" onSubmit={(e) => handleSubmit(e)}>

        <div className="reset-password-input-group">
          <label className="reset-password-label">Email</label>
          <div className="reset-password-input-wrapper">
            <span className="reset-password-input-icon">✉️</span>
            <input
              className="reset-password-input"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <button className="reset-password-btn" type="submit">
          Send Reset Link →
        </button>

      </form>

      {/* Back link */}
      <p className="reset-password-back">
        Remember your password? <a href="/signin">Sign In</a>
      </p>

    </div>
  </div>
)
}
