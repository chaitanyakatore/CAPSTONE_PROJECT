import { Request, Response } from 'express';
import Design from '../models/designModel';

export const createDesign = async (req: Request, res: Response) => {
    const { designId, designTitle, description, createdById, createdByName } = req.body;
    const designInput = req.file; // File from the request

    try {
        // Create a new design object
        const newDesign = new Design({
            designId,
            designInput: designInput ? designInput.path : null, // Save the file path
            designTitle,
            description,
            createdById,
            createdByName,
        });
        
        await newDesign.save();
        res.status(201).json(newDesign);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const getDesigns = async (req: Request, res: Response) => {
    try {
        const designs = await Design.find();
        res.status(200).json(designs);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

// New method to get designs by createdById
export const getDesignsByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const designs = await Design.find({ createdById: userId }); // Adjust field name if necessary
        if (designs.length === 0) {
            return res.status(404).json({ message: 'No designs found for this user.' });
        }
        res.status(200).json(designs);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

// Update method remains unchanged
export const updateDesign = async (req: Request, res: Response) => {
    const { designId } = req.params;
    const { designInput, designTitle, description } = req.body;

    try {
        const updatedDesign = await Design.findByIdAndUpdate(designId, { designInput, designTitle, description }, { new: true });
        if (!updatedDesign) {
            return res.status(404).json({ message: 'Design not found' });
        }
        res.status(200).json(updatedDesign);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
