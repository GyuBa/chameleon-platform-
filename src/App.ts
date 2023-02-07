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


app.use(cors());
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