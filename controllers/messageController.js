// const { cAxios: axios } = require("../server");
const axios = require('axios')
const Attachment = require("../models/attachmentSchema");
const Message = require("../models/messageSchema");

// -------------------- IDS

const messages_get_id = (mreq, mres) => {
  Message.findById(mreq.params.id)
    .populate("from", { name: 1, _id: 1, img: 1, desc: 1, email: 1, state: 1 })
    .populate("to", { name: 1, _id: 1, img: 1, desc: 1, email: 1, state: 1 })
    .populate("cc", { name: 1, _id: 1, img: 1, desc: 1, email: 1, state: 1 })
    .populate("bcc", { name: 1, _id: 1, img: 1, desc: 1, email: 1, state: 1 })
    .then((res) => (res ? mres.json(res) : mres.sendStatus(404)))
    .catch(() => mres.sendStatus(404));
};

const messages_put_id = (mreq, mres) => {
  
  //TODO if put new receivers just add to inbox for them
  Message.findByIdAndUpdate(
    mreq.params.id,
    mreq.body,
    { new: true },
    function (err, docs) {
      if (err) return mres.sendStatus(404);
      mres.json(docs);
    }
  );
};

const messages_delete_id = (mreq, mres) => {
  Message.findByIdAndDelete(mreq.params.id, function (err) {
    if (err) return mres.sendStatus(404);
    mres.sendStatus(200);
  });
};

// --------------------- General

const messages_post = async (mreq, mres) => {
  //Save the data in the database
  
  mreq.body.attachments = mreq.files.attachments? await mreq.files.attachments.map((file) =>
    file.path.replace("public", process.env.HOST)
  ): [];

  let result = await Attachment.insertMany(mreq.files.attachments);
  if (!result) return mres.sendStatus(400);

  let attachmentsIds = await result.map((i) => i._id);

  //Save attachments in its schema

  mreq.body.attachments = attachmentsIds;
  const message = new Message(mreq.body);

  let res_message = await message.save();

  if (!res_message)
    return mres.status(500).json({ message: "Error while saving model" });

  //Save message id in the user data (Sender/Receivers)
  console.log('res',res_message,res_message._id.toString())

  axios.put(process.env.HOST + "/api/users/" + mreq.body.from, {sent: res_message._id.toString()})

  mreq.body.to.map((receiver) =>
    axios.put(process.env.HOST + "/api/users/" + receiver, {inbox: res_message._id})
  );

  mres.status(200).json(res_message);
};

const messages_get = (mreq, mres) => {
  if (mreq.query.search || mreq.query.Search) {
    //String Query Param for Search
    let que = mreq.query.search || mreq.query.Search;
    Message.find({
      $or: [
        { sender_name: { $regex: que, $options: "i" } },
        { content: { $regex: que, $options: "i" } },
        { subject: { $regex: que, $options: "i" } },
        { attachments: { $regex: que, $options: "i" } },
      ],
    })
      .sort({ date: -1 })
      .then((filt_feeds) => {
        mres.json(filt_feeds);
      })
      .catch((err) => mres.status(404).json({ message: err }));
  } else {
    //General
    const { page = 1, limit = 10 } = mreq.query;

    Message.find()
      .sort({ date: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .then(async (feeds) => {
        const count = await Message.countDocuments({});
        mres.json({ data: feeds, count });
      });
  }
};

const messages_post_delete_group = async (mreq, mres) => {
  let ids = mreq.body.messagesIds;
  let result = await model.deleteMany({ _id: { $in: ids } });
  //TODO: still needs checking for result if no [] sent
  if (!result) return mres.sendStatus(400);
  mres.sendStatus(200);
};

module.exports = {
  messages_get_id,
  messages_put_id,
  messages_delete_id,
  messages_post,
  messages_get,
  messages_post_delete_group,
};

//TODO (Optional): adding timed tasks to send emails on specific time - redirected emails on demand
