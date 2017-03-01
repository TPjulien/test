var nodemailer = require('nodemailer');
var format = require('dateformat');
module.exports = function (router, client) {
  router.route('/mail')
    .post(function (req, res) {
      var smtpConfig = {
        host: 'Smtp-pulse.com',
        port: 465,
        secure: true,
        auth: {
          user: 'julien@travelplanet.fr',
          pass: 'qCPjZQ9TmF'
        }
      }
      var transporter = nodemailer.createTransport(smtpConfig);
      var aller = req.body.depart;
      var retour = req.body.retour;
      var infoForWho = req.body.infoForWho;
      var date_aller = format(new Date(aller.departure_date), 'UTC:dd-mm-yyyy');
      var mail = `
          <div style="height:50px; width:100%; background-color: #2E5284;color: #2E5284;"></div>
           <div style="text-align: center">
            <br>
            <img src="http://jobs.travelplanet.pro/wp-content/uploads/2017/02/Travel-Planet.png" width="200" height="100"><br>
          <div>
          <div style="text-align: justify"><br>
            Bonjour <b>` + infoForWho.fullName + `</b>,
            <br><br>
            <p>Vous venez d'effectuer une reservation sur click.travelplanet.fr et nous vous en remercions.<\p>`
      mail += `<p>Nous ferons le maximum pour vous donner satisfaction.</p> <p>Voici un recapitulatif de votre commande : </p>`
      if (retour) {
        var date_retour = format(new Date(retour.departure_date), 'UTC:dd-mm-yyyy');
        var price = (retour.price * 100) + (aller.price * 100);
        mail += `<p><b>type de trajet :</b> Aller - Retour</p>
                     <p style="font-size:15px"><b>Aller -></b>
                     <p style="margin-left:10px"><b>Destination : </b>  De ` + aller.departure_city + ` <b>=></b> ` + aller.arrival_city + `</p>
                     <p style="margin-left:10px"><b>Heure départ:</b> ` + aller.departure_time + ` le ` + date_aller + `</p>
                     <p style="font-size:15px"><b>Retour -> </b>
                     <p style="margin-left:10px"><b>Destination : </b>  De ` + retour.departure_city + ` <b>=></b> ` + retour.arrival_city + `</p>
                     <p style="margin-left:10px"><b>Heure départ:</b> ` + retour.departure_time + ` le ` + date_retour + `</p>
                     <p style="font-size:15px"><b>Prix : </b> ` + (price / 100) + ` €</p>`
      } else {
        var price = (aller.price * 100);
        mail += `<p><b>type de trajet : </b> Aller seulement</p>
                     <p style="margin-left:10px"><b>Destination : </b>  De ` + aller.departure_city + ` <b>=></b> ` + aller.arrival_city + `</p>
                     <p style="margin-left:10px"><b>Heure départ:</b> ` + aller.departure_time + ` le ` + date_aller + `</p>
                     <p style="font-size:15px"><b>Prix : </b> ` + (price / 100) + ` €</p>`
      }

      var endMail = `<br><br><br><br>
                    Tristan Dessain-Gelinet,<br>
                    Directeur Général, - Travel Planet<br>
                    <br>
                    <div>
                    <div style="height:50px; width:100%; background-color: #2E5284;">&nbsp;</div>`

      mail += endMail


      var staffMail = `
          <div style="height:50px; width:100%; background-color: #2E5284;color: #2E5284;"></div>
           <div style="text-align: center">
            <br>
            <img src="http://jobs.travelplanet.pro/wp-content/uploads/2017/02/Travel-Planet.png" width="200" height="100"><br>
          <div>
          <div style="text-align: justify"><br>
            Bonjour,
            <br><br>
            <p>Un client vient d'effectuer une reservation sur click.travelplanet.fr.<\p>`
      staffMail += `<p>Merci de faire le necessaire.</p> <p>Voici un recapitulatif de la commande : </p>`
      if (retour) {
        var date_retour = format(new Date(retour.departure_date), 'UTC:dd-mm-yyyy');
        var price = (retour.price * 100) + (aller.price * 100);
        staffMail += `<p style="font-size:15px"><b>Nom : </b> ` + infoForWho.fullName + `</p>
		     <p style="font-size:15px"><b>Identifiant Utilisateur : </b>` + infoForWho.uid + `</p>
		     <p style="font-size:15px"><b Addresse E-mail : </b>` + infoForWho.email + `</p>
		     <p><b>type de trajet :</b> Aller - Retour</p>
                     <p style="font-size:15px"><b>Aller -></b>
                     <p style="margin-left:10px"><b>Destination : </b>  De ` + aller.departure_city + ` <b>=></b> ` + aller.arrival_city + `</p>
                     <p style="margin-left:10px"><b>Heure départ:</b> ` + aller.departure_time + ` le ` + date_aller + `</p>
                     <p style="font-size:15px"><b>Retour -> </b>
                     <p style="margin-left:10px"><b>Destination : </b>  De ` + retour.departure_city + ` <b>=></b> ` + retour.arrival_city + `</p>
                     <p style="margin-left:10px"><b>Heure départ:</b> ` + retour.departure_time + ` le ` + date_retour + `</p>
                     <p style="font-size:15px"><b>Prix : </b> ` + (price / 100) + ` €</p>`
      } else {
        var price = (aller.price * 100);
        staffMail += `<p><b>type de trajet : </b> Aller seulement</p>
                      <p style="margin-left:10px"><b>Destination : </b>  De ` + aller.departure_city + ` <b>=></b> ` + aller.arrival_city + `</p>
                      <p style="margin-left:10px"><b>Heure départ:</b> ` + aller.departure_time + ` le ` + date_aller + `</p>
		      <p style="font-size:15px"><b>Prix : </b> ` + (price / 100) + ` €</p>`
      }

      var endStaffMail = `<br><br><br><br>
                    Tristan Dessain-Gelinet,<br>
                    Directeur Général, - Travel Planet<br>
                    <br>
                    <div>
                    <div style="height:50px; width:100%; background-color: #2E5284;">&nbsp;</div>`

      staffMail += endStaffMail

      // le mail a envoyer chez le client

      var mailClient = {
        from: '"No-reply" <noreply@travelplanet.fr>"',
        to: infoForWho.email,
        subject: 'Travel Planet - Confirmation de reservation Bus',
        text: 'Travel Planet',
        html: mail
      };

      request = "SELECT js_data FROM click.table1 WHERE type=? AND KEY=? AND ID=?";
      table = ["base", "general", req.body.site_id];
      client.execute(request, table, function (err, _result) {
        if (err) {
          res.status(400).send(err);
        } else {
          console.log(_result);
          // le mail à envoyer chez Travel
          var mailTravel = {
            from: '"No-reply" <noreply@travelplanet.fr>',
            to: 'mahefa@travelplanet.fr',
            subject: "Prise de commande",
            text: 'Prise de commande',
            html: staffMail
          };

          transporter.sendMail(mailClient, function (error) {
            if (error) {
              res.status(400).send({ "sucess": false, "message": error });
            } else {
              transporter.sendMail(mailTravel, function (err) {
                if (err) {
                  res.status(400).send({ "success": false, "message": err });
                } else {
                  res.status(200).send({ "result": "Sent" });
                }
              })
            }
          })
        }
      })
    })
}
