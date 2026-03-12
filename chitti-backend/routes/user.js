const router = require('express').Router();

const authController = require('./../controllers/authController');
const userController = require('./../controllers/UserController');

router.use(authController.protect);

router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);
router.patch('/avatar', userController.updateAvatar);
router.patch('/password', userController.updatePassword);

router.get('/users', userController.getUsers);
router.post('/start-conversations', userController.startConversation);
router.get('/conversations', userController.getConversations);

module.exports = router;

