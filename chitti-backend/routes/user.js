const router = require('express').Router();

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

router.use(authController.protect);

router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);
router.patch('/avatar', userController.updateAvatar);
router.patch('/password', userController.updatePassword);

router.get('/users', userController.getUsers);
router.post('/start-conversations', userController.startConversation);
router.get('/conversations', userController.getConversations);
router.post('/group', userController.createGroup);
router.post('/block', userController.blockUser);
router.post('/unblock', userController.unblockUser);
router.get('/search-messages', userController.searchMessages);
router.get('/unread-count', userController.getUnreadCount);

module.exports = router;

