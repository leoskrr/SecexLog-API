/* CONTROLLERS */
const LoginController = require('./app/controllers/auth/LoginController');
const ForgotPassword = require('./app/controllers/auth/ForgotPassword');
const UserController = require('./app/controllers/UserController');
const OpinionController = require('./app/controllers/OpinionController');

/* MIDDLEWARES */
const UserAuthentication = require('./app/middlewares/UserAuthentication');
const authAdmin = require('./app/middlewares/AdminAuthentication');

const AuthUser = UserAuthentication();

module.exports = app => {
   /* ROTAS DE AUTENTICAÇÃO DE USUÁRIO */

   app.post('/login', LoginController.signIn);
   app.post('/validateToken', LoginController.validateToken);
   app.post('/forgot_password', ForgotPassword.recoverPass);
   
   /* ROTAS DE USUÁRIOS */

   app.route('/users')
      .all(AuthUser.authenticate())
      .get(authAdmin(UserController.index))
      .post(authAdmin(UserController.store));

   app.route('/users/:data')
      .all(AuthUser.authenticate())
      .get(authAdmin(UserController.show))
      .put(authAdmin(UserController.update))
      .delete(authAdmin(UserController.delete));

   /* ROTAS DE OPINIÕES */

   app.route('/opinions')
      .get(OpinionController.index)
      .post(OpinionController.store)

   app.route('/opinions/:id')
      .get(OpinionController.show)
      .put(OpinionController.update)
      .delete(OpinionController.delete)

}