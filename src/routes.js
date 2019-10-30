/* CONTROLLERS */
const LoginController = require('./app/controllers/auth/LoginController');
const ForgotPassword = require('./app/controllers/auth/ForgotPassword');
const UserController = require('./app/controllers/UserController');
const OpinionController = require('./app/controllers/OpinionController');
const CityController = require('./app/controllers/CityController');
const PathController = require('./app/controllers/PathController');
const ProviderController = require('./app/controllers/ProviderController');

/* MIDDLEWARES */
const UserAuthentication = require('./app/middlewares/UserAuthentication');
// const CityAuthentication = require('./app/middlewares/CityAuthentication');
// const PathAuthentication = require('./app/middlewares/PathAuthentication');
const authAdmin = require('./app/middlewares/AdminAuthentication');


// const AuthPath = PathAuthentication();
const AuthUser = UserAuthentication();
// const AuthCity = CityAuthentication();

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

   /* ROTAS DE CIDADE */

   // app.route('/cities')
   //    .all(AuthUser.authenticate())
   //    .get(authAdmin(CityController.index))
   //    .post(authAdmin(CityController.store));

   // app.route('/cities/:data')
   //    .all(AuthUser.authenticate())
   //    .get(CityController.show)
   //    .post(authAdmin(CityController.update))
   //    .delete(authAdmin(CityController.delete));

   app.route('/cities')
      // .all(AuthUser.authenticate())
      .get(CityController.index)
      .post(CityController.store);

   app.route('/cities/:data')
      // .all(AuthUser.authenticate())
      .get(CityController.show)
      .put(CityController.update)
      .delete(CityController.delete);

   /* ROTA DE PROVEDORES */

   app.route('/providers')
      .all(AuthUser.authenticate())
      .get(ProviderController.storeOrShow)
      .post(ProviderController.storeOrShow)

   /* ROTAS DE TRAJETO*/

   // app.route('/paths')
   //    .all(AuthUser.authenticate())
   //    .get(PathController.index)
   //    .post(authAdmin(CityController.store));
      
   // app.route('/paths/:data')
   //    .all(AuthUser.authenticate())
   //    .get(PathController.show)
   //    .post(authAdmin(PathController.update))
   //    .delete(authAdmin(PathController.delete));

   app.route('/paths')
      //.all(AuthUser.authenticate())
      .get(PathController.index)
      .post(PathController.store);
      
   app.route('/paths/:data')
      //.all(AuthUser.authenticate())
      .get(PathController.show)
      .post(PathController.update)
      .delete(PathController.delete);

   /* ROTAS DE OPINIÕES */

   app.route('/opinions')
      .get(OpinionController.index)
      .post(OpinionController.store)

   app.route('/opinions/:id')
      .get(OpinionController.show)
      .put(OpinionController.update)
      .delete(OpinionController.delete)

}