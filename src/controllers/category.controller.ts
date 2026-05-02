import { Request, Response } from 'express';
import { createCategory, deleteCategoryById, getAllCategories, getCategoryById, updateCategoryById } from '../services/category.service';

export const getCategoriesController = async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategories(Number(req.userId));
        res.json({
            ok: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error al obtener categorías',
        });
    }
};

export const getCategoryController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const category = await getCategoryById(Number(id), Number(req.userId));

        if (!category) {
            return res.status(404).json({
                ok: false,
                message: 'Categoría no encontrada',
            });
        }

        res.json({
            ok: true,
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error al obtener categoría',
        });
    }
};

export const createCategoryController = async (
    req: Request<{}, {}, { name: string }>,
    res: Response
) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                ok: false,
                message: 'El nombre de la categoría es requerido',
            });
        }

        const category = await createCategory(Number(req.userId), name);

        res.status(201).json({
            ok: true,
            data: category,
            message: 'Categoría creada exitosamente',
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            message: error instanceof Error ? error.message : 'Error al crear categoría',
        });
    }
};

export const updateCategoryController = async (
    req: Request<{ id: string }, {}, { name: string }>,
    res: Response
) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                ok: false,
                message: 'El nombre de la categoría es requerido',
            });
        }

        const category = await getCategoryById(Number(id), Number(req.userId));

        if (!category) {
            return res.status(404).json({
                ok: false,
                message: 'Categoría no encontrada',
            });
        }

        const result = await updateCategoryById(Number(id), Number(req.userId), name);

        if (result.count === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Categoría no encontrada',
            });
        }

        res.json({
            ok: true,
            message: 'Categoría actualizada exitosamente',
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            message: error instanceof Error ? error.message : 'Error al actualizar categoría',
        });
    }
};

export const deleteCategoryController = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const { id } = req.params;

        const category = await getCategoryById(Number(id), Number(req.userId));

        if (!category) {
            return res.status(404).json({
                ok: false,
                message: 'Categoría no encontrada',
            });
        }

        const result = await deleteCategoryById(Number(id), Number(req.userId));

        if (result.count === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Categoría no encontrada',
            });
        }

        res.json({
            ok: true,
            message: 'Categoría eliminada exitosamente',
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Error al eliminar categoría',
        });
    }
};