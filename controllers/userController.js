const AppointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const DoctorModel = require("../models/doctorModel");
const UserModel = require("../models/userModel");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ msg: `Invalid email or password`, status: false });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res
        .status(404)
        .json({ msg: `Invalid email or password`, status: false });
    }

    const token = await user.getJWTToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 60 * 60 * 1000
      ),
      httpOnly: false,
    };

    return res
      .status(200)
      .cookie("token", token, options)
      .json({
        msg: `Login Successful Successfully`,
        status: true,
        user: { name: user.name, email: user.email, loggedIn: true },
        token,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error: ${error.message}`, status: false });
  }
};

const registerUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(200)
        .json({ msg: `User Already exists`, status: false });
    }
    const newUser = new UserModel(req.body);
    await newUser.save();
    return res
      .status(201)
      .json({ msg: `Registered Successfully`, status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
  }
};

// get login-user ctrl
const getUserData = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ msg: `User Found`, status: true,user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error: ${error.message}`, status: false });
  }
};
// Unseen Notification ctrl
const unseenNotification = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user._id });
    let { notification } = user;
    user.seenNotification = notification;
    user.notification = [];
    const updatedUser = await user.save();
    return res.status(200).json({
      user: updatedUser,
      status: true,
      msg: "All Notifications are marked as seen! ",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error: ${error.message}`, status: false });
  }
};

// seen Notification ctrl
const seenNotification = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user._id });
    user.seenNotification = [];
    const updatedUser = await user.save();
    return res.status(200).json({
      user: updatedUser,
      status: true,
      msg: "Seen messages are cleared! ",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error: ${error.message}`, status: false });
  }
};

// logout feature ctrl
const logoutUser = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    return res.status(200).json({ msg: `User logged out`, status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
  }
};

// doctor notification ctrl
const doctorApplication = async (req, res) => {
  try {
    const { phone, prefix, consultationFees, achievements } = req.body;

    const Phone = "+" + prefix + "-" + phone;
    req.body.phone = Phone;
    req.body.consultationFees = parseInt(consultationFees);
    delete req.body.prefix;
    if (!achievements) {
      delete req.body.achievements;
    }
    req.body.userId = req.user._id;

    let newTime = [];

    req.body.timings.map((time) => {
      newTime.push(moment(time, "HH:mm").toISOString());
    });

    req.body.timings = newTime;

    // return res.json({check:moment(req.body.timings[1] ).format('HH:mm'),time:req.body.timings[1] });

    const newDoctor = await DoctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    // notification adding
    const adminUser = await UserModel.findOne({ admin: true });
    const { notification } = adminUser;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });

    await UserModel.findByIdAndUpdate(adminUser._id, { notification });
    return res.status(200).json({
      msg: `Application has been sent for approval to admin`,
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
  }
};

// get doctor data ctrl
const getDoctorData = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await DoctorModel.findOne({ userId: id });
    return res.status(200).json({ doctor, status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
  }
};
const doctorApprove = async (req, res) => {
  try {
    const doctor = await DoctorModel.find({ status: "approved" });
    return res.status(200).json({ doctor, status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
  }
};

// get single doctor data
const getSingleDoctorsData = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await DoctorModel.findOne({ _id: id });
    return res.status(200).json({ doctor, status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
  }
};

// get update doctor data ctrl
const updateDoctorData = async (req, res) => {
  try {
    const newVal = req.body;
    if (!newVal.achievements) newVal.achievements = "None";

    newVal.phone = "+" + newVal.prefix + "-" + newVal.phone;
    delete newVal.prefix;

    newVal.consultationFees = parseInt(newVal.consultationFees);
    newVal.experience = parseInt(newVal.experience);

    let newTime = [];

    newVal.timings.map((time) => {
      newTime.push(moment(time, "HH:mm").toISOString());
    });

    newVal.timings = newTime;

    // return res.json({newVal});
    // return res.json({check:moment(newTime[0]).format('HH:mm'),newTime});

    const updatedData = await DoctorModel.findOneAndUpdate(
      { userId: newVal.userId },
      { ...newVal }
    );

    return res
      .status(200)
      .json({ msg: "Profile Updated", status: true, updatedData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();

    // return res.json({check:moment(req.body.time ).format('HH:mm'),time:req.body.time });

    const newAppointment = new AppointmentModel(req.body);
    await newAppointment.save();

    const user = await UserModel.findOne({ _id: req.body.doctorInfo.userId });

    user.notification.push({
      type: "appoint-notification",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      data: {
        doctorId: req.body.userInfo._id,
        name: req.body.userInfo.name,
        onClickPath: "/user/appointments",
      },
    });

    await user.save();
    return res
      .status(200)
      .json({ msg: "Appointment Book success", status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
  }
};

const checkAvailability = async (req, res) => {
  try {
    let { date, time } = req.body;
    date = moment(date, "DD-MM-YYYY").toISOString();

    const fromTime = moment(time, "HH:mm").subtract(1, "hour").toISOString();
    const toTime = moment(time, "HH:mm").add(1, "hour").toISOString();
    const doctorId = req.body.docId;

    // return res.json({check:moment(toTime).format('HH:mm'),toTime});

    const appointment = await AppointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    // return res.json(appointment);

    if (appointment.length === 0) {
      return res
        .status(200)
        .json({ msg: "Appointment available", status: true, available: true });
    } else {
      return res
        .status(200)
        .json({
          msg: "Appointment not Available",
          fromTime,
          toTime,
          status: true,
          available: false,
        });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
  }
};

const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({
      userId: req.user._id,
    });
    res.status(200).json({
      status: true,
      msg: "Users Appointments Fetch SUccessfully",
      appointments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await DoctorModel.findOne({userId:req.user._id});
    const appointments = await AppointmentModel.find({
      doctorId: doctor._id,
    });
    return res.status(200).json({
      status: true,
      msg: "Users Appointments Fetch SUccessfully",
      appointments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
  }
};

const updateStatus = async(req,res)=>{
try {
  const { appointmentsId, status } = req.body;
  const appointments = await AppointmentModel.findByIdAndUpdate(
    appointmentsId,
    { status }
  );
  // return res.json(appointments,appointmentsId,status);
  const user = await UserModel.findOne({ _id: appointments.userId });

  user.notification.push({
    type: "status-updated",
    message: `Your appointment has been ${status}`,
    data: {
      doctorId: appointments.doctorId,
      name: req.user.name,
      onClickPath: "/appointments",
    },
  });

  await user.save();

  res.status(200).json({
    status: true,
    msg: "Status updated",
  });


} catch (error) {
  console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error:${error.message}`, status: false });
}
}



module.exports = {
  checkAvailability,
  doctorAppointmentsController,
  loginUser,
  updateStatus,
  registerUser,
  getUserData,
  logoutUser,
  doctorApplication,
  unseenNotification,
  seenNotification,
  getDoctorData,
  bookAppointmentController,
  getSingleDoctorsData,
  updateDoctorData,
  doctorApprove,
  userAppointmentsController
};
