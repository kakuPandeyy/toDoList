//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const _ = require('lodash')
require('dotenv').config()
const myPassword = process.env.PASSWORD
const myNAME = process.env.NAME
const myCOLLECTION =process.env.COLLECTION
const myPORT =process.env.PORT

// const date = require(__dirname + "/date.js");
mongoose.connect('mongodb+srv://'+myNAME+':'+myPassword+'@cluster0.p8aesom.mongodb.net/'+myCOLLECTION,{useNewUrlParser: true})
const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



const itemSchema = {
  item:String
}
const listSchema = {
 ListName:String,
 item:[itemSchema]
}
const Item = new mongoose.model("item",itemSchema)
const List = new mongoose.model("customList",listSchema)

const meditaion = new Item ({
item:"good day 😍"
})
const yoga= new Item ({
 item:"<-- click to delete"
 })

 const defaultArray = [meditaion,yoga];


app.get("/", function(req, res) {

// const day = date.getDate();



 

Item.find((err,foundItems)=>{
  if (err) {
    console.log(err)
  } else {

    if (foundItems.length===0) {
      
 Item.insertMany(defaultArray,(err)=>{
   if (!err) {
    console.log("successfully")
   } 
   
 })
 
  res.redirect('/');
   
    } else {
      res.render("list", {listTitle: "today", newListItems: foundItems});
    }
  
  }
})

});
// const listSchema = {

// }
app.get("/:customListName",(req,res)=>{
  const customListName = _.capitalize(req.params.customListName)



List.findOne({ListName:customListName},(err,match)=>{

if (!err) {
  if (!match) {
    
 const list1 = new List (
  {
  ListName:customListName,
  item:defaultArray
  }
 )
 list1.save();
 res.redirect("/" +customListName)
  } else {
    res.render("list", {listTitle: match.ListName, newListItems: match.item});
  }
} 
  })

 
}) 

app.post("/", function(req, res){

  const itemName = req.body.newItem;
   
  const listName = req.body.lists;

 
  const item1 = new Item({
    item: itemName,
  })

  if (listName==="today") {
    item1.save();
    res.redirect('/')
  } else {
    List.findOne({ListName:listName,},(err,foundList)=>{


      console.log( foundList.item)
      foundList.item.push(item1);
      foundList.save();
    res.redirect("/" + listName)
    })
  }

});

app.post("/delete",(req,res)=>{
   const dele = req.body.checkboxs;
   const deleItem = req.body.deleItem

   if (deleItem==="today") {
    Item.findByIdAndDelete(dele,(e)=>{
      console.log(e)
    })
    res.redirect('/')
   } else {
    List.findOneAndUpdate({ListName:deleItem},{$pull:{item:{_id:dele}}},(err,doc)=>{
if (!err) {
  res.redirect("/"+deleItem)
}
    })
   }
  
})


app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(myPORT, function() {
  console.log("Server started on port "+myPORT);
});
