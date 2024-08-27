const express = require("express")
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();


const HospitalRoutes = require("./routes/Hospital");
const ClinicRoutes = require("./routes/Clinic");
const PatientRoutes = require("./routes/Patient");
const DoctorRoutes = require("./routes/Doctor");




const app = express()
app.use(express.json());

// IMPORTANT IN DEV MODE
app.use(cors());

mongoose
  .connect(process.env.MONGO_SERVER)
  .then(console.log("connected to mongodb"))
  .catch((err) => console.log(err));

app.use("/api/hospital", HospitalRoutes);
app.use("/api/clinic", ClinicRoutes);
app.use("/api/patient", PatientRoutes);
app.use("/api/doctor", DoctorRoutes);



app.listen(4000,()=>{
    console.log("listening on port 4000")
})