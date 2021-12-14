import dotenv from "dotenv";
import express from "express";
import  mongoose  from "mongoose";
import cors from "cors";
import TodoModel from "./schema/todo_schema.js";

const app =express();
app.use(express.json());
app.use(cors());
dotenv.config()


const port =3000;

const db = process.env.DB_URL;
const username = process.env.USER_NAME;
const password =process.env.USER_PASSWORD;

//Connect to local DB
//mongoose
//  .connect("mongodb://localhost/todo_db",{
//     useNewUrlParser:true,
//     useUnifiedTopology: true,
// })
// .then(()=>{
//     console.log("Connected to MongoDB");
// })
// .catch((err)=>{
//     console.log(err);
// })



mongoose

.connect (db,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
})

app.get("/todos", async (req,res)=>{
    const todoModel = await TodoModel.find({});
    if (todoModel){
        return res.status(200).json({
            status: true,
            message:"Todos fetched sucessfully",
            data: todoModel,
        });
    }
    else{
        return res.status(400).json({
            staus: false,
            message:"Todos not found",
        })
    }
});

app.get("/todo/:id",async (req, res)=>{
    const { status}= req.params;

    const todoModel = await TodoModel.find({}).where('status').equals(status);
    if (todoModel){
        return res.status(200).json({
            status:true,
            message: "Todos fetched successfully",
            data: todoModel,
        });
    } 
    else {
        return res.status(400).json({
            status: false,
            message: "Todos not found",
        });
    }
    
});

app.post("/todo", async(req, res)=>{
    const {title, description, date_time}= req.body;

    const todoModel = await TodoModel.create({
        title,
        description,
        date_time,
    });

    if (todoModel) {
        return res.status(201).json({
            status: true,
            message: "Todos created",
            data: todoModel,
        });
     }
      else {
        return res.status(400).json({
            status: false,
            message: "Todos failed to create",
        });
        }
    });
    app.patch("/todos/:id",async (req,res)=>{
        const{ id}= req.params;
        const {status}= req.body;

        const todoModel = await TodoModel.updateOne({status: status}).where({
            _id: id,
        });
        if (todoModel){
            return res.status(200).json({
                status:true,
                message: "Todos marked as completed!",
                data: todoModel,
            });
        }
        else{
            return res.status(400).json({
                status: false,
                message: "Todos failed to update",
            });
        }
    })

    app.delete("/todo/:id", async (req, res)=>{
        const todoModel = await TodoModel.findByIdAndDelete(req.params.id);
        if(todoModel){
            return res.status(200).json({
                status: true,
                message: "Todo deleted!",
                data: todoModel,
            });
        }
        else {
            return res.status(400).json({
                status: false,
                message: "Todos failed to delete",
            });
        }
    });

    app.listen(port,()=>console.log('Example app listening on port ${port}!'));



