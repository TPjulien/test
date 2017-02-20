module.exports = {
    queryBusBuilder: function(_stationsStart, _stationEnd, _api, _clientApi) {
        // le début de l'url avec les parametres
        var urlText="https://api.distribusion.com:443/reseller/v2/connections/find?affiliate_partner_number=" + _clientApi + "&api_key=" + _api + ""; 
        // on fait une boucle pour faire tout cela
        for (var station in _stationsStart) {
            urlText += "&departure_station_ids[]=" + _stationStart[station].id;
        }
        for (var station in _stationEnd) {
            urlText += "&arrival_station_ids[]=" + _stationEnd[station].id;
        }
        return urlText;
    }
}