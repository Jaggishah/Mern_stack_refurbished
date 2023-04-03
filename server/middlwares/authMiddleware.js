const jwt = require('jsonwebtoken')

module.exports = (req ,res, next) => {
    try{
        const token = req.header('Authorization').split(" ")[1];
        const decryptedToken = jwt.verify(token,process.env.jwt_secret);
        req.body.userid = decryptedToken.userid
        next()
    }catch(error){
        res.send({
            success:false,
            message:error.message
        })
    }

}