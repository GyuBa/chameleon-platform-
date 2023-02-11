import * as express from 'express';
import {source} from './DataSource';
import {TypeormStore} from 'connect-typeorm';
import * as session from 'express-session';
import * as fileUpload from 'express-fileupload';
import * as passport from 'passport';
import {initSocket} from './socket/InitSocket';
import {LoginService} from './service/route/LoginService';
import {UploadService} from './service/route/UploadService';
import {PointService} from './service/route/PointService';
import {PassportService} from './service/passport/PassportService';


// Create and setup express app
const app = express();

app.use(express.json());

// Setup express-file-upload
app.use(fileUpload());

// Passport initialize
const passportService = new PassportService();
passportService.init();

// Establish database connection
source
    .initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

// Setup express-session
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

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/login', new LoginService().router);
app.use('/upload', new UploadService().router);
app.use('/point', new PointService().router);


// Start express server
const server = app.listen(process.env.PORT || 5000);

// WS
initSocket(server);
