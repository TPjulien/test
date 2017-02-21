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
                    console.log("le resultat", req.body.city_name);
                    res.send(_result);
                }
            })
        })
    // la partie la plus délicate
    router.route('/findIdStations')
        .post(function (req, res) {
            var idCityStart = null;
	    var idCityEnd   = null;
	    var dateStart   = req.body.dateStart;
	    get_id_stations(req.body.cityStart, function(_cityStart) {
		idCityStart = _cityStart;
		get_id_stations(req.body.cityEnd, function(_cityEnd) {
		    idCityEnd = _cityEnd;
		    query = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
		    table = ["alteryx.api_parameters", "API", "DISTRIBUSION"];
		    query = mysql.format(query, table);
		    connection.query(query, function (err, _idApi) {
			if (err) {
			    res.status(400).send(err);
			} else {
			    if (idCityStart == false || idCityEnd == false ) {
				res.status(404).send("Bad Ids");
			    } else {
				console.log(_idApi.API);
				var urlQuery = queryBus.queryBusBuilder(idCityStart, idCityEnd, _idApi[0].KEY, _idApi[0].USER_ID, dateStart);
				request(urlQuery, function(err, response, body){
				    res.send(body);
				});
				//res.send(urlQuery);
			    }
			}
		    })
		})
	    });            
        })
}
