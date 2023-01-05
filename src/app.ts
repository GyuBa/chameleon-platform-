import * as express from "express"
import {myDataSource} from "./data-source"
import LoginRouter from "./routes/login";
import { TypeormStore } from "connect-typeorm";

const session = require("express-session")
const cors = require("cors");
// create and setup express app
const app = express();
app.use(cors());
app.use(express.json())



// establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

//setup express-session
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        store: new TypeormStore({
            cleanupLimit: 2,
            limitSubquery: false, // If using MariaDB.
            ttl: 86400
        }).connect(myDataSource.getRepository('Session')),
        secret: "keyboard cat"
    })
);


//test
app.get('/', (req, res, next) => {
    if(req.session["num"] === undefined){
        req.session['num'] = 1
    }
    else{
        req.session['num'] = req.session['num'] + 1;
    }


    res.send(`Views : ${req.session['num']}`);
})
//routes
app.use("/login", LoginRouter)

// start express server
app.listen(3000)