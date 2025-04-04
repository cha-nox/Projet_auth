import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import moment from 'moment-timezone';
import passport from 'passport';
import session from 'express-session';
import { Strategy } from 'passport-google-oauth20';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import mainRoutes from './routes/mainRoutes';
import authRoutes from './routes/authRoutes';

// Getting environment variables
dotenv.config({path: path.resolve(__dirname, '../.env')});

// Passport initialisation
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));
passport.use(new Strategy(
    {
        clientID:       process.env.GOOGLE_CLIENT_ID        || '',
        clientSecret:   process.env.GOOGLE_CLIENT_SECRET    || '',
        callbackURL:    process.env.CALLBACK_URL            || ''
    },
    (accessToken, refreshToken, profile, done) => {return done(null, profile);}
));

// App initialisation
morgan.token('date', (req, res, tz) => {return moment().tz(tz as string).format('ddd, DD MMM YYYY HH:mm:ss z');});
const port = 2012;
const app = express()
    // Settings
    .use(session({
        secret:             process.env.SESSION_SECRET || '',
        resave:             false,
        saveUninitialized:  false
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(express.json())
    .use(helmet())
    .use(helmet.contentSecurityPolicy())
    .use(helmet.hidePoweredBy())
    .use(express.urlencoded({extended: false}))
    .use(bodyParser.json())
    .use(morgan(":date[Europe/Paris] \: :remote-addr - :method :url | :status | :response-time ms | :res[content-length]"))
    .set('view engine', 'ejs')
    .set('views', './src/views')
    .use(express.static('public'))

    // Routes
    .use('/', mainRoutes)
    .use('/auth', authRoutes)
    //.use('/api', mainAPIRoutes) //Disables the API routes until they got updated.

    // Starting the server
    .listen(port, () => {console.log(`Server listening on port ${port}.`);})
    .on('error', err => {console.error(err)});
;