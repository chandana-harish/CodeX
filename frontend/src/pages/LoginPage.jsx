import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form);
      navigate("/");
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Unable to login.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-pattern px-4 py-8">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-panel rounded-[2rem] border border-white/10 p-8 shadow-card lg:p-12">
          <p className="text-xs uppercase tracking-[0.45em] text-brand-200">Learning & Development</p>
          <h1 className="mt-4 max-w-xl text-5xl font-extrabold leading-tight text-white">
            Build an operational nerve center for workforce training.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-slate-300">
            Orchestrate employee onboarding, trainer-led programs, and attendance intelligence through a modern
            multi-service platform.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-black text-white">4</p>
              <p className="mt-2 text-sm text-slate-300">Independent microservices</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-black text-white">JWT</p>
              <p className="mt-2 text-sm text-slate-300">Secure role-based sessions</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-black text-white">SaaS</p>
              <p className="mt-2 text-sm text-slate-300">Responsive admin dashboard</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] border border-white/10 p-8 shadow-card lg:p-10">
          <h2 className="text-3xl font-extrabold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-300">Sign in to manage users, trainings, and attendance.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-brand-400"
                placeholder="admin@company.com"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {error ? <div className="rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-300">
            Need an account?{" "}
            <Link className="font-semibold text-brand-200 hover:text-white" to="/register">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
