require('moment-duration-format');

var queryBus = require('../functions/busQueryBuilder');
var request = require('request');
var currentWeekNumber = require('current-week-number');
var shortid = require('shortid');
var Promise = require('promise');
var Q = require('q');
var format = require('dateformat');

var moment = require('moment');

module.exports = function (router, connection, mysql) {
    // markup
    var d = new Date();
    var month = d.getMonth();
    var weekDay = d.getDay();
    var hour = d.getHours();
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

    function get_id_stations_2(city) {
        return new Promise(function (res, rej) {
            var query = "SELECT * FROM ?? WHERE ?? = ?";
            var table = ['distribusion.stations', 'city_name', city];
            query = mysql.format(query, table);
            connection.query(query, function (err, _idStations) {
                if (err) {
                    rej(err);
                } else {
                    res(_idStations);
                }
            })
        })
    }

    function get_api_distribusion_2() {
        return new Promise(function (_resolve, _reject){
            query = "SELECT * FROM ?? WHERE ?? = ? LIMIT 1";
            table = ["alteryx.api_parameters", "API", "DISTRIBUSION"];
            query = mysql.format(query, table);
            connection.query(query, function (err, _idApi) {
                if (err) {
                    _reject(err);
                } else {
                    _resolve(_idApi[0]);
                }
            })
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

    function markup(_site_id) {
	return new Promise(function(_resolve, _reject) {
	    var query = "SELECT ??,?? FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ? AND ?? = ? AND ?? = ? LIMIT 1";
            var table = ["type", "value", "distribusion.markup", "SITE_ID", _site_id, "WEEK_NUM", currentWeekNumber(), "MONTH_NUM", month, "WEEK_DAY", weekDay, "HOUR", hour];
	    query = mysql.format(query, table);
            connection.query(query, function (err, _queryResult) {
		if (err) {
		    _reject(err);
		} else {
		    _resolve(_queryResult);
		}		
	    })
	})
    }
    
    function livePrice(_userN, _key, _departure_id, _arrival_id, _provider_id, _departure_time, _arrival_time, _stationNames, _site_id, _markup, _carrier_id, _carrier_list, _duration) {
	var proprietiesObject = {
            affiliate_partner_number: _userN,
            api_key:                  _key,
            departure_station_id:     _departure_id,
            arrival_station_id:       _arrival_id,
            departure_time:           _departure_time,
            arrival_time:             _arrival_time,
            provider_id:              _provider_id,
            language:                 'fr'
        };	
	return new Promise(function(_resolve, _reject) {
	    request({ url: 'https://api.distribusion.com:443/reseller/v2/connections/live', qs: proprietiesObject }, function (err, response, body) {
		if (err) {
		    _reject(err);
		} else {
		    var bodyParsed     = JSON.parse(body);
		    var _object        = {};
		    var _departureCity = null;
		    var _arrivalCity   = null;
		    var _carrierName   = null;
		    for(var _j in _stationNames) {
			if (_departure_id == _stationNames[_j].id) {
			    _departureCity = _stationNames[_j].attributes.name;
			} else if (_arrival_id == _stationNames[_j].id) {
			    _arrivalCity = _stationNames[_j].attributes.name;
			}
		    }
		    for (var _i in _carrier_list) {
			if (_carrier_id == _carrier_list[_i].id) {
			    _carrierName = _carrier_list[_i].attributes.legal_name;
			    
			}
		    }
		    var _pricesWithMarkup = 0;
		    // on check le result si c'est un markup ou bien un taux
		    if (_markup.length) {
                        if (_markup[0].type == "markup") {
                            if (bodyParsed.data) {
				var numberTemp = _markup[0].value * 100;
				pricesWithMarkup = bodyParsed.data.attributes.price_per_seat = bodyParsed.data.attributes.price_per_seat + numberTemp;
                            } else {
                                var numberTemp = bodyParsed.data.attributes.price_per_seat * (_markup[0].value / 100);
                                pricesWithMarkup = bodyParsed.data.attributes.price_per_seat = bodyParsed.data.attributes.price_per_seat + numberTemp;
                            }
			}
                    }
		    _object = { "id" :  shortid.generate(),
				"departure_city" : _departureCity,
				"arrival_city"   : _arrivalCity, 
				"departure_id"   : _departure_id,
				"arrival_id"     : _arrival_id,
				"departure_date" : _departure_time,
				"departure_time" : format(new Date(_departure_time), 'UTC:HH:MM'),
				"arrival_date"   : _arrival_time,
				"arrival_time"   : format(new Date(_arrival_time),   'UTC:HH:MM'),
				"provider_id"    : _provider_id,
				"duration"       : moment.duration(_duration,"seconds").format("h:mm"),
				"price"          : (pricesWithMarkup / 100),
				"carrier_name"   : _carrierName,
				"availability"   : bodyParsed.data.attributes.available
			      };
			_resolve(_object);
		}
	    })
	})
    }

    //remaster de findStations
    router.route('/findStations')
        .post(function (req, res) {
            var idDate        = req.body.dateStart;
            var idStationsPromises = [];
            // depart et arrivée
            var idCityDepart = get_id_stations_2(req.body.cityStart).then(function (_result) { return Q(_result) });
            var idCityArrive = get_id_stations_2(req.body.cityEnd).then(function (_result) { return Q(_result) });
            // API Distri credentials  et markup 
            var api = get_api_distribusion_2().then(function(_result){ return Q(_result) });
	    var getMarkup = markup(req.body.site_id).then(function(_result) { return Q(_result) });
            idStationsPromises.push(idCityDepart, idCityArrive, api, getMarkup);

            // premier call 
            Q.all(idStationsPromises).then(function (_result) {
                // la query
                // 0 = ville de depart, 1 = ville d'arrivée, 2 = api, 3 = markup
                var urlQuery = queryBus.queryBusBuilder(_result[0], _result[1], _result[2].KEY, _result[2].USER_ID, idDate);
                request(urlQuery, function(err, response, body) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
			var parsedBody  = (JSON.parse(body));
			var stationNames = parsedBody.included.stations;
			var livePricesPromises = [];
			for ( var _i in parsedBody.data) {
			    var livePricePromise = livePrice(_result[2].USER_ID, _result[2].KEY, // la clé 
							     parsedBody.data[_i].relationships.departure.data.id, // id de départ 
							     parsedBody.data[_i].relationships.arrival.data.id, // id d'arrivée
							     parsedBody.data[_i].relationships.provider.data.id, // id du fournisseur
							     parsedBody.data[_i].attributes.departure_time, // date de départ
							     parsedBody.data[_i].attributes.arrival_time, // date d'arrivée
							     stationNames, // nom des stations
							     req.body.site_id, // le site_id
							     _result[3], // le markup
							     parsedBody.data[_i].relationships.carrier.data.id, // carrier
							     parsedBody.included.carriers, // liste des carrier
							     parsedBody.data[_i].attributes.duration_in_seconds // durée en secondes
							    );
			    // for promise
			    livePricePromise.then(function(_result) {
				return Q(true);
			    })
			    livePricesPromises.push(livePricePromise);
			}
			Q.all(livePricesPromises).then(function(_stations) {
			    var _arrayFinal = [];
			    for (var _x in _stations) {
				if (_stations[_x].availability == true) {
				    _arrayFinal.push(_stations[_x]);
				}
			    }
			    res.send(_arrayFinal);
			})
                    }
                })
            });
        })
}
