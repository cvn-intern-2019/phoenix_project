var db = require('../utils/db');

module.exports = {
    exec: query => {
        return db.query(query);
    },
    validEmail: (email, user_id) => {
        let check_valid_email = `SELECT * FROM users where user_email = '${email}' and user_id != '${user_id}'`;
        return db.query(check_valid_email);
    },
    updateEmail: (email, user_id) => {
        let update_email = `UPDATE users SET user_email = '${email}' where user_id = '${user_id}'`;
        return db.query(update_email);
    },
    changePassword: (newPass, user_id) => {
        let update_email = `UPDATE users SET user_password = '${newPass}' where user_id = '${user_id}'`;
        return db.query(update_email);
    },
}