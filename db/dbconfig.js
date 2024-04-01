const mongoose=require("mongoose");

function dbConnect(url){
mongoose.connect(url).then((res)=>{
    console.log("DB connection sucessfull"+res)

}).catch((err)=>{
    console.log(err);
})
}


module.exports=dbConnect