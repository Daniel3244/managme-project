import { useState } from "react";

interface Props {
  onLoginSuccess: (token: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const LoginForm: React.FC<Props> = ({ onLoginSuccess, darkMode, toggleDarkMode }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Błąd logowania");
        return;
      }
      const data = await res.json();
      onLoginSuccess(data.token);
    } catch {
      setError("Błąd sieci");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className={`card p-4 ${darkMode ? "bg-secondary text-light" : "bg-white text-dark"}`} style={{ width: "100%", maxWidth: "400px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 m-0">Zaloguj się</h2>
          <button
            type="button"
            className={`btn btn-sm btn-${darkMode ? "light" : "dark"}`}
            onClick={toggleDarkMode}
          >
            {darkMode ? "🌞" : "🌜"}
          </button>
        </div>
        {error && <div className="alert alert-danger py-1">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Login</label>
            <input
              type="text"
              className="form-control"
              value={login}
              onChange={e => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Hasło</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Zaloguj
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
