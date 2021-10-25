var knex = require("../database/connection")
var User = require("./User")
var uuid = require("uuid")

class PasswordTokens{

    async new(email){
        var user = await User.findByEmail(email)
        
        if(user != undefined){

           try{
                var token = uuid.v4()
                await knex.insert({
                    user_id: user.id,
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

}

module.exports = new PasswordTokens()