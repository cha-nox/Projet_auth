import express from 'express';
import helmet from 'helmet';
//import cors from 'cors';
import morgan from 'morgan';
import mainRoutes from './routes/mainRoutes';
import bodyParser from 'body-parser';

// App initialisation
const port = 2012;
const app = express()
    // Settings
    //.use(cors({origin: 'http://localhost:5173'}))
    .use(express.json())
    .use(helmet())
    .use(helmet.contentSecurityPolicy())
    .use(helmet.hidePoweredBy())
    .use(express.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use(morgan(":date \: :remote-addr - :method :url | :status | :response-time ms | :res[content-length]"))

    // Routes
    .use('/', mainRoutes)

    // Starting the server
    .listen(port, () => {console.log(`Server listening on port ${port}.`);})
    .on('error', err => {console.error(err)});
;