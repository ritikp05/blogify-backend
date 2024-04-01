const jwt=require("jsonwebtoken");

function verfiytoken(req,res,next){



    const token=req.headers.authorization;
jwt.verify(token,"secret",(err,decode)=>{
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