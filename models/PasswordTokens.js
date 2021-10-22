var knex = require("../database/connection")

class PasswordTokens{

    async new(token, id){
        try {
            await knex.insert({token, id, used: 0}).table("passwordtokens")   
        } catch (error) {
            console.log(error)
        }        
    }

    async findByToken(token){
        try {
            var result = await knex.select("*").from("passwordtokens").where({token: token})
            if(result.length > 0){
                return result[0]
            }
        } catch (err) {
            console.log(err)
        }
    }

    async update(token){
        try{
            var result = this.findByToken(token)
            if(result){
                await knex.update({used: 1}).where({token: result.token}).table("")
            }
        }catch(err){
            console.log(err)
        }
    }

}

module.exports = new PasswordTokens()