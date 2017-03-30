module.exports = {
    queryBusBuilder: function (_stationsStart, _stationsEnd, _api, _clientApi, _date) {
        // le début de l'url avec les parametres
        var urlText = "https://api.distribusion.com:443/reseller/v2/connections/find?affiliate_partner_number=" + _clientApi + "&api_key=" + _api + "&date=" + _date;
        // on fait une boucle pour faire tout cela
        for (var station in _stationsStart) {
            urlText += "&departure_station_ids[]=" + _stationsStart[station].id;
        }
        for (var station in _stationsEnd) {
            urlText += "&arrival_station_ids[]=" + _stationsEnd[station].id;
        }
        return urlText;
    }
}
