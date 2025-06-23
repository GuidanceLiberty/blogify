import { BsCalendar3, BsGrid3X3 } from "react-icons/bs";
import samplePostImage from '../../assets/images/sample.jpg';
import { Link, NavLink } from "react-router-dom";
import { FaCommentAlt, FaHeart, FaUserTie } from "react-icons/fa";

const PostCard = ({ post, className }) => { 


  const userInfo = localStorage.getItem('user');
  const user = JSON.parse(userInfo);
  
  const URL = process.env.REACT_APP_BASE_URL;  
  const imgURL = process.env.REACT_APP_UPLOAD_URL;  
  const imgPath = imgURL + post?.photo;  
  console.log("post : ", post);


  

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all ease-in-out duration-[900ms] ${className}`}
    >
      <Link to={`/blog/${post?.slug}/${post?._id}`}>
        <img
          src={post.photo ? imgPath : samplePostImage}
          alt="title"
          className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
        />
      </Link>
      <div className="p-5">
        <Link to={`/blog/${post.slug}`}>
          <h2 className="font-roboto font-[500] text-lg text-dark-soft md:text-xl lg:text-[22px]">
            {post.title}
          </h2>

          <p className="py-1 line-clamp-1 text-sm"> {post?.body.substring(0, 35)} ...  </p>

          <div className="flex justify-between items-center">
            <p className="text-dark-light mt-2 text-sm md:text-[1rem] flex items-center gap-1">
                <NavLink to={`/category-posts/${post?.categories?._id}`} className="flex items-center gap-2"><BsGrid3X3 className="w-3 h-3 text-blue-800 rounded-full" /></NavLink>
              {post?.categories ? post.categories?.name : 'No Category'},
              
            </p>

            <div className="activities flex justify-end items-center gap-2">
              <div className="flex items-center gap-1 text-sm cursor-pointer">
                <FaHeart className={`${post?.likes?.length > 0 ? 'text-red-600' : 'text-gray-400'}`} /> 
                  {post?.likes?.length}
              </div>

              <div className="flex items-center gap-1 text-sm cursor-pointer">
                <FaCommentAlt className={`${post?.comments?.length > 0 ? 'text-red-600' : 'text-gray-400'}`}  /> 
                  {post?.comments?.length}
              </div>
            </div>
          </div>
        </Link>

        <div className="flex justify-between flex-nowrap items-center mt-3">
          <div className="flex items-center gap-x-2 md:gap-x-2.5">
            {
              post?.author?.photo !== '' ? 
                <img src={ post?.author?.photo ? imgURL+post?.author?.photo: '' } alt="profile"
              className="w-5 h-5 md:w-10 md:h-10 rounded-full" /> :
              <FaUserTie className="text-red-600" />
            }
            

            <div className="flex flex-col">
              <h4 className="font-light italic text-dark-soft !text-sm md:text-base">
                {post?.author?.name}
              </h4>
            </div>
          </div>

          <span className="font-extralight text-dark-light !text-sm md:text-base flex items-center gap-1">
            <BsCalendar3 className="w-3 h-4" />
            {new Date(post.createdAt).getDate()}{" "}
            {new Date(post.createdAt).toLocaleString("default", {
              month: "long",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
