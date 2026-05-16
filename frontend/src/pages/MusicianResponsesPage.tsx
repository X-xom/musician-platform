import { useEffect, useState } from "react";
import { responseApi } from "../api/endpoints";
import type { ResponseItem, ResponseStatus } from "../types/models";
import { formatCurrency, formatDate } from "../utils/format";

const statusLabel: Record<ResponseStatus, string> = {
  PENDING: "На рассмотрении",
  ACCEPTED: "Принят",
  REJECTED: "Отклонён",
};

export function MusicianResponsesPage() {
  const [responses, setResponses] = useState<ResponseItem[]>([]);

  useEffect(() => {
    void responseApi
      .my()
      .then(setResponses)
      .catch(() => setResponses([]));
  }, []);

  return (
    <main className="page container-page">
      <div className="page-header">
        <div>
          <h1>Мои отклики</h1>
          <p>Список объявлений, на которые вы уже откликнулись</p>
        </div>
      </div>

      <div className="cards-list">
        {responses.length === 0 && (
          <p className="empty-state">У вас пока нет откликов.</p>
        )}
        {responses.map((response) => (
          <article className="announcement-card" key={response.id}>
            <div className="announcement-header">
              <div>
                <h5>{response.advertisement?.title || "Объявление"}</h5>
                <span
                  className={`status-badge status-${response.status.toLowerCase()}`}
                >
                  {statusLabel[response.status]}
                </span>
                <p>
                  Статус объявления: {response.advertisement?.status || "—"}
                </p>
              </div>
            </div>
            {response.advertisement && (
              <>
                <div className="announcement-meta">
                  <span>📅 {formatDate(response.advertisement.eventDate)}</span>
                  <span>📍 {response.advertisement.location}</span>
                  <span>
                    💰 {formatCurrency(response.advertisement.budget)}
                  </span>
                </div>
                <div className="tags">
                  <span className="tag">
                    {response.advertisement.requiredGenre}
                  </span>
                  <span className="tag">
                    {response.advertisement.requiredInstrument}
                  </span>
                </div>
                <p>{response.advertisement.description}</p>
              </>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
