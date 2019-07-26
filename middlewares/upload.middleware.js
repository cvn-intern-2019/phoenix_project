const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

var upload = multer({ storage });

module.exports = function (app) {
  app.post('/upload',upload.array('questionset_img'), (req, res, next) => {
    //   if (err) {
    //     return res.json({
    //       error: err.message
    //     });
    //   }
    //   res.json({});
    res.send(req.file);
  });
}