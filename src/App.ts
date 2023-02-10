import * as express from 'express';
import {source} from './DataSource';
import LoginRouter from './routes/Login';
import {TypeormStore} from 'connect-typeorm';

import * as session from 'express-session';
import * as cors from 'cors';
import * as passport from 'passport';
import {PassportManager} from './passport/PassportManager';
import PointRouter from "./routes/Point";

// create and setup express app
const app = express();

const whiteList = ["https://dev-client.chameleon.best", "https://localhost:3000", "http://localhost:3000"];
app.use(cors({ origin: function (origin, callback) {
        if (whiteList.indexOf(origin) != -1) { // 만일 whitelist 배열에 origin인자가 있을 경우
            callback(null, true); // cors 허용
        } else {
            callback(new Error("Not Allowed Origin!")); // cors 비허용
        }}, credentials: true}));
app.use(express.json());

PassportManager.init();

// establish database connection
source
    .initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

//setup express-session
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        store: new TypeormStore({
            cleanupLimit: 2,
            limitSubquery: false, // If using MariaDB.
            ttl: 86400
        }).connect(source.getRepository('Session')),
        secret: 'keyboard cat'
    })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/login', LoginRouter);
app.use('/point', PointRouter);

// start express server
app.listen(process.env.PORT || 3000);