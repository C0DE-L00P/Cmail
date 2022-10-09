const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController.js')
const uploadSingle = require('../middlewares/upload.js')

router.route("/:id")
.get(userController.users_get_id)
.put(uploadSingle,userController.users_put_id)
.delete(userController.users_delete_id)

router.route("")
.post(uploadSingle,userController.users_post)
.get(userController.users_get);

module.exports = router;