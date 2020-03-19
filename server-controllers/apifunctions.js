const pgp = require('pg-promise')()

const conString = "postgres://postgres:1234@localhost:5433/postgres";
const db = pgp(conString);

function getAll(req, res, next) {
    db.any('SELECT name, id FROM employee;',
        {
            active: true,
        })
        .then((data) => {
            res.send(data);
            return res.status(200)
                .json({
                    status: 'success',
                    data,
                    message: 'Retrieved ALL CM Data',
                });
        })
        .catch((err) => {
            return next(err);
        });
};
function getSingleEmployee(req, res, next) {
    db.any(`SELECT name, id FROM employee WHERE isDeleted=false AND id= ${req.params.id};`,
        {
            active: true,
        })
        .then((data) => {
            res.send(data);
            return res.status(200)
                .json({
                    status: 'success',
                    data,
                    message: 'Retrieved ALL CM Data',
                });
        })
        .catch((err) => {
            return next(err);
        });
};
// DELETE FROM table
// WHERE table.id = (SELECT id FROM another_table);
// DELETE FROM employee
// WHERE employee.ID = req.body;
function deleteEmployee(req, res, next) {
    console.log('qqq', req.params);
    db.any(`UPDATE employee SET isDeleted=true WHERE id= ${req.params.id};`,
        {
            active: true,
        })
        .then((data) => {
            return res.status(200)
                .json({
                    status: 'success',
                    message: 'Data deleted success',
                });
        })
        .catch((err) => {
            return next(err);
        });
}
function updateEmployee(req, res, next) {
    console.log('qqq', req.params);
    let q;

    q = `UPDATE employee SET name='${req.params.newName}' WHERE id= ${req.params.id};`

    console.log('qweqwesda', q)
    db.any(q,
        {
            active: true,
        })
        .then((data) => {
            return res.status(200)
                .json({
                    status: 'success',
                    message: 'Data updated success',
                });
        })
        .catch((err) => {
            return next(err);
        });
}

function addEmployee(req, res, next) {
    console.log('qweqweqweqwe', req);
    console.log('test')
    const q = `INSERT INTO employee (name) VALUES (' ${req.body.name} ')`
    console.log('qweqwesda', q)
    db.any(q,
        {
            active: true,
        })
        .then((data) => {
            return res.status(200)
                .json({
                    status: 'success',
                    message: 'Data Saved success',
                });
        })
        .catch((err) => {
            console.log('eerr', err);
            return next(err);
        });
}


module.exports = {
    getAll,
    deleteEmployee,
    addEmployee,
    updateEmployee,
    getSingleEmployee
}