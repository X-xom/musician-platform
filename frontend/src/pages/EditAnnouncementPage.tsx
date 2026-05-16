import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { advertisementApi } from "../api/endpoints";

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
const eventTypes = [
  "Корпоратив",
  "Свадьба",
  "День рождения",
  "Концерт",
  "Частное мероприятие",
];

export function EditAnnouncementPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = Number(params.id);

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
    status: "DRAFT",
  });

  useEffect(() => {
    if (!id) return;
    void advertisementApi.getById(id).then((ad) => {
      const date = new Date(ad.eventDate);
      const locationParts = ad.location.split(",").map((part) => part.trim());
      const typePrefix = "Тип мероприятия:";
      const lines = ad.description.split("\n");
      const typeLine = lines.find((line) => line.includes(typePrefix));
      setForm({
        title: ad.title,
        eventType: typeLine ? typeLine.replace(typePrefix, "").trim() : "",
        eventDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
        city: locationParts[0] || "",
        address: locationParts.slice(1).join(", "),
        budget: String(ad.budget),
        requiredGenre: ad.requiredGenre,
        requiredInstrument: ad.requiredInstrument,
        description: lines
          .filter((line) => !line.includes(typePrefix))
          .join("\n"),
        status: ad.status,
      });
    });
  }, [id]);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    await advertisementApi.update(id, {
      title: form.title,
      description: `${form.description}\nТип мероприятия: ${form.eventType}`,
      eventDate: new Date(form.eventDate).toISOString(),
      location: [form.city, form.address].filter(Boolean).join(", "),
      budget: Number(form.budget),
      requiredGenre: form.requiredGenre,
      requiredInstrument: form.requiredInstrument,
      status: form.status as "DRAFT" | "PUBLISHED" | "IN_PROGRESS" | "CLOSED",
    });
    navigate("/client/advertisements");
  };

  return (
    <main className="page container-page">
      <div className="back-header">
        <Link className="back-arrow" to="/client/advertisements">
          ←
        </Link>
        <h1>Редактирование объявления</h1>
      </div>
      <form className="form-container" onSubmit={save}>
        <div className="form-grid">
          <label className="grid-full">
            Заголовок
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
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
              <option value="" disabled>
                Выберите тип
              </option>
              {eventTypes.map((eventType) => (
                <option key={eventType}>{eventType}</option>
              ))}
            </select>
          </label>
          <label>
            Дата и время
            <input
              type="datetime-local"
              value={form.eventDate}
              onChange={(event) => updateField("eventDate", event.target.value)}
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
            Адрес
            <input
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
            />
          </label>
          <label>
            Бюджет
            <input
              type="number"
              value={form.budget}
              onChange={(event) => updateField("budget", event.target.value)}
              required
            />
          </label>
          <label>
            Статус
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              <option value="DRAFT">Черновик</option>
              <option value="PUBLISHED">Опубликовано</option>
              <option value="IN_PROGRESS">В процессе</option>
              <option value="CLOSED">Закрыто</option>
            </select>
          </label>
          <label>
            Жанр
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
            Инструмент
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
            Описание
            <textarea
              rows={5}
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              required
            />
          </label>
        </div>
        <div className="form-actions">
          <button className="btn-dark" type="submit">
            Сохранить изменения
          </button>
        </div>
      </form>
    </main>
  );
}
