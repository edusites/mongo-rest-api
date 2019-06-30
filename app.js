const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Decide qual arquivo dotenv deve ser carregado de acordo com o ambiente
require('dotenv').config({
  path : '.env'
})

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  reconnectInterval: 500
});

mongoose.set('useCreateIndex',true)

mongoose.connection.on('error',(err) => {
  console.log('Error:', `Erro na conexão com mongodb ${err}`)
})

mongoose.connection.on('disconnected',(err) => {
  console.log('Desconectado:', `Aplicação desconectado ao mongodb ${err}`)
})

mongoose.connection.on('connected',() => {
  console.log('Conexão ON:', `Aplicação conectado ao mongodb`)
})

//Suporte ao Body Parser
/**
 * O body-parser é um módulo capaz de converter o body da requisição 
 * para vários formatos. Um desses formatos é json.
 */
app.use(bodyParser.urlencoded({
  extended : false
}))
app.use(bodyParser.json())

// Importando arquivo de rotas para requisições feitas em /users
const routesUsers = require('./app/routes/users')

app.use('/users',routesUsers)
app.all('*', (req, res) => res.status(404).json({erro: 'A rota solicitada não existe'}))

const port = process.env.PORT || 3333

app.listen(port, () =>{
  console.log(`Servidor executando em modo ${process.env.NODE_ENV} na porta ${port}`)
})


module.exports = app