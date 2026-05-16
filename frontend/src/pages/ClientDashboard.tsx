import { Link } from 'react-router-dom';

export function ClientDashboard() {
  return (
    <main className="page container-page">
      <section className="hero compact">
        <p className="eyebrow">Кабинет заказчика</p>
        <h1>Управляйте заказами и откликами</h1>
        <p>Создавайте объявления, отслеживайте статусы и выбирайте подходящих музыкантов для мероприятий.</p>
        <div className="actions">
          <Link className="button" to="/client/advertisements/create">Создать объявление</Link>
          <Link className="button secondary" to="/client/advertisements">Мои объявления</Link>
        </div>
      </section>
    </main>
  );
}
