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
      var depart = req.body.depart;
      var retour = req.body.retour;

      //console.log("aller départ : ", depart.attributes.relationships.departure.data.id, "aller retour : ", depart.attributes.relationships.arrival.data.id);
      //console.log("retour départ : ", retour.attributes.relationships.departure.data.id, "retour retour : ", retour.attributes.relationships.arrival.data.id);

      // depart.includes
      var _departStations = getStationsName(depart.attributes.relationships, depart.includes.stations);
      var _retourStations = getStationsName(retour.attributes.relationships, retour.includes.stations);
      
      console.log("depart", _departStations);
      console.log("retour", _retourStations);
      
      var mail = "<p>Bonjour, Vous venez d'effectuer une reservation sur click.travelplanet.fr et nous vous en remercions.</p>\n Nous ferons le maximum pour vous donner satisfaction.</p>\n <p>Voici un recapitulatif de votre commande : </p>\n"
      
      if (retour) {
	  var priceRetour = retour.attributes.attributes.price_per_seat / 100 + 4.99;
	  mail += `<p><b>type de trajet :</b> Aller - Retour</p>\n
	      <p><b>Prix : </b> ` + priceRetour + ` Euros</p>\n
	      <p><b>Destination : </b> ` + retour.attributes.stations  + `--` + retour.attributes.stations + `</p>
	      <p><b>Heure :</b>` + retour.attributes.attributes.departure_time + `--` + retour.attributes.attributes.arrival_time + `</p>`;
      } else {
	  mail += "<p><b>type de trajet : </b> Aller seulement</p>"
      }

      var endMail = "A Bientot sur notre site,\n L'Equipe Travel Planet."
      

      

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
      to      : 'mahefa@travelplanet.fr',
      subject : "Prise de contact",
      text    : 'Demande de contact client 👥',
      html    : "Doppin'low"
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
