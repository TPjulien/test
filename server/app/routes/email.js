var nodemailer = require('nodemailer');

module.exports = function(router, connection) {

  // route pour lister les numéros de téléphone du profil
  router.route('/sendMail')
      .post(function(req, res) {
          var expediteur      = req.body.expediteur;
          var destinataire    = req.body.destinataire;
          var objet           = req.body.objet;
          var body            = req.body.body;

          // create reusable transporter object using the default SMTP transport
          var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

          // setup e-mail data with unicode symbols
          var mailOptions = {
              from: '<' + from + '>', // sender address
              to: destinataire, // list of receivers
              subject: objet, // Subject line
              text: 'Hello world ?', // plaintext body
              html: body // html body
          };
          // send mail with defined transport object
          transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  return console.log(error);
              }
              console.log('Message sent: ' + info.response);
          })
      })
  }
