var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session.passport.user)
  res.render('error', { title: 'Express' });
});
router.get('/test', function(req, res, next) {
  console.log(req.session.passport.user)
  res.render('index', { title: 'Express' });
});

module.exports = router;
