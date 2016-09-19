var mysql       = require('mysql');
var fs          = require('fs');
var cors        = require('cors');
var express     = require('express');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');
var https       = require('https');
var http        = require('http');
var passport    = require('passport');


var app = express();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var connection = mysql.createConnection({
    host:     '192.168.1.119',
    user:     'mahefa',
    password: '7umAban73EAZjKXt',
    database: 'portail_tableau',
    port:     '3333',
    debug:    true
});

var credentials = {
     key:  fs.readFileSync('/etc/ssl/tp_control/ia.key'),
     cert: fs.readFileSync('/etc/ssl/tp_control/tp-control_travelplanet_fr.crt'),
     ca:   fs.readFileSync('/etc/ssl/tp_control/DigiCertCA.crt'),
     requestCert:        true,
     rejectUnauthorized: false
};

connection.connect(function(err) {
    if (err)
        console.log(err);
    else
        console.log("connection etablished !");
});

// app.use(cors({credentials: true}));
app.use(cors());

// options pour accepter tout !
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.json());

var port   = process.env.PORT || 3000;
var router = express.Router();

app.use(passport.initialize());
app.use(passport.session());

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
require('./app/routes/templateRoute')     (router, connection);
require('./app/routes/datatable')         (router, connection);
require('./app/routes/rules')             (router, connection);
require('./app/routes/ipRoute')           (router, connection);
require('./app/routes/profilRoute')       (router, connection);
require('./app/routes/tableauRoute')      (router, connection);
require('./app/routes/email')             (router, connection);

app.use('/api', router);

// ajouter exceptionnelement le preflight
app.options('/loginProfils', cors());

var httpServer  = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3001);
httpsServer.listen(3254);
