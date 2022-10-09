const { default: mongoose } = require('mongoose')
const Schema = mongoose.Schema

const attachmentSchema = new Schema({
    fieldname: {type: String, default: 'attachments'},
    encoding: {type: String, default: '7bit'},
    date: {type: Date,default: Date.now},
    originalname: String,
    destination: String,
    filename:  String,
    mimetype: String,
    path: String,
    size: Number,
})

const Attachment = new mongoose.model('Attachment', attachmentSchema)
module.exports = Attachment