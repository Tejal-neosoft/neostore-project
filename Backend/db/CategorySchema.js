import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})
export default mongoose.model("category",categorySchema)