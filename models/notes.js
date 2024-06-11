const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    user: {type: String, require: true},
    title: {type: String, require: true},
    body: {type: String, require: true},
});

const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;