const authMiddleware = require('../middlewares/auth.middleware');
const question_controller = require('../controllers/question.controller');

module.exports = function (app) {
    app.route('/host/questionset/:id/question')
        .get(authMiddleware.isSignIn, question_controller.showQuestionList);

    app.route('/host/questionset/:qs_id/question/add')
        .get(question_controller.addQuestion)
        .post(question_controller.saveQuestion);

    app.route('/host/questionset/:qs_id/question/:q_id/delete')
        .get(authMiddleware.isSignIn, question_controller.deleteQuestion);

    app.route('/host/questionset/:qs_id/question/:q_id/edit')
        .get(authMiddleware.isSignIn, question_controller.findQuestion)
        .post(question_controller.editQuestion);
};