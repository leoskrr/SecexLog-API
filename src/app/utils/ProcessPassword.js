const bcrypt = require("bcrypt");

const salt = bcrypt.genSaltSync(10);
/* Função usada para criptografar a senha, 
retorna o hash da senha digitada pelo usuário */
function cryptPsw(password) {
  return bcrypt.hashSync(password, salt);
}
/*Função usada para comparar senhas
  Recebe a senha digitada e a que está no database
*/
function comparePsw(typedpass, password) {
<<<<<<< HEAD
  // return typedpass === password;
=======

  return bcrypt.compareSync(typedpass, password)
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a

  return bcrypt.compareSync(typedpass, password);
}
/*Gera uma senha aleatória para a recuperação de senha do usuário */
function generatePassword() {
  //O slice fará pegar somente os últimos 10 caracteres do resultado em base36
  return Math.random()
    .toString(36)
    .slice(-10);
}
<<<<<<< HEAD
module.exports = { cryptPsw, comparePsw, generatePassword };
=======
module.exports = { cryptPsw, comparePsw, generatePassword }
>>>>>>> f80e84a78afa13a4d357a5a3325099e0cf08e70a
