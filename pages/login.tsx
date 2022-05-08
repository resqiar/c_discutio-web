import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();

    if (!emailInput || !passwordInput) return;

    try {
      const result = await axios.post("http://localhost:8080/v1/auth/login", {
        email: emailInput,
        password: passwordInput,
      });

      if (result.status == 200 && result.data) {
        const access_token = result.data.access_token;

        // set access token to cookie
        // expire after 1 day
        Cookies.set("access_token", access_token, { expires: 1 });

        // redirect back to dashboard
        window.location.href = "/dashboard";
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }

  return (
    <div className="auth">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="card">
              <div className="card-body">
                <h3 className="mb-5">SIGN IN</h3>
                <form id="login-form" onSubmit={(e) => handleLogin(e)}>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="login-email"
                      aria-describedby="emailHelp"
                      placeholder="Email"
                      required
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="login-password"
                      placeholder="Password"
                      required
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                  </div>

                  {errorMessage ? (
                    <div className="row mt-2">
                      <div id="error-message" className="col-12 text-center">
                        <div className="alert alert-danger" role="alert">
                          {errorMessage}
                        </div>
                      </div>
                    </div>
                  ) : undefined}

                  <div className="row">
                    <div className="col-6 text-left">
                      <div className="form-group form-check ml-2"></div>
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <input
                      type="submit"
                      value="Sign In"
                      id="login-btn"
                      className="btn btn-primary form-control"
                    />
                  </div>
                </form>
                <p>
                  New Member? <a href="/register">Create Account</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
