import mongoose from 'mongoose';
const registerSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    addresses: {
        type:Array
    },
    profilepic:{
        type: String
    },
    cart:{
        type:Array
    }
    
})
export default mongoose.model("user",registerSchema)