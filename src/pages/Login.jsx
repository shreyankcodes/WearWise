import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-left">

          {/* WearWise Logo */}
          <div className="brand">
            <img
              src="/wearwise-logo.png"
              alt="WearWise Logo"
              className="brand-logo"
            />
            <span>WearWise</span>
          </div>

          {/* Login Content */}
          <div className="auth-content">

            <h1>
              Welcome
              <br />
              back
            </h1>

            <p className="auth-description">
              Manage your wardrobe. Discover your style.
            </p>

            {/* Social Login */}
            <div className="social-login">
              <button type="button" aria-label="Continue with Google">
                G
              </button>

              <button type="button" aria-label="Continue with Facebook">
                f
              </button>

              <button type="button" aria-label="Continue with Apple">
                
              </button>
            </div>

            {/* Divider */}
            <div className="or-divider">
              <span>or</span>
            </div>

            {/* Login Form */}
            <form>
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>

              <button
                type="submit"
                className="login-button"
              >
                Log in
              </button>
            </form>

            {/* Register */}
            <p className="register-text">
              Don't have an account?{" "}
              <Link to="/register">
                Sign up
              </Link>
            </p>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">

          <img
            src="/wardrobe-login.jpg"
            alt="WearWise wardrobe"
          />

          <div className="image-overlay-text">
            <span>WEARWISE</span>

            <h2>
              Your style.
              <br />
              Your wardrobe.
            </h2>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;