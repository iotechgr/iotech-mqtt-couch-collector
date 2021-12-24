/**
 * MQTT subscriber application that connects                 
 * via  MQTT  and forwards data through HTTP API
 * 
 * @author Panos Matsaridis
 */

 var mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
 const request = require('request')
 
 
 /**
  * Create an MQTT connection
  */
 var topic = process.env.MQTT_TOPIC //'parking_ath/things/#'
 var brokerUrl = process.env.MQTT_BROKER_URL //'ssl://friendly-actor.cloudmqtt.com';
 var optionsMQTT = {
     clientId: 'iotech-collector-node-parser-' + Date.now(),
     port: process.env.MQTT_PORT, //8883,
     username: process.env.MQTT_USERNAME, //'thingpark_ath',
     password: process.env.MQTT_PASSWORD, //'@thingpark12345',
     keepalive: 60
 };
 
 var client = mqtt.connect(brokerUrl, optionsMQTT);
 client.on('connect', mqtt_connect);
 client.on('reconnect', mqtt_reconnect);
 client.on('error', mqtt_error);
 client.on('message', mqtt_messsageReceived);
 client.on('close', mqtt_close);
 
 function mqtt_connect() {
     console.log("Connecting MQTT..");
     client.subscribe(topic, mqtt_subscribe);
 };
 
 function mqtt_subscribe(err, granted) {
     console.log("Subscribed to " + topic + "!");
     if (err) { console.log(err); }
 };
 
 function mqtt_reconnect(err) {
     console.log("Reconnecting MQTT..");
     if (err) { console.log(err); }
     client = mqtt.connect(brokerUrl, optionsMQTT);
 };
 
 function mqtt_error(err) {
     if (err) { console.log(err); }
 };
 
 function after_publish() {
     //do nothing
 };
 
 /**
  * On message receive event
  */
 function mqtt_messsageReceived(message) {
 
     var msg = JSON.parse(message);

     request.post({
         headers: {'Content-Type' : 'application/json'},
         url: process.env.COUCHDB_PROTOCOL 
                + '://' + process.env.COUCHDB_USERNAME 
                +':' + process.env.COUCHDB_PASSWORD 
                + '@' + process.env.COUCHDB_HOST + ':' 
                + process.env.COUCHDB_PORT + '/' 
                + process.env.COUCHDB_NAME,
         body: JSON.stringify(msg)
     }, (error, res, body) => {
             if (error) {
                 console.error(error)
                 return
             }
             console.log(`statusCode: ${res.statusCode}`)
             console.log(body)
         })
     
 };
 
 function mqtt_close() {
     console.log("MQTT closed.");
 };
 