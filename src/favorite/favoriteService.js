
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllFavorites = async () => {
    try {
        const allFavorites = await prisma.favorite.findMany({
            include: {
                userRecommendation: {
                    include: {
                        craft: true,
                    },
                },
            },
        });

        const formattedFavorites = allFavorites.map((favorite) => ({
            id: favorite.id,
            title: favorite.userRecommendation.craft.title,
            description: favorite.userRecommendation.craft.description,
            imageUrl: favorite.userRecommendation.craft.imageUrl || "",
        }));

        console.log("All favorites:", formattedFavorites);

        return formattedFavorites;
    } catch (error) {
        console.error("Error getting all favorites:", error);
        throw error;
    }
};

const getFavoritesById = async (userId) => {
    try {
        console.log("Fetching favorites for user:", userId);
        const favorites = await prisma.favorite.findMany({
            where: {
                userId: userId,
            },
            include: {
                userRecommendation: {
                    include: {
                        craft: true,
                    },
                },
            },
        });

        console.log("Raw favorites data:", favorites);

        const formattedFavorites = favorites.map((favorite) => ({
            id: favorite.id,
            title: favorite.userRecommendation.craft.title,
            description: favorite.userRecommendation.craft.description,
            imageUrl: favorite.userRecommendation.craft.imageUrl || "",
        }));

        console.log("Formatted favorites for user:", userId, formattedFavorites);

        return {
            user_id: userId,
            favorite: formattedFavorites,
        };
    } catch (error) {
        console.error("Error getting favorites by user ID:", error);
        throw error;
    }
};

const addFavorite = async (userId, recommendationId) => {
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const recommendationIdInt = parseInt(recommendationId);

        const userRecommendation = await prisma.userrecommendation.findFirst({
            where: {
                id: recommendationIdInt,
                userId: userId,
            },
        });

        if (!userRecommendation) {
            throw new Error("User recommendation not found.");
        }

        const existingFavorite = await prisma.favorite.findFirst({
            where: {
                userId: userId,
                userRecommendationId: userRecommendation.id,
            },
        });

        if (existingFavorite) {
            throw new Error("Craft already in favorites.");
        }

        const newFavorite = await prisma.favorite.create({
            data: {
                userId: userId,
                userRecommendationId: userRecommendation.id,
            },
            include: {
                userRecommendation: {
                    include: {
                        craft: true,
                    },
                },
            },
        });

        const formattedFavorite = {
            id: newFavorite.id,
            title: newFavorite.userRecommendation.craft.title,
            description: newFavorite.userRecommendation.craft.description,
            imageUrl: newFavorite.userRecommendation.craft.imageUrl || "",
        };

        console.log("New favorite created:", newFavorite);

        return {
            message: "Favorite successfully added",
            favorite: formattedFavorite,
        };
    } catch (error) {
        console.error("Error adding favorite:", error);
        throw error;
    }
};

const updateFavorite = async (userId, favoriteId, updatedData) => {
    try {
        const favoriteIdInt = parseInt(favoriteId);

        const existingFavorite = await prisma.favorite.findFirst({
            where: {
                id: favoriteIdInt,
                userId: userId,
            },
        });

        if (!existingFavorite) {
            throw new Error('Favorite not found.');
        }

        const updatedFavorite = await prisma.favorite.update({
            where: {
                id: favoriteIdInt,
            },
            data: updatedData,
        });

        console.log("Favorite updated:", updatedFavorite);

        return updatedFavorite;
    } catch (error) {
        console.error("Error updating favorite:", error);
        throw error;
    }
};

const deleteFavorite = async (userId, favoriteId) => {
    try {
        const favoriteIdInt = parseInt(favoriteId);

        const favorite = await prisma.favorite.findUnique({
            where: { id: favoriteIdInt },
        });

        if (!favorite) {
            throw new Error(`Favorite with ID ${favoriteIdInt} not found for user ${userId}`);
        }

        await prisma.favorite.delete({
            where: {
                id: favoriteIdInt,
                userId: userId,
            },
        });

        console.log(`Favorite with ID ${favoriteIdInt} deleted for user ${userId}`);
    } catch (error) {
        console.error("Error deleting favorite:", error);
        throw error;
    }
};

module.exports = {
    getAllFavorites,
    getFavoritesById,
    addFavorite,
    updateFavorite,
    deleteFavorite,
};
