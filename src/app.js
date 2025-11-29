import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';
import User from './models/User.js';


const app = express();


// Security middleware
app.use(helmet());
app.use(cors());


// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Request logging
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
res.json({ status: 'ok', message: 'Education Scheduler API is running' });
});

// TEMP: test DB connection and user collection
// import User from './models/User.js';
// app.get('/test-users', async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json({ success: true, count: users.length, users });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// Main routes
app.use('/api', routes);

//app running check
app.use('/',(req,res)=>{
    res.send("Server is Running")
})

// 404 handler
app.use(notFound);


// Error handler
app.use(errorHandler);


export default app;