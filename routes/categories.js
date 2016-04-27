'use strict';

var express = require('express');
var router = express.Router();

var Category = require('../models/category');

router.route('/').get((req, res) => {
    Category.getCategories((err, categories) => {
        if (err) return res.status(400).send(err);

        res.send(categories);
    });
}).post((req, res) => {
    Category.createCategory(req.body, (err, newCategory) => {
        if (err) return res.status(400).send(err);

        res.send(newCategory);
    });
});

router.get('/values', (req, res) => {
    Category.getValueByCategory((err, categoryValues) => {
        if (err) return res.status(400).send(err);

        res.send(categoryValues);
    });
});

router.route('/:id').get((req, res) => {
    var id = req.params.id;

    Category.getCategoryById(id, (err, category) => {
        if (err || !category) {
            return res.status(400).send(err || 'Category not found.');
        }

        res.send(category);
    });
}).put((req, res) => {
    var id = req.params.id;

    Category.updateCategoryById(id, req.body, err => {
        res.send();
    });
}).delete((req, res) => {
    var id = req.params.id;

    Category.removeCategoryById(id, err => {
        if (err) return res.status(400).send(err);

        res.send();
    });
});

module.exports = router;