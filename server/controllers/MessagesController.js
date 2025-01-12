import Messages from "../models/MessageModel.js";
import { mkdirSync, renameSync } from "fs"




export const getMessages = async (request, response, next) => {
    try{
        
        const user1 = request.userId;
        const user2 = request.body.id;

        if(!user1 || !user2) {
            return response.status(400).send("Boht user ID's are required.")
        }

        const messages = await Messages.find({
            $or: [ 
                {sender: user1, recipinent: user2},
                {sender: user2, recipinent: user1}
            ],
        }).sort({timesTamp: 1})
        
        return response.status(200).json({ messages })
    }catch (error) {
        console.log({error})
        return response.status(500).send("Internal Server Error")
    }
}



export const uplaodFile = async (request, response, next) => {
    try{
        
        if(!request.file){
            return response.status(400).send("file is required")
        }

        const date = Date.now()
        let fileDir = `uploads/files/${date}`
        let fileName = `${fileDir}/${request.file.originalname}`

        mkdirSync(fileDir, { recursive: true })
        renameSync(request.file.path, fileName)
        
        
        return response.status(200).json({ filePath: fileName })
    }catch (error) {
        console.log({error})
        return response.status(500).send("Internal Server Error")
    }
}
 