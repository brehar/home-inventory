'use strict';

var db = require('../config/db');

exports.getItems = function(cb) {
    db.query('SELECT items.id, items.description, items.value, rooms.name AS room_name, rooms.id AS room_id, categories.name AS category_name, categories.id AS category_id FROM items LEFT JOIN rooms on items.room = rooms.id LEFT JOIN categories on items.category = categories.id', cb);
};

exports.getItemById = function(id, cb) {
    db.query(`SELECT items.id, items.description, items.value, rooms.name AS room_name, rooms.id AS room_id, categories.name AS category_name, categories.id AS category_id FROM items LEFT JOIN rooms on items.room = rooms.id LEFT JOIN categories on items.category = categories.id WHERE items.id = ${id}`, cb);
};

exports.getValueByItems = function(cb) {
    db.query('SELECT SUM(value) AS sum_value FROM items', cb);
};

exports.createItem = function(item, cb) {
    if (!item.description || !item.value || !item.category || !item.room) {
        return cb('Missing required field.');
    }

    db.query(`INSERT INTO items (description, category, value, room) VALUES ('${item.description}', '${item.category}', '${item.value}', '${item.room}')`, (err) => {
        if (err) return cb(err);

        db.query('SELECT items.id, items.description, items.value, rooms.name AS room_name, rooms.id AS room_id, categories.name AS category_name, categories.id AS category_id FROM items LEFT JOIN rooms on items.room = rooms.id LEFT JOIN categories on items.category = categories.id WHERE items.id = (SELECT MAX(id) FROM items)', cb);
    });
};

exports.removeItemById = function(id, cb) {
    if (!id) return cb('Item id required.');

    db.query(`DELETE FROM items WHERE id = ${id}`, function(err) {
        cb(err);
    });
};

exports.updateItemById = function(id, newItem, cb) {
    if (!id) return cb('Item id required.');

    if (!newItem.description || !newItem.value || !newItem.category || !newItem.room) {
        return cb('Missing required field.');
    }

    db.query(`UPDATE items SET description = '${newItem.description}', value = '${newItem.value}', category = '${newItem.category}', room = '${newItem.room}' WHERE id = ${id}`, cb);
};