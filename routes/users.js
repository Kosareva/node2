import express from 'express';
import userSchema from '../schema/user.js'
import requestSchema from '../schema/request-query.js'
import {mapErrors, validateSchema} from "../utils.js";
import {v4 as uuid} from 'uuid';
import bcrypt from 'bcrypt';
import dbClient from '../db/db-client.js';

const router = express.Router();
const saltRounds = 10;

router.get('/', validateSchema(requestSchema, 'query'), (req, res) => {
    const usersColl = dbClient.collection('users');
    const users = usersColl.getAll({...req.query, searchBy: 'login'});
    res.json(users);
}, (err, req, res, next) => {
    const errors = [{message: 'Can not get users: ' + err}];
    res.status(500).json(mapErrors(errors));
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const usersColl = dbClient.collection('users');
    const user = usersColl.get(id);
    if (!user) {
        res.status(404).json(mapErrors([{message: 'User is not found'}]));
    } else {
        res.json(user);
    }
}, (err, req, res, next) => {
    const errors = [{message: 'Can not get user: ' + err}];
    res.status(500).json(mapErrors(errors));
});

router.post('/', validateSchema(userSchema), (req, res) => {
    const {login, password, age} = req.body;
    const id = uuid();
    const passwordHash = bcrypt.hashSync(password, saltRounds);
    const user = {id, login, password: passwordHash, age};
    const usersColl = dbClient.collection('users');
    const addedUser = usersColl.add(user);
    res.json(addedUser);
}, (err, req, res, next) => {
    const errors = [{message: 'Can not create user: ' + err}];
    res.status(500).json(mapErrors(errors));
});

router.put('/:id', validateSchema(userSchema, 'body', {isUpdate: true}), (req, res) => {
    const id = req.params.id;
    const {password, age} = req.body;
    const usersColl = dbClient.collection('users');
    const user = usersColl.update(id, {
        ...password && {password},
        ...age && {age},
    });
    if (!user) {
        res.status(404).json(mapErrors([{message: 'User is not found'}]));
    } else {
        res.json(user);
    }
}, (err, req, res, next) => {
    const errors = [{message: 'Can not update user: ' + err}];
    res.status(500).json(mapErrors(errors));
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const usersColl = dbClient.collection('users');
    const user = usersColl.remove(id);
    if (!user) {
        res.status(404).json(mapErrors([{message: 'User is not found'}]));
    } else {
        res.json(user);
    }
}, (err, req, res, next) => {
    const errors = [{message: 'Can not delete user: ' + err}];
    res.status(500).json(mapErrors(errors));
});

export default router;
