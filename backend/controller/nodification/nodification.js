const Nodification = require("../../models/nodification");
const mongoose = require("mongoose"); // Import mongoose

const FetchNodification = async (req, res) => {
  try {
    const userid = req.User._id;
    console.log("Original userid:", userid);

    if (!userid) {
      return res.status(400).json({ message: "USER ID IS REQUIRED" });
    }

    // Try querying without toString()
    const nodification = await Nodification.find({
      receiverId: userid, // Remove toString()
    }).populate({
      path: "senderId",
      select: "username profilePic",
    });

    console.log("Query result:", nodification);
    console.log("Query parameters:", {
      receiverId: userid,
    });

    // Add a direct database check
    // const allNodifications = await Nodification.find({});
    // console.log("All notifications in DB:", allNodifications);

    if (nodification.length === 0) {
      return res.status(404).json({ message: "NODIFICATION NOT FOUND" });
    }

    const read = await Nodification.updateMany(
      { receiverId: userid },
      { isRead: true }
    );

    return res.status(200).json(nodification);
  } catch (error) {
    console.log("Error details:", error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

const deleteNodification = async (req, res) => {
  try {
    const userid = req.User._id;
    console.log("userid is this", userid);
    if (!userid)
      return res.status(400).json({ message: "USER ID IS REQUIRED" });

    const deleteNodification = await Nodification.deleteMany({
      receiverId: userid,
    });
    console.log(deleteNodification);
    if (deleteNodification.deletedCount === 0) {
      return res.status(403).json({ message: "NO NODIFICATION TO BE DELETED" });
    }

    return res
      .status(200)
      .json({ message: "NODIFICATION DELETED SUCCESSFULLY" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

const deleteNodificationID = async (req, res) => {
  const userid = req.User._id;
  console.log("userid is this", userid);

  if (!userid) return res.status(400).json({ message: "USER ID IS REQUIRED" });

  const deleteID = req.params.id;
  if (!deleteID)
    return res.status(400).json({ message: "DELETE ID IS REQUIRED" });
  try {
    const deleteNodification = await Nodification.deleteOne({ _id: deleteID });
    if (deleteNodification.deletedCount === 0) {
      console.log("no deleted");
      return res.status(404).json({ message: "NODIFICATION NOT FOUND" });
    }
    return res
      .status(200)
      .json({ message: "NODIFICATION DELETED SUCCESSFULLY" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

module.exports = {
  FetchNodification,
  deleteNodification,
  deleteNodificationID,
};
