


import jwt from "jsonwebtoken"
import User from "../models/UsersModel.js"
import { compare } from "bcrypt"
import { renameSync, unlinkSync } from "fs"

const maxAge = 3 * 24 * 60 * 60 * 1000

const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: maxAge})
}


export const signup = async (request, response, next) => {
    try{
        const {email, password} = request.body
        if(!email || !password){
            return response.status(400).send("Email and Password is Required")
        }
        const user = await User.create({email, password})
        response.cookie("JWT", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })
        return response.status(201).json({
            user: {
                id: user.id, 
                email: user.email,
                profileSetup: user.profileSetup
            }
        })
    }catch (error) {
        console.log({error})
        return response.status(500).send("Internal Server Error")
    }
} 




export const login = async (request, response, next) => {
    try{
        const {email, password} = request.body
        if(!email || !password){
            return response.status(400).send("Email and Password is Required")
        }

        const user = await User.findOne({email})
        if(!user){
            return response.status(404).send("User with this email Not found")
        }

        const auth = await compare(password, user.password)
        if(!auth){
            return response.status(200).send("password is incorrect")
        }

        response.cookie("JWT", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        })
        return response.status(201).json({
            user: {
                id: user.id, 
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color,
            }

        })
    }catch (error) {
        console.log({error})
        return response.status(500).send("Internal Server Error")
    }
} 




export const getUserInfo = async (request, response, next) => {
    try{
        const userData = await User.findById(request.userId)
        if(!userData){
            return response.status(404).send("User with this id Not found")
        }
        return response.status(200).json({
            id: userData.id, 
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        })
    }catch (error) {
        console.log({error})
        return response.status(500).send("Internal Server Error")
    }
} 



export const updateProfile = async (request, response, next) => {
    try{
        const {userId} = request
        const {firstName, lastName, color} = request.body
        if(!firstName || !lastName || !color){
            return response.status(400).send("Firstname Lastname and Color is required ")
        }

        const userData = await User.findByIdAndUpdate(userId,{
            firstName,
            lastName,
            color,
            profileSetup: true
        }, {new: true, runValidators: true})

        return response.status(200).json({
            id: userData.id, 
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        })
    }catch (error) {
        console.log({error})
        return response.status(500).send("Internal Server Error")
    }
}



export const addProfileImage = async (request, response, next) => {
    try{
        if(!request.file){
            response.status(400).send("file is required.")
        }

        const date = Date.now()
        let fileName = "uploads/profiles/" + date + request.file.originalname;
        renameSync(request.file.path, fileName)

        const updatedUser = await User.findByIdAndUpdate(request.userId, {image: fileName}, {new: true, runValidators: true}) 

        return response.status(200).json({
            image: updatedUser.image,
        })
    }catch (error) {
        console.log({error})
        return response.status(500).send("Internal Server Error")
    }
}



export const removeProfileImage = async (request, response, next) => {
    try{
        const {userId} = request
        const user = await User.findById(userId)

        if(!user){
            return response.status(404).send("user not found.")
        }

        if(user.image){
            unlinkSync(user.image)
        }

        user.image = null
        await user.save();

        return response.status(200).send("image removed successfully")
    }catch (error) {
        console.log({error})
        return response.status(500).send("Internal Server Error")
    }
}



export const logOut = async (request, response, next) => {
    try{
        response.cookie("JWT", "", {maxAge: 1, secure: true, sameSite: "None"})
        return response.status(200).send("logOut seccessfull.")
    }catch (error) {
        console.log({error})
        return response.status(500).send("Internal Server Error")
    }
}











