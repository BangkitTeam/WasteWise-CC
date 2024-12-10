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

const addCraft = async (crafts) => {
  if (!Array.isArray(crafts)) {
    crafts = [crafts];
  }

  try {
    const addedCrafts = [];
    for (const craft of crafts) {
      let { wasteType, title, description, imageUrl, tutorialUrl } = craft;
      let uploadedImageUrl = imageUrl;

      if (imageUrl) {
        try {
          const response = await axios({
            url: imageUrl,
            method: "GET",
            responseType: "stream",
          });

          const extension = path.extname(imageUrl).toLowerCase();
          const destination = `${Date.now()}${extension}`;

          uploadedImageUrl = await uploadToCloudStorage(response.data, destination);

        } catch (error) {
          throw new Error("Error uploading image to Cloud Storage: " + error.message);
        }
      }

      const addedCraft = await prisma.craft.create({
        data: {
          wasteType,
          title,
          description,
          imageUrl: uploadedImageUrl,
          tutorialUrl,
        },
      });

      addedCrafts.push(addedCraft);
    }

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
    });

    if (!craft) {
      throw new Error("Craft not found");
    }

    await prisma.craft.delete({
      where: { id },
    });

    return { message: "Craft deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting craft: " + error.message);
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

  let updatedImageUrl = imageUrl;

  if (imageUrl && imageUrl !== existingCraft.imageUrl) {
    try {
      const response = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream",
      });

      const extension = path.extname(imageUrl).toLowerCase();
      const destination = `${id}/${Date.now()}${extension}`;

      updatedImageUrl = await uploadToCloudStorage(response.data, destination);

    } catch (error) {
      throw new Error("Error uploading image to Cloud Storage: " + error.message);
    }
  }

  const updatedCraft = await prisma.craft.update({
    where: { id: Number(id) },
    data: {
      wasteType: wasteType || existingCraft.wasteType,
      title: title || existingCraft.title,
      description: description || existingCraft.description,
      imageUrl: updatedImageUrl || existingCraft.imageUrl,
      tutorialUrl: tutorialUrl || existingCraft.tutorialUrl,
    },
  });

  return updatedCraft;
};

module.exports = {
  addCraft,
  getCrafts,
  deleteCraft,
  updateCraft,
};
