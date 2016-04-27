'use strict';

const PORT = process.env.PORT || 3000;

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var Room = require('./models/room');
var Category = require('./models/category');
var Item = require('./models/item');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
    Room.getRooms((err, rooms) => {
        if (err) {
            res.status(400).send(err);
        } else {
            Category.getCategories((err, categories) => {
                if (err) {
                    res.status(400).send(err);
                } else {
                    Item.getItems((err, items) => {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            Room.getValueByRoom((err, roomValues) => {
                                if (err) {
                                    res.status(400).send(err);
                                } else {
                                    Category.getValueByCategory((err, categoryValues) => {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            Item.getValueByItems((err, itemValues) => {
                                                if (err) {
                                                    res.status(400).send(err);
                                                } else {
                                                    res.render('index', {rooms: rooms, categories: categories, items: items, roomValues: roomValues, categoryValues: categoryValues, itemValues: itemValues});
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});