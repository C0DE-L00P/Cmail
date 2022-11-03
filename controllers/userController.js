const User = require("../models/userSchema");
const bcrypt = require("bcrypt");

// -------------------- IDS

const users_get_id = (mreq, mres) => {
  User.findById(mreq.params.id)
    .populate([
      {
        path: "inbox",
        select: "name",
        model: "Message",
        options: {
          sort: { date: -1 },
          limit: 10,
        },
      },
    ])
    .then((res) => (res ? mres.json(res) : mres.sendStatus(404)))
    .catch(() => mres.sendStatus(404));
};

const users_put_id = (mreq, mres) => {
  //rItems: r for remove
  let {
    inbox,
    sent,
    marked,
    draft,
    trash,
    rMarked,
    rDraft,
    rTrash,
    rInbox,
    rSent,
    ...rest
  } = mreq.body;
  console.log("body", mreq.body, "rest", rest);

  User.findByIdAndUpdate(
    mreq.params.id,
    {
      ...rest,
      $addToSet: {
        inbox,
        sent,
        draft,
        marked,
        trash,
      },
      $pull: {
        draft: rDraft,
        marked: rMarked,
        trash: rTrash,
        inbox: rInbox,
        sent: rSent,
      },
    },
    { new: true },
    function (err, docs) {
      if (err) return mres.sendStatus(404);
      mres.json(docs);
    }
  );
};

const users_delete_id = (mreq, mres) => {
  User.findByIdAndDelete(mreq.params.id, function (err) {
    if (err) return mres.sendStatus(404);
    mres.sendStatus(200);
  });
};

// --------------------- General

const users_post = (mreq, mres) => {
  bcrypt.hash(mreq.body.password, 10, function (err, hash) {
    if (err != null) return mres.status(400).json({ message: err });

    mreq.body.password = hash;

    let host = process.env.HOST;
    mreq.body.img = mreq.file.path.replace("public", host);

    const user = new User(mreq.body);

    user
      .save()
      .then((res_cat) => {
        mres.json(res_cat);
      })
      .catch((err) => {
        mres.status(500).json({ user: err });
      });
  });
};

const users_get = (mreq, mres) => {
  if (mreq.query.search || mreq.query.Search) {
    //String Query Param for Search
    let que = mreq.query.search || mreq.query.Search;
    console.log("que", que);
    User.find({
      $or: [
        { name: { $regex: que, $options: "i" } },
        { desc: { $regex: que, $options: "i" } },
        { email: { $regex: que, $options: "i" } },
      ],
    })
      .sort({ date: -1 })
      .then((filt_feeds) => {
        const count = filt_feeds?.length ?? 0;
        mres.json({ data: filt_feeds, count });
      })
      .catch((err) => mres.status(404).json({ message: err }));
  } else {
    //General
    const { page = 1, limit = 10 } = mreq.query;
    User.find()
      .sort({ name: 1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select({ password: 0 })
      .then(async (feeds) => {
        const count = await User.countDocuments({});
        mres.json({ data: feeds, count });
      });
  }
};

module.exports = {
  users_get_id,
  users_put_id,
  users_delete_id,
  users_post,
  users_get,
};
