import express from "express";
import {createTable,updateTable,getTables, readTable, saveTable } from "../controllers/tableController.js";

const app = express.Router();


app.post('/create',createTable);
app.post('/update/:id',updateTable);
// app.post('/delete');
app.get('/tables',getTables);
app.put('save/:id',saveTable)
app.get('/read/:id',readTable);
export default app;

