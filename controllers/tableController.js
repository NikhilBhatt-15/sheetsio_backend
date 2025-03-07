import { TryCatch } from "../middlewares/errorMiddleware.js";
import TableModel from "../models/TableModel.js";
import TableDataModel from "../models/TableDataModel.js";
import { ErrorHandler } from "../utils/utility.js";


const createTable = TryCatch(async (req,res)=>{
    const {tableName,columns}=req.body;
    if(!tableName || !columns){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    const table = await TableModel.create({
        userId:req.user._id,
        tableName,
        columns
    })
    res.status(200).json({
        success:true,
        table
    })
})

const getTables = TryCatch(async (req,res)=>{
    const tables = await TableModel.find({
        userId:req.user._id
    })
    const filledTables = tables.map((table)=>{
        const tableData = TableDataModel.find({
            tableId:table._id
        })
        table.data = tableData;
        return table;
    })
    res.status(200).json({
        success:true,
        tables:filledTables
    })
})
const updateTable = TryCatch(async (req,res)=>{
    const {tableName,columns}=req.body;
    if(!tableName || !columns){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    const table = await TableModel.findByIdAndUpdate(req.params.id,{
        userId:req.user._id,
        tableName,
        columns
    })
    if(!table){
        return next(new ErrorHandler("Table not found",404));
    }
    res.status(200).json({
        success:true,
        table
    })
})

export {createTable,getTables,updateTable}