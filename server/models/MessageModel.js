import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        require: true
    },
    recipinent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        require: false
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        require: true
    },
    content: {
        type: String,
        require: function () {
            return this.messageType === "text"
        }
    },
    fileUrl: {
        type: String,
        require: function () {
            return this.messageType === "file"
        }
    },
    timesTamp: {
        type: Date,
        default: Date.now
    }
})

const Messages = mongoose.model("Messages", messageSchema);
export default Messages;













