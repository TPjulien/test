var syncRequest = require('sync-request');
var queryBus = require('../functions/busQueryBuilder');
var request = require('request');
var currentWeekNumber = require('current-week-number');
var shortid           = require('shortid');
module.exports = function (router, connection, mysql) {
    
    // markup
    var d       = new Date();
    var month   = d.getMonth();
    var weekDay = d.getDay();
    var hour    = d.getHours();
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

    function get_api_distribusion(cb) {
        query = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
        table = ["alteryx.api_parameters", "API", "DISTRIBUSION"];
        query = mysql.format(query, table);
        connection.query(query, function (err, _idApi) {
            if (err) {
                cb(false);
            } else {
                cb(_idApi);
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
                    get_api_distribusion(function (_apiResult) {
                        if (_apiResult == false) {
                            res.status(404).send("unable to call api_parameters");
                        } else {
                            var urlQuery = queryBus.queryBusBuilder(idCityStart, idCityEnd, _apiResult[0].KEY, _apiResult[0].USER_ID, dateStart);
                            request(urlQuery, function (err, response, body) {
				if (err) {
				    res.status(400).send(err);
				} else {
				    var query = "SELECT ??,?? FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ? AND ?? = ? AND ?? = ? LIMIT 1";
				    var table = ["type", "value", "distribusion.markup", "SITE_ID", req.body.site_id, "WEEK_NUM", currentWeekNumber(), "MONTH_NUM", month, "WEEK_DAY", weekDay, "HOUR", hour];
				    query = mysql.format(query, table);
				    connection.query(query, function(err, _queryResult) {
					if (err) {
					    res.status(400).send(err);
					} else {
					    var datas = JSON.parse(body);
					    if (_queryResult.length != 0)  {
						for (var data in datas.data) {
						    if (_queryResult[0].type == "markup") {
							var numberTemp = _queryResult[0].value * 100;
							datas.data[data].attributes.price_per_seat = datas.data[data].attributes.price_per_seat + numberTemp ;
						    } else if (_queryResult[0].type == "taux") {
							var numberTemp = datas.data[data].attributes.price_per_seat * (_queryResult[0].value / 100);
							datas.data[data].attributes.price_per_seat = datas.data[data].attributes.price_per_seat + numberTemp;
						    }
						}
					    }
					    for (var data in datas.data) {
						datas.data[data].id = shortid.generate();
					    } 
					    res.send(datas);
					}
				    })
				}
                            });
                        }
                    });
                })
            })
        });
    router.route('/livePrice')
        .post(function (req, res) {
            get_api_distribusion(function (_api) {
                var proprietiesObject = {
                    affiliate_partner_number: _api[0].USER_ID,
                    api_key: _api[0].KEY,
                    departure_station_id: req.body.departure_station_id,
                    arrival_station_id: req.body.arrival_station_id,
                    departure_time: req.body.departure_time,
                    arrival_time: req.body.arrival_time,
                    provider_id: req.body.provider_id,
                    language: 'fr'
                };
                request({ url: 'https://api-demo.distribusion.com:443/reseller/v2/connections/live', qs: proprietiesObject }, function (err, response, body) {
                    if (err) {
                        console.log(err);
                        res.status(400).send("unable to call distribusion");
                    } else {
			var query = "SELECT ??,?? FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ? AND ?? = ? AND ?? = ? LIMIT 1";
                        var table = ["type", "value", "distribusion.markup", "SITE_ID", req.body.site_id, "WEEK_NUM", currentWeekNumber(), "MONTH_NUM", month, "WEEK_DAY", weekDay, "HOUR", hour];
                        query = mysql.format(query, table);
                        connection.query(query, function(err, _queryResult) {
                            if (err) {
                                res.status(400).send(err);
                            } else {
                                var prices = JSON.parse(body);
				if (_queryResult.length) {
				    if (_queryResult[0].type == "markup") {
					var numberTemp = _queryResult[0].value * 100;
					prices.data.attributes.price_per_seat = prices.data.attributes.price_per_seat + numberTemp;
                                    } else if (_queryResult[0].type == "taux") {
					var numberTemp = prices.data.attributes.price_per_seat * (_queryResult[0].value / 100);
					prices.data.attributes.price_per_seat = prices.data.attributes.price_per_seat + numberTemp;
				    }
				}
				
				res.send({
				    "id" : shortid.generate(),
				    "arrival_time": req.body.arrival_time,
				    "departure_time": req.body.departure_time,
				    "price": prices.data.attributes.price_per_seat,
				    "departure_station_id": req.body.departure_station_id,
				    "arrival_station_id": req.body.arrival_station_id,
				    "provider_id": req.body.provider_id
				});
                            }
                        })
                    }
                });
            })
        })
}
