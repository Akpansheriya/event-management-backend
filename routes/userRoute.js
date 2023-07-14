const express = require("express");
const router = express.Router();
const userRouter = require("../controllers/userController");
const adminRouter = require("../controllers/adminController")
const eventRouter = require("../controllers/eventController")
const path = require("path");
const multer = require("multer");

const ProfileStorage = multer.diskStorage({
    destination: "./public",
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  const profileFilter = function (req, file, cb) {
    // Check if the file is an image and has a valid extension
    if (file.mimetype.startsWith('image/') && (file.originalname.endsWith('.png') || file.originalname.endsWith('.jpg'))) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file format. Only PNG and JPG images are allowed.')); // Reject the file
    }
  };
  const upload = multer({
    storage: ProfileStorage,
    limits: {
      fileSize: 52428800,
    },
    fileFilter:profileFilter
  });




//user ---------------
router.post("/signup", userRouter.signUp)
router.get("/verify/signup", userRouter.verify)
router.post("/signin", userRouter.signIn)
router.post("/verifyUser", userRouter.verifyUser)
router.get("/reset/password", userRouter.resetLink)
router.post("/setpassword/:_id", userRouter.setPassword)


//admin ---------------
router.post("/adminsignup", adminRouter.adminSignUp)
router.get("/verify/admin/signup", adminRouter.verify)
router.post("/admin/signin", adminRouter.adminSignIn)


//event----------------
router.post("/event/:_id", upload.single("file"),eventRouter.createEvent)
router.get("/getEvents", eventRouter.getEvents)
router.put("/joinevent/:_id", eventRouter.joinEvent)
router.put("/exitEvent/:_id", eventRouter.exitEvent)
router.delete("/deleteEvent/:_id",eventRouter.deleteEvent)
router.post("/excel/:adminId", eventRouter.createExcelfile)
router.get("/getEventByAdmin/:adminId", eventRouter.getEventByAdmin)
router.get("/getEventByUser/:userId", eventRouter.getEventByUser)

module.exports = router