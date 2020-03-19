var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session.passport.user)
  res.render('error', { title: 'Express' });
});
router.get('/welcome', function(req, res, next) {
  console.log('welcome route called....................');
  console.log(req.session.passport.user)
  res.render('welcome', { data : req.session.passport.user  });
});
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/welcome');
});

module.exports = router;
