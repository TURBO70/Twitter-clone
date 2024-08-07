const route = require("express").Router();
const {
  getNotifications,
  readNotifications,
} = require("../controllers/notifications.controllers");

const { auth } = require("../middlewares/auth");

route.get("/", auth, getNotifications);

route.post("/setread", auth, readNotifications);

module.exports = route;
