const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  projectId: "bangkit-capstone-441807",
  keyFilename: path.join(__dirname, "../../sv-key.json"),
});
const bucketName = "craft_picture";

const downloadImage = async (url) => {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  return response.data;
};

const uploadToCloudStorage = async (stream, destination) => {
  try {
    const file = storage.bucket(bucketName).file(destination);
    const writeStream = file.createWriteStream({
      resumable: false,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    stream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
    return publicUrl;
  } catch (error) {
    throw new Error("Error uploading image to Cloud Storage: " + error.message);
  }
};

const updateCraft = async (id, craft) => {
  const { wasteType, title, description, imageUrl, tutorialUrl } = craft;

  const existingCraft = await prisma.craft.findUnique({
    where: { id: Number(id) },
  });

  if (!existingCraft) {
    throw new Error(`Craft with ID ${id} not found`);
  }

  let updatedImageUrl = imageUrl || existingCraft.imageUrl;

  if (imageUrl && imageUrl !== existingCraft.imageUrl) {
    const imageStream = await downloadImage(imageUrl);
    const extension = path.extname(imageUrl).toLowerCase();
    const destination = `${craft.wasteType}/${Date.now()}${extension}`;
    updatedImageUrl = await uploadToCloudStorage(imageStream, destination);
  }

  const transactionResult = await prisma.$transaction(async (prisma) => {
    const updatedCraft = await prisma.craft.update({
      where: { id: Number(id) },
      data: {
        wasteType: wasteType || existingCraft.wasteType,
        title: title || existingCraft.title,
        description: description || existingCraft.description,
        imageUrl: updatedImageUrl,
        tutorialUrl: tutorialUrl || existingCraft.tutorialUrl,
      },
    });

    const userRecommendations = await prisma.userrecommendation.findMany({
      where: { craftId: Number(id) },
    });

    const userRecommendationIds = userRecommendations.map((rec) => rec.id);

    if (userRecommendationIds.length > 0) {
      await prisma.userrecommendation.updateMany({
        where: { craftId: Number(id) },
        data: { updatedAt: new Date() },
      });
    }

    return updatedCraft;
  });

  return transactionResult;
};

const addCraft = async (crafts) => {
  if (!Array.isArray(crafts)) {
    crafts = [crafts];
  }

  try {
    for (let craft of crafts) {
      const { imageUrl } = craft;
      if (imageUrl) {
        const imageStream = await downloadImage(imageUrl);
        const extension = path.extname(imageUrl).toLowerCase();
        const destination = `${craft.wasteType}/${Date.now()}${extension}`;
        craft.imageUrl = await uploadToCloudStorage(imageStream, destination);
      }
    }

    const addedCrafts = await prisma.craft.createMany({
      data: crafts,
      skipDuplicates: true,
    });

    return addedCrafts;
  } catch (error) {
    throw new Error("Error adding crafts: " + error.message);
  }
};

const getCrafts = async () => {
  try {
    return await prisma.craft.findMany({
      include: {
        userrecommendations: true,
      },
    });
  } catch (error) {
    throw new Error("Error fetching crafts: " + error.message);
  }
};

const deleteCraft = async (id) => {
  try {
    const craft = await prisma.craft.findUnique({
      where: { id },
      include: {
        userrecommendations: true,
      },
    });

    if (!craft) {
      throw new Error("Craft not found");
    }

    const userRecommendationIds = craft.userrecommendations.map((rec) => rec.id);

    await prisma.favorite.deleteMany({
      where: {
        userRecommendationId: { in: userRecommendationIds },
      },
    });

    await prisma.history.deleteMany({
      where: {
        userRecommendationId: { in: userRecommendationIds },
      },
    });

    await prisma.userrecommendation.deleteMany({
      where: { craftId: id },
    });

    await prisma.craft.delete({
      where: { id },
    });

    return { message: "Craft and related data deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting craft: " + error.message);
  }
};

module.exports = {
  addCraft,
  getCrafts,
  deleteCraft,
  updateCraft,
};
