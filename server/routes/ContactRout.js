

import { Router } from "express"
import { verifyToken } from "../middlewars/AuthMiddlewar.js"
import { getContactForDMList, searchContacts } from "../controllers/ContactController.js"


const contactsRout = Router()

contactsRout.post('/search', verifyToken, searchContacts)
contactsRout.get('/get-contacts-for-md', verifyToken, getContactForDMList)

export default contactsRout;






