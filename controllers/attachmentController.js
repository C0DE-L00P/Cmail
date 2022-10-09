const Attachment = require("../models/attachmentSchema");

// -------------------- IDS

const attachments_get_id = (mreq, mres) => {
  Attachment.findById(mreq.params.id)
    .then((res) => (res ? mres.json(res) : mres.sendStatus(404)))
    .catch(() => mres.sendStatus(404));
};

const attachments_put_id = (mreq, mres) => {
  Attachment.findByIdAndUpdate(
    mreq.params.id,
    mreq.body,
    { new: true },
    function (err, docs) {
      if (err) return mres.sendStatus(404);
      mres.json(docs);
    }
  );
};

const attachments_delete_id = (mreq, mres) => {
  Attachment.findByIdAndDelete(mreq.params.id, function (err) {
    if (err) return mres.sendStatus(404);
    mres.sendStatus(200);
  });
};

// --------------------- General

const attachments_post = (mreq, mres) => {
  const attachment = new Attachment(mreq.body);
  attachment
    .save()
    .then((res_cat) => {
      mres.json(res_cat);
    })
    .catch((err) => {
      mres.status(500).json({ attachment: err });
    });
};

const attachments_get = (mreq, mres) => {
  if (mreq.query.search || mreq.query.Search) {
    //String Query Param for Search
    let que = mreq.query.search || mreq.query.Search;
    Attachment.find({
      $or: [
        { filename: { $regex: que, $options: "i" } },
        { originalname: { $regex: que, $options: "i" } },
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
    Attachment.find()
      .sort({ date: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .then(async (feeds) => {
        const count = await Attachment.countDocuments({});
        mres.json({ data: feeds, count });
      });
  }
};

module.exports = {
  attachments_get_id,
  attachments_put_id,
  attachments_delete_id,
  attachments_post,
  attachments_get,
};
