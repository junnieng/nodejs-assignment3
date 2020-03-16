const express = require('express');
const path = require('path');
const ejs = require('ejs');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const Image = require('./models/gallery.js');

//Express module

const app = express();

app.set ('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

app.use(express.static('public/images'));

//

const dbURI = process.env.MONGODB_URL;
mongoose.connect(dbURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;

db.on('error', function(error) {
    console.log(`Connected error: ${error.message}`);
});

db.once('open', function() {
    console.log('Connected to DB...');

});

//

const cors = require('cors');

corsOptions = {
    origin: "https://nodejs-assignment3.herokuapp.com/gallery",
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

//Endpoint handlers for index(homepage), gallery page and each pic of gallery

app.get ('/', function(req, res) {
    res.render('index', {title: 'Home'});
});

app.get ('/gallery', function(req, res) {
    Image.find(function(error, result) {
        res.locals.gallery= result;
        res.render('gallery', {title: 'Gallery'});
    })
    
});

app.get ('/gallery/:id', function(req, res, next) {
    Image.findOne({id: req.params.id}, function(error, result) {
        if (error) {
            return console.log(error);
        }

        res.locals.gallery= result;
        res.render('galleryId', {title: `${req.params.id}`})
    });
});


//Serve static assets from a public direction:
app.use(express.static(path.join(__dirname, 'public')));

//The css styling was not working for the image endpoint (galleryId.ejs) so I looked online and found this solution
app.use("/styles",express.static(__dirname + "/css"));

// Moment code for current year in footer
const moment = require('moment');

app.locals.year= () => {
    return moment().format('YYYY');
}

//Return 404 errors
app.use(function(req, res, next) {
    res.status(404);
    res.send('404: File Not Found');
});

//Start server
const port = process.env.PORT || 3000;
app.listen (port, () => console.log(`Listening on port ${port}...`));