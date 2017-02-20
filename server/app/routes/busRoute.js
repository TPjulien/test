module.exports = function(router, connection, mysql) {
    router.route('/departureBus/:city_name?')
    .get(function(req, res) {
        var query = "SELECT ??, ?? FROM ?? ";
        var table = ['departure_city_name', 'departure_country_code', 'distribusion.city_pairs'];
        if (req.params.city_name) {
            query += "WHERE ?? = ?";
            table.push("departure_city_name", req.params.city_name)
        }
        query = mysql.format(query, table);
        connection.query(query, function(err, _result) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    res.send(_result);
                }
        })
    })
    router.route('/arrivalBus/:city_name?')
    .get(function(req, res) {
        var query = "SELECT * FROM ?? ";
        var table = ['arrival_city_name', 'arrival_country_code', 'distribusion.city_pairs'];
        if (req.params.city_name) {
            query += "WHERE ?? = ?";
            table.push("arrival_city_name", req.params.city_name)
        }
        query = mysql.format(query, table);
        connection.query(query, function(err, _result) {
                if (err) {
                    res.status(404).send(err);
                } else {
                    res.send(_result);
                }
        })
    })
}