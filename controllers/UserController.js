var User = require('../models/User')
class UserController{

    async index(req, res){}

    async create(req, res){
        console.log(req.body);
        var {email, name, password} = req.body;

        if(email == undefined || email == ""){
            res.status(400);
            res.json({err: "Email é inválido!"})
        }else if(password == undefined || password == ""){
            res.status(400);
            res.json({err: "Senha não pode ser vazia!"})
        }else{
            if(await User.findEmail(email)){
                res.send("Email já cadastrado!")    
            }else{
                await User.new(email, password, name)            
                res.status(200)
                res.send("Tudo ok!");
            }
        }        
    }

}

module.exports = new UserController();