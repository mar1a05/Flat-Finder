//Creare server pe baza express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({path: './config.env'});
const flatRouter = require("./FlatRoutes");
const userRoutes = require("./UserRoutes");
const messageRoutes = require("./MessageRoutes");
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, PATCH, DELETE",
    credentials: true
}))

//Middleware pentru a atasa body pe request
app.use(express.json());
app.use(userRoutes);
app.use(flatRouter);
app.use(messageRoutes);
app.all("*", (request, response, next) => {
    response.status(404).json({
        status: "failed",
        messagge: `Page not found.`
    })
})

//Creare conexiune MongoDB cu Mongoose
mongoose.connect(process.env.CONN_STR)
    .then((succes) => {
        console.log("DB connected");
    }).catch((err) => {
        console.log(`Error connecting to DB: ${err}`);
    })


app.listen(process.env.PORT, () => {
    console.log("Server started...");
})
