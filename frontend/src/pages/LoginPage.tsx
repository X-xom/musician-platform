import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types/models";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role | null>(null);
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (!role) {
      setError("Выберите роль: музыкант или заказчик");
      return;
    }

    try {
      const payload = { login: loginValue, password, role, phone, companyName };
      const redirectPath =
        mode === "login" ? await login(payload) : await register(payload);
      navigate(redirectPath);
    } catch (requestError) {
      setError(
        "Неверный логин или пароль. \nПожалуйста, проверьте введённые данные.",
      );
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-header">
          <h1>Платформа для поиска музыкантов</h1>
          <p>Выберите роль и войдите в личный кабинет</p>
        </div>

        <div className="role-cards">
          <button
            className={`role-card ${role === "MUSICIAN" ? "selected" : ""}`}
            type="button"
            onClick={() => setRole("MUSICIAN")}
          >
            <span className="role-icon">🎤</span>
            <span>
              <strong>Я музыкант</strong>
              <small>Ищу выступления, управляю профилем и откликами</small>
            </span>
          </button>
          <button
            className={`role-card ${role === "CLIENT" ? "selected" : ""}`}
            type="button"
            onClick={() => setRole("CLIENT")}
          >
            <span className="role-icon">🧾</span>
            <span>
              <strong>Я заказчик</strong>
              <small>Размещаю объявления и ищу исполнителей</small>
            </span>
          </button>
        </div>

        {role && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Логин
              <input
                value={loginValue}
                onChange={(event) => setLoginValue(event.target.value)}
                placeholder="User123"
                required
              />
            </label>
            <label>
              Пароль
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="••••••••"
                required
              />
            </label>
            {mode === "register" && (
              <>
                <label>
                  Телефон
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+7 999 000-00-00"
                  />
                </label>
                {role === "CLIENT" && (
                  <label>
                    Компания
                    <input
                      value={companyName}
                      onChange={(event) => setCompanyName(event.target.value)}
                      placeholder="Event Agency"
                    />
                  </label>
                )}
              </>
            )}
            {error && <p className="form-error">{error}</p>}
            <button className="btn-dark" type="submit">
              {mode === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
            <div className="divider">или</div>
            <button
              className="text-button"
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login"
                ? "Нет аккаунта? Зарегистрироваться"
                : "Уже есть аккаунт? Войти"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
