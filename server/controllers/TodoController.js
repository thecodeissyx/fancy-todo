const Todo = require('../models/todo')

class TodoController {
    static create(req,res,next){
        const values = {
            name : req.body.name,
            description : req.body.description || "",
            status : "uncompleted",
            dueDate : req.body.dueDate,
            UserId : req.payload._id
        }
        Todo
            .create(values)
            .then((todo) => {
                res.status(201).json(todo)
            })
            .catch((err)=>{
                console.log(err)
                res.status(400).json(err)
            })
    }
    static read(req,res,next){
        const keys = ["name","status","description","dueDate"]
        const condition = {
            "UserId" : req.payload._id
        }
        console.log(req.body)
        keys.forEach(key => {
            if(req.query[key]){
                if(key==="name" || key==="description"){
                    condition[key] = { $regex : `${req.query[key]}` }
                }else{
                    condition[key] = req.query[key]
                }
            }
        });
        Todo
            .find(condition)
            .then((todos) => {
                res.status(200).json(todos)
            })
            .catch((err)=>{
                console.log(err)
                res.status(500).json({message : "Internal server error"})

            })
    }
    static delete(req,res,next){
        const condition = {
            _id : req.params.id
        }
        Todo
            .findByIdAndDelete(condition,{rawResult:true})
            .then((result)=>{
                res.status(200).json(result)
            })
            .catch((err)=>{
                console.log(err)
                res.status(500).json({message : "Internal server error"})
            })
    }
    static update(req,res,next){
        const keys = Object.keys(req.body)
        const values = {}
        const condition = {
            _id : req.params.id
        }
        const option = {
            new : true,
            omitUndefined : true
        }
        keys.forEach(key => {
            if(req.body[key]) values[key] = req.body[key]
        });
        Todo
            .findByIdAndUpdate(condition,values,option)
            .then((result)=>{
                res.status(200).json(result)
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({message : "Internal server error"})
            })
    }
}

module.exports = TodoController