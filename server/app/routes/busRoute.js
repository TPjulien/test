module.exports = function(router, connection, mysql) {
    router.route('/departureBus/:city_name?')
    .get(function(req, res) {
        console.log(req.params.city_name);
	var query = "SELECT ??, ?? FROM ?? ";
        var table = ['departure_city_name', 'departure_country_code', 'distribusion.city_pairs'];
        if (req.params.city_name) {
            query += "WHERE ?? LIKE '%" + req.params.city_name + "%' GROUP BY ??";
            table.push("departure_city_name", "departure_city_name")
        }
        query = mysql.format(query, table);
        connection.query(query, function(err, _result) {
                if (err) {
                    res.status(404).send(err);
                } else {
		    console.log("le resultat", _result);
                    res.send(_result);
                }
        })
    })

    router.route('/arrivalBus/:city_name/:city_arrival')
    .get(function(req, res) {
        console.log(req.params.city_name);
	var query = "SELECT ??, ?? FROM ?? ";
        var table = ['arrival_city_name', 'arrival_country_code', 'distribusion.city_pairs'];
        if (req.params.city_name) {
            query += "WHERE ?? = ? AND ?? LIKE '%" + req.params.city_arrival + "%' LIMIT 10";
            table.push("departure_city_name", req.params.city_name, "arrival_city_name");
        }
        query = mysql.format(query, table);
        connection.query(query, function(err, _result) {
                if (err) {
                    res.status(404).send(err);
                } else {
		    console.log("le resultat", req.body.city_name);
                    res.send(_result);
                }
        })
    })

    
    
}
