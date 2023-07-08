const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({
    extended: true //ALLOWS US TO POST NESTED OBJECTS
}));
app.use(express.static("public"))
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

//CREATE SCHEMA FOR COLLECTION
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

//ARTICLE MODEL
const Article = mongoose.model("Article", articleSchema);

//NEW ARTICLE
const article1 = new Article({
    title: "Test Article",
    content: "This is a demo article"
});

//<!-------------------- ROUTE FOR ALL ARTICLES -----------------------!>
app.route("/articles")
    .get((request, response) => {
            Article.find({})
                .then(function (articles) {
                    //RETURN THE ARTICLES
                    response.send(articles);

                })
                .catch(function (err) {
                    if (err) {
                        //RETURN THE ERROR STATEMENT
                        response.send(err)
                    }
                });
        })
    .delete ((request, response) => {
        Article.deleteMany({})
            .then(function () {
                response.send("Successfully Deleted All Articles");
            })
            .catch(function (err) {
                response.send(err);
            });
    })
    .post((request, response) => {
            console.log(request.body.title);
            console.log(request.body.content);
            //API WITHOUT THE NEED OF A FRONTEND GETS THE DATA FROM USER
            const newArticle = new Article({
                title: request.body.title,
                content: request.body.content
            });

            //SAVE INTO DATABASE
            newArticle.save()
                .then(function () {
                    response.send("Successfully saved new article");
                })
                .catch(function (err) {
                    response.send(err);
                });

        });
//<!---------------------- ROUTE FOR PARTICULAR ARTICLE ----------------!>
app.route("/articles/:articleTitle")
        .get((request, response) => {
            const requestedArticle = request.params.articleTitle;
            Article.findOne({
                title: requestedArticle
            })
                .then(function(foundArticle){
                    if(foundArticle){
                        response.send(foundArticle);
                    }
                    else{
                        response.send("No article with requested title was found");
                    }
                })
                .catch(function(err){
                    if(err){
                        response.send(err);
                    }
                });
        })
        .put((request, response) =>{
            var newContent = request.body.content;
            var newTitle = request.body.title;
            Article.replaceOne({
                title: request.params.articleTitle
            },
            {
                title: newTitle,
                content: newContent
        
            },
            )
                .then(function(){
                    response.send("Successfully updated article with title: " + request.params.articleTitle +  " new content: " + newContent + " new title: " + newTitle);
                })
                .catch(function(err){
                    if(err){
                        response.send(err);
                    }
                });
        })
        .patch((request, response) => {
            Article.updateOne({
                title: request.params.articleTitle
            },
            {
                $set: request.body
            })
                .then(()=>{
                    response.send("Successfully patched article");
                })
                .catch((err) =>{
                    response.send(err);
                });
        })
        .delete((request, response) =>{
            Article.deleteOne({
                title: request.params.articleTitle
            })
                .then(function(){
                    response.send("Successfully delete article.");
                })
                .catch(function(err){
                    if(err){
                        response.send(err);
                    }
                })
        })
//SETUP SERVER
app.listen(3000, function(){
    console.log("Server started on port 3000");
});