const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema(
    {
        userId: {
          type: String,
          required: true,
        },
        doctorId: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          required: true,
          default: "pending",
        },
        time: {
          type: String,
          required: true,
        },
      },
      { timestamps: true }
    );

const AppointmentModel = mongoose.model("Appointments", appointmentSchema);
module.exports = AppointmentModel;