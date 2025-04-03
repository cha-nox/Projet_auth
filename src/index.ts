import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import moment from 'moment-timezone';
import mainRoutes from './routes/mainRoutes';
import mainAPIRoutes from './routes/mainAPIRoutes';
import bodyParser from 'body-parser';

// App initialisation
morgan.token('date', (req, res, tz) => {return moment().tz(tz as string).format('ddd, DD MMM YYYY HH:mm:ss z');});
const port = 2012;
const app = express()
    // Settings
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
    .use('/api', mainAPIRoutes)

    // Starting the server
    .listen(port, () => {console.log(`Server listening on port ${port}.`);})
    .on('error', err => {console.error(err)});
;