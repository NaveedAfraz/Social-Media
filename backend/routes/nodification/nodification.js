const express = require("express");
const {
  deleteNodification,
  FetchNodification,
  deleteNodificationID,
} = require("../../controller/nodification/nodification");
const { protectedRoute } = require("../../middleware/authReCheck");
const router = express.Router();

router.get("/FetchNodification", protectedRoute, FetchNodification);
router.delete("/DeleteNodification", protectedRoute, deleteNodification);
router.delete("/DeleteNodification/:id", protectedRoute, deleteNodificationID);
module.exports = router;
