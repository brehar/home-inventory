'use strict';

var express = require('express');
var router = express.Router();

var Room = require('../models/room');

router.route('/').get((req, res) => {
    Room.getRooms((err, rooms) => {
        if (err) return res.status(400).send(err);

        res.send(rooms);
    });
}).post((req, res) => {
    Room.createRoom(req.body, (err, newRoom) => {
        if (err) return res.status(400).send(err);

        res.send(newRoom);
    });
});

router.get('/values', (req, res) => {
    Room.getValueByRoom((err, roomValues) => {
        if (err) return res.status(400).send(err);

        res.send(roomValues);
    });
});

router.route('/:id').get((req, res) => {
    var id = req.params.id;

    Room.getRoomById(id, (err, room) => {
        if (err || !room) {
            return res.status(400).send(err || 'Room not found.');
        }

        res.send(room);
    });
}).put((req, res) => {
    var id = req.params.id;
    
    Room.updateRoomById(id, req.body, err => {
        res.send();
    });
}).delete((req, res) => {
    var id = req.params.id;
    
    Room.removeRoomById(id, err => {
        if (err) return res.status(400).send(err);
        
        res.send();
    });
});

module.exports = router;