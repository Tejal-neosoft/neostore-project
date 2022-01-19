import express from 'express';
import  cors from'cors';
import postRoutes from './routes/postRoutes.js'
import {connectdb} from './config/connection.js'
import proRouter from './routes/productRoutes.js';
const PORT = 5000
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use("../neostore-frontend/public/images/", express.static("public"));

app.use("/posts",postRoutes)
app.use("/products",proRouter)

connectdb();
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`working on ${PORT}`)
})