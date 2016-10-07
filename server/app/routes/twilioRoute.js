var mysql  = require('mysql');
var twilio = require('twilio');

// Faudrai reverifier les roles
module.exports = function(router, connection) {
    router.route('/sendSMS')
        .post (function(req, res) {
            client = new twilio.RestClient('ACc806c7fc5d5905df6d8798c9d1f4b8ec', '45fa33445857342176269980ddb5aa53');
            client.sms.messages.create({
                to: req.body.number_client,
                from: '+33756799990',
                body: req.body.message
            }, function(err, message) {
                if (err)
                    res.status(400).send("Unable to send sms because : " + err );
                else
                    res.status(200).send(message);
            });
        })
}
