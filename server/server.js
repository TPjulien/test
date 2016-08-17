var mysql       = require('mysql');
var fs          = require('fs');
var cors        = require('cors');
var express     = require('express');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');
var https       = require('https');
var http        = require('http');

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

// var credentials = {
//     key:  fs.readFileSync('/etc/ssl/tp_control/ia.key'),
//     cert: fs.readFileSync('/etc/ssl/tp_control/tp-control_travelplanet_fr.crt'),
//     ca:   fs.readFileSync('/etc/ssl/tp_control/DigiCertCA.crt'),
//     requestCert:        true,
//     rejectUnauthorized: false
// };

connection.connect(function(err) {
    if (err)
        console.log(err);
    else
        console.log("connection etablished !");
});

// cors perso
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", '86400');
    next();
});

// ajouter une whitelist pour Cors
// var whitelist = ['http://localhost', 'https://tp-control.travelplanet.fr/**'];
// var corsOptions = {
//   origin: function(origin, callback) {
//       console.log(origin);
//       var originIsWhiteListed = whitelist.indexOf(origin) !== -1;
//       callback(null, originIsWhiteListed);
//   }
// }

// app.use(cors({credentials: true}));
// app.use(cors(corsOptions));

// app.options('*', cors());
// options pour accepter tout !
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
require('./app/routes/templateRoute')     (router, connection);
require('./app/routes/datatable')         (router, connection);
require('./app/routes/rules')             (router, connection);
require('./app/routes/ipRoute')           (router, connection);
require('./app/routes/profilRoute')       (router, connection);

app.use('/api', router);

var httpServer  = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

httpServer.listen(3001);
// httpsServer.listen(3254);
