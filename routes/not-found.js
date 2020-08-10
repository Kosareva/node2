import express from 'express';
import {mapErrors} from '../utils.js';

const router = express.Router();

router.all('*', (req, res) => {
    res.status(404).json(mapErrors([{message: 'Route is not found'}]));
});

export default router;
