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

    // geting only _id,_userId,tableName,createdAt,updatedAt
    const tables = await TableModel.find({
        userId:req.user._id
    }).select({
        _id:1,
        userId:1,
        tableName:1,
        createdAt:1,
        updatedAt:1
    })
    
    res.status(200).json({
        success:true,
        tables:tables
    })
})
const updateTable = TryCatch(async (req,res)=>{
    const tableId = req.params.id;
    const tableRows = req.body.rows;
    const columns = req.body.columns;
    const tableName = req.body.tableName;


    const table = await TableModel.findById(tableId);
    if(!table){
        return next(new ErrorHandler("Table not found",404));
    }
    await TableModel.updateOne({
        _id:tableId
    },{
        columns:columns,
        tableName:tableName
    })
    let tableData = await TableDataModel.findOne({
        tableId:tableId
    });
    if(tableData){
        await TableDataModel.updateOne({
            tableId:tableId
        },{
            rows:tableRows
        })
    }
    else{
        tableData = await TableDataModel.create({
            tableId:tableId,
            rows:tableRows
        })
    }   
    res.status(200).json({
        success:true,
        table,
        rows:tableData.rows
    })
})

const readTable  = TryCatch(async(req,res)=>{
    const table  = await TableModel.findById(req.params.id);
    if(!table){
        return next(new ErrorHandler("Table not found",404));
    }
    const tableData =await  TableDataModel.findOne({
        tableId:req.params.id
    })
    // table.data = tableData.rows;
    if(tableData){
        table.data = tableData.rows;
    }
    res.status(200).json({
        success:true,
        table,
        rows:table.data?table.data:[]
    })  
})

const saveTable = TryCatch(async(req,res)=>{
    const tableId = req.params.id;
    const tableRows = req.body.rows;
    const columns = req.body.columns;
    const table = await TableModel.findById(tableId);
    if(!table){
        return next(new ErrorHandler("Table not found",404));
    }
    if(columns){
        table.columns = columns;
        await table.save();
    }
    const tableData = await TableDataModel.findOne({
        tableId:tableId
    });
    if(tableData){
        tableData.rows = tableRows;
        await tableData.save();
    }
    else{
        tableData = await TableDataModel.create({
            tableId:tableId,
            rows:tableRows
        })
    }
    res.status(200).json({
        success:true,
        table,
        rows:tableData.rows
    })
})

export {createTable,getTables,updateTable,readTable,saveTable};