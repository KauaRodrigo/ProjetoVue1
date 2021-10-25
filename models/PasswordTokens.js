var knex = require("../database/connection")
var uuid = require("uuid")
var User = require("./User")

class PasswordTokens{

    async create(email){
        var user = await User.findByEmail(email)
        
        if(user != undefined){

           try{
                var token = uuid.v4()
                await knex.insert({
                    id_user: user.id,
                    token: token,
                    used: 0
                }).table("passwordtokens")
                return {status: true, token: token}
            }catch(err){
                console.log(err)
                return {status: false, err: err}
            }
        }else{
            return {status: false, err: "usuario não cadastrado!"}
        }
    }

    async  validade(token){
        try {
            var result = await knex.select().where({token:token}).table("passwordtokens")

            if(result.length > 0){

                var tk = result[0]

                if(tk.used){
                    return {status: false}
                }else{
                    return {status: true, token: tk}
                }
            }else{
                
                return {status: false};
            }
        } catch (err) {
            console.log(err)
            return {status: false}
        }
    }

    async setUsed(token){
        await knex.update({used: 1}).where({token: token}).table("passwordtokens")
    }

}

module.exports = new PasswordTokens()