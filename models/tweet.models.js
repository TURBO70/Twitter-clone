const mongoose = require("mongoose");


const tweetSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "text required"],
    maxLenght: [200, "too much "],
  },
  hearts: {
    type: Array,
    default: [],
  },
  retweets: {
    type: Array,
    default: [],
  },
  replies: {
    type: Array,
    default: [],
  },
  time: {
    type: Date,
    default: [],
  },

  userId: {
    type: String,
  },
  repliedTo:moongose.Schema.Types.ObjectId,
});


module.exports = mongoose.model("Tweet", tweetSchema);
