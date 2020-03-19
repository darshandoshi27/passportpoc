const swaggerUi = require('swagger-ui-express');
var express = require('express');
const swaggerDocument = require('../swagger.json');
var app = express.Router();
var db = require('../server-controllers/apifunctions');
var cors = require('cors')

var options = {
  docExpansion: 'list',
}

var swaggerUiOpts2 = {
  explorer: false,
  swaggerOptions: options,
  // .topbar { background-color: red }
  customCss: ' .swagger-ui .copy-paste {display:none}',
  swaggerUrl: '/swagger.json',
  // customJs: '/my-custom.js',
  operationsSorter: 'alpha',
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css'
  //customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-monokai.css'
}

// app.use('/api-docs', swaggerUi.serve)
// app.get('/api-docs', swaggerUi.setup(swaggerDocument, false, options, '.swagger-ui .topbar { background-color: red }'));

app.use('/api-docs-from-url', swaggerUi.serve)
// app.get('/api-docs-from-url', swaggerUi.setup(swaggerDocument, false, swaggerUiOpts2, '.swagger-ui .topbar { background-color: red }', null, '/swagger.json'));
app.get('/api-docs-from-url', swaggerUi.setup(swaggerDocument, swaggerUiOpts2));
app.get('/getEmployees', cors(), (req, res, next) => {
  db.getAll(req, res, next);
});
app.get('/getEmployee/:id', cors(), (req, res, next) => {
  db.getSingleEmployee(req, res, next);
});
app.post('/addEmployee', cors(), (req, res, next) => {
    console.log('asdasdasd', req.body);
    console.log('------- api 1-----')

    db.addEmployee(req, res, next);
    console.log('------- api 2-----')
});
app.delete('/deleteEmployee/:id', cors(), (req, res, next) => {
    console.log('qqq', req.params);
    db.deleteEmployee(req, res, next);
});
app.put('/updateEmployee/:id/:newName', cors(), (req, res, next) => {
    console.log('sss', req.params);
    db.updateEmployee(req, res, next);
});


app.use(function (req, res) {
  res.status(404).send('Page not found');
});
module.exports = app;  