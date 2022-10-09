const express = require("express");
const router = express.Router();
const messageController = require('../controllers/messageController.js');
const uploadMultiple = require("../middlewares/upload.js");


router.route("/:id")
.get(messageController.messages_get_id)
.put(messageController.messages_put_id)
.delete(messageController.messages_delete_id)
//TODO: how to edit uploaded attachments => check if they are already existed XX still the name is not the same => maybe using middleware of md5 to make a signature of file original name or just store the original name itself
//TODO: Summery: make utils schema for storing uploaded files original names => still how to access mreq.files

router.route("")
.post(uploadMultiple,messageController.messages_post)
.get(messageController.messages_get);

//Custom routes
router.route("/delete_messages").post(messageController.messages_post_delete_group)
router.route("/edit_messages").post(messageController.messages_post_delete_group)

module.exports = router;