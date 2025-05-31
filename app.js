const path = require('path')
const express = require('express');
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')

const app = new express();
app.use(express.json({ limit: '10kb' }));


const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const bookingRouter = require('./routes/bookingRoutes')

const viewRouter = require('./routes/viewRoutes')

const scriptSrcUrls = [
  'https://unpkg.com',
  'https://cdn.jsdelivr.net',
  'https://js.stripe.com'
];

const styleSrcUrls = [
  'https://fonts.googleapis.com',
  'https://unpkg.com' // ✅ Added here
];

const connectSrcUrls = [
  'ws:',
  'http://localhost:*',
  'ws://localhost:*',
  'ws://127.0.0.1:*'
];


const fontSrcUrls = [
  'https://fonts.gstatic.com', 
  'https://js.stripe.com'
];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // 🔄 change from [] to "'self'" or a more appropriate fallback
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      fontSrc: ["'self'", ...fontSrcUrls],
      frameSrc: ["'self'", 'https://js.stripe.com'] // ✅ Allow Stripe to be framed
    }
  })
);



app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());

// GLOBAL MIDDLEWARES

// Set security headers 

// app.use(
//     helmet({
//       contentSecurityPolicy: {
//         directives: {
//           defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
//           baseUri: ["'self'"],
//           fontSrc: ["'self'", 'https:', 'data:'],
//           scriptSrc: [
//             "'self'",
//             'https:',
//             'http:',
//             'blob:',
//             'https://*.mapbox.com',
//             'https://js.stripe.com',
//             'https://m.stripe.network',
//             'https://*.cloudflare.com',
//           ],
//           frameSrc: ["'self'", 'https://js.stripe.com'],
//           objectSrc: ["'none'"],
//           styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
//           workerSrc: [
//             "'self'",
//             'data:',
//             'blob:',
//             'https://*.tiles.mapbox.com',
//             'https://api.mapbox.com',
//             'https://events.mapbox.com',
//             'https://m.stripe.network',
//           ],
//           childSrc: ["'self'", 'blob:'],
//           imgSrc: ["'self'", 'data:', 'blob:'],
//           formAction: ["'self'"],
//           connectSrc: [
//             "'self'",
//             "'unsafe-inline'",
//             'data:',
//             'blob:',
//             'https://*.stripe.com',
//             'https://*.mapbox.com',
//             'https://*.cloudflare.com/',
//             'https://bundle.js:*',
//             'ws://127.0.0.1:*/',
//           ],
//           upgradeInsecureRequests: [],
//         },
//       },
//     })
//   );




if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP , please try again in an hour !'
})
app.use('/api', limiter)
app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet/dist'));


// Body parser, reading data from the body into req.body
// app.use(express.urlencoded({extended : true , limit : '10kb'}))
app.use(cookieParser())

// Data sanitization against nosql query injection
app.use(mongoSanitize())

app.use(xss())

app.use(hpp({
  whitelist: ['duration']
}))



app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies );
  next();
})



// ROUTES 


app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

app.all('*', (req, res, next) => {

  // const err = new Error(`Cant find ${req.originalUrl} on this server`)
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Cant find ${req.originalUrl} on this server !`, 404));
})
// global error handling middleware
app.use(globalErrorHandler)

module.exports = app;