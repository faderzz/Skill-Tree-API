const express = require('express');
const userController = require('../../controllers/user.controller');

const router = express.Router();
const prefix = "/v1/users"

router.get(prefix + '/', userController.getUser);
router.post(prefix + '/', userController.createUser);
router.put(prefix + '/{id}', userController.updateUser);     
router.delete(prefix + '/{id}', userController.deleteUser);  

module.exports = router;