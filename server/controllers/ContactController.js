
import mongoose from "mongoose"
import User from "../models/UsersModel.js"
import Messages from "../models/MessageModel.js"


export const searchContacts = async (request, response, next) => {
    try{
        
        const {searchTerm} = request.body

        if(searchTerm === undefined || searchTerm === null) {
            return response.status(400).send("SearchTerm is required.")
        }

        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()[\]\\]/g,"\\$&")

        const regex = new RegExp(sanitizedSearchTerm, "i")

        const contacts = await User.find({
            $and: [ 
                {_id: {$ne: request.userId}},
                {$or: [{firstName : regex}, {lastName: regex}, {email: regex}]}
            ],
        })
        
        return response.status(200).json({ contacts })
    }catch (error) {
        console.log({error})
        return response.status(500).send("Internal Server Error")
    }
}


export const getContactForDMList = async (request, response, next) => {
    try{
        
        let { userId } = request
        userId = new mongoose.Types.ObjectId(userId)

        const contacts = await Messages.aggregate([
            {
                $match: {
                    $or: [ { sender: userId }, { recipinent: userId } ]
                },
            },
            {
                $sort: {timesTamp: -1},
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipinent",
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timesTamp"},
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                },
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ])

        
        return response.status(200).json({ contacts })
    }catch (error) {
        console.log({error})
        return response.status(500).send("Internal Server Error")
    }
}









