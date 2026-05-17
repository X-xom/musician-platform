import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import type { Notification } from "../types/models";

export function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const loadNotifications = async () => {
    try {
      const items = await notificationApi.list();
      setNotifications(items);
    } catch {
      setNotifications([]);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      const updated = await notificationApi.markAsRead(notification.id);
      setNotifications((items) =>
        items.map((item) => (item.id === notification.id ? updated : item)),
      );
    }

    if (user?.role === "CLIENT" && notification.type === "NEW_RESPONSE") {
      navigate("/client/responses");
      return;
    }

    if (user?.role === "MUSICIAN") {
      navigate("/musician/responses");
    }
  };

  return (
    <div className="notifications">
      <button className="nav-button" type="button">
        Уведомления{" "}
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </button>
      <div className="notifications-panel">
        {notifications.length === 0 ? (
          <p className="empty-text">Новых уведомлений нет</p>
        ) : (
          notifications.map((notification) => (
            <button
              className={`notification-item ${notification.isRead ? "read" : ""}`}
              key={notification.id}
              type="button"
              onClick={() => handleNotificationClick(notification)}
            >
              <span>{notification.message}</span>
              <small>
                {new Date(notification.createdAt).toLocaleString("ru-RU")}
              </small>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
