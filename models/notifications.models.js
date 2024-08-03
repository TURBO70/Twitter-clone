const { type } = require("express/lib/response");
const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  link: {
    type: String,
  },
  client: {
    type: String,
  },
  text:String,
  time:Date,
  read:{
    type:Boolean,
    default:false,
  },
});


module.exports = mongoose.model("Notification", notificationSchema);
