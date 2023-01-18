import * as express from "express"
import {myDataSource} from "./DataSource"
import LoginRouter from "./routes/Login";
import {TypeormStore} from "connect-typeorm";
import {passportConfig} from "./passport";

const session = require("express-session")
const cors = require("cors");
// create and setup express app
const app = express();
const passport = require('passport');

app.use(cors());
app.use(express.json())

passportConfig();

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

//passport
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/login", LoginRouter);

// start express server
app.listen(process.env.PORT || 3000);