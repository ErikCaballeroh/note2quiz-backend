import prisma from '../prisma/client';

export const getAllCategories = async (userId: number) => {
    try {
        return await prisma.category.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
        });
    } catch (error) {
        throw new Error(`Error al obtener categorías: ${error}`);
    }
};

export const getCategoryById = async (id: number, userId: number) => {
    try {
        return await prisma.category.findFirst({
            where: { id, userId },
        });
    } catch (error) {
        throw new Error(`Error al obtener categoría: ${error}`);
    }
};

export const createCategory = async (userId: number, name: string) => {
    const normalizedName = name.trim();

    try {
        const existingCategory = await prisma.category.findFirst({
            where: {
                userId,
                name: normalizedName,
            },
        });

        if (existingCategory) {
            throw new Error('Ya existe una categoría con ese nombre');
        }

        return await prisma.category.create({
            data: {
                name: normalizedName,
                userId,
            },
        });
    } catch (error) {
        throw new Error(`Error al crear categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};

export const updateCategoryById = async (id: number, userId: number, name: string) => {
    const normalizedName = name.trim();

    try {
        const existingCategory = await prisma.category.findFirst({
            where: {
                userId,
                name: normalizedName,
                NOT: {
                    id,
                },
            },
        });

        if (existingCategory) {
            throw new Error('Ya existe una categoría con ese nombre');
        }

        return await prisma.category.updateMany({
            where: { id, userId },
            data: {
                name: normalizedName,
            },
        });
    } catch (error) {
        throw new Error(`Error al actualizar categoría: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};

export const deleteCategoryById = async (id: number, userId: number) => {
    try {
        return await prisma.category.deleteMany({
            where: { id, userId },
        });
    } catch (error) {
        throw new Error(`Error al eliminar categoría: ${error}`);
    }
};