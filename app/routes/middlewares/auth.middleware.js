const jwt = require('jsonwebtoken')
const UserSchema = require('../../models/users')


module.exports = async (req, res, next) => {
  
  const { authorization } = req.headers
  let tokenHeader = undefined
  
  if(authorization)
    tokenHeader = authorization.split(' ')[1]
  
  if (!tokenHeader) {
    /**
     * 401 Unauthorized
     * Embora o padrão HTTP especifique "unauthorized", semanticamente,
     * essa resposta significa "unauthenticated". Ou seja,
     * o cliente deve se autenticar para obter a resposta solicitada.
     */
    return res.status(401)
      .json({
        error: 'Token não fornecido ou fornecido de forma inválida.'
      })
  }
  // Caso o token tenha expirado verify lança um objeto com os erros de expiração
  try{
    const decoded = jwt.verify(tokenHeader, process.env.PRIVATE_KEY_JWT)
    const userDocument = await UserSchema.findOne({ _id: decoded.id })
    
    if (!userDocument.checkToken(tokenHeader)) {
      return res.status(403)
        .json({
          error: 'Usuário não autorizado'
        })
    }

    req.authorization = userDocument

    return next()
  // Caso o token for inválido ou tiver sido expirado sempre cai no catch
  }catch(err){
    /**
    * 403 Forbidden
    * O cliente não tem direitos de acesso ao conteúdo portanto
    * o servidor está rejeitando dar a resposta. Diferente do código 401,
    * aqui a identidade do cliente é conhecida.
    */
    return res.status(403)
      .json({
        error : {
          message : 'Token expirado ou inválido',
          expirado_em : err.expiredAt
        }
      })
  }
  
}