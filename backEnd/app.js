// IMPORTAR MODULO EXPRESS
const express = require('express');

// IMPORTA MODULO EXPRESS HANDLEBARS
const {engine} = require('express-handlebars')

const mysql = require('mysql2');






  const app = express();

  



  // ADICIONANDO O BOOTSTRAP
  app.use('/bootstrap',express.static('./node_modules/bootstrap/dist'))

    // ADICIONANDO O CSS
    app.use('/css', express.static('./css'));

// CONFIGURAÇÃO DO EXPRESS HANDLEBARS
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


  // CONFIGURAR CONEXÃO MYSQL COM O SERVIDOR
  const conexão = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'carlos72924396',
    database:'login'
  });
  
    //TESTE DE CONEXÃO
conexão.connect(function(erro){
if(erro) throw erro;
console.log('conexão efetuada com sucessos!')
    })

// ROTA PRINCIPAL
  app.get('/', function(req,res){
res.render('formulario');
 
});

app.post('/cadastrar', function(req,res){
  console.log(req.body);
  console.log('erro')
  res.end()
})
app.listen(8080);

