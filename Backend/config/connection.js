import mongoose from 'mongoose'
const db = "mongodb://localhost:27017/neostore";
export const connectdb = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true })
        console.log("mongo connected");
    }
    catch (err) {
        console.log(err.message)
    }

}