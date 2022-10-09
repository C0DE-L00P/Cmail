const { default: mongoose } = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = Schema({
    subject: {type: String, required: true},
    content: {type: String, required: true},
    attachments: {type: [{type: Schema.Types.ObjectId, ref: "Attachment"}]},
    sender_name: {type: String},
    sender_img: {type: String},
    date: {type: Date, default: Date.now, required: true},
    from: {type: Schema.Types.ObjectId, ref: "User", required: true},
    cc: {type: [{type: Schema.Types.ObjectId, ref: "User"}], default: []},
    bcc: {type: [{type: Schema.Types.ObjectId, ref: "User"}],default: []},
    to: {type: [{type: Schema.Types.ObjectId, ref: "User"}], required: true},
    isUrgent: {type: Boolean, default: false}
})

//TODO: do you really need isUrgent?

const Message = mongoose.model('Message',messageSchema)
module.exports = Message