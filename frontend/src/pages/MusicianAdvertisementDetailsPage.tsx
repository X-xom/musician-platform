import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { advertisementApi } from "../api/endpoints";
import type { Advertisement } from "../types/models";
import { formatCurrency, formatDate } from "../utils/format";

export function MusicianAdvertisementDetailsPage() {
  const params = useParams();
  const id = Number(params.id);
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(
    null,
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    void advertisementApi.getById(id).then(setAdvertisement);
  }, [id]);

  const respond = async () => {
    if (!advertisement) return;
    try {
      await advertisementApi.respond(advertisement.id);
      setMessage("Отклик отправлен");
    } catch {
      setMessage(
        "Отклик не отправлен: профиль должен совпадать с жанром и инструментом объявления.",
      );
    }
  };

  if (!advertisement) {
    return (
      <main className="page container-page">
        <p>Загрузка...</p>
      </main>
    );
  }

  return (
    <main className="page container-page">
      <div className="back-header">
        <Link className="back-arrow" to="/musician/advertisements">
          ←
        </Link>
        <h1>{advertisement.title}</h1>
      </div>

      <article className="announcement-card">
        <div className="announcement-meta">
          <span>📅 {formatDate(advertisement.eventDate)}</span>
          <span>📍 {advertisement.location}</span>
          <span>💰 {formatCurrency(advertisement.budget)}</span>
        </div>
        <div className="tags">
          <span className="tag">{advertisement.requiredGenre}</span>
          <span className="tag">{advertisement.requiredInstrument}</span>
        </div>
        <h3>Описание требований</h3>
        <p>{advertisement.description}</p>
        {message && <p className="notice">{message}</p>}
        <button className="btn-respond" type="button" onClick={respond}>
          Откликнуться
        </button>
      </article>
    </main>
  );
}
