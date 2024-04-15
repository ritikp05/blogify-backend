const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config()
function verfiytoken(req,res,next){



    const token=req.headers.authorization;
jwt.verify(token,process.env.KEY,(err,decode)=>{
try{

    if(!err){
        req.user=decode.existingUser
        next();    
    }
    
}catch(err){

    res.send({
        msg:err.message
    })
}
})
}

module.exports=verfiytoken