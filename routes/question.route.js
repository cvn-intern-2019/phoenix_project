const authMiddleware = require('../middlewares/auth.middleware');
const question_controller = require('../controllers/question.controller');

module.exports = function(app) {
    app.route('/host/questionset/:id/question')
        .get(question_controller.showQuestionList);

    app.route('/host/questionset/:qs_id/question/:q_id/delete')
        .get(question_controller.deleteQuestion);
};