import { Link } from 'react-router-dom';

export function MusicianDashboard() {
  return (
    <main className="page container-page">
      <section className="hero compact">
        <p className="eyebrow">Кабинет музыканта</p>
        <h1>Находите выступления и развивайте профиль</h1>
        <p>Просматривайте активные объявления, фильтруйте заказы и отправляйте отклики только на подходящие заявки.</p>
        <div className="actions">
          <Link className="button" to="/musician/advertisements">Лента объявлений</Link>
          <Link className="button secondary" to="/musician/profile">Мой профиль</Link>
        </div>
      </section>
    </main>
  );
}
