import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function RegisterPage() {
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister(e: any) {
    e.preventDefault();

    setErrorMessage("");

    // if user not specified basic input
    if (!usernameInput || !emailInput || !passwordInput) return;

    // if password mismatch
    if (passwordInput !== confirmPasswordInput) {
      setErrorMessage("Password mismatch");
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:8000/v1/auth/register",
        {
          username: usernameInput,
          email: emailInput,
          password: passwordInput,
        }
      );

      if (result.status == 200 && result.data) {
        const access_token = result.data.data.access_token;

        // set access token to cookie
        // expire after 1 day
        Cookies.set("access_token", access_token, { expires: 1 });

        // redirect back to dashboard
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log(error);
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
                <h3 className="mb-5">SIGN UP</h3>
                <form id="register-form" onSubmit={(e) => handleRegister(e)}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="register-username"
                      aria-describedby="usernameHelp"
                      placeholder="Username"
                      required
                      onChange={(e) => setUsernameInput(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="register-email"
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
                      id="register-password"
                      aria-describedby="emailHelp"
                      placeholder="Password"
                      required
                      onChange={(e) => setPasswordInput(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="register-confirm-password"
                      placeholder="Confirm Password"
                      required
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    />
                    <small
                      id="confirm-password-helper"
                      className="form-text text-muted"
                    ></small>
                  </div>

                  <div className="form-group form-check text-left ml-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="register-agree-tos"
                      required
                    />
                    <label htmlFor="agree" className="form-check-label">
                      I agree to the
                      <a href=""> Terms Of Service & Privacy Policy </a>
                    </label>
                  </div>

                  {errorMessage ? (
                    <div className="row my-2">
                      <div id="error-message" className="col-12 text-center">
                        <div className="alert alert-danger" role="alert">
                          {errorMessage}
                        </div>
                      </div>
                    </div>
                  ) : undefined}

                  <div className="form-group my-4">
                    <input
                      type="submit"
                      className="btn btn-primary form-control"
                      value="Create Account"
                    />
                  </div>
                </form>
                <p>
                  Already Have an Account? <a href="/login">Login</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
