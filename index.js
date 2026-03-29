const express = require('express');
const session = require('express-session');
const app = express();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'fake',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(express.static('./views'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use('/', require('./routes/index'))

app.listen(3000, () => {
    console.log('Server is running...')
});