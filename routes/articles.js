const express = require("express")
const router = express.Router()
const Articles = require("../models/article")


router.get("/new", (req,res)=>{
    res.render("articles/new",{article:new Articles()})
})

router.get("/edit/:id", async(req,res)=>{
    const article = await Articles.findById(req.params.id)
    res.render("articles/edit",{article:article})
})

router.get("/:slug", async(req,res)=>{
    const article = await Articles.findOne({slug:req.params.slug})
    if(article == null) res.redirect("/")
    res.render("articles/show",{article:article})

})

router.post("/", async(req,res,next)=>{
    req.article = new Articles()
    next()
},saveArticleAndRedirect("new"))

router.put("/:id", async(req,res,next)=>{
    req.article = await Articles.findById(req.params.id)
    next()
},saveArticleAndRedirect("edit"))

router.delete("/:id", async(req,res)=>{
    try{
        await Articles.findByIdAndDelete(req.params.id)
        res.redirect("/")
    }catch(err){
        console.log(err);
        res.json(err)
    }
})


function saveArticleAndRedirect(path){
    return async(req,res)=>{
        let article = req.article
        article.title= req.body.title
        article.description=req.body.description
        article.markdown = req.body.markdown
        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
    
        }catch(err){
            res.render(`articles/new/${path}`,{article:article})
    
        }
    }
}

module.exports = router