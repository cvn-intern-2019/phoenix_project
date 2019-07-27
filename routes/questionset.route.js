const authMiddleware = require('./../middlewares/auth.middleware');
const questionset_controller = require('../controllers/questionset.controller');

module.exports = function (app) {
    app.route('/host/questionset')
        .get(questionset_controller.showQuestionsetList);

    app.route('/host/questionset/add')
        .get(questionset_controller.addquestionset)
        .post(questionset_controller.savequestionset);

    app.route('/host/questionset/:qs_id/edit')
        .get(questionset_controller.findquestionset)
        .post(questionset_controller.editquestionset);
}