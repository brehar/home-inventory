'use strict';

var db = require('../config/db');

exports.getCategories = function(cb) {
    db.query('SELECT * FROM categories', cb);
};

exports.getCategoryById = function(id, cb) {
    db.query(`SELECT * FROM categories WHERE id = ${id}`, cb);
};

exports.getValueByCategory = function(cb) {
    db.query('SELECT categories.name, items.category, SUM(items.value) AS category_value FROM items INNER JOIN categories on items.category = categories.id GROUP BY items.category', cb);
};

exports.createCategory = function(category, cb) {
    if (!category.name) {
        return cb('Missing required field.');
    }

    db.query(`INSERT INTO categories (name) VALUES ('${category.name}')`, (err) => {
        if (err) return cb(err);

        db.query('SELECT * FROM categories WHERE id = (SELECT MAX(id) FROM categories)', cb);
    });
};

exports.removeCategoryById = function(id, cb) {
    if (!id) return cb('Category id required.');

    db.query(`DELETE FROM categories WHERE id = ${id}`, function(err) {
        cb(err);
    });
};

exports.updateCategoryById = function(id, newCategory, cb) {
    if (!id) return cb('Category id required.');

    if (!newCategory.name) {
        return cb('Missing required field.');
    }

    db.query(`UPDATE categories SET name = '${newCategory.name}' WHERE id = ${id}`, cb);
};