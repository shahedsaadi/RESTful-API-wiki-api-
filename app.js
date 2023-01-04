
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

//connect to MongoDB
mongoose.set('strictQuery', false);
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
}

// create Schema
const articleSchema = {
  title: String,
  content: String
};

// create Model
const Articale = mongoose.model("Articale", articleSchema);

////////////////////// Requests targetting all Articles ///////////////////////
//Chained route handlers using express >> app.route("/"), https://expressjs.com/en/guide/routing.html
app.route("/articles")

.get(function(req, res) {
  Articale.find(function(err, foundArticles)  {
    if(!err) {
       res.send(foundArticles)
    } else {
       res.send(err)
    }

  });
})

.post(function(req, res){
// create Document , Articale is Model name
  const newArticle = new Articale ({
    title: req.body.title,
    content:req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article.");
    }else{
      res.send(err);
    }

  });
})

.delete(function(req, res){
  Articale.deleteMany(function(err){
    if(!err) {
      res.send("Successfully deleted all articles.")
    }else {
      res.send(err);
    }
  });
});


////////////////////// Requests targetting a specific Article //////////////////////
// Route parameters
app.route("/articles/:articleTitle")
//req.params.articleTitle = "JQuery" , that title inside DB

.get(function(req, res){

  Articale.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    } else{
      res.send("NO article matching that title was found.");
    }
  });
})

.put(function(req, res){
  // ModelName.update({condition},{update},{overwrite:true}, function(err){})
  Articale.replaceOne(
    {title: req.params.articleTitle}, //condtion
    {title: req.body.title, content: req.body.content}, //what to update
    {overwrite: true}, //over write
    function(err){
      if(!err){
        res.send("Successfully Updated the selected article.")
      }
    }
  )
})

.patch(function(req, res){
  Articale.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully Updated article.")
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Articale.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the corresponding article.")
      }else{
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
