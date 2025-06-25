import MainLayout from '../components/MainLayout'
import { FaUserTie } from 'react-icons/fa';
import { useEffect, useState } from "react";

const Profile = () => {
    const URL = process.env.REACT_APP_BASE_URL;
  const UPLOAD_URL = process.env.REACT_APP_UPLOAD_URL;
    let user = localStorage.getItem('user');
    user = JSON.parse(user);
    const profilePic = UPLOAD_URL + user?.photo;  //console.log("profilePic :: ", profilePic);
    const ProfileRow = ({ label, value }) => (
  <div className="flex justify-between items-center bg-gray-100 rounded-md px-4 py-2">
    <span className="text-gray-700 font-semibold">{label}</span>
    <span className="text-gray-800">{value}</span>
  </div>
    );

const [postCount, setPostCount,] = useState(0);

useEffect(() => {
  const fetchPostCount = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id;

      const res = await fetch(`${URL}/posts/count/${userId}`);
      const data = await res.json();

      if (data.success) {
        setPostCount(data.count);
      }
    } catch (err) {
      console.error("Error fetching post count:", err);
    }
  };

  fetchPostCount();
}, []);

const [commentCount, setCommentCount] = useState(0);

useEffect(() => {
  const fetchCommentCount = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id;

      const res = await fetch(`${URL}/comments/count/${userId}`);
      const data = await res.json();

      if (data.success) {
        setCommentCount(data.count);
      }
    } catch (err) {
      console.error("Error fetching comment count:", err);
    }
  };

  fetchCommentCount();
}, []);


const [likePostCount, setLikePostCount] = useState(0);

useEffect(() => {
  const fetchLikePostCount = async () => {
    try {
      const post = JSON.parse(localStorage.getItem('user'));
      const postId = post?._id;

      const res = await fetch(`${URL}/posts/likes/count/${postId}`);
      const data = await res.json();

      if (data.success) {
        setLikePostCount(data.count);
      }
    } catch (err) {
      console.error("Error fetching comment count:", err);
    }
  };

  fetchLikePostCount();
}, []);

  return (
    <MainLayout>
         <div className="mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 bg-white p-8 rounded-xl shadow-md">
        
        {/* Avatar */}
        {
          profilePic !== `${UPLOAD_URL}/undefined` ? 
        <img src={profilePic} className='w-[50%] h-[50%] rounded-full object-cover border-4 border-cyan-500' alt="profile pic" /> : 
          <FaUserTie /> 
        }

        {/* User Info */}
        <div className="flex-1 space-y-3 w-full my-auto items-center">
          <ProfileRow label="Username" value={user.name} />
          <ProfileRow label="Email" value={user.email} />
          <ProfileRow label="Role" value={user.role} />
          <ProfileRow label="Last Login" value={user.lastLogin} />
          <ProfileRow label="No of Posts" value={postCount} />
          <ProfileRow label="No of Liked Posts" value={likePostCount} />
          <ProfileRow label="No of Comments" value={commentCount} />
          <ProfileRow
            label="Is Verified"
            value={
              <span className="bg-red-200 text-red-800 font-bold px-3 py-0.5 rounded-full text-sm">
                No
              </span>
            }
          />
          <ProfileRow label="Last Comment Date" value="12 April" />
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default Profile