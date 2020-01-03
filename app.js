//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const md5 = require("md5");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/usuarioDB', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

const usuarioEsquema = new mongoose.Schema({
  email: String,
  senha: String
});



const Usuario = new mongoose.model("Usuario",usuarioEsquema);

app.get("/",function(req, res){
  res.render("home");
});

app.get("/login",function(req, res){
  res.render("login");
});

app.get("/register",function(req, res){
  res.render("register");
});

app.post("/register",function(req, res){
  const novoUsuario = new Usuario({
    email: req.body.username,
    senha: md5(req.body.password)
  });
  novoUsuario.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login",function(req, res){
  const usuario = req.body.username;
  const senha = md5(req.body.password);

  Usuario.findOne({email: usuario},function(err, usuarioEncontrado){
    if (err) {
      console.log(err);
    } else {
      if (usuarioEncontrado) {
        if(usuarioEncontrado.senha === senha){
          res.render("secrets");
        }else{
          res.send("Senha incorreta");
        }
      }else{
        res.send("Usuário não encontrado");
      }
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
