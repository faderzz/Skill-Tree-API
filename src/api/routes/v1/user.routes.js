const express = require('express');
const userController = require('../../controllers/user.controller');

const router = express.Router();
const prefix = "/v1/users"

router.get(prefix + '/', userController.getUser);
router.post(prefix + '/', userController.createUser);
router.put(prefix + '/{id}', userController.updateUser);     // Obviously needs elevated perms
router.delete(prefix + '/{id}', userController.deleteUser);  // Obviosuly needs elevated perms

module.exports = router;