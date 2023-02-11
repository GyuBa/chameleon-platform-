import * as express from 'express';
import {source} from './DataSource';
import LoginRouter from './routes/Login';
import {TypeormStore} from 'connect-typeorm';

import * as session from 'express-session';
import * as cors from 'cors';
import * as fileUpload from 'express-fileupload';
import * as passport from 'passport';
import {PassportManager} from './passport/PassportManager';
import UploadRouter from "./routes/Upload";
import PointRouter from "./routes/Point";


// create and setup express app
const app = express();

app.use(express.json());

//setup express-file-upload
app.use(fileUpload())

//passport initialize
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
app.use('/upload', UploadRouter);
app.use('/point', PointRouter);


// start express server
const server = app.listen(process.env.PORT || 3000);

//ws
import {initSocket} from "./socket/InitSocket";
initSocket(server);
