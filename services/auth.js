const jwt = require('jsonwebtoken')

const authJWT = (req,res,next)=>{
    const authHead = req.headers.authorization

    if(authHead){
        if(DEBUG) console.log('in authHead')
        const token = authHead.split(' ')[1]
        jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
            if(err){
                console.log(err)
            }
            req.user = user
            next();
        })
    }else{
        req.session.stat = 'you needed to be logged in to search'
        res.redirect('/login')
}
}
const setTok = (req,res,next)=>{
    if(req.session && req.session.token){
        req.headers['authorization'] = `Bearer ${req.session.token}`
    }
    next();
}
module.exports={
    authJWT,
    setTok
}