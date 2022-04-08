const express = require('express');
const skillRouter = require('./v1/skill.routes');

const router = express.Router();

router.use('/v1/skills', skillRouter);

module.exports = router;
