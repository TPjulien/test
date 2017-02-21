module.exports = {
    queryBusBuilder: function(_stationsStart, _stationsEnd, _api, _clientApi) {
        // le début de l'url avec les parametres
        var urlText="https://api.distribusion.com:443/reseller/v2/connections/find?affiliate_partner_number=" + _clientApi + "&api_key=" + _api + ""; 
        // on fait une boucle pour faire tout cela
        for (var station in _stationsStart) {
	    console.log("le depart", _stationsStart[station].id);
            urlText += "&departure_station_ids[]=" + _stationsStart[station].id;
        }
	console.log("la variable", _stationsEnd);
        for (var station in _stationsEnd) {
	    console.log("l'arrivé ", _stationsEnd[station].id);
            urlText += "&arrival_station_ids[]=" + _stationsEnd[station].id;
        }
        return urlText;
    }
}
