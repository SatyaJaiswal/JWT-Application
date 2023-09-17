var express = require('express');
var jwt = require('jsonwebtoken');

const app = express();

app.use(express.json()); // Add this line to parse JSON requests

app.post('/api/login', function (req, res) {
    // auth user
    const user = { id: 3 };
    const token = jwt.sign({ user }, 'my_secret'); // Use the same secret key here

    res.json({
        token: token
    });
});

app.get('/api/protected', ensureToken, function (req, res) {
    jwt.verify(req.token, 'my_secret', function (err, data) { // Use the same secret key here
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                text: 'This is protected',
                data: data
            });
        }
    });
});

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.get('/api', function (req, res) {
    res.json({
        text: 'My API!'
    });
});

app.listen(3000, function () {
    console.log('App listening on port 3000');
});
