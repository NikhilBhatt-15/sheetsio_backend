import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { connectDB } from './utils/utility.js';

dotenv.config("./env");
const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors);
app.use(express.json());
connectDB(process.env.MONGO_URI,process.env.DB_NAME);
app.get('/', (req, res) => {
    res.send('Hello World');
    }
);

app.listen(PORT, () => {
    console.log('Server is running on port '+PORT);
    }   
);