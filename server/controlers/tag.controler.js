import { Tag } from "../model/Tag.js";
import { ObjectId } from 'mongodb';

export const getTags = async(req, res) => {
    try {
        const tag = await Tag.find();
        if (tag) {
            return res.status(200).json({
                success: true, message: 'Tag found successfully',
                data: tag
            });
        }
        return res.status(200).json({
            success: false, message: 'No tag found'
        });
    } catch (error) {
        return res.status(400).json({
            success: false, message: error.message
        });
    }
}

export const createTag = async(req, res) => {
    const { name, description } = req.body;
    if(!name || !description){
        throw new Error("All fields are required!");
    }

    try {
        const tagExist = await Tag.findOne({name});
        if(tagExist){
            res.status(400).json({
                success: false, message: 'Tag already exists'
            });
        }

        const tag = new Tag({ name, description });
        await tag.save();

        res.status(201).json({
            success: true, message: `${name} tag created successfully`,
            data: tag
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getTag = async(req, res) => {
    const tag_id = new ObjectId(req.params.tag_id);
    try {
        if(!tag_id) {
            throw new Error('Tag ID is required');
        }

        const tag = await Tag.findById({_id: tag_id});
        if(!tag){
           return res.status(400).json({
                success: false, message: `tag not found successfully`,
                data: tag
            });
        }
        res.status(200).json({
            success: true, message: `${tag?.name} tag found successfully`,
            data: tag
        });
    } catch (error) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
}

export const updateTag = async(req, res) => {
    const tag_id = new ObjectId(req.params.tag_id);
    if(!tag_id) {
        throw new Error('Tag ID is required');
    }
    const { name, description } = req.body;
    try {
        if(!name || !description){
            throw new Error("All fields are required!");
        }

        const tag = await Tag.findOneAndUpdate({_id: tag_id},
            {name, description}, {new: true,}
        );
        if(!tag){
           return res.status(400).json({
                success: false, message: `Failed to update tag record`,
                data: tag
            });
        }
        await tag.save();
        res.status(200).json({
            success: true, message: `category tag successfully`,
            data: tag
        });
    } catch (error) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
}

export const deleteTag = async(req, res) => {
    const tag_id = new ObjectId(req.params.tag_id);
    if(!tag_id) {
        throw new Error('Tag ID is required');
    }
    try {

        const tag = await Tag.findOneAndDelete({_id: tag_id}
        );
        if(!tag){
           return res.status(400).json({
                success: false, message: `Failed to delete tag record`,
                data: tag
            });
        }
        res.status(200).json({
            success: true, message: `tag deleted successfully`,
            data: tag
        });
    } catch (error) {
        res.status(400).json({
            success: false, message: error.message
        });
    }
}