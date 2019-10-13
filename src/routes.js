const UserController = require('./app/controllers/UserController');

module.exports = app => {

    /* ROTAS DE USUÁRIOS */

    app.route('/users')
       .get(UserController.index)
       .post(UserController.store);
    
    app.route('/users/:data')
       .get(UserController.show)
       .put(UserController.update)
       .delete(UserController.delete);
    
}