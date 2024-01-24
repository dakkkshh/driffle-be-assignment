const {getNoteById} = require('../src/controllers/note.controller');
const log = require('../logger/index');

async function checkNoteAccess({
    owner,
    noteId
}){
    try {
        const Note = await getNoteById(noteId);
        if (!Note){
            return false;
        }
        if (Note.data?.owner?.toString() !== owner?.toString()){
            return false;
        }
        return true;
    } catch (error) {
        log.error(error);
        return false;
    }
}

module.exports = {
    checkNoteAccess
}