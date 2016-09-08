var nodemailer = require('nodemailer');

module.exports = function(router, connection) {

  // route pour lister les numéros de téléphone du profil
  router.route('/sendMail')
      .post(function(req, res) {
          var body = req.body.body;
          console.log(body);
          // // create reusable transporter object using the default SMTP transport
          // var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
          //
          // // setup e-mail data with unicode symbols
          // var mailOptions = {
          //     from: '"Fred Foo ?" <foo@blurdybloop.com>', // sender address
          //     to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
          //     subject: 'Hello ✔', // Subject line
          //     text: 'Hello world ?', // plaintext body
          //     html: '<b>Hello world ?</b>' // html body
          // };
          // // send mail with defined transport object
          // transporter.sendMail(mailOptions, function(error, info){
          //     if(error){
          //         return console.log(error);
          //     }
          //     console.log('Message sent: ' + info.response);
          // })
      })
  }
