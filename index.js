const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    fs.readdir(`./files`, (err,files)=>{
        res.render("index",{files:files});
    })
});

app.get("/file/:filename",(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8", ((err,filedata)=>{
        res.render("show",{filename: req.params.filename, filedate: filedata});
    }))
});


app.get("/file/delete/:filename",(req,res)=>{
    fs.rm(`./files/${req.params.filename}`, ((err)=>{
        res.redirect("/");
    }))
});

app.get("/edit/:filename",(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8", ((err,filedata)=>{
        res.render("edit",{filename: req.params.filename.split('.').slice(0, -1).join('.')});
    }))
});

app.post("/create",((req,res)=>{
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,(err)=>{
        res.redirect("/");
    })
}))

app.post("/edit",((req,res)=>{
    fs.rename(`./files/${req.body.previous}.txt`,`./files/${req.body.new.split(' ').join('')}.txt`, (err)=>{
        res.redirect("/");
    });
}))


app.listen(3000,()=>{
    console.log("server running http://localhost:3000/");
})