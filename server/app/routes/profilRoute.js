var mysql     = require('mysql');
var http      = require('http');
var request   = require('request');

module.exports = function(router, connection) {
    router.route('/profils/:site_id/:uid')
        .get(function(req, res) {
            var query_one    = "SELECT \
                               * \
                               FROM ?? \
                               WHERE ?? = ? \
                               AND ?? = ? LIMIT 1 ";
            var table_one    = [
                                "profils.view_profil_lvl1",
                                "SITE_ID", req.params.site_id,
                                "uid", req.params.uid];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister les numéros de téléphone du profil
    router.route('/profilPhone/:uid')
        .get(function(req, res) {
            var query_one = "SELECT * FROM ?? WHERE ?? = ? \
                             AND ?? = (SELECT MAX (??) FROM ?? WHERE ?? = ? )";
            var table_one = ["profils.phone", "profils.phone.UID", req.params.uid,
                             "profils.phone.DEPOSITED_DATE","profils.phone.DEPOSITED_DATE","profils.phone","profils.phone.UID", req.params.uid];
            query_one     = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })


    // Nouvelle route du profil Email
    router.route('/profilEmail/:uid')
        .get(function(req, res){
          // var query_one = "SELECT * FROM ?? WHERE ?? = ? \
          //                           AND ?? = (SELECT MAX (??) FROM ?? WHERE ?? = ? )";
          // var table_one = ["profils.email", "profils.email.UID", req.params.uid,
          //                  "profils.email.DEPOSITED_DATE","profils.email.DEPOSITED_DATE","profils.email","profils.email.UID", req.params.uid];
          // query_one     = mysql.format(query_one, table_one);

          var query = "SELECT * FROM email WHERE UID='" + req.params.uid + "' AND DEPOSITED_DATE=(SELECT MAX(DEPOSITED_DATE) FROM email WHERE UID='" + req.params.uid + "')";
          var options = {
              url: 'http://api-interne-test.travelplanet.fr/api/ReadDatabase/selectMySQLPost',
              form : {
                sql      : query,
                database : 'profils',
                decrypt  : ''
              }
          }
          request.post(options, function(err, resultat, body) {
              res.json(body);
          })
        })

    // route pour lister les adresses mail du profil
    // router.route('/profilEmail/:uid')
    //     .get(function(req, res) {
    //         var query_one = "SELECT * FROM ?? WHERE ?? = ? \
    //                          AND ?? = (SELECT MAX (??) FROM ?? WHERE ?? = ? )";
    //         var table_one = ["profils.email", "profils.email.UID", req.params.uid,
    //                          "profils.email.DEPOSITED_DATE","profils.email.DEPOSITED_DATE","profils.email","profils.email.UID", req.params.uid];
    //         query_one     = mysql.format(query_one, table_one);
    //         connection.query(query_one, function(err, rows) {
    //             if (err)
    //                 res.status(400).send(err);
    //             else
    //                 res.json(rows);
    //         })
    //     })
    // route pour lister toutes les class voyageur pour le train
    router.route('/railClass')
        .get(function(req, res) {
            var query_one = "SELECT DISTINCT ?? FROM ?? WHERE ?? IS NOT NULL";
            var table_one = ["railClass", "profils.view_profil_lvl1","railClass"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister tout les emplacements siège pour le train
    router.route('/railWagonCode')
        .get(function(req, res) {
            var query_one = "SELECT DISTINCT ?? FROM ?? WHERE ?? IS NOT NULL";
            var table_one = ["RailWagonCode", "profils.view_profil_lvl1","RailWagonCode"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister toutes les preferences sens marche train
    router.route('/railSeatPosition')
        .get(function(req, res) {
            var query_one = "SELECT DISTINCT ?? FROM ?? WHERE ?? IS NOT NULL";
            var table_one = ["railSeatPosition", "profils.view_profil_lvl1","railSeatPosition"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister toutes les preferences sens marche train
    router.route('/railDepartureStation')
        .get(function(req, res) {
            var query_one = "SELECT DISTINCT ?? FROM ?? WHERE ?? IS NOT NULL ORDER BY ?? ASC";
            var table_one = ["RailDepartureStation", "profils.view_profil_lvl1","RailDepartureStation","RailDepartureStation"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister les compagnies férrovières
    router.route('/provider')
        .get(function(req, res) {
            var query_one = "SELECT DISTINCT ?? FROM ?? WHERE ?? IS NOT NULL ORDER BY ?? ASC";
            var table_one = ["PROVIDER", "profils.rail_cards","PROVIDER","PROVIDER"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister les carte voyageur en fonction des compagnies férrovières
    router.route('/card_name/:provider')
        .get(function(req, res) {
            var query_one    = "SELECT ?? \
                               FROM ?? \
                               WHERE ?? = ?";
            var table_one    = [
                                "CARD_NAME",
                                "profils.rail_cards",
                                "PROVIDER", req.params.provider];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister les cartes voyageur du voyageur
    router.route('/cardTraveller/:uid')
        .get(function(req, res) {
            var query_one    = "SELECT * \
                               FROM (( ?? \
                               LEFT JOIN  ?? ON ?? = ?? ) \
                               LEFT JOIN  ?? ON ?? = ??  \
                               AND ?? = ??) \
                               WHERE ?? = ??  \
                               AND ?? = ? \
                               AND ?? = ( \
                                 SELECT MAX(??) \
                                 FROM  ?? WHERE ?? = ? ) \
                              AND  ?? = ( \
                                SELECT MAX(??) \
                                FROM  ?? WHERE ?? = ? ) \ \
                              ORDER BY ?? ASC ";
            var table_one    = [
                                "profils.rail_discount",
                                "profils.rail_cards","profils.rail_discount.DiscountCode","profils.rail_cards.CODE",
                                "profils.rail_discount_itinerary","profils.rail_discount.SITE_ID","profils.rail_discount_itinerary.SITE_ID",
                                "profils.rail_discount.UID", "profils.rail_discount_itinerary.UID",
                                "profils.rail_discount.SequenceNumber","profils.rail_discount_itinerary.SequenceNumber",
                                "profils.rail_discount.UID", req.params.uid,
                                "profils.rail_discount.DEPOSITED_DATE",
                                "profils.rail_discount.DEPOSITED_DATE",
                                "profils.rail_discount","profils.rail_discount.UID", req.params.uid,
                                "profils.rail_discount_itinerary.DEPOSITED_DATE",
                                "profils.rail_discount_itinerary.DEPOSITED_DATE",
                                "profils.rail_discount_itinerary","profils.rail_discount_itinerary.UID", req.params.uid,
                                "profils.rail_discount.SequenceNumber"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister toutes les countries pour le phone
    router.route('/rail_loyaltyprogramCode')
        .get(function(req, res) {
            var query_one = "SELECT DISTINCT ?? FROM ??";
            var table_one = ["profils.rail_loyalty.ProgramCode", "profils.rail_loyalty"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister toutes les countries pour le phone
      router.route('/rail_loyalty/:uid')
        .get(function(req, res) {
            var query_one = "  SELECT * \
                               FROM ?? \
                               WHERE ?? = ?  \
                               AND ?? = ( \
                                 SELECT MAX(??) \
                                 FROM  ?? WHERE ?? = ? ) \
                               ORDER BY ?? ASC ";
            var table_one = ["profils.rail_loyalty",
                             "profils.rail_loyalty.UID",req.params.uid,
                             "profils.rail_loyalty.DEPOSITED_DATE",
                             "profils.rail_loyalty.DEPOSITED_DATE",
                             "profils.rail_loyalty","profils.rail_loyalty.UID",req.params.uid,
                             "profils.rail_loyalty.SequenceNumber"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour la carte de fidelite air france d'un voyageur
    router.route('/air_loyaltyAF/:uid')
        .get(function(req, res) {
            var query_one = "SELECT * FROM ?? \
                             WHERE ?? = ?  \
                             AND ?? = 'AF' \
                             AND ?? = ( \
                               SELECT MAX(??) \
                               FROM  ?? WHERE ?? = ? )  \
                               ORDER BY ?? ASC ";
            var table_one = ["profils.air_loyalty",
                             "profils.air_loyalty.UID",req.params.uid,
                             "profils.air_loyalty.ProgramCode",
                             "profils.air_loyalty.DEPOSITED_DATE",
                             "profils.air_loyalty.DEPOSITED_DATE",
                             "profils.air_loyalty","profils.air_loyalty.UID",req.params.uid,
                             "profils.air_loyalty.SequenceNumber"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour les cartes de fidelite aérienne d'un voyageur
    router.route('/air_loyalty/:uid')
        .get(function(req, res) {
            var query_one = "SELECT * FROM ?? \
                             WHERE ?? = ?  \
                             AND ?? != 'AF' \
                             AND ?? = ( \
                               SELECT MAX(??) \
                               FROM  ?? WHERE ?? = ? )  \
                               ORDER BY ?? ASC ";
            var table_one = ["profils.air_loyalty",
                             "profils.air_loyalty.UID",req.params.uid,
                             "profils.air_loyalty.ProgramCode",
                             "profils.air_loyalty.DEPOSITED_DATE",
                             "profils.air_loyalty.DEPOSITED_DATE",
                             "profils.air_loyalty","profils.air_loyalty.UID",req.params.uid,
                             "profils.air_loyalty.SequenceNumber"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister toutes les countries pour le phone
    router.route('/airSeatingPref')
        .get(function(req, res) {
            var query_one = "SELECT DISTINCT ?? FROM ?? \
                             WHERE ?? IS NOT NULL \
                             AND ?? !='' ";
            var table_one = ["profils.air_pref.AirSeatingPref", "profils.air_pref",
                             "profils.air_pref.AirSeatingPref",
                             "profils.air_pref.AirSeatingPref"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister toutes les countries pour le phone
    router.route('/getCountry')
        .get(function(req, res) {
            var query_one = "SELECT ?? FROM ??";
            var table_one = ["nicename", "country"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    router.route('/phoneCode/:country')
        .get(function(req, res) {
            var query_one = "SELECT ?? FROM ?? WHERE ?? = ?";
            var table_one = ["phonecode", "country", "nicename", req.params.country];
            query_one     = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister toutes les communautés par Site
    router.route('/community/:site_id')
        .get(function(req, res) {
            var query_one = "SELECT DISTINCT ?? FROM ?? WHERE ?? = ? ORDER BY ??";
            var table_one = ["profils.view_allowed_community.Community", "profils.view_allowed_community", "profils.view_allowed_community.SITE_ID", req.params.site_id,"profils.view_allowed_community.Community"];
            query_one     = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister tout les profils par communauté et site
    router.route('/usersCommunity/:site_id/:community')
        .get(function(req, res) {
            var query_one = "SELECT * FROM ??  \
                             LEFT JOIN ?? ON ?? = ?? \
                             AND ?? = ?? \
                             WHERE ?? = ?  \
                             AND ?? = ?  \
                             ORDER BY ?? ";
            var table_one = ["profils.view_allowed_community",
                             "profils.view_customer", "profils.view_allowed_community.SITE_ID","profils.view_customer.SITE_ID",
                             "profils.view_allowed_community.UID","profils.view_customer.UID",
                             "profils.view_allowed_community.SITE_ID", req.params.site_id,
                             "profils.view_allowed_community.Community", req.params.community,
                             "profils.view_allowed_community.Community"];
            query_one     = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
}
