
const express = require("express");
const {
  createRoom,
  getRooms,
  renameRoom,
  deleteRoom,
}= require("../controllers/roomController.js");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();  
// 
router.post("/create", authMiddleware, createRoom);
router.get("/list", authMiddleware, getRooms);
router.patch("/:roomId", authMiddleware, renameRoom);
router.delete("/:roomId", authMiddleware, deleteRoom);

module.exports = router;
