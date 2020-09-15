var createError = require('http-errors');
var express = require('express');
var path = require('path');
var port = 3000;
var MongoClient = require('mongodb').MongoClient;
var mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

var dbClient;


var app = express();





app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html')
})

app.post('/page', function(req, res) {
    var name = req.body.name;
    res.sendFile(__dirname + '/views/' + name + '.html')
})

app.get('/mainList', function(req, res) {
    dbClient.db('catalog').collection('catalogNamesList').find().toArray(function(err, data) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        res.send(data);
    });
})

app.post('/catalog', function(req, res) {
    var name = req.body.name;
    dbClient.db('catalog').collection(name).find().toArray(function(err, data) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        res.send(data);
    });
})

app.post('/feedback', function(req, res) {
    var message = req.body;
    dbClient.db('feedback').collection('messages').insertOne(message, function(err, data) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        res.send(data);
    });
})

app.post('/order', function(req, res) {
    var order = req.body;
    dbClient.db('orders').collection('new_orders').insertOne(order, function(err, data) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        res.send(data);
    });
})









mongoClient.connect(function(err, client) {
    if (err) {
        return console.log(err);
    }
    dbClient = client;
    app.listen(port, function() {
        console.log('Server starts on port ' + port);
    });
});