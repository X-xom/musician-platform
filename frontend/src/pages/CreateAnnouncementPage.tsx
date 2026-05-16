import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { advertisementApi } from "../api/endpoints";
import type { AdvertisementStatus } from "../types/models";

const genres = ["Классика", "Джаз", "Поп", "Рок", "Фолк", "Лаунж"];
const instruments = [
  "Гитара",
  "Фортепиано",
  "Скрипка",
  "Ударные",
  "Вокал",
  "Саксофон",
];
const cities = [
  "Москва",
  "Санкт-Петербург",
  "Казань",
  "Екатеринбург",
  "Новосибирск",
  "Нижний Новгород",
];

export function CreateAnnouncementPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    eventType: "",
    eventDate: "",
    city: "",
    address: "",
    budget: "",
    requiredGenre: "",
    requiredInstrument: "",
    description: "",
  });
  const [error, setError] = useState("");

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (status: AdvertisementStatus) => {
    setError("");

    try {
      await advertisementApi.create({
        title: form.title,
        description: `${form.description || "Описание заказа"}\nТип мероприятия: ${form.eventType}`,
        eventDate: new Date(form.eventDate).toISOString(),
        location: [form.city, form.address].filter(Boolean).join(", "),
        budget: Number(form.budget),
        requiredGenre: form.requiredGenre,
        requiredInstrument: form.requiredInstrument,
        status,
      });
      navigate("/client/advertisements");
    } catch {
      setError("Не удалось сохранить объявление. Проверьте заполнение формы.");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await submit("PUBLISHED");
  };

  return (
    <main className="page container-page">
      <div className="back-header">
        <Link className="back-arrow" to="/client/advertisements">
          ←
        </Link>
        <h1>Новое объявление</h1>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <section className="form-section">
          <h3>ⓘ Основная информация</h3>
          <label>
            Заголовок
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Например: Гитарист на корпоратив"
              required
            />
          </label>
          <label>
            Тип мероприятия
            <select
              value={form.eventType}
              onChange={(event) => updateField("eventType", event.target.value)}
              required
            >
              <option value="">Выберите тип</option>
              <option>Корпоратив</option>
              <option>Свадьба</option>
              <option>День рождения</option>
              <option>Концерт</option>
              <option>Частное мероприятие</option>
            </select>
          </label>
        </section>

        <section className="form-section">
          <h3>📅 Детали мероприятия</h3>
          <div className="form-grid">
            <label>
              Дата и время
              <input
                type="datetime-local"
                value={form.eventDate}
                onChange={(event) =>
                  updateField("eventDate", event.target.value)
                }
                required
              />
            </label>
            <label>
              Город
              <select
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                required
              >
                <option value="">Выберите город</option>
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </label>
            <label className="grid-full">
              Точный адрес / площадка
              <input
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="Бизнес-центр Олимп, ул. Примерная, 10"
              />
            </label>
            <label>
              Бюджет ₽
              <input
                type="number"
                value={form.budget}
                onChange={(event) => updateField("budget", event.target.value)}
                placeholder="8000"
                required
              />
            </label>
          </div>
        </section>

        <section className="form-section">
          <h3>🎵 Требования к исполнителю</h3>
          <div className="form-grid">
            <label>
              Жанр музыки
              <select
                value={form.requiredGenre}
                onChange={(event) =>
                  updateField("requiredGenre", event.target.value)
                }
                required
              >
                <option value="" disabled>
                  Выберите жанр
                </option>
                {genres.map((genre) => (
                  <option key={genre}>{genre}</option>
                ))}
              </select>
            </label>
            <label>
              Инструмент / роль
              <select
                value={form.requiredInstrument}
                onChange={(event) =>
                  updateField("requiredInstrument", event.target.value)
                }
                required
              >
                <option value="" disabled>
                  Выберите инструмент
                </option>
                {instruments.map((instrument) => (
                  <option key={instrument}>{instrument}</option>
                ))}
              </select>
            </label>
            <label className="grid-full">
              Описание требований
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={4}
                placeholder="Опишите пожелания к репертуару, опыту..."
              />
            </label>
          </div>
        </section>

        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button
            className="btn-secondary"
            type="button"
            onClick={() => submit("DRAFT")}
          >
            Сохранить черновик
          </button>
          <button className="btn-dark" type="submit">
            Опубликовать объявление
          </button>
        </div>
      </form>
    </main>
  );
}
