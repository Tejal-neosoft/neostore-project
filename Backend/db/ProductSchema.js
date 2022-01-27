import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_image: {
        type: String,
        required: true
    },
    product_desc: {
        type: String,
        required: true
    },
    product_subimages: {
        type: Array
    },
    product_cost: {
        type: Number,
        required: true
    },
    product_rating: {
        type: Number
    },
    color_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "color"
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    product_feature:{
        type:String,
        required:true
    },
    rated_by:{
        type:Array,
        default:[]
    }

})
export default mongoose.model("product",productSchema)