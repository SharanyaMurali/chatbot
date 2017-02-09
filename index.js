var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port',(process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.get('/', function(req,res) {
res.send('hello, i am a chatbot')
})

app.get('/webhook', function(req,res) {
    if(req.query['hub.verify_token']=== 'Sample ALM'){
        res.send(req.query['hub.challenge'])
    }
res.send('some thing wrong')
})

app.listen(app.get('port'),function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/',function(req,res) {
    messaging_events = req.body.entry[0].messaging
    for(i=0;i<messaging_events.lenght;i++){
        event = req.body.entry.messaging[i]
        sender = event.sender.id
        if(event.message && event.message.text) {
            text = event.message.text
            if(text === 'Aha') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Text received, echo: " + text.substring(0,200))
        }
        if(event.postback) {
            text = JSON.stringify(event.postback)
             sendTextMessage(sender, "Postback received: " + text.substring(0,200), token)
             continue
        }
    }
    res.sendStatus(200)
})

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://www.google.com',
        qs: {access_token:token},
        method: 'POST',
        json:{
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if(error) {
            console.log('error sending messages: ', error)
        }else if (respose.body.error) {
            console.log('error ', respose.body.error)
        }
    })
}

function sendGenericMessage(recipientId) {
  var messageData = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);


function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}​