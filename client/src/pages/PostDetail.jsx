import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import samplePostImage from '../assets/images/sample.jpg';
import MainLayout from '../components/MainLayout'
import PostCardSkeleton from "../components/post/PostCardSkeleton";
import SuggestedPosts from "../components/post/SuggestedPosts";
import SocialShareButtons from "../components/SocialShareButtons";
import { FaCalendarAlt, FaCheckCircle, FaComments, FaCubes, FaHeart, FaInfoCircle, FaPen, FaShareAlt, FaTrash, FaUser } from "react-icons/fa";
import CommentForm from "../components/comment/CommentForm";
import Comments from "../components/comment/Comments";
import useSWR from 'swr';
import { formatDateString } from "../utils";
import axios from "axios";
import toast from "react-hot-toast";

const PostDetail = () => {

  const URL = process.env.REACT_APP_BASE_URL;
  const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL;

  let user = localStorage.getItem('user');
  user = JSON.parse(user);
  const user_id = user?._id;
  const params = useParams();
  const slug = params?.slug;
  const post_id = params?.post_id;

    const navigate = useNavigate();

    const [comment, setComment] = useState('');
    let res;
    
 
  // console.log("IMGurl : ", imgPath);

  // FETCHING SINGLE POST    
  const fetcher = (...args) => fetch(...args, {headers: {'Authorization': `Bearer ${user.token}`}}).then((Response) => Response.json());
  const { data: post, mutate: post_mutate, error: post_error, isLoading: post_isLoading } = useSWR(`${URL}/posts/${slug}`, fetcher);
  const { data: posts, mutate: posts_mutate, error: posts_error, isLoading: posts_isLoading } = useSWR(`${URL}/posts?limit=3`, fetcher);
  const { data: comments, mutate: comments_mutate, error: comments_error, isLoading: comments_isLoading } = useSWR(`${URL}/comments/${post_id}?limit=3`, fetcher);

  const imgPath = UPLOAD_URL + post?.data?.photo; 

// console.log("POST : ", posts)


    // FETCHING SUGGESTED POST
    




  // DELETE POST
  const gotoPostPage = () => { return navigate(`/`); }


  const handleRemovePost = (e) => {
    e.preventDefault();
    // return console.log("Image URL : ", post?.post?.photo);
    
    let answer;
    answer = window.confirm('Are you sure you want to remove post ?');
    if (answer) {
      removePost();
    }
  }

  const removePost = async () => {
    try {
        const resp = await fetch(`${URL}/posts/${slug}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${user.token}`
            },
        });
        res = await resp.json();
        if (res) {  
            toast.success(res.message);
            setTimeout(gotoPostPage, 3000);
        }
        else{
          toast.error(res.message);
        }
    } catch (err) {
        toast.error("Error while removing post ", err); 
        console.log("Error while removing post ", err); 
    }
  }



  // LIKE AND UNLIKE POST
  const handleLikeUnlikePost = () => {
    let answer;
    
    answer = window.confirm('Are you sure you want to like / unlike post ?');
    if (answer) {
      LikeUnlikePost();
    }
  }
  const likeDetail = { user_id, post_id }

  const LikeUnlikePost = async () => {
    try {  
      const response = await fetch(`${URL}/posts/like-and-unike-post`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(likeDetail),
      });
      res = await response.json();
      if (res.success) { 
        post_mutate();
        toast.success(res?.message);
      }else{
        toast.error(res.message);
      }
  } catch (err) {
      toast.error("Error occurred while liking post ", err); 
      console.log("Error occurred while liking post ", err); 
    }
  }



  // COMMENT 
  const gotoPostDetail = () => { return navigate(`/blog/${slug}/${post_id}`); }
  const handleComment = (e) => {
    e.preventDefault();
    
    let answer;
    answer = window.confirm('Are you sure you want to comment on post ?');
    if (answer) {
      const commentInfo = { comment, post_id, user_id };  
      commentOnPost(commentInfo);
    }
  }

  const commentOnPost = async (commentInfo) => { 
    try {  
        const response = await fetch(`${URL}/comments/`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(commentInfo),
        });   //alert("ok am here");

        res = await response.json();    
        if (res.success) { 
            toast.success(res?.message);
            setComment('');
            setTimeout(gotoPostDetail, 3000);
            // return navigate(`/login`); 
        }else{
            toast.error(res.message);
        }
    } catch (err) {
        toast.error("Error occurred while commenting on post ", err); 
        console.log("Error occurred while commenting on post ", err); 
    }
}



  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  




  return (
    <MainLayout>
      {post_isLoading ? (
        <PostCardSkeleton />
      ) : (
        <section className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start mt-8">
          

          <article className="flex-1">
            <div className="img-div">
              <div className="flex justify-end items-center gap-2 mb-1">
                  <Link to={`/post/edit/${post?.data?.slug}`} className="blue-edit-btn"> 
                    <FaPen className="" /> 
                  </Link>
                  <form onSubmit={handleRemovePost}>                 
                      <button type='submit' className='cate-delete-btn'> <FaTrash /> </button>
                  </form> 
              </div>

              <img
                className="rounded-2xl w-full !min-h-[60vh] !max-h-[60vh] object-cover"
                src={post?.data?.photo ? imgPath : samplePostImage}
                alt={post?.data?.title}
              />
            </div>
            


            <div className="flex justify-between items-center my-3">
              <div className="flex items-center gap-1 text-dark-light text-sm">
                <FaUser className="text-red-600" />   {post?.data?.author?.name}
              </div>

              <div className="flex justify-end items-center gap-3.5 text-dark-light">
                <div className="flex items-center gap-1 text-sm cursor-pointer" onClick={handleLikeUnlikePost}>
                  <FaHeart className={`${post?.data?.likes?.includes(user_id) ? 'text-red-600' : 'text-gray-400'}`} /> {post?.data?.likes?.length} 
                </div>

                <a href="#comment" className="flex items-center gap-1 text-sm cursor-pointer">
                  <FaComments />  {post?.data?.comments?.length}
                </a>

                <div className="flex items-center gap-0.5 text-sm">
                  <FaCalendarAlt />  
                  {/* {formatDateString(post?.post?.createdAt)} */}
                  {new Date(post?.data?.createdAt).getDate()}{" "}
                  {new Date(post?.data?.createdAt).toLocaleString("default", {
                    month: "long",
                  })}
                </div>
              </div>

            </div>
           

            <h1 className="flex justify-between items-center text-xl font-medium font-roboto mt-4 text-dark-hard md:text-[26px]">
              {post?.data?.title}

              <div className="flex items-center gap-1.5 text-dark-light ">
                <FaCubes size={17} />
                
                  <Link
                    to={`/blog?category=${post?.data?.categories?.name}`}
                    className="text-sm font-roboto inline-block md:text-base"
                  >
                    {post?.data?.categories?.name}
                  </Link>
            </div>


            </h1>
            <div className="w-full my-3 text-base text-dark-light">
              { !post_isLoading &&  post?.data?.body }
            </div>


            <CommentForm handleComment={handleComment} comment={comment} setComment={setComment} />

            <Comments comments={comments} />
          </article>

          
          <div>

            <SuggestedPosts header="Latest Articles"  posts={posts?.posts} tags={posts?.posts?.categories}
              className="mt-8 lg:mt-0 lg:max-w-xs"
            />
            <div className="mt-7">
              <h2 className="font-roboto font-medium text-dark-light mb-4 md:text-[1rem] flex items-center gap-2">
                <FaShareAlt size={15} /> Share on
              </h2>

              <SocialShareButtons
                url={encodeURI(window.location.href)}
                title={encodeURIComponent(post?.data?.title)}
              />
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default PostDetail;
