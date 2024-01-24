const { Router } = require("express");
const { body, param, query } = require("express-validator");

const {
    createNote,
    getAllNotesOfUser,
    getNoteById,
    deleteNoteById,
    updateNoteById
} = require("../controllers/note.controller");

const {
    sendResponse,
    checkError
} = require("../response");

const {
    jwtVerify
} = require("../../services/jwt");

const {
    checkNoteAccess
} = require("../../services/accessControl");

const noteRouter = Router();

noteRouter
    .route("/")
    .get(
        jwtVerify,
        [
            query("title")
                .optional()
                .trim()
                .isString()
                .withMessage("Title must be a string"),
        ],
        checkError,
        async (req, res) => {
            const id = req.user?._id;
            const {
                title
            } = req.query
            const notes = await getAllNotesOfUser({
                owner: id,
                title
            });
            return sendResponse(res, notes);
        }
    )
    .post(
        jwtVerify,
        [
            body("title")
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage("Title is required")
                .trim()
                .isString()
                .withMessage("Title must be a string"),
            body("content")
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage("Content is required")
                .trim()
                .isString()
                .withMessage("Content must be a string")
        ],
        checkError,
        async (req, res) => {
            const id = req.user?._id;
            const {
                title,
                content
            } = req.body;
            const note = await createNote({
                title,
                content,
                owner: id
            });
            return sendResponse(res, note);
        }
    );

noteRouter
    .route("/:noteId")
    .get(
        jwtVerify,
        [
            param("noteId")
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage("Note Id is required")
                .trim()
                .isMongoId()
                .withMessage("Invalid Note Id")
        ],
        checkError,
        async (req, res) => {
            const id = req.user?._id;
            const {
                noteId
            } = req.params;
            const checkAccess = await checkNoteAccess({
                owner: id,
                noteId
            });
            if (!checkAccess){
                return sendResponse(res, {
                    status: 403,
                    message: "Access denied",
                    type: "ERROR"
                });
            } else {
                const note = await getNoteById(noteId, id);
                return sendResponse(res, note);
            }
        }
    )
    .patch(
        jwtVerify,
        [
            param("noteId")
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage("Note Id is required")
                .trim()
                .isMongoId()
                .withMessage("Invalid Note Id"),
            body("title")
                .optional()
                .trim()
                .isString()
                .withMessage("Title must be a string"),
            body("content")
                .optional()
                .trim()
                .isString()
                .withMessage("Content must be a string"),
            body("isRead")
                .optional()
                .isBoolean()
                .withMessage("isRead must be a boolean")
        ],
        checkError,
        async (req, res) => {
            const id = req.user?._id;
            const {
                noteId
            } = req.params;
            const checkAccess = await checkNoteAccess({
                owner: id,
                noteId
            });
            if (!checkAccess){
                return sendResponse(res, {
                    status: 403,
                    message: "Access denied",
                    type: "ERROR"
                });
            } else {
                const {
                    title,
                    content,
                    isRead
                } = req.body;
                const note = await updateNoteById(noteId, {
                    title,
                    content,
                    isRead
                });
                return sendResponse(res, note);
            }
        }
    )
    .delete(
        jwtVerify,
        [
            param("noteId")
                .exists({ checkFalsy: true, checkNull: true })
                .withMessage("Note Id is required")
                .trim()
                .isMongoId()
                .withMessage("Invalid Note Id")
        ],
        checkError,
        async (req, res) => {
            const id = req.user?._id;
            const {
                noteId
            } = req.params;
            const checkAccess = await checkNoteAccess({
                owner: id,
                noteId
            });
            if (!checkAccess){
                return sendResponse(res, {
                    status: 403,
                    message: "Access denied",
                    type: "ERROR"
                });
            } else {
                const note = await deleteNoteById(noteId);
                return sendResponse(res, note);
            }
        }
    );
    


module.exports = {
    noteRouter
}