import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())              e.name     = "Name is required";
    if (!form.email.includes("@"))      e.email    = "Valid email required";
    if (form.password.length < 6)       e.password = "Minimum 6 characters";
    if (form.password !== form.confirm) e.confirm  = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate("/");
  };

  const Field = ({ label, id, type = "text", placeholder, value, onChange, error }) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground block mb-1.5">{label}</label>
      <input
        id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`input-dark h-11 w-full text-sm ${error ? "border-destructive" : ""}`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20">
              <span className="font-display font-black text-lg text-[#0B0B0B]">N</span>
            </div>
            <span className="font-display font-bold text-xl">
              Nex<span className="text-gold-gradient">Mart</span>
            </span>
          </Link>
          <h1 className="text-2xl font-display font-bold mt-6 mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground">Join 200,000+ happy shoppers</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name"       id="name"     value={form.name}     onChange={set("name")}     placeholder="Adaeze Okafor"         error={errors.name} />
            <Field label="Email Address"   id="email"    value={form.email}    onChange={set("email")}    placeholder="you@example.com"       error={errors.email} type="email" />

            {/* Password with toggle */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password} onChange={set("password")}
                  placeholder="Min. 6 characters"
                  className={`input-dark h-11 w-full text-sm pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPw
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            <Field label="Confirm Password" id="confirm" value={form.confirm} onChange={set("confirm")} placeholder="Re-enter password" error={errors.confirm} type="password" />

            {/* Terms */}
            <p className="text-xs text-muted-foreground">
              By creating an account you agree to our{" "}
              <a href="#" className="text-gold hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-gold hover:underline">Privacy Policy</a>.
            </p>

            <button type="submit" disabled={loading}
              className="btn-gold w-full h-11 rounded-xl font-display font-bold text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-gold hover:underline font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
