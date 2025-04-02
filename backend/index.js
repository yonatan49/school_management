import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import courseRoutes from "./routes/courseRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import cors from "cors";

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy
// Option 1: Allow all origins with default of cors(*)
app.use(cors());
// Option 2: Allow custom origins
// app.use(cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowHeaders: ['Content-Type'],
// }));

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome to Mern');
});

app.use('/courses', courseRoutes);
app.use('/students', studentRoutes);
app.use('/registrations', registrationRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });   
    })
    .catch((error) => {
        console.log(error);
    });
