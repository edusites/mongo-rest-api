const jwt = require('jsonwebtoken')

const signIn = (data) => {
  /**
   * Chamamos o método sign já que o mesmo é responsável por
   * devolver o json web token.
    */

  return jwt.sign(data, process.env.PRIVATE_KEY_JWT, { expiresIn: '1h' })
}

module.exports = {
  signIn
}