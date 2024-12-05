const { Router } = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");

const {
  addBookmark,
  getAllBookmarks,
  deleteBookmark,
} = require("./bookmarkService");

// GET ALL bookmarks
router.get("/", authenticateJWT, async (req, res, next) => {
  try {
    const bookmarks = await getAllBookmarks();
    res.status(200).json({
      data: bookmarks,
      message: "Succesfully get all data bookmarks",
    });
  } catch (error) {
    next(error);
  }
});

// ADD bookmarks
router.post("/", authenticateJWT, async (req, res) => {
  const bookmark = req.body;

  try {
    const addBookmarks = await addBookmark(bookmark);
    res.status(201).json({
      message: "Bookmark added succesfully",
      data: addBookmarks,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

//  DELETE bookmarks
router.delete("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const response = await deleteBookmark(Number(id));
    res.status(200).json({
      message: `Bookmark id ${id} deleted succesfully`,
      response,
    });
  } catch (error) {
    next(error);
  }
});
