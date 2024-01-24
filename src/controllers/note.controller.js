const {
    note
} = require("../models/note.model");
const log = require("../../logger/index")
const {
    operationComplete,
    operationIncomplete
} = require("../consts");

async function createNote({
    title,
    content,
    owner
}){
    try {
        if (!title || !content || !owner){
            return operationIncomplete({
                status: 400,
                message: "Invalid parameters for note creation"
            })
        }
        const Note = await note.create({
            title,
            content,
            owner
        });

        return operationComplete({
            status: 201,
            message: "Note created",
            data: Note
        });
    } catch (error) {
        log.error(error)
        return operationIncomplete({});
    }
}

async function getAllNotesOfUser({
    owner,
    title = "",
}){
    try {
        if (!owner){
            return operationIncomplete({
                status: 400,
                message: "Invalid parameters for note search"
            });
        }
        const Notes = await note.find({
            owner,
            title: {
                $regex: title,
                $options: "i"
            }
        });
        if (!Notes){
            return operationIncomplete({
                status: 404,
                message: "Notes not found"
            });
        }
        return operationComplete({
            status: 200,
            message: "Notes found",
            data: Notes
        });
    } catch (error) {
        log.error(error)
        return operationIncomplete({});
    }
}

async function getNoteById(id){
    try {
        if (!id){
            return operationIncomplete({
                status: 400,
                message: "Invalid parameters for note search"
            });
        }
        const Note = await note.findById(id);
        if (!Note){
            return operationIncomplete({
                status: 404,
                message: "Note not found"
            });
        }
        return operationComplete({
            status: 200,
            message: "Note found",
            data: Note
        });
    } catch (error) {
        log.error(error)
        return operationIncomplete({});
    }
}

async function deleteNoteById(id){
    try {
        if (!id){
            return operationIncomplete({
                status: 400,
                message: "Invalid parameters for note deletion"
            });
        }
        const Note = await note.findByIdAndDelete(id);
        if (!Note){
            return operationIncomplete({
                status: 404,
                message: "Note not found"
            });
        }
        return operationComplete({
            status: 200,
            message: "Note deleted",
            data: Note
        });
    } catch (error) {
        log.error(error)
        return operationIncomplete({});
    }
}

async function updateNoteById(id, {
    title,
    content,
    isRead
}){
    try {
        if (!id){
            return operationIncomplete({
                status: 400,
                message: "Invalid parameters for note update"
            });
        }
        const query = {};
        if (title) query.title = title;
        if (content) query.content = content;
        if (isRead === true || isRead === false) query.isRead = isRead;
        const Note = await note.findByIdAndUpdate(id, query, {
            new: true
        });
        if (!Note){
            return operationIncomplete({
                status: 404,
                message: "Note not found"
            });
        }
        return operationComplete({
            status: 200,
            message: "Note updated",
            data: Note
        });
    } catch (error) {
        log.error(error)
        return operationIncomplete({});
    }
}

module.exports = {
    createNote,
    getAllNotesOfUser,
    getNoteById,
    deleteNoteById,
    updateNoteById
}