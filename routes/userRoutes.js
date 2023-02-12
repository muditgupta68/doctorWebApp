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
  .get(isAuthenticate, getUserData)
  .patch(isAuthenticate, updateDoctorData);
UserRouter.route("/logout").get(isAuthenticate, logoutUser);

//notification routes
UserRouter.route("/clear-Unseen-message").post(
  isAuthenticate,
  unseenNotification
);
UserRouter.route("/clear-seen-message").post(isAuthenticate, seenNotification);

//apply for doctor route
UserRouter.route("/doctorApplication").post(isAuthenticate, doctorApplication);
UserRouter.route("/doctor/:id").get(isAuthenticate, getDoctorData);
UserRouter.route("/approvedDoc").post(isAuthenticate, doctorApprove);
UserRouter.route("/singleData/:id").get(isAuthenticate, getSingleDoctorsData);

//appointment routes
UserRouter.route("/appointment/new").post(
  isAuthenticate,
  bookAppointmentController
);

UserRouter.route("/bookAvailability/check").post(
  isAuthenticate,
  checkAvailability
);

UserRouter.route("/appointment").get(
  isAuthenticate,
  userAppointmentsController
);

UserRouter.route("/doctor/appointment/data").get(
  isAuthenticate,
  doctorAppointmentsController
);
UserRouter.route("/doctor/appointment/data").post(
  isAuthenticate,
  updateStatus
);



module.exports = UserRouter;
