var nodemailer = require('nodemailer');

module.exports = function(router) {
    function getStationsName (_object, _fullToCompare) {
	var tab = [];
	for ( var full in _fullToCompare) {
	    var tempObj = {};
	    if (_object.departure.data.id == _fullToCompare[full].id) {
		tempObj['depart'] = _fullToCompare[full].attributes.name;
		tab.push(tempObj);
		tempObj = {};
	    } else if (_object.arrival.data.id == _fullToCompare[full].id) {
		tempObj['arrive'] = _fullToCompare[full].attributes.name;
		tab.push(tempObj);
		tempObj = {};
	    }
	}
	return tab;
    }
  router.route('/mail')
  .post(function(req, res) {
    var smtpConfig = {
      host : 'Smtp-pulse.com',
      port : 465,
      secure : true,
      auth : {
        user : 'julien@travelplanet.fr',
        pass : 'qCPjZQ9TmF'
      }
    }
      var transporter = nodemailer.createTransport(smtpConfig);
      var depart     = req.body.depart;
      var retour     = req.body.retour;
      var infoForWho = req.body.infoForWho;

      //console.log("aller départ : ", depart.attributes.relationships.departure.data.id, "aller retour : ", depart.attributes.relationships.arrival.data.id);
      //console.log("retour départ : ", retour.attributes.relationships.departure.data.id, "retour retour : ", retour.attributes.relationships.arrival.data.id);

      // depart.includes
      var _departStations = getStationsName(depart.attributes.relationships, depart.includes.stations);
      console.log("le result", _departStations);
      var mail = `
          <div style="height:50px; width:100%; background-color: #2E5284;color: #2E5284;"></div>
           <div style="text-align: center">
            <br>
            <img src="http://jobs.travelplanet.pro/wp-content/uploads/2017/02/Travel-Planet.png" width="200" height="100"><br>
          <div>
          <div style="text-align: justify"><br>
            Bonjour ` + infoForWho.receiveFirstName + `
            <br><br>
            <p>Vous venez d'effectuer une reservation sur click.travelplanet.fr et nous vous en remercions.Nous ferons le maximum pour vous donner satisfaction.</p> <p>Voici un recapitulatif de votre commande : </p>
            
            `      
          if (retour) {
            var _retourStations = getStationsName(retour.attributes.relationships, retour.includes.stations);
            var price = (retour.attributes.attributes.price_per_seat / 100) + (depart.attributes.attributes.price_per_seat / 100);
            mail += `<p><b>type de trajet :</b> Aller - Retour</p>
                     <p><b>Aller -> </b>
                     <p><b>Destination : </b>  De ` + _departStations[0].depart  + ` vers ` + _departStations[1].arrive + `</p>
                     <p><b>Heure :</b>` + depart.attributes.attributes.departure_time + `</p>
                     <p><b>Retour -> </b>
                      <p><b>Destination : </b>  De ` + _retourStations[0].depart  + ` vers ` + _retourStations[1].arrive + `</p>
                     <p><b>Heure :</b>` + retour.attributes.attributes.departure_time + `</p>;
                     <p><b>Prix : </b> ` + price + ` €</p>`
              } else {
            mail += `<p><b>type de trajet : </b> Aller seulement</p>
                     <p><b>Destination : </b>  De ` + _departStations.depart  + `vers ` + _departStations.arrive + `</p>
                     <p><b>Heure :</b>` + depart.attributes.attributes.departure_time + `</p>`
              }

      var endMail = `<br><br><br><br>
                    Tristan Dessain-Gelinet,<br>
                    Directeur Général, - Travel Planet<br>
                    <br>
                    <div>
                    <div style="height:50px; width:100%; background-color: #2E5284;">&nbsp;</div>`
      
      mail += endMail 
      // le mail a envoyer chez le client
      var mailClient = {
        from    : '"No-reply" <noreply@travelplanet.fr>"',
        to      : 'mahefa@travelplanet.fr',
        subject : 'Travel Planet - Confirmation de reservation Bus',
        text    : 'Travel Planet',
        html    : mail
          };

    // le mail à envoyer chez Travel
    var mailTravel = {
      from    : '"No-reply" <noreply@travelplanet.fr>',
      to      :  infoForWho.receiveEmail,
      subject : "Prise de commande",
      text    : 'Prise de commande',
      html    :  mail
    };

    transporter.sendMail(mailClient, function(error) {
      if (error) {
        res.status(400).send({ "sucess": false, "message": error});
      } else {
        transporter.sendMail(mailTravel, function(err) {
          if (err) {
            res.status(400).send({"success": false, "message": err});
          } else {
            res.status(200).send({"result": "Sent"});
          }
        })
      }
    })
  })
}
