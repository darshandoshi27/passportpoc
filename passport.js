var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

const { ensureLoggedIn } = require('connect-ensure-login')
const pgoptions = {
    connect(client, dc, isFresh) {
        if (isFresh) {
            client.on('notice', (msg) => {
                console.log('notice: ', msg);
            });
        }
    },
    query(e) {
        console.log(e.query);
    },
};
const pgp = require('pg-promise')(pgoptions);

const conString = `postgres://postgres:1234@localhost:5433/postgres`;
const db = pgp(conString);

const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        db.any(`select * from users where username=$1 and password=$2`, [username, password])
            .then(user => {
                if (user.length == 0) {
                    resolve({ user: false, error: null })
                } else {
                    resolve({ user, error: null })
                }
            })
            .catch(error => {
                reject({ user: null, error })
            })
    })
}

const middleWare = async (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
    app.use(bodyParser.urlencoded({ extended: true }));
    // Passport calls serializeUser and deserializeUser to
    // manage users
    passport.serializeUser(function (user, done) {
        // Use the OID property of the user as a key
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
    passport.use(new LocalStrategy((username, password, cb) => {
        console.log('Passport middle ware called', username, password)
        getUser(username, password).then(({ user }) => {
            cb(null, user)
        }).catch(error => {
            cb(error)
        })
    }));


    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login',
        passport.authenticate('local', { successReturnToOrRedirect: '/' }),
        function (req, res) {
            console.log('ROUTE AFTER AUTHENTICATION........')
            res.redirect('/');
        });

    app.use(ensureLoggedIn('/login'))

}

module.exports = {
    middleWare,
}