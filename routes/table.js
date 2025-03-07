import express from "express";
import {createTable,updateTable,getTables } from "../controllers/tableController.js";

const app = express.Router();


app.post('/create',createTable);
app.post('/update/:id',updateTable);
app.post('/delete');
app.get('/tables',getTables);
// app.get('/read/:id');
export default app;

