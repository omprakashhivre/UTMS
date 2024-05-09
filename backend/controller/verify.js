const jwt = require('jsonwebtoken');
const {User} = require('../model/User');

const verifyUser = async (req, res, next) => {
    try {
        if (!req.headers.authorization) return res.status(400).json({status:"failed" ,  message: "Token not found" }) 
        let userTokenArray = req.headers.authorization.split(" ");
        let userToken = userTokenArray[1]
        console.log(userToken);
        
    jwt.verify(userToken, process.env.SECRET, async(err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        const _id = decoded.userId
        const user = await User.findOne({ where: { id : _id } });  
        // console.log(user);  
        if (!user)
            return res.status(400).json({status:"failed" ,  message: "Invalid Token" })    
        req.userId = _id;
        next();
    });
    } catch (error) {
        return res.status(403).json({status : "failed" , message : error.message , error:error})
    }
   
};

module.exports = {
    verifyUser
}