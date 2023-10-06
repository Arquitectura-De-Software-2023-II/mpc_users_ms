const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const auth = req.headers.authorization
    let token = undefined
    if(auth && auth.toLowerCase().startsWith('bearer')){
        token = auth.split(' ')[1]
    }
    if(token == undefined) return res.status(401).json({error: 'Acceso denegado'})
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.body.user = verified
        next()
    } catch (error){
        res.status(400).json({error: 'Token no valido, acceso denegado'})
    }
}

module.exports = verifyToken