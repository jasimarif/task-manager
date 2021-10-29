const jwt = require('jsonwebtoken')
const User = require('../db/models/user')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,'thisismysecret')
        const user =await User.findOne({_id:decode._id, 'tokens.token':token})
        if(!user){
            throw new Error
        }
       // console.log(user)
        req.token=token
        req.user= user
        next()
    }
    catch (e) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}
module.exports = auth