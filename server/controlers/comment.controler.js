import {ObjectId} from 'mongodb';
import url from 'url';
import { Comment } from '../model/Comment.js';
import { Post } from '../model/Post.js';
import { User } from '../model/User.js';


export const getComments = async (req, res) => {
    const parseUrl = url.parse(req.url);
    const query = parseUrl.query;
    const postId = req.params.post_id;
    const post_id = new ObjectId(postId);

    try {
        let limit = query.limit;
        if(limit = undefined){ limit = 50 }

        const comments = await Comment.find({ postId })
            .populate({
                path: "author",
                model: User,
                select: '_id name email photo'
            })
            .sort({ createdAt: 'desc' })
            .limit(limit)
            .exec();

            if(!comments){
                return res.status(400).json({
                    success: false, message: 'No comments found'
                });
            }
            res.status(200).json({
                success: true, message: 'Comments found', posts
            })

    } catch (error) {
        return res.status(400).json({
            success: false, message: error.message
        });
    }
}

export const addComment = async (req, res) => {
    const { comment, user_id, post_id } = req.body;
    const userId = new ObjectId(user_id);
    const postId = new ObjectId(post_id);

    try {
        const post = await Post.findById(postId);
        if(!post){
            return res.status(400).json({
                success: false, message: "post not found"
            });
        }

        const post_comment = await Comment.create(
            { postId, comment, author: user_id }
        );
        if( post_comment ) {
            const updatePost = await post.updateOne(
                { $push: { cpmments: {$each: [post_comment._id], $position:0 } } }
            );

            if(updatePost){
                res.status(200).json({
                    success: true, message: "Comment posted successfully"
                })
            }else{
                res.status(400).json({
                    success: false, message: "Fail to add comment to post"
                })
            }
        }
    } catch (error) {
        return res.status(400).json({
            success: false, message: error.message
        })
    }
}

export const getCommentCountByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const count = await Comment.countDocuments({ author: user_id });
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error('Error counting posts:', error);
    res.status(500).json({ success: false, message: 'Failed to count posts.' });
  }
};
