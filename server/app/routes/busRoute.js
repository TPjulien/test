var request = require('request');
var queryBus = require('../functions/busQueryBuilder');

module.exports = function (router, connection, mysql) {
    // pour l'api de distribusion
    function get_id_stations(city, cb) {
        var query = "SELECT * FROM ?? WHERE ?? = ?";
        var table = ['distribusion.stations', 'city_name', city];
        query = mysql.format(query, table);
        connection.query(query, function (err, _idStations) {
            if (err) {
                cb(false);
            } else {
                cb(_idStations);
            }
        })
    }

    function get_api_distribusion(_idCityStart, _idCityEnd, cb) {
        query = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
        table = ["alteryx.api_parameters", "API", "DISTRIBUSION"];
        query = mysql.format(query, table);
        connection.query(query, function (err, _idApi) {
            if (err) {
                cb(false);
            } else {
                if (_idCityStart == false || _idCityEnd == false) {
                    cb(false);
                } else {
                    cb(_idApi);
                }
            }
        })
    }

    router.route('/departureBus/:city_name?')
        .get(function (req, res) {
            var query = "SELECT ??, ?? FROM ?? ";
            var table = ['departure_city_name', 'departure_country_code', 'distribusion.city_pairs'];
            if (req.params.city_name) {
                query += "WHERE ?? LIKE '%" + req.params.city_name + "%' GROUP BY ??";
                table.push("departure_city_name", "departure_city_name")
            }
            query = mysql.format(query, table);
            connection.query(query, function (err, _result) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    res.send(_result);
                }
            })
        })


    router.route('/arrivalBus/:city_name/:city_arrival')
        .get(function (req, res) {
            var query = "SELECT ??, ?? FROM ?? ";
            var table = ['arrival_city_name', 'arrival_country_code', 'distribusion.city_pairs'];
            if (req.params.city_name) {
                query += "WHERE ?? = ? AND ?? LIKE '%" + req.params.city_arrival + "%' LIMIT 10";
                table.push("departure_city_name", req.params.city_name, "arrival_city_name");
            }
            query = mysql.format(query, table);
            connection.query(query, function (err, _result) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    res.send(_result);
                }
            })
        })

    // la partie la plus délicate
    router.route('/findIdStations')
        .post(function (req, res) {
            var idCityStart = null;
            var idCityEnd = null;
            var dateStart = req.body.dateStart;
            get_id_stations(req.body.cityStart, function (_cityStart) {
                idCityStart = _cityStart;
                get_id_stations(req.body.cityEnd, function (_cityEnd) {
                    idCityEnd = _cityEnd;
                    get_api_distribusion(idCityStart, idCityEnd, function (_apiResult) {
                        if (_apiResult == false) {
                            res.status(404).send("unable to call api_parameters");
                        } else {
                            var urlQuery = queryBus.queryBusBuilder(idCityStart, idCityEnd, _apiResult.API, _apiResult.USER_ID);
                            res.send(urlQuery);
                        }
                    });
                })
            })
        });
    // pour la partie live price si jamais
    router.route('/livePrice')
        .post(function (req, res) {
            request({ url: 'https://api.distribusion.com/v2/connections/live' }, function (err, response, body) {
                if (err) {
                    res.status(400).send("unable to call distribusion");
                } else {
                    res.send(bony);
                }
            });
        })

}
