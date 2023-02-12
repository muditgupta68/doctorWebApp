const express = require("express");
const {
  loginUser,
  registerUser,
  getUserData,
  logoutUser,
  doctorApplication,
  unseenNotification,
  seenNotification,
  getDoctorData,
  bookAppointmentController,
  updateDoctorData,
  getSingleDoctorsData,
  doctorApprove,
  checkAvailability,
  userAppointmentsController,
  doctorAppointmentsController,
  updateStatus,
} = require("../controllers/userController");
const { isAuthenticate } = require("../middleware/auth");

const UserRouter = express.Router();

// user routes
UserRouter.route("/login").post(loginUser);
UserRouter.route("/register").post(registerUser);
UserRouter.route("/")
  .post(isAuthenticate, getUserData)
  .patch(isAuthenticate, updateDoctorData);
UserRouter.route("/logout").post(isAuthenticate, logoutUser);

//notification routes
UserRouter.route("/clear-Unseen-message").post(
  isAuthenticate,
  unseenNotification
);
UserRouter.route("/clear-seen-message").post(isAuthenticate, seenNotification);
//apply for doctor route
UserRouter.route("/doctorApplication").post(isAuthenticate, doctorApplication);
// finding doctor using userId
UserRouter.route("/doctor/:id").post(isAuthenticate, getDoctorData);
UserRouter.route("/approvedDoc").post(isAuthenticate, doctorApprove);
// finding doctor using doctorId
UserRouter.route("/singleData/:id").post(isAuthenticate, getSingleDoctorsData);

//appointment routes
UserRouter.route("/appointment/new").post(
  isAuthenticate,
  bookAppointmentController
);

UserRouter.route("/bookAvailability/check").post(
  isAuthenticate,
  checkAvailability
);

UserRouter.route("/appointment").post(
  isAuthenticate,
  userAppointmentsController
);

UserRouter.route("/doctor/appointment/data").post(
  isAuthenticate,
  doctorAppointmentsController
);
UserRouter.route("/doctor/appointment/status").post(
  isAuthenticate,
  updateStatus
);



module.exports = UserRouter;
