const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllBookmarks = async () => {
  return await prisma.bookmark.findMany();
};

const addBookmark = async (bookmark) => {
  const newBookmark = await prisma.bookmark.create({
    data: {
      userId: bookmark.userId,
      userRecommendationId: bookmark.userRecommendationId,
    },
  });

  return newBookmark;
};

const deleteBookmark = async (id) => {
  const bookmark = await prisma.bookmark.findUnique({
    where: { id },
  });

  if (!bookmark) throw new Error("Bookmark not found");

  await prisma.bookmark.delete({
    where: { id },
  });

  return {
    message: "Bookmark deleted succesfully",
  };
};

module.exports = {
  getAllBookmarks,
  addBookmark,
  deleteBookmark,
};
