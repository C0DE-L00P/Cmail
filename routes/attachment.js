const express = require("express");
const router = express.Router();
const attachmentController = require("../controllers/attachmentController.js");

router
  .route("/:id")
  .get(attachmentController.attachments_get_id)
  .put(attachmentController.attachments_put_id)
  .delete(attachmentController.attachments_delete_id);

router
  .route("/")
  .get(attachmentController.attachments_get)
  .post(attachmentController.attachments_post);

module.exports = router;