import { ObjectId } from "mongodb";
import { Post } from "../model/Post.js";
import { User } from "../model/User.js";
import { Category } from "../model/Category.js";
import url from 'url';
import { postSchema } from "../schema/index.js";

export const getPosts = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const query = parseUrl.query;
  try {
    let limit = query.limit || 100;

    const posts = await Post.find()
      .populate({ path: "author", model: User, select: '_id name email photo' })
      .populate({ path: "categories", model: Category, select: '_id name description' })
      .sort({ createdAt: 'desc' })
      .limit(limit)
      .exec();

    res.status(200).json({ success: true, message: "Records found", posts });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { title, body, categories, photo, author } = req.body;

  const toSlug = (title) => title.toLowerCase().replace(/\s+/g, '-');
  const slug = toSlug(title);

  try {
    const { error } = postSchema.validate({ title, slug, body, categories, author });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const postExist = await Post.findOne({ title });
    if (postExist) return res.status(400).json({ success: false, message: "Post already exists" });

    const post = new Post({ title, slug, body, categories, photo, author });
    await post.save();

    res.status(200).json({ success: true, message: "Post created successfully", post });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPost = async (req, res) => {
  const slug = req.params.slug;
  try {
    const post = await Post.findOne({ slug })
      .populate({ path: "author", model: User, select: '_id name email photo' })
      .populate({ path: "categories", model: Category, select: '_id name description' });

    if (!post) return res.status(400).json({ success: false, message: `No post record found` });

    res.status(200).json({ success: true, message: `${post?.title} post found`, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getSinglePost = async (req, res) => {
  const slug = req.params.slug;
  try {
    const post = await Post.findOne({ slug });
    if (!post) return res.status(400).json({ success: false, message: `No post record found` });

    res.status(200).json({ success: true, message: `${post?.title} post found`, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const post_slug = req.params.slug;
  const { title, body, categories, photo, author } = req.body;
  const cate_id = new ObjectId(categories);
  const slug = title.toLowerCase().replace(/\s+/g, '-');

  try {
    const { error } = postSchema.validate({ title, slug, body, categories, author });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const updateData = { title, slug, body, categories: cate_id };
    if (photo?.length > 12) {
      updateData.photo = photo; // full Cloudinary URL
    }

    const updatedPost = await Post.findOneAndUpdate({ slug: post_slug }, updateData, { new: true });
    if (!updatedPost) return res.status(400).json({ success: false, message: "Failed to update post!" });

    await updatedPost.save();
    res.status(200).json({ success: true, message: "Post updated successfully!", updatedPost });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const slug = req.params.slug;
  try {
    const post = await Post.findOneAndDelete({ slug });
    if (!post) return res.status(400).json({ success: false, message: `Failed to delete post record` });

    res.status(200).json({ success: true, message: `Post deleted successfully`, data: post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  const { user_id, post_id } = req.body;
  const userId = new ObjectId(user_id);
  const postId = new ObjectId(post_id);

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    const alreadyLiked = post.likes.includes(userId);

    if (!alreadyLiked) {
      await post.updateOne({ $push: { likes: { $each: [userId], $position: 0 } } });
      await user.updateOne({ $push: { likes: { $each: [postId], $position: 0 } } });
      return res.status(200).json({ success: true, message: "Post was liked!" });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      await user.updateOne({ $pull: { likes: postId } });
      return res.status(200).json({ success: true, message: "Post was unliked!" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getLikedPosts = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const user_id = req.params.user_id;
  const query = parseUrl.query;
  const limit = query.limit || 100;

  try {
    const user = await User.findOne({ _id: user_id }).select('-password')
      .populate({
        path: "likes",
        model: Post,
        select: "_id title slug categories body photo createdAt",
        populate: [
          { path: "author", model: User, select: "_id name email photo" },
          { path: "categories", model: Category, select: "_id name" }
        ]
      })
      .limit(limit)
      .exec();

    if (!user) {
      return res.status(400).json({ success: false, message: 'Failed to fetch user liked posts!' });
    }

    res.status(200).json({ success: true, message: 'User liked posts found!', data: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getPostCountByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const count = await Post.countDocuments({ author: user_id });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to count posts.' });
  }
};

export const getLikePostCountByUser = async (req, res) => {
  try {
    const { post_id } = req.params;
    const count = await Post.countDocuments({ _id: post_id });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to count liked posts.' });
  }
};

export const getSearchPosts = async (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const query = parseUrl.query;
  const limit = query.limit || 100;
  const q = query.q;

  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
        { body: { $regex: q, $options: 'i' } }
      ]
    })
      .populate({ path: "author", model: User, select: '_id name email photo' })
      .populate({ path: "categories", model: Category, select: '_id name description' })
      .sort({ createdAt: 'desc' })
      .limit(limit)
      .exec();

    res.status(200).json({ success: true, message: "Records found", posts });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};