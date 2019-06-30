const ValidaForm = require('../../utils/ValidationsForm')


module.exports = async (req, res, next) => {
  
  const {nome,email,password,telefones} = req.body

  if( !nome || !email || !password || !telefones)
    return res.status(406)
    .send({
      error : 'Campo nome, email, password e telefones são obrigatórios!'
    })

  let error = {}
    
  if( !ValidaForm.validaString(nome.trim()) ){
    error.nome = 'Campo nome inválido!'
  }

  if( !ValidaForm.validaEmail(email.trim()) ){
    error.email = 'Campo email inválido!'
  }

  const telValidate = telefones.filter(tel =>{
    if(!ValidaForm.validaTel(tel.ddd+tel.numero)){
      return tel
    }
  }).map(tel => ({
    ddd : tel.ddd, 
    numero : `Campo telefone inválido ${tel.numero}`
  }))

  if(telValidate.length){
    error.telefones = telValidate
  }

  if(Object.keys(error).length > 0){
    return res.status(406)
    .send(error)
  }

  return next()

}