require('dotenv').config();
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');

const APP_SECRET = process.env.APP_SECRET;
const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
    res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) {
    console.log('webhook get');

    if (req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        res.send(req.query['hub.challenge']);
    }

    res.send('Error, wrong validation token');
});

app.post('/webhook', function(req, res) {
    console.log('webhook post');

    var entries = req.body.entry;
    console.log(req.body);
    // for (var entry of entries) {
    //     var messaging = entry.messaging;
    //     for (var message of messaging) {
    //         var senderId = message.sender.id;
    //         if (message.message) {
    //             if (message.message.text) {
    //                 var text = message.message.text;
    //                 sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
    //             }
    //         }
    //     }
    // }
    // res.status(200).send("OK");
    res.status(200).send("OK");
});

function sendMessage(senderId, message) {
    request({
        url: 'https://graph.facebook.com/v8.0/me/messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN,
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            },
        }
    });
}

app.set('port', process.env.PORT || 5000);
app.set('ip', process.env.IP || "0.0.0.0");

server.listen(app.get('port'), app.get('ip'), function() {
    console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});
