import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Notifications } from "./Notifications";

export function AppLayout({ variant }: { variant: "client" | "musician" }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="topbar">
        <div className="topbar-inner">
          <div className="topbar-links">
            {variant === "client" ? (
              <>
                <NavLink to="/client/advertisements">Мои объявления</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/musician/advertisements">Объявления</NavLink>
                <NavLink to="/musician/responses">Мои отклики</NavLink>
              </>
            )}
          </div>
          <div className="topbar-actions">
            <Notifications />
            <Link
              className="profile-link"
              to={
                variant === "musician" ? "/musician/profile" : "/client/profile"
              }
            >
              {user?.login || "Пользователь"}
            </Link>
            <button
              className="dropdown-action"
              type="button"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
