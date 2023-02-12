const DoctorModel = require("../models/doctorModel");
const UserModel = require("../models/userModel");

const getAllUsersData = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({ msg: `Users Found`, status: true, users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error: ${error.message}`, status: false });
  }
};
const getAllDoctorsData = async (req, res) => {
  try {
    const doctors = await DoctorModel.find();
    return res
      .status(200)
      .json({ msg: `Doctors Found`, status: true, doctors });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error: ${error.message}`, status: false });
  }
};
const changeAccountStatusController = async (req, res) => {
  try {
    const { docId, status } = req.body;

    const doctor = await DoctorModel.findOne({ _id: docId });
    if (!doctor) {
      return res
        .status(404)
        .json({ msg: `Doctors not requested`, status: false });
    }
    doctor.status = status;
    await doctor.save();

    const user = await UserModel.findOne({ _id: doctor.userId });
    if (doctor.status === "approved") {
      user.doctor = true;
    } else if (doctor.status !== "approved") {
      user.doctor = false;
    }

    user.notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status}`,
      data: {
        doctorId: doctor._id,
        name: doctor.firstName + " " + doctor.lastName,
        onClickPath: "/notification",
      },
    });
    await user.save();
    return res
      .status(200)
      .json({ msg: `Doctor Status changed: SUCCESS`, status: true, doctor });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: `Controller Error: ${error.message}`, status: false });
  }
};

module.exports = {
  getAllUsersData,
  getAllDoctorsData,
  changeAccountStatusController,
};
