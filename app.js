const express = require("express")
const mongoose = require("mongoose")
const Article = require("./models/article")
const articleRouter = require("./routes/articles")
const methodOverride = require("method-override")
const PORT = process.env.PORT || 8080
const app = express()


// #for database connection
mongoose.connect("mongodb://localhost/blog",{ useUnifiedTopology: true,useNewUrlParser: true, useCreateIndex:true})
.then(()=>{
    console.log("database connected....");
})
.catch((err)=>{
    console.log(err);
})

app.set("view engine","ejs")
app.use(express.urlencoded({extended:false}))
app.use(methodOverride("_method"))
app.use("/articles",articleRouter)


// #for create some articles
app.get("/", async(req,res)=>{
    const articles = await Article.find().sort({createdAt:"desc"})
    res.render("articles/index",{articles:articles})
})

app.listen(PORT,console.log(`server is running on port ${PORT}`))