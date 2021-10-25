var knex = require("../database/connection")
var PasswordTokens = require("../models/PasswordTokens")
var bcrypt = require('bcrypt')

class User{

    async findAll(){
        try{
            var result = await knex.select("id", "name", "email", "role").from("users")
            return result
        }catch(err){
            console.log(err)
            return []
        }
        
    }

    async findById(id){
        try{
            var result = await knex.select(["id", "name", "email", "role"]).where({id: id}).table("users")
            if(result.length > 0){
                return result[0]
            }
        }catch(err){
            console.log(err)
            return []
        }
    }

    async create(email, password, name){
        try {
            var hash = await bcrypt.hash(password, 10)            
            await knex.insert({email, password: hash, name, role: 0}).table("users");    
        } catch (err) {
            console.log(err)
        }
    }

    async findEmail(email){
        try{
            var result = await knex.select('*').from("users").where({email: email})
            if(result.length > 0){
                return true
            }else{
                return false
            }
        } catch(err){            
            console.log(err)       
            return false
        }
    }
    
    async update(id, name, email, role){
        
        var user = await this.findById(id);
        
        if(user){
            var editUser = {}

            if(name != undefined){
                editUser.name = name
            }

            if(email != undefined){
                if(email != user.email){
                    var result = await this.findEmail(email)
                    if(!result){
                        editUser.email = email
                    }else{
                        return {status: false, err: "Email já cadastrado"}
                    }
                }
            }           

            if(role != undefined){
                editUser.role = role
            }

            try {
                await knex.update(editUser).where({id: id}).table("users")   
                return {status: true}
            } catch (error) {
                return {status: false, err: error}
            }            

        }else{
            return {status: false, err: "Usuário não existente"}
        }

    }

    async delete(id){
        var user = await this.findById(id);
        if(user != undefined){

            try {
                await knex.delete().where({id: id}).table("users")
                return {status: true}
            } catch (error) {

                return {status: false, err: error}
            }
            

        }else{
            return {status: false, err: "Usuário não encontrado!"}
        }
    }

    async findByEmail(email){
        try{
            var result = await knex.select("*").table("users").where({email: email})
            if(result.length > 0){
                return result[0]
            }
        }catch(err){
            console.log(err)
            return []
        }
    }

    async changePassword(newPassword, id, token){
        var hash = await bcrypt.hash(newPassword, 10)            
        await knex.update({password: hash}).where({id: id}).table("users")
        await PasswordTokens.setUsed(token)
    }
    

}

module.exports = new User();