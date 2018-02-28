const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.js');
const Twit = require('twit');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static('public'));

app.set('view engine', 'pug');

app.locals.moment = require('moment');

const mainRoutes = require('./routes');

var T = new Twit({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret,
    timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
});

app.use((req, res, next) => {
    T.get('statuses/user_timeline', { count: 5 }, function (err, data, response) {
        req.timeline = data;
        next();
    });
},
(req, res, next) => {
    T.get('friends/list', { count: 5 }, function (err, data, response) {
        req.friends = data;
        next();
    });
},
    //   (req, res, next) => {
    //     T.get('direct_messages/events/list', { count: 5 }, function (err, data, response) {
    //       req.messages = data;
    //     //   req.messages = JSON.stringify(req.messages);
    //     //   req.messages = JSON.parse(req.messages);
    //       console.log(req.messages);
    //       next();
    //     });
(req, res, next) => {
    T.get('direct_messages', { count: 5 }, function (err, data, response) {
        req.messages = data;
        //   req.messages = JSON.stringify(req.messages);
        //   req.messages = JSON.parse(req.messages);
        // console.log(req.messages);
        next();
    });
},
(req, res, next) => {
    T.get('account/verify_credentials', { skip_status: true }, function (err, data, response) {
        req.user = data;
        // req.name = data.name;        
        // req.screenName = data.screen_name;
        // req.profileImage = data.profile_image_url;
        //   console.log(JSON.stringify(req.user));
        next();
    });
});

app.use(mainRoutes);

//If you make it here, then there is no route, so serve a 404 error
app.use((req, res, next) => {
    const err = new Error("not found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
});

app.listen(3000);