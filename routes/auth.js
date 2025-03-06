import express from 'express';
import { AuthMiddleware } from '../middlewares/authMiddleware.js';
import { login, logout, register } from '../controllers/authController.js';

const app = express.Router();


app.post('/login',login);
app.post('/register',register);

app.use(AuthMiddleware);

app.post('/logout',logout);

export default app;