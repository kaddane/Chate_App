
import { Router } from "express"
import { verifyToken } from "../middlewars/AuthMiddlewar.js"
import { getMessages, uplaodFile } from "../controllers/MessagesController.js"
import multer from "multer"


const messagesRoute = Router()

const upload = multer({dest: "uploads/files"})
messagesRoute.post("/get-messages", verifyToken, getMessages)
messagesRoute.post("/uplaod-file", verifyToken, upload.single("file"), uplaodFile)

export default messagesRoute; 

