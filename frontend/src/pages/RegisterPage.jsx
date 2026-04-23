import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  department: "",
  designation: "",
  phone: "",
  role: "Admin"
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
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
      await register(form);
      navigate("/");
    } catch (submitError) {
      setError(submitError.response?.data?.message || "Unable to register.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="glass-panel w-full max-w-3xl rounded-[2rem] border border-white/10 p-8 shadow-card lg:p-10">
        <p className="text-xs uppercase tracking-[0.45em] text-brand-200">Provision Access</p>
        <h1 className="mt-4 text-4xl font-extrabold text-white">Create your platform account</h1>
        <p className="mt-2 text-sm text-slate-300">
          The first registered user should use the <span className="font-semibold text-white">Admin</span> role.
        </p>

        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400"
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
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400"
            >
              <option value="Admin">Admin</option>
              <option value="Trainer">Trainer</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Department</label>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Designation</label>
            <input
              name="designation"
              value={form.designation}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white focus:border-brand-400"
            />
          </div>

          {error ? <div className="md:col-span-2 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

          <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link className="text-sm font-semibold text-brand-200 hover:text-white" to="/login">
              Back to login
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-brand-500 px-6 py-3 font-semibold text-white transition hover:bg-brand-400 disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
