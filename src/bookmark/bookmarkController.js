const { Router } = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");

const {
  addBookmark,
  getAllBookmarks,
  deleteBookmark,
} = require("./bookmarkService");

// GET ALL bookmarks
router.get("/", authenticateJWT, async (req, res) => {});

// ADD bookmarks
router.post("/", authenticateJWT, async (req, res) => {});

//  DELETE bookmarks
router.delete("/:id", authenticateJWT, async (req, res) => {});
