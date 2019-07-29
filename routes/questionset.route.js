const authMiddleware = require('./../middlewares/auth.middleware');
const questionset_controller = require('../controllers/questionset.controller');

module.exports = function(app) {
    app.route('/host/questionset')
        .get(authMiddleware.isSignIn, questionset_controller.showQuestionsetList);

    app.route('/host/questionset/add')
        .get(authMiddleware.isSignIn, questionset_controller.addquestionset)
        .post(authMiddleware.isSignIn, questionset_controller.savequestionset);

    app.route('/host/questionset/:qs_id/edit')
        .get(authMiddleware.isSignIn, questionset_controller.findquestionset)
        .post(authMiddleware.isSignIn, questionset_controller.editquestionset);
}