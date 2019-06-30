mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')


const usersSchema = new Schema({
  nome : {
    type : 'string',
    required : true
  },
  email : {
    type : 'string',
    required : true,
    unique : true,
    lowercase : true
  },
  password : {
    type : 'string',
    required : true,
    select : false
  },
  // Um array de objetos ofMixed: [Schema.Types.Mixed]
  telefones :{
    type : [Schema.Types.Mixed]
  },
  ultimoLogin : {
    type : Date
  },
  token : {
    type : String
  },
  // Cria e atualiza automaticamente as propriedades createdAt e updatedAt na collection.
}, { timestamps: true })

usersSchema.pre('save', async function(next){
  
  let user = this
  if(!user.isModified('password'))
    return next()
  // Refatorando a função para await
  try{
    user.password = await bcrypt.hash(user.password,10)
    return next()
  }catch(error){
    console.log(`Erro no processo de encryptar a senha do usuário: ${error}`)
    return
  }
  
})
/**
 * methods é uma propriedade do objeto Schema do mongoose
 * todo o método declarado no escopo desse método pode ser
 * acessado na instância do objeto User.
 */
usersSchema.methods = {
  /**
   * Método responsável por comparar a senha do usuário
   * retorna true ou false
   */
  comparePassword : async (currentPassword, hashPassword) => {

    const match = await bcrypt.compare(currentPassword, hashPassword)
    
    return match
  },
  /**
   * Faz a comparação do token de posse do cliente com o token
   * salvo no Documento.
   */
  checkToken: function (token) {
    return this.token === token
  },
  /**
   * Método responsável por salvar o último login do usuário
   * seu retorno é o documento com todas as propriedades
   * inclusive a atualização do ultimoLogin.
   */
  saveLastLogin: async function () {
    this.ultimoLogin = new Date()
    const result = await this.save()
    
    return result
  },

  /**
   * Método responsável por salvar
   * o token gerado no documento do usuário
   * @param {*} token
   */
  saveToken: async function (token) {
    this.token = token
    const result = await this.save()

    return result
  },

  /**
   * Fizemos uma abstração
   * para quando precisarmos
   * atualizar os dois no mesmo código.
   *
   * @param {*} token
   */
  saveTokenAndLastLogin: async function (token) {
    await this.saveLastLogin()
    const result = await this.saveToken(token)
    
    return result
  }
  
}
  

module.exports = mongoose.model('User', usersSchema)