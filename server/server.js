var mysql       = require('mysql');
var fs          = require('fs');
var cors        = require('cors');
var express     = require('express');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');
var https       = require('https');
var http        = require('http');
var passport    = require('passport');
require('dotenv').config({path: '/home/defaultuser/.env' });

var app = express();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

function handleDisconnect() {}
    var connection = mysql.createConnection({
        host:     process.env.DB_HOST,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port:     process.env.DB_PORT,
        debug:    true
    });

    connection.connect(function(err) {
        if (err)
            setTimeout(handleDisconnect, 2000);
        else
            console.log("connection etablished !");
    });

    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
            handleDisconnect();
        else
            throw err;
    });
}

handleDisconnect();

var credentials = {
     key:                fs.readFileSync(process.env.SERV_API_KEY),
     cert:               fs.readFileSync(process.env.SERV_API_CERT),
     ca:                 fs.readFileSync(process.env.SERV_API_KEY_CHAIN),
     requestCert:        true,
     rejectUnauthorized: false
};

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
require('./app/routes/twilioRoute')(router, connection);

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
