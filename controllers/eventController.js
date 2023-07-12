
const admin = require("../models/admin");
const event = require("../models/event");
const excel4node = require("excel4node");

const createEvent = async (req, res) => {
  const exist = await admin.findOne({ _id: req.params._id });
  console.log("exist", exist);
  if (exist === null) {
    res.status(400).send("admin not exist");
  } else {
    const eventData = new event({
      adminId: exist._id,
      eventName: req.body.eventName,
      location: req.body.location,
      image:
        req.protocol +
        "://" +
        req.get("host") +
        `/profile/${req.file.filename}`,
      startDate: new Date(),
      endDate: new Date(),
    });
    const event = await eventData.save();
    res.status(200).send(event);
  }
};

const getEvents = async (req, res) => {
  const eventData = await event.find();
  res.status(200).send(eventData);
};

const joinEvent = async (req, res) => {
  const exist = await event.find({
    _id: req.params._id,
    "users.userId": req.body.userId,
  });
  console.log("exist", exist);
  if (exist.length > 0) {
    res.status(400).send("you have already joined this event");
  } else {
    await event
      .findOneAndUpdate(
        { _id: req.params._id },
        {
          $push: {
            users: {
              userId: req.body.userId,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              age: req.body.age,
            },
          },
        }
      )
      .then((result) => {
        res.status(200).send(result);
      });
  }
};

const exitEvent = async (req, res) => {
  await event
    .updateOne(
      { _id: req.params._id, "users.userId": req.body.userId },
      { $pull: { users: { userId: req.body.userId } } },
      { safe: true, upsert: true }
    )
    .then((result) => {
      res.status(200).send(result);
    });
};

const deleteEvent = async (req, res) => {
  const deletedData = await event.findOneAndDelete({ _id: req.params._id });
  res.status(200).send({
    message: "event deleted",
    deletedData: deletedData,
  });
};

const createExcelfile = async (req, res) => {
  try {
    const events = await event.find({
      adminId: req.params.adminId,
      _id: req.body._id,
    });

    // Create a new workbook
    const workbook = new excel4node.Workbook();

    events.forEach((event, index) => {
      const { eventName, users } = event;

      // Create a new worksheet
      const worksheet = workbook.addWorksheet(`Event ${index + 1}`);

      // Set column headers
      worksheet.cell(1, 1).string("First Name");
      worksheet.cell(1, 2).string("Last Name");
      worksheet.cell(1, 3).string("Age");

      // Add user data to the worksheet
      users.forEach((user, rowIndex) => {
        worksheet.cell(rowIndex + 2, 1).string(user.firstName);
        worksheet.cell(rowIndex + 2, 2).string(user.lastName);
        worksheet.cell(rowIndex + 2, 3).number(user.age);
      });

      // Rename the worksheet to the event name
      worksheet.name = eventName;
      console.log(" worksheet", worksheet.name);
    });

    events.map((v) => {
      if (v.eventName) {
        return (eventName = v.eventName);
      }
    });

    const filePath = `excel/${eventName}.xlsx`;
    workbook.write(filePath);

    console.log(`Excel sheet created at ${filePath}`);
    res.status(200).send("File created");
    const data = await event.find({
      adminId: req.params.adminId,
      _id: req.body._id,
    });
    console.log(data, "--------====");
    data.excelFile =
      req.protocol + "://" + req.get("host") + `/excel/${eventName}.xlsx`;
    data.save().then((result) => {
      res.status(200).send({
        message: "file updated",
        result: result,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getEventByAdmin = async (req,res) => {
    const list = await event.find({adminId:req.params.adminId})
    res.status(200).send(list)
}

// Call the createExcelfile function

module.exports = {
  createEvent,
  getEvents,
  joinEvent,
  exitEvent,
  deleteEvent,
  createExcelfile,
  getEventByAdmin
};
