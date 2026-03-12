const express = require('express');
const morgan = require('morgan');

const routes = require('./routes/index');

const rateLimit = require('express-rate-limit'); // Basic rate-limiting middleware for Express. use to limit repeated request to public APIs and/or endpoints such as password reset.

const helmet = require('helmet');

const mongosanitize = require('express-mongo-sanitize');

const xss = require('xss-clean');

const bodyParser = require('body-parser');

const cors = require('cors');

const cookieParser = require('cookie-parser');

const session = require('cookie-session');

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'PATCH', 'POST', 'DELETE', 'PUT'],
        credentials: true,
    })
)

app.use(cookieParser());

app.use(express.json({limit: '10kb'}));

app.use(bodyParser.json({}));

app.use(bodyParser.urlencoded({extended: true}));

app.use(helmet());

app.use(morgan('dev'));

const limiter = rateLimit({
    max: 3000,
    windowMs: 60 * 60* 1000,
    message: 'Too many request from this IP, please try again in an hour!'
});

app.use('/api', limiter);

app.use(express.urlencoded({
    extended: true,
}))

app.use(mongosanitize());

app.use(xss());

app.use(routes);

module.exports = app;



