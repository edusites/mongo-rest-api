const express = require('express')
const router = express.Router()
const User = require('../models/users')
const auth = require('../services/auth')
const authMiddleware = require('./middlewares/auth.middleware')
const validatorUser = require('./middlewares/validatorUser.middleware') 


const returnUserInfo = (userDocument, token) => {
  return {
    id: userDocument._id,
    data_criacao: userDocument.createdAt,
    data_atualizacao: userDocument.updatedAt,
    ultimo_login: userDocument.ultimoLogin || userDocument.createdAt,
    token
  }
}

router.post('/sign_in', async (req, res) => {

  const {email,password} = req.body
  /**
   * 406 Not Acceptable 
   * Essa resposta é enviada quando o servidor da Web após 
   * realizar a negociação de conteúdo orientada pelo servidor, 
   * não encontra nenhum conteúdo seguindo os critérios 
   * fornecidos pelo agente do usuário.
   */
  if(!email || !password)
    return res.status(406)
    .send({
      error : 'Campo email e password são obrigatório!'
    })
  /**
   * Exclui o password porque era apenas para teste
   * agora que a senha está sendo salva criptografada
   * busco primeiro o usuário por email e em caso de 
   * sucesso comparo a senha enviada com a mesma criptografia 
   * usada para salvar na collection.
   */ 
  try{
    /**
     * chamo select() para que seja listado o campo password por
     * que na modelagem do model user coloquei a propriedade select
     * false, para não listar a senha do usuário nos selects.
     */ 
    const userDocument = await User.findOne({email}).select('+password') 
    let samePassword = false
    
    if(userDocument){
      samePassword = await userDocument.comparePassword(password,userDocument.password)
    }
     
    if (!userDocument || !samePassword) {
      return res
        .status(401)
        .send({ error: 'Usuário e/ou senha inválidos' })
    }
    /**
     * Cria um token com base em um identificador único do usuário
     * não se deve passar dados sigilosos como a senha do usuário
     * para não por em risco a segurança do sistema pois esse token
     * é codificado apenas em base 64 e é facil descriptografar usando
     * por exemplo o site https://jwt.io/
     */
    const token = auth.signIn({ id: userDocument._id })
    const userDocumentWithLastLogin = await userDocument.saveTokenAndLastLogin(token)
    
    return res.status(200)
      .send({
        message: 'Usuário logado',
        ...returnUserInfo(userDocumentWithLastLogin, token)
      })

    //console.log('samePassword', samePassword)
    
  }catch(error){
    /**
     * 500 Internal Server Error
     * O servidor encontrou uma situação com a qual não sabe lidar.
    */
    return res.status(500)
      .send({
        error : `Houve um erro, ${error}`
      })
  }
  
})

router.post('/sign_up', validatorUser, async (req, res) => {
  
  const {nome,email,password,telefones} = req.body
  
  try {

    const userDocument = await User.findOne({email})

    if(userDocument)
      return res.status(406)
      .send({
        error : `Este usuário já está cadastrado!`
      })

    const userCreated = await User.create({
      nome,
      email,
      password,
      telefones
    })
     /**
      * Obtemos o token
    */
    const token = auth.signIn({ id: userCreated._id })

    /**
     * Atualizamos o token no documento do usuário (no banco)
    */
    const userDocumentWithToken = await userCreated.saveToken(token)
    /**
     * 201 Created 
     * A requisição foi bem sucessida e um novo recurso foi criado 
     * como resultado. Esta é uma tipica resposta enviada após 
     * uma requisição POST.
     */
    if(userCreated)
      res.status(201)
      .send({
        message: 'Usuário cadastrado com sucesso!',
        ...returnUserInfo(userDocumentWithToken, token)
      })
  
  }catch(error) {
    return res.status(500)
      .send({
        error : `Houve um erro ${error}`
      })
  }

})

router.get('/buscar_usuario/:id', authMiddleware, async (req, res) => {
  
  const _id = req.params.id
  // Dados persistidos pelo middleware authMiddleware
  //console.log('Authorization => ', req.authorization)
  if(!_id)
    return res.status(406)
    .send({
      error : 'Campo id deve ser informado!'
    })
  
  const userDocument = await User.findOne({ _id })

  if (!userDocument) {
    return res
      .status(401)
      .send({
        error: 'Usuário não existe'
      })
  }
  
  return res.status(200)
    .json({
      success: true,
      values: userDocument
    })

})

module.exports = router