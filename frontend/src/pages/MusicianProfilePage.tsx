import { FormEvent, useEffect, useState } from "react";
import { profileApi } from "../api/endpoints";
import type { Profile } from "../types/models";

const genres = ["Классика", "Джаз", "Поп", "Рок", "Фолк", "Лаунж"];
const instruments = [
  "Гитара",
  "Фортепиано",
  "Скрипка",
  "Ударные",
  "Вокал",
  "Саксофон",
];

export function MusicianProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    bio: "",
    genre: "",
    instrument: "",
    experience: "",
    education: "",
    portfolioUrl: "",
    phone: "",
  });

  const loadProfile = async () => {
    const data = await profileApi.getMusician();
    setProfile(data);
    setForm({
      bio: data.musician?.bio || "",
      genre: data.musician?.genre || "",
      instrument: data.musician?.instrument || "",
      experience: data.musician?.experience || "",
      education: data.musician?.education || "",
      portfolioUrl: data.musician?.portfolioUrl || "",
      phone: data.phone || "",
    });
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    const updated = await profileApi.updateMusician(form);
    setProfile(updated);
    setIsEditing(false);
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  if (!profile) {
    return (
      <main className="page container-page">
        <p>Загрузка профиля...</p>
      </main>
    );
  }

  if (isEditing) {
    return (
      <main className="page container-page">
        <div className="page-header">
          <div>
            <h1>Редактирование профиля</h1>
            <p>Заполните поля формы музыканта</p>
          </div>
        </div>
        <form className="form-container" onSubmit={saveProfile}>
          <div className="form-grid">
            <label>
              Телефон
              <input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </label>
            <label>
              Жанр
              <select
                value={form.genre}
                onChange={(event) => updateField("genre", event.target.value)}
              >
                <option value="">Выберите жанр</option>
                {genres.map((genre) => (
                  <option key={genre}>{genre}</option>
                ))}
              </select>
            </label>
            <label>
              Инструмент
              <select
                value={form.instrument}
                onChange={(event) =>
                  updateField("instrument", event.target.value)
                }
              >
                <option value="">Выберите инструмент</option>
                {instruments.map((instrument) => (
                  <option key={instrument}>{instrument}</option>
                ))}
              </select>
            </label>
            <label>
              Портфолио URL
              <input
                value={form.portfolioUrl}
                onChange={(event) =>
                  updateField("portfolioUrl", event.target.value)
                }
                placeholder="https://..."
              />
            </label>
            <label className="grid-full">
              О себе
              <textarea
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                rows={4}
              />
            </label>
            <label className="grid-full">
              Образование
              <textarea
                value={form.education}
                onChange={(event) =>
                  updateField("education", event.target.value)
                }
                rows={4}
              />
            </label>
            <label className="grid-full">
              Опыт работы
              <textarea
                value={form.experience}
                onChange={(event) =>
                  updateField("experience", event.target.value)
                }
                rows={4}
              />
            </label>
          </div>
          <div className="form-actions">
            <button
              className="btn-secondary"
              type="button"
              onClick={() => setIsEditing(false)}
            >
              Отмена
            </button>
            <button className="btn-dark" type="submit">
              Сохранить
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="page container-page">
      <section className="profile-header">
        <div className="profile-avatar">
          {profile.login.slice(0, 2).toUpperCase()}
        </div>
        <div className="profile-info">
          <h1>{profile.login}</h1>
          <div className="profile-meta">
            <span>☎ {profile.phone || "Телефон не указан"}</span>
            <span>🎼 {profile.musician?.genre || "Жанр не указан"}</span>
            <span>
              🎸 {profile.musician?.instrument || "Инструмент не указан"}
            </span>
          </div>
          <div className="profile-tags">
            {profile.musician?.genre && (
              <span className="profile-tag">{profile.musician.genre}</span>
            )}
            {profile.musician?.instrument && (
              <span className="profile-tag">{profile.musician.instrument}</span>
            )}
          </div>
          <p>
            {profile.musician?.bio ||
              "Добавьте описание, чтобы заказчики лучше понимали ваш стиль и опыт."}
          </p>
          <button
            className="btn-edit"
            type="button"
            onClick={() => setIsEditing(true)}
          >
            ✎ Редактировать профиль
          </button>
        </div>
      </section>

      <section className="profile-section">
        <h3>Образование</h3>
        <p>
          {profile.musician?.education ||
            "Информация об образовании пока не добавлена."}
        </p>
      </section>
      <section className="profile-section">
        <h3>Опыт работы</h3>
        <p>
          {profile.musician?.experience ||
            "Информация об опыте пока не добавлена."}
        </p>
      </section>
      <section className="profile-section">
        <h3>Портфолио</h3>
        {profile.musician?.portfolioUrl ? (
          <a
            className="text-link"
            href={profile.musician.portfolioUrl}
            target="_blank"
            rel="noreferrer"
          >
            Открыть портфолио →
          </a>
        ) : (
          <p>Ссылка на портфолио не добавлена.</p>
        )}
      </section>
    </main>
  );
}
