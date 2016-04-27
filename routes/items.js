'use strict';

var express = require('express');
var router = express.Router();

var Item = require('../models/item');

router.route('/').get((req, res) => {
    Item.getItems((err, items) => {
        if (err) return res.status(400).send(err);

        res.send(items);
    });
}).post((req, res) => {
    Item.createItem(req.body, (err, newItem) => {
        if (err) return res.status(400).send(err);

        res.send(newItem);
    });
});

router.get('/values', (req, res) => {
    Item.getValueByItems((err, itemValues) => {
        if (err) return res.status(400).send(err);

        res.send(itemValues);
    });
});

router.route('/:id').get((req, res) => {
    var id = req.params.id;

    Item.getItemById(id, (err, item) => {
        if (err || !item) {
            return res.status(400).send(err || 'Item not found.');
        }

        res.send(item);
    });
}).put((req, res) => {
    var id = req.params.id;

    Item.updateItemById(id, req.body, err => {
        res.send();
    });
}).delete((req, res) => {
    var id = req.params.id;

    Item.removeItemById(id, err => {
        if (err) return res.status(400).send(err);

        res.send();
    });
});

module.exports = router;