import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { advertisementApi, responseApi } from "../api/endpoints";
import type { ResponseItem } from "../types/models";

export function ClientAdvertisementResponsesPage() {
  const params = useParams();
  const id = Number(params.id);
  const [responses, setResponses] = useState<ResponseItem[]>([]);

  const load = async () => {
    const items = await advertisementApi.responses(id);
    setResponses(items);
  };

  useEffect(() => {
    if (!id) return;
    void load();
  }, [id]);

  const setStatus = async (response: ResponseItem, status: "ACCEPTED" | "REJECTED") => {
    await responseApi.setStatus(response.id, status);
    await load();
  };

  return (
    <main className="page container-page">
      <div className="back-header">
        <Link to="/client/advertisements">←</Link>
        <h1>Отклики на объявление</h1>
      </div>

      <div className="cards-list">
        {responses.length === 0 && <p className="empty-state">Откликов пока нет.</p>}
        {responses.map((response) => (
          <article className="announcement-card" key={response.id}>
            <div className="announcement-header">
              <div>
                <h5>{response.musician?.user?.login || `Музыкант #${response.musicianId}`}</h5>
                <p>Статус: {response.status}</p>
              </div>
              <div className="btn-actions">
                {response.status === "PENDING" && (
                  <>
                    <button className="btn-sm btn-outline" type="button" onClick={() => setStatus(response, "ACCEPTED")}>Принять</button>
                    <button className="btn-sm btn-danger" type="button" onClick={() => setStatus(response, "REJECTED")}>Отклонить</button>
                  </>
                )}
              </div>
            </div>
            <p>Телефон: {response.musician?.user?.phone || "Не указан"}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
