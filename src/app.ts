import * as express from "express"
import { myDataSource } from "./data-source"
import LoginRouter from "./routes/login";
const session = require("express-session")

// create and setup express app
const app = express();
app.use(express.json())

//setup express-session
app.use(session({
    secret: "changeit",
    resave: false,
    saveUninitialized: false
}));

// establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

//routes
app.use("/login", LoginRouter)

// start express server
app.listen(3000)