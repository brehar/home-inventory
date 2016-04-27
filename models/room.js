'use strict';

var db = require('../config/db');

exports.getRooms = function(cb) {
    db.query('SELECT * FROM rooms', cb);
};

exports.getRoomById = function(id, cb) {
    db.query(`SELECT * FROM rooms WHERE id = ${id}`, cb);
};

exports.getValueByRoom = function(cb) {
    db.query('SELECT rooms.name, items.room, SUM(items.value) AS room_value FROM items INNER JOIN rooms on items.room = rooms.id GROUP BY items.room', cb);
};

exports.createRoom = function(room, cb) {
    if (!room.name) {
        return cb('Missing required field.');
    }
    
    db.query(`INSERT INTO rooms (name) VALUES ('${room.name}')`, (err) => {
        if (err) return cb(err);
        
        db.query('SELECT * FROM rooms WHERE id = (SELECT MAX(id) FROM rooms)', cb);
    });
};

exports.removeRoomById = function(id, cb) {
    if (!id) return cb('Room id required.');
    
    db.query(`DELETE FROM rooms WHERE id = ${id}`, function(err) {
        cb(err);
    });
};

exports.updateRoomById = function(id, newRoom, cb) {
    if (!id) return cb('Room id required.');
    
    if (!newRoom.name) {
        return cb('Missing required field.');
    }
    
    db.query(`UPDATE rooms SET name = '${newRoom.name}' WHERE id = ${id}`, cb);
};