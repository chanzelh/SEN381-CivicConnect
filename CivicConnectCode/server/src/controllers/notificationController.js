
const notificationModel = require("../models/notificationModel");

function getUserId(req, res) {
  const userId = Number(req.user?.user_id);

  if (!Number.isInteger(userId) || userId < 1) {
    res.status(401).json({
      message: "Please log in again.",
    });

    return null;
  }

  return userId;
}

async function getNotifications(req, res) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const notifications =
      await notificationModel.getNotifications(userId);

    return res.json({ notifications });
  } catch (error) {
    console.error("Could not load notifications:", error.message);

    return res.status(500).json({
      message: "Could not load notifications.",
    });
  }
}

async function getUnreadCount(req, res) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const count =
      await notificationModel.getUnreadCount(userId);

    return res.json({ count });
  } catch (error) {
    console.error("Could not count notifications:", error.message);

    return res.status(500).json({
      message: "Could not count notifications.",
    });
  }
}

async function markAsRead(req, res) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const notificationId = Number(req.params.id);

    if (!Number.isInteger(notificationId) || notificationId < 1) {
      return res.status(400).json({
        message: "Invalid notification ID.",
      });
    }

    const notification = await notificationModel.markAsRead(
      notificationId,
      userId
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    return res.json({
      message: "Notification marked as read.",
    });
  } catch (error) {
    console.error("Could not update notification:", error.message);

    return res.status(500).json({
      message: "Could not update notification.",
    });
  }
}

async function markAllAsRead(req, res) {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    await notificationModel.markAllAsRead(userId);

    return res.json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("Could not update notifications:", error.message);

    return res.status(500).json({
      message: "Could not update notifications.",
    });
  }
}

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
