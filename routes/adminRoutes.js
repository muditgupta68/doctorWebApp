const express = require('express');
const { getAllUsersData, getAllDoctorsData, changeAccountStatusController } = require('../controllers/adminController');
const { isAuthenticate, adminAuth } = require('../middleware/auth');
const adminRouter = express.Router();

adminRouter.route('/users').get(isAuthenticate,adminAuth,getAllUsersData);
adminRouter.route('/doctors').get(isAuthenticate,adminAuth,getAllDoctorsData);
adminRouter.route('/changeAccountStatus').post(isAuthenticate,adminAuth,changeAccountStatusController);

module.exports = adminRouter;