import mongoose from 'mongoose';
const colorSchema = new mongoose.Schema({
    color_name: {type: String, required: true, unique: true},
    color_code: {type: String, required: true, unique: true},
})

export default mongoose.model("color",colorSchema)