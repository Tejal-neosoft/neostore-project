import mongoose from 'mongoose';
const checkoutSchema = new mongoose.Schema({
    user_email:{
        type:String,
        required: true, 
    },
    card_name:{
        type: String,
        required: true, 
    },
    subtotal:{
        type:Number,
        required: true,
    },
    gst:{
        type:Number,
        required: true,
    },
    totalCart:{
        type:Array,
        required: true,

    },
    addresses:{
        type:Array,
    },
    created_at:{
        type: Date,
        default: Date.now
    }

})
export default mongoose.model("checkout",checkoutSchema)