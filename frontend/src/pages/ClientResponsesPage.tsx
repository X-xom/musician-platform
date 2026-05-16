import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { advertisementApi, responseApi } from "../api/endpoints";
import type { Advertisement, ResponseItem } from "../types/models";

export function ClientResponsesPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

  const load = async () => {
    const items = await advertisementApi.my();
    setAdvertisements(items);
  };

  useEffect(() => {
    void load();
  }, []);

  const responses = useMemo(
    () =>
      advertisements.flatMap((advertisement) =>
        (advertisement.responses || []).map((response) => ({
          ...response,
          advertisement,
        }))
      ),
    [advertisements]
  );

  const setStatus = async (response: ResponseItem, status: "ACCEPTED" | "REJECTED") => {
    await responseApi.setStatus(response.id, status);
    await load();
  };

  return (
    <main className="page container-page">
      <div className="page-header">
        <div>
          <h1>Все отклики</h1>
          <p>Отклики на ваши объявления</p>
        </div>
      </div>

      <div className="cards-list">
        {responses.length === 0 && <p className="empty-state">Откликов пока нет.</p>}
        {responses.map((response) => (
          <article className="announcement-card" key={response.id}>
            <div className="announcement-header">
              <div>
                <h5>{response.advertisement?.title}</h5>
                <p>Статус отклика: {response.status}</p>
              </div>
              <div className="btn-actions">
                {response.status === "PENDING" && (
                  <>
                    <button className="btn-sm btn-outline" type="button" onClick={() => setStatus(response, "ACCEPTED")}>Принять</button>
                    <button className="btn-sm btn-danger" type="button" onClick={() => setStatus(response, "REJECTED")}>Отклонить</button>
                  </>
                )}
                <Link className="btn-sm btn-outline" to={`/client/advertisements/${response.advertisementId}/responses`}>
                  Все отклики объявления
                </Link>
              </div>
            </div>
            <p>Музыкант ID: {response.musicianId}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
