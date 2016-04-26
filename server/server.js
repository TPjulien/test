var mysql       = require('mysql');
var fs          = require('fs');
var cors        = require('cors');
var express     = require('express');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');
var https       = require('https');
var http        = require('http');
// var privateKey  = fs.readFileSync('/etc/ssl/portail/server.key', 'utf8');
// var certificate = fs.readFileSync('/etc/ssl/portail/portail_travelplanet_fr.crt', 'utf8');
var credentials = {
    key:  fs.readFileSync('key/server.key'),
    cert: fs.readFileSync('key/server.crt'),
    ca:   fs.readFileSync('key/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
};
var app         = express();

var connection = mysql.createConnection({
    host:     '192.168.1.119',
    user:     'mahefa',
    password: '7umAban73EAZjKXt',
    database: 'portail_tableau',
    port:     '3333',
    debug:    true
});

connection.connect(function(err) {
    if (err)
        console.log(err);
    else
        console.log("connection etablished !");
});

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.json());

var port   = process.env.PORT || 3000;
var router = express.Router();


// debut des routes  ----------------------------------------------------------------------------------
// on n'a pas besoin de proteger la route d'authentification
require('./app/routes/loginRoute')(router, connection);

// on verifie le token auth pour les autres routes
router.use(function(req, res, next) {
    // check header url if token exist
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
    var removed_bearer = token.replace("Bearer ", '')
    // decoding the token
    if (token) {
        jwt.verify(removed_bearer, 'travelSecret', function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if no token has been send, show an error
        return res.status(403).send({
            success: false,
            message: "wrong realm :'("
        });
    }
});

// require des routes nécesittant un token valide
require('./app/routes/testRoute')(router, connection);
require('./app/routes/tokenTableauRoute')(router, connection);
require('./app/routes/templateRoute')(router, connection);
require('./app/routes/dimensionRoute')(router, connection);
require('./app/routes/pdfRoute')(router, connection);
require('./app/routes/rules')(router, connection);
require('./app/routes/ipRoute')(router, connection);

app.use('/api', router);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000);
httpsServer.listen(3100);
// var httpsServer = https.createServer(credentials, app);
// starting API
// httpsServer.lisen(port);
// app.listen(port);

console.log('done !' + port);
