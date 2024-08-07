const Notification = require("../models/notification.model");
const asyncHandler = require("express-async-handler");
const customError = require("../utils/customError");
const User = require("../models/user.models");

const getNotifications = asyncHandler(async (req, res) => {
  let notifications = await Notification.find({
    client: req.user._id,
  }).sort({ time: -1 });
  res.send(notifications);
});

const readNotifications = asyncHandler(async (req, res) => {
  Notification.findByIdAndUpdate(req.body.notificationID, {
    $set: { read: true },
  })
    .then((response) => {
      res.send(response);
    })
    .catch((e) => {
      res.send(e);
    });
});

module.exports = {
  getNotifications,
  readNotifications,
};
