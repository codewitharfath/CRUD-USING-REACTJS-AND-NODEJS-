const express = require("express")
const cors = require("cors")
const users = require("./sample.json")
const app = express()

app.use(express.json())
const fs = require("fs")

const port =8000
app.use(cors(
    {
        origin:"http://localhost:5173",
        methods:["GET","POST","PATCH","DELETE"],
    }
))

app.get("/users",(req,res)=>{
    return res.json(users)
})


app.delete("/users/:id",(req,res)=>{
    let id = Number(req.params.id)
    let filterUser = users.filter((user)=>
    user.id !== id)
    fs.writeFile("./sample.json",JSON.stringify(filterUser),(err,data)=>{
        return res.json(filterUser)
    })
})

app.post("/users",(req,res)=>{
 
     let {name,age,city} = req.body
     if(!name || !age || !city){
         res.status(400).send({message:"All field Required"})
     }
     let id = Date.now();
     users.push({id,name,age,city})
     fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
         return res.json({message:"user details added success"})
     })
    
})
app.patch("/users/:id",(req,res)=>{
    let id = Number(req.params.id)

     let {name,age,city} = req.body
     if(!name || !age || !city){
         res.status(400).send({message:"All field Required"})
     }
    let index = users.findIndex((user)=> user.id == id)
     users.splice(index,1,{...req.body})
     fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
         return res.json({message:"user details added success"})
     })
    
})


app.listen(port,(err)=>{
    console.log(`app is  running in port ${port}`)
})