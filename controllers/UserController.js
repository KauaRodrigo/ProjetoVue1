var User = require('../models/User')
class UserController{

    async index(req, res){
        var users = await User.findAll();
        res.json(users)
    }

    async findUser(req, res){
        var id = req.params.id
        var user = await User.findById(id)
        if(isNaN(id)){
            res.status(400)
            res.json({err: "O id deve ser um número"})
            return
        }
        if(user == undefined){
            res.status(404)
            res.json({err: "Usuário não existente"})
        }else{
            res.status(200)
            res.json(user)
        }
    }

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
            var emailExists = await User.findEmail(email)
            if(emailExists){
                res.status(406)
                res.json({err: "O email já está cadastrado"})
            }else{
                await User.new(email, password, name)            
                res.status(200)
                res.send("Tudo ok!");
            }
        }        
    }

    async edit(req, res){
        var {id, name, email, role} = req.body
        var result = await User.update(id, name, email, role)

        if(result != undefined){
            if(result.status){
                res.status(200)
                res.send("Tudo ok!")
            }else{
                res.status(406)
                res.send(result.err)
            }
        }        
    }

    async login(req, res){

    }

    async passswordRecover(req, res){
        var email = req.body.email
        var result = await User.findByEmail(email)
        
        res.json(result.id)
    }

    async passwordUpdate(req, res){

    }

}

module.exports = new UserController();