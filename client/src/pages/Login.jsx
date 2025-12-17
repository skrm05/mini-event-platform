import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/user/login", {
        email,
        password,
      });

      if (res.data) {
        login(res.data.token, res.data._id);

        alert("Login Successful!");
        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mt-5">
      <div className="row">
        <div className="col-md-5 m-auto">
          <div className="card p-4 shadow-lg border-0 rounded-3">
            <h3 className="text-center fw-bold mb-4">Welcome Back</h3>

            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value.trim())}
                  value={password}
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Loading...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary fw-bold text-decoration-none"
                >
                  Register Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
