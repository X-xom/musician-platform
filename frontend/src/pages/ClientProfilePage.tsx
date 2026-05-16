import { FormEvent, useEffect, useState } from "react";
import { profileApi } from "../api/endpoints";
import type { Profile } from "../types/models";

export function ClientProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({ login: "", companyName: "", phone: "" });
  const [message, setMessage] = useState("");

  const load = async () => {
    const data = await profileApi.getClient();
    setProfile(data);
    setForm({
      login: data.login || "",
      companyName: data.client?.companyName || "",
      phone: data.phone || "",
    });
  };

  useEffect(() => {
    void load();
  }, []);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    try {
      const updated = await profileApi.updateClient(form);
      setProfile(updated);
      setForm({
        login: updated.login || "",
        companyName: updated.client?.companyName || "",
        phone: updated.phone || "",
      });
      setMessage("Профиль успешно сохранён");
    } catch {
      setMessage("Не удалось сохранить профиль");
    }
  };

  return (
    <main className="page container-page">
      <div className="page-header">
        <div>
          <h1>Профиль заказчика</h1>
          <p>Редактирование имени, компании и телефона</p>
        </div>
      </div>

      {profile && (
        <form className="form-container" onSubmit={save}>
          <div className="form-grid form-grid-single">
            <label>
              Имя
              <input
                value={form.login}
                onChange={(event) => updateField("login", event.target.value)}
                required
              />
            </label>
            <label>
              Имя компании
              <input
                value={form.companyName}
                onChange={(event) =>
                  updateField("companyName", event.target.value)
                }
              />
            </label>
            <label>
              Телефон
              <input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </label>
          </div>
          {message && <p className="notice">{message}</p>}
          <div className="form-actions">
            <button className="btn-dark" type="submit">
              Сохранить
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
