const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
},
{
    timestamps: true
});

const note = model("note", noteSchema);

module.exports = {
    note
}