var User = require('../models/User')
var PasswordTokens = require('../models/PasswordTokens')
var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")

var secret = "george o'maley"

class UserController{

    async index(req, res){
        var users = await User.findAll();
        res.json(users)        
    }

    async findUser(req, res){
        var id = req.params.id
        if(isNaN(id)){
            res.status(400)
            res.json({err: "O id deve ser um número"})
            return
        }
        var user = await User.findById(id)        
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
                await User.create(email, password, name)            
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

    async remove(req, res){
        var id = req.params.id

        var result = await User.delete(id)

        if(result.status){
                res.status(200)
                res.send("Tudo Ok!")                
        }else{
            res.status(406)
            res.send(result.err)
        }
    }

    async recoverPassword(req, res){
        var email = req.body.email
        var result = await PasswordTokens.create(email)
        if(result.status){
            res.status(200)
            res.send("" + result.token)
        }else{
            res.status(406)
            res.send(result.err)
        }
    }

    async updatePassword(req, res){
        var token = req.body.token
        var newPassword = req.body.password

        var isValid = await PasswordTokens.validade(token)

        if(isValid.status){
            await User.changePassword(newPassword, isValid.token.id_user , isValid.token.token)
            res.status(200)
            res.send("Senha Atualizada")
        }else{
            res.status(406)
            res.send("token inválido")
        }
    }

    async login(req, res){
        var {email, password} = req.body

        var user = await User.findByEmail(email)

        if(user != undefined){
            
            var result = await bcrypt.compare(password, user.password)
            
            if(result){
                var token = jwt.sign({email: user.email, role: user.role}, secret)

                res.status(200)
                res.json({token: token})

            }else{
                res.status(406)
                res.send("Credenciais Inválidas")
            }

        }else{
            res.json({status: false})
        }
    }


}

module.exports = new UserController();