const mongoose = require("mongoose");
// const { Schema } = require("mongoose");
const { type } = require("os");

const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Name required"],
    minLenght: [3, "too short user name "],
  },
  email: {
    type: String,
    required: [true, "email required"],
    uniqe: true,
  },
  password: {
    type: String,
    required: [true, "password required"],
    minLenght: [3, "too short password "],
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified:Boolean,

  createdAt: {
    type: Date,
  },
  following:{
    type:Array,
    default:[]
  },
  followers:{
    type:Array,
    default:[]
  },
  additionalData:{
    type:Object,
    default:{}
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword =async function (canditatePassword) {
  const isMatch=await bcrypt.compare(this.password,canditatePassword)
      return isMatch;
  
  };

module.exports = mongoose.model("User", userSchema);
