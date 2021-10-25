var jwt = require('jsonwebtoken');
var secret = "george o'maley"

module.exports = function(req, res, next){

    const authToken = req.headers['authorization']

    if(authToken != undefined){
        const bearer = authToken.split(' ')
        var token = bearer[1]

        try{
            var decoded = jwt.verify(token, secret)
            console.log(decoded)
        }catch(err){
            res.status(403)
            res.send("Usuário não autenticado")
            return;
        }
        next()
    }else{
        res.status(403)
        res.send("Usuário não autenticado")
        return;
    }

}