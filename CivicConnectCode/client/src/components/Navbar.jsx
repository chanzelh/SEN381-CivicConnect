import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  const normalizedRole = String(role || "").toLowerCase();

  const dashboardLinks = {
    requester: {
      path: "/requester",
      label: "My Requests",
    },
    staff: {
      path: "/staff",
      label: "Staff Dashboard",
    },
    management: {
      path: "/management",
      label: "Management Dashboard",
    },
  };

  const dashboard = dashboardLinks[normalizedRole];

  function getToken() {
    return (
      sessionStorage.getItem("token") ||
      localStorage.getItem("token")
    );
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  }

  function isActive(path) {
    if (path === "/requester") {
      return (
        location.pathname === "/requester" ||
        location.pathname === "/requester/"
      );
    }

    return location.pathname === path;
  }

  function getLinkClass(path) {
    return isActive(path)
      ? "nav-button active"
      : "nav-button";
  }

  async function loadNotifications() {
    const token = getToken();

    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setNotificationError("");

      const [notificationsResponse, countResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/notifications", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(
            "http://localhost:5000/api/notifications/unread-count",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      if (!notificationsResponse.ok || !countResponse.ok) {
        throw new Error(
          "Could not load notifications. Please try again."
        );
      }

      const notificationsData =
        await notificationsResponse.json();

      const countData = await countResponse.json();

      const notificationList = Array.isArray(notificationsData)
        ? notificationsData
        : notificationsData.notifications || [];

      setNotifications(notificationList);

      const count = Number(
        countData.count ?? countData.unreadCount
      );

      setUnreadCount(
        Number.isFinite(count)
          ? count
          : notificationList.filter(
              (notification) =>
                !notification.is_read &&
                !notification.isRead
            ).length
      );
    } catch (error) {
      console.error("Notification error:", error);
      setNotificationError(error.message);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function markAsRead(notification) {
    const id =
      notification.notification_id ?? notification.id;

    if (
      notification.is_read ||
      notification.isRead
    ) {
      return;
    }

    const token = getToken();

    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Could not mark notification as read.");
      }

      setNotifications((current) =>
        current.map((item) =>
          (item.notification_id ?? item.id) === id
            ? { ...item, is_read: true, isRead: true }
            : item
        )
      );

      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (error) {
      console.error("Mark as read error:", error);
      setNotificationError(error.message);
    }
  }

  async function markAllAsRead() {
    const token = getToken();

    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Could not mark all notifications as read."
        );
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
          isRead: true,
        }))
      );

      setUnreadCount(0);
      setNotificationError("");
    } catch (error) {
      console.error("Mark all as read error:", error);
      setNotificationError(error.message);
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleString();
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {dashboard && (
          <Link
            to={dashboard.path}
            className={getLinkClass(dashboard.path)}
          >
            {dashboard.label}
          </Link>
        )}
      </div>

      <div className="navbar-right">
        <div className="notification-wrapper">
          <button
            type="button"
            className="nav-button notification-button"
            aria-label="Notifications"
            aria-expanded={showNotifications}
            onClick={() => {
              const opening = !showNotifications;
              setShowNotifications(opening);

              if (opening) {
                loadNotifications();
              }
            }}
          >
            <span aria-hidden="true">🔔</span>
            <span>Notifications</span>

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <strong>Notifications</strong>

                <button
                  type="button"
                  className="mark-all-button"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </button>
              </div>

              {notificationError && (
                <p className="notification-error">
                  {notificationError}
                </p>
              )}

              {notifications.length === 0 ? (
                <p className="no-notifications">
                  No notifications yet.
                </p>
              ) : (
                <div className="notification-list">
                  {notifications.map((notification) => {
                    const id =
                      notification.notification_id ??
                      notification.id;

                    const isRead =
                      notification.is_read ??
                      notification.isRead ??
                      false;

                    return (
                      <button
                        type="button"
                        key={id}
                        className={`notification-item ${
                          !isRead ? "unread" : ""
                        }`}
                        onClick={() => markAsRead(notification)}
                      >
                        <span className="notification-title">
                          {notification.title}
                        </span>

                        <span className="notification-message">
                          {notification.message}
                        </span>

                        <span className="notification-date">
                          {formatDate(
                            notification.created_at ??
                              notification.createdAt
                          )}
                        </span>

                        {!isRead && (
                          <span className="unread-label">
                            Unread
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <Link
          to="/account"
          className={getLinkClass("/account")}
        >
          My Account
        </Link>

        <button
          type="button"
          className="nav-button logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;