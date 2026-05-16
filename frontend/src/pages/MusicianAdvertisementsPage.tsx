import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { advertisementApi } from "../api/endpoints";
import type { Advertisement } from "../types/models";
import { formatCurrency, formatDate } from "../utils/format";

export function MusicianAdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [filters, setFilters] = useState({
    requiredGenre: "",
    requiredInstrument: "",
    budget: "",
  });
  const [message, setMessage] = useState("");

  const loadFeed = async () => {
    const preparedFilters = {
      requiredGenre: filters.requiredGenre.trim() || undefined,
      requiredInstrument: filters.requiredInstrument.trim() || undefined,
      budget: filters.budget.trim() || undefined,
    };

    const items = await advertisementApi.feed(preparedFilters);
    setAdvertisements(items);
  };

  useEffect(() => {
    void loadFeed();
  }, []);

  const applyFilters = async (event: FormEvent) => {
    event.preventDefault();
    await loadFeed();
  };

  const respond = async (id: number) => {
    setMessage("");
    try {
      await advertisementApi.respond(id);
      setMessage("Отклик отправлен. Заказчик получил уведомление.");
    } catch {
      setMessage(
        "Отклик не отправлен: профиль должен совпадать с жанром и инструментом объявления.",
      );
    }
  };

  return (
    <main className="page container-page">
      <div className="page-header">
        <div>
          <h1>Лента объявлений</h1>
          <p>Активные заказы, доступные для отклика музыкантам</p>
        </div>
      </div>

      <form className="filter-section" onSubmit={applyFilters}>
        <label>
          Жанр
          <input
            value={filters.requiredGenre}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                requiredGenre: event.target.value,
              }))
            }
            placeholder="Джаз"
          />
        </label>
        <label>
          Инструмент
          <input
            value={filters.requiredInstrument}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                requiredInstrument: event.target.value,
              }))
            }
            placeholder="Гитара"
          />
        </label>
        <label>
          Бюджет от
          <input
            type="number"
            value={filters.budget}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                budget: event.target.value,
              }))
            }
            placeholder="5000"
          />
        </label>
        <button className="btn-dark" type="submit">
          🔎 Найти
        </button>
      </form>

      {message && <p className="notice">{message}</p>}

      <div className="cards-grid">
        {advertisements.map((advertisement, index) => (
          <article
            className={`announcement-card musician-card variant-${(index % 4) + 1}`}
            key={advertisement.id}
          >
            <div className="announcement-header">
              <div>
                <h5>{advertisement.title}</h5>
                <p>📍 {advertisement.location}</p>
              </div>
            </div>
            <div className="announcement-body">
              <div className="announcement-meta">
                <span>📅 {formatDate(advertisement.eventDate)}</span>
                <span>💰 {formatCurrency(advertisement.budget)}</span>
              </div>
              <div className="tags">
                <span className="tag">{advertisement.requiredGenre}</span>
                <span className="tag">{advertisement.requiredInstrument}</span>
              </div>
              <div className="btn-actions">
                <Link
                  className="btn-sm btn-outline"
                  to={`/musician/advertisements/${advertisement.id}`}
                >
                  Подробнее
                </Link>
                <button
                  className="btn-respond"
                  type="button"
                  onClick={() => respond(advertisement.id)}
                >
                  Откликнуться
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
