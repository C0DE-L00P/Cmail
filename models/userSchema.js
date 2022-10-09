const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();

const userSchema = new Schema({
  email: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
  name: { type: String, required: true },
  desc: { type: String },
  password: { type: String, required: true },
  img: { type: String, default: `${process.env.HOST}/uploads/placeholder.jpg` },
  state: { type: String, default: "Active" },
  inbox: {
    type: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    default: [],
  },
  marked: {
    type: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    default: [],
  },
  draft: [
    {
      subject: String,
      content: String,
      to: [String],
      cc: [String],
      bcc: [String],
      isUrgent: Boolean,
    },
  ],
  sent: {
    type: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    default: [],
  },
  trash: {
    type: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    default: [],
  },
});

//TODO: add the labels logic
//TODO: put some ENUM for state
//TODO: would websocket be needed for state changing? -> could just send a PUT for state when changing focus of tabs or close the tab entirely

const User = new mongoose.model("User", userSchema);
module.exports = User;
