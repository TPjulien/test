var nodemailer = require('nodemailer');

module.exports = function(router) {
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
      var attributes = req.body.attributes.attributes;
      var included   = req.body.includes;
      
      console.log(included.stations[0].attributes.name);
      console.log(included.stations[1].attributes.name);
      
      // le mail a envoyer chez le client
      var mailClient = {
	  from    : '"No-reply" <noreply@travelplanet.fr>"',
	  to      : 'mahefa@travelplanet.fr',
	  subject : 'Travel Planet - Confirmation de reservation Bus',
	  text    : 'Travel Planet',
	  html    : `<h1>Bonjour, les crédentials</h1>
	      <p>Le prix : ` + attributes.price_per_seat + `</p>` +
	      `<p>ville de Départ : ` + included.stations[0].attributes.name + `</p>` + 
	      "<p>ville de D'arrivée : " + included.stations[1].attributes.name + `</p>` + 
	      `<p>date et heure du départ : ` + attributes.departure_time + `</p>` +
	      "<p>date et heure d'arivée : " + attributes.arrival_time + `</p>` +
	      `<p>durée du trajet : ` + attributes.duration_in_seconds + `</p>`
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
