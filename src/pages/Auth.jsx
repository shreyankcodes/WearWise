import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.79-.07-1.55-.2-2.28H12v4.31h5.23a4.47 4.47 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.92-4.18 2.92-7.4z"
      />
      <path
        fill="#34A853"
        d="M12 21.8c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.8z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.91A5.86 5.86 0 0 1 6.23 12c0-.66.11-1.3.31-1.91V7.57H3.3A9.78 9.78 0 0 0 2.25 12c0 1.58.38 3.07 1.05 4.43l3.24-2.52z"
      />
      <path
        fill="#EA4335"
        d="M12 6.06c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.15 14.63 2.2 12 2.2a9.74 9.74 0 0 0-8.7 5.37l3.24 2.52C7.31 7.78 9.46 6.06 12 6.06z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.04 1.79-4.73 4.55-4.73 1.32 0 2.7.24 2.7.24v2.99h-1.52c-1.5 0-1.97.94-1.97 1.9v2.27h3.35l-.54 3.49h-2.81V24C19.61 23.1 24 18.1 24 12.07z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="#111111"
        d="M17.05 12.54c-.02-2.23 1.82-3.31 1.9-3.36a4.1 4.1 0 0 0-3.23-1.75c-1.37-.14-2.69.82-3.39.82-.71 0-1.8-.8-2.96-.78a4.36 4.36 0 0 0-3.66 2.23c-1.58 2.74-.4 6.77 1.13 8.99.76 1.09 1.65 2.31 2.83 2.26 1.14-.05 1.57-.73 2.94-.73 1.37 0 1.76.73 2.95.7 1.22-.02 1.99-1.1 2.74-2.2a8.99 8.99 0 0 0 1.25-2.55 3.95 3.95 0 0 1-2.5-3.63z"
      />
      <path
        fill="#111111"
        d="M14.82 5.98a3.91 3.91 0 0 0 .89-2.8 4.02 4.02 0 0 0-2.59 1.34 3.74 3.74 0 0 0-.91 2.7 3.32 3.32 0 0 0 2.61-1.24z"
      />
    </svg>
  );
}

function Auth({ initialRegister = false }) {
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);

    navigate("/dashboard");
  } catch (error) {
    console.error("Google sign-in failed:", error);

    if (error.code === "auth/popup-closed-by-user") {
      return;
    }

    alert("Google sign-in failed. Please try again.");
  }
};

  const [isRegistering, setIsRegistering] = useState(initialRegister);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Unable to log in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     REGISTER
  ========================= */

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (registerPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          registerEmail,
          registerPassword
        );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setError("An account already exists with this email.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else {
        setError("Unable to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SWITCH MODE
  ========================= */

  const switchToRegister = () => {
    setError("");
    setIsRegistering(true);
  };

  const switchToLogin = () => {
    setError("");
    setIsRegistering(false);
  };

  return (
    <div className="auth-page">

      <div
        className={`auth-container ${
          isRegistering ? "register-mode" : ""
        }`}
      >

        {/* =========================
            LOGIN
        ========================= */}

        <div className="auth-form login-form">

          <div className="brand">
            <img
              src="/wearwise-logo.png"
              alt="WearWise"
              className="brand-logo"
            />

            <span>WearWise</span>
          </div>

          <div className="auth-content">

            <h1>
              Welcome
              <br />
              back
            </h1>

            <p className="auth-description">
              Manage your wardrobe. Discover your style.
            </p>

            <div className="social-login">

              <button 
              type="button"
              className="social-button"
              onClick={handleGoogleSignIn}
              >
                <GoogleIcon />
              </button>

              <button type="button">
                <FacebookIcon />
              </button>

              <button type="button">
                <AppleIcon />
              </button>

            </div>

            <div className="or-divider">
              <span>or</span>
            </div>

            <form onSubmit={handleLogin}>

              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) =>
                    setLoginEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) =>
                    setLoginPassword(e.target.value)
                  }
                  required
                />
              </div>

              {error && !isRegistering && (
                <p className="auth-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>

            </form>

            <p className="register-text">
              Don't have an account?{" "}

              <button
                type="button"
                className="text-button"
                onClick={switchToRegister}
              >
                Sign up
              </button>
            </p>

          </div>
        </div>


        {/* =========================
            REGISTER
        ========================= */}

        <div className="auth-form register-form">

          <div className="brand">

            <img
              src="/wearwise-logo.png"
              alt="WearWise"
              className="brand-logo"
            />

            <span>WearWise</span>

          </div>

          <div className="auth-content">

            <h1>
              Create
              <br />
              account
            </h1>

            <p className="auth-description">
              Start organizing your wardrobe with WearWise.
            </p>

            <div className="social-login">

              <button type="button">
                <GoogleIcon />
              </button>

              <button type="button">
                <FacebookIcon />
              </button>

              <button type="button">
                <AppleIcon />
              </button>

            </div>

            <div className="or-divider">
              <span>or</span>
            </div>

            <form onSubmit={handleRegister}>

              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>

              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) =>
                    setRegisterEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) =>
                    setRegisterPassword(e.target.value)
                  }
                  required
                />
              </div>

              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />
              </div>

              {error && isRegistering && (
                <p className="auth-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}
              </button>

            </form>

            <p className="register-text">
              Already have an account?{" "}

              <button
                type="button"
                className="text-button"
                onClick={switchToLogin}
              >
                Log in
              </button>
            </p>

          </div>
        </div>


        {/* =========================
            MOVING IMAGE
        ========================= */}

        <div className="auth-image-panel">

          <img
            src="/wardrobe-login.jpg"
            alt="WearWise wardrobe"
          />

          <div className="image-overlay-text">

            <span>WEARWISE</span>

            <h2>
              {isRegistering ? (
                <>
                  Build your style.
                  <br />
                  Own your wardrobe.
                </>
              ) : (
                <>
                  Your style.
                  <br />
                  Your wardrobe.
                </>
              )}
            </h2>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Auth;