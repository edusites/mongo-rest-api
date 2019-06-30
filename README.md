# API de teste para salvar dados, logar e buscar informações de usuários

Iniciando a API em ambiente de teste, executará nodemon app em background
npm run dev

# Endpoint tipo POST para cadastrar usuário
https://mongo-rest-api.herokuapp.com/users/sign_up

# Endpoint tipo POST para logar um usuário
https://mongo-rest-api.herokuapp.com/users/sign_in

# Endpoint tipo GET para buscar um usuário
Este é um endpoint restrito que se deve usar o token fornecido no ato do cadastramento para buscar um usuário especifico, futuramente além do token o app vai verificar se o cliente tem permissões suficiente para esta operação.

https://mongo-rest-api.herokuapp.com/buscar_usuario/<id>

Necessário informar o token no Header da requisição client, exemplo:
Authorization Basic token

# Exemplo de um formato e propriedades esperada pelo Endpoint sign_up
```
{
	"telefones" : [
		{
			"numero" : "7485-7845",
			"ddd" : "11"
		},
		{
			"numero" : "94178-7245",
			"ddd" : "11"
		}
	],
	"nome" : "Maria Silva",
	"email" : "maria@bol.com.br",
	"password" : "teste123"
}
```

# Exemplo de um formato e propriedades esperada pelo Endpoint sign_in
```
{
  "email" : "maria@bol.com.br",
	"password" : "teste123"
}
```