const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const pug = require('pug');
const mysql = require('mysql');

//database connection
//connection = mysql.createConnection//
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'notifier'
});

/*connection.connect(function(err){
	if (err) throw err;
	
	console.log('connected successfully');
}); */

var encode = bodyParser.urlencoded({ extended: false });
const app = express();
app.use(bodyParser.json());

const publicVapidKey = 'BLzhvkZqLU5NS512DRuB7Qcuj9JeStGhxVRaBTe1J7TidMzJRcEqiakrM0dlKILWgMhIlQSUj4ZK6HEtqukXUT4';
const privateVapidKey = 'aeO8K8Sda53X2IqD6fWD5Il4P1bRoBUaUNnUcFRlkYk';

webpush.setVapidDetails('mailto:sdade14@gmail.com', publicVapidKey, privateVapidKey);

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('subscribe');
});

app.get('/notify', function(req, res){
	res.render('notify');
});

app.get('/subscribe', function(req, res){
	res.render('subscribe');
});


app.post('/notify', encode, (req, res) => {
	//Get custom push object
	
	const title = req.body.title;
	const image = req.body.graphic;
	const url = req.body.url;
	const message = req.body.message;
	//console.log(all_body);
	
	
	//create payload
	const payload = JSON.stringify(
		{
		title: title,
		body:  message,
		image: image,
		url: url
		}); 
		console.log(payload);
	
		connection.getConnection(function(err){
				if (err) throw err;
				connection.query("SELECT endpoint, p256dh, auth FROM subscriptions", function(err, result, fields){
					if (err) throw err;
					//console.log(result);
					//console.log(result);
					
					for (var i=0; i<result.length; i++){
						var end = result[i];
						//console.log(end);
						
						var sub = {"endpoint":end.endpoint, "keys":{"p256dh":end.p256dh,"auth":end.auth}}
						//console.log(sub);
						webpush.sendNotification(sub, payload).catch(err => console.error(err));
					}
					
				});
			});
	
});

app.post('/subscribe', (req, res) => {
	
	//Get push subscription object
	const subscription = req.body;
	console.log(subscription);
	
	//send 201 resource succs
	//res.status(201).json({});
	var sql = "insert into subscriptions values(null, '"+ req.body.name +"', '"+ req.body.department +"', '"+ req.body.subscription.endpoint +"', '"+ req.body.subscription.keys.p256dh +"', '"+ req.body.subscription.keys.auth +"')";
	connection.query(sql);
}); 


//update database where subscription has expired
app.post('/updateSubscription', (req, res) => {
	const newEndpoint = req.body.endpoint;
	const auth = req.body.keys.auth;
	console.log(newEndpoint);
	
	var updateSql = "UPDATE subscriptions SET endpoint = '"+ newEndpoint +"' WHERE auth = '"+ auth +"'";
	connection.query(updateSql);
});


const port = 2000;
app.listen(port,  () => console.log(`server started on port ${port}`));


