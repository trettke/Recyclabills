var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Pin = require('pinjs');
var fs = require('fs');
var forceSSL = require('force-ssl');
//var http = require('http');
//var https = require('https');
var mandrill = require('mandrill-api/mandrill');

var routes = require('./routes/index');
var users = require('./routes/users');

//var ssl_options = {
//    key: fs.readFileSync('./keys/private.key'),
//    cert: fs.readFileSync('./keys/cert.crt'),
//    ca: fs.readFileSync('./keys/intermediate.crt')
//};

var app = express();

//var server = http.createServer(app);
//var secureServer = https.createServer(ssl_options, app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(forceSSL);

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(express.bodyParser());
//app.use(app.router);

//http.get('*', function(req, res) {
//    res.redirect('https://recyclabills.com'+req.url);
//});

app.use('/users', users);
app.post('/process', function(req, res) {
    var pin = Pin.setup({
        //PROD KEY
        key: 'Psq-3nQ84ip_UIJ3IVR5AA',

        //TEST KEY
        //key: 'rkNspqDmfys1P5Clye93Mw',
        production: true
    });

    var value = req.body.quantity * 1000;

    pin.createCharge({
        amount: value,
        description: 'Recyclabills Order',
        email: req.body.email,
        ip_address: '203.192.1.172',
        card: {
            number: req.body.cardnumber,
            expiry_month: req.body.expiryMonth,
            expiry_year: req.body.expiryYear,
            cvc: req.body.cvc,
            name: req.body.cardname,
            address_line1: req.body.address1,
            address_city: req.body.city,
            address_postcode: req.body.postcode,
            address_state: req.body.state,
            address_country: 'AU'
        }
    }, function (response) {
        if (response.error) {
            console.log(response.body);
            res.redirect('/failure.html')
        } else {
            fs.readFile('./public/billing.html', function(err, data) {

                var m = new mandrill.Mandrill('EQ8CPpL41GD7GqtZpBoQxA');

                var params = {
                    "message": {
                        "from_email":"info@recyclabills.com",
                        "to":[{"email":"taylor.rettke@gmail.com"}, {"email":"orders@recyclabills.com"}, {"email":req.body.email}],
                        "subject": "Get Excited - Recyclabills are Coming",
                        "global_merge_vars" : [
                            {"name" : "name",
                                "content" : req.body.first + ' ' + req.body.last},
                            {"name" : "classic",
                                "content" : req.body.classic},
                            {"name" : "bifold",
                                "content" : req.body.bifold},
                            {"name" : "quantity",
                                "content" : req.body.quantity},
                            {"name" : "total",
                                "content" : "$" + value},
                            {"name" : "address",
                                "content" : req.body.address1 + '<br>' + req.body.address2 + '<br>' + req.body.city
                                    + '<br>' + req.body.state +', ' + req.body.postcode}
                        ],
                        /*"text": "Product: " + fields.product + "\n"
                         + "Quantity: " + fields.quantity + "\n"
                         + "Name: " + fields.firstName + " " + fields.lastName + "\n"
                         + "Address: " + fields.address1 + "\n" + fields.address2 + "\n" + fields.address3 + "\n"
                         + fields.city + "\n" + fields.state + "\n" + fields.postcode*/
                        "html" : data.toString()
                    }
                };

                m.messages.send(params, function(res) {
                    console.log(JSON.stringify(res));
                }, function(err) {
                    console.log(JSON.stringify(err));
                });

            });

            console.log(response.body);
            res.redirect('success.html');
        }
    });
});

app.use("/", express.static(__dirname));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//app.listen(4000);
//http.listen(3001);
//secureServer.listen(443);
//server.listen(80);

module.exports = app;


