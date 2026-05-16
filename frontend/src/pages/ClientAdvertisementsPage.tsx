import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { advertisementApi } from "../api/endpoints";
import type { Advertisement, AdvertisementStatus } from "../types/models";
import { formatCurrency, formatDate } from "../utils/format";

const statusLabels: Record<AdvertisementStatus, string> = {
  DRAFT: "Черновик",
  PUBLISHED: "Активно",
  IN_PROGRESS: "В процессе",
  CLOSED: "Завершено",
};

const cardVariants: Record<AdvertisementStatus, string> = {
  DRAFT: "variant-draft",
  PUBLISHED: "variant-active",
  IN_PROGRESS: "variant-progress",
  CLOSED: "variant-closed",
};

export function ClientAdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdvertisements = async () => {
    try {
      setLoading(true);
      const items = await advertisementApi.my();
      setAdvertisements(items);
    } catch {
      setError("Не удалось загрузить объявления");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdvertisements();
  }, []);

  const closeAdvertisement = async (advertisement: Advertisement) => {
    await advertisementApi.update(advertisement.id, { status: "CLOSED" });
    await loadAdvertisements();
  };

  const publishAdvertisement = async (advertisement: Advertisement) => {
    await advertisementApi.update(advertisement.id, { status: "PUBLISHED" });
    await loadAdvertisements();
  };

  return (
    <main className="page container-page">
      <div className="page-header">
        <div>
          <h1>Мои объявления</h1>
          <p>Управляйте заказами и отслеживайте отклики</p>
        </div>
        <Link className="btn-create" to="/client/advertisements/create">
          ＋ Создать объявление
        </Link>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && advertisements.length === 0 && (
        <p className="empty-state">У вас пока нет объявлений.</p>
      )}

      <div className="cards-list">
        {advertisements.map((advertisement) => (
          <article
            className={`announcement-card ${cardVariants[advertisement.status]}`}
            key={advertisement.id}
          >
            <div className="announcement-header">
              <div>
                <h5>{advertisement.title}</h5>
                <span
                  className={`status-badge status-${advertisement.status.toLowerCase()}`}
                >
                  {statusLabels[advertisement.status]}
                </span>
              </div>
              <div className="btn-actions">
                {advertisement.status !== "CLOSED" && (
                  <Link
                    className="btn-sm btn-outline"
                    to={`/client/advertisements/${advertisement.id}/edit`}
                  >
                    Редактировать
                  </Link>
                )}
                {advertisement.status === "DRAFT" && (
                  <button
                    className="btn-sm btn-outline"
                    type="button"
                    onClick={() => publishAdvertisement(advertisement)}
                  >
                    Опубликовать
                  </button>
                )}
                {advertisement.status !== "CLOSED" && (
                  <button
                    className="btn-sm btn-danger"
                    type="button"
                    onClick={() => closeAdvertisement(advertisement)}
                  >
                    Закрыть
                  </button>
                )}
              </div>
            </div>
            <div className="announcement-meta">
              <span>📅 {formatDate(advertisement.eventDate)}</span>
              <span>📍 {advertisement.location}</span>
              <span>💰 {formatCurrency(advertisement.budget)}</span>
            </div>
            <div className="tags">
              <span className="tag">{advertisement.requiredGenre}</span>
              <span className="tag">{advertisement.requiredInstrument}</span>
            </div>
            <p>{advertisement.description}</p>
            <div className="stats">
              <div className="stat-item">
                👥 <strong>{advertisement.responses?.length || 0}</strong>{" "}
                откликов
              </div>
              <Link
                className="btn-sm btn-outline"
                to={`/client/advertisements/${advertisement.id}/responses`}
              >
                Смотреть отклики
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
