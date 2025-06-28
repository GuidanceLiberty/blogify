import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { navItems } from '../constants'
import { FaPowerOff, FaUserAlt, FaUserTie } from 'react-icons/fa'
import { RiMenu4Line } from '@remixicon/react'
import toast from "react-hot-toast";

const Navbar = ({ showMenu, setShowMenu, showDropdown, setShowDropdown }) => {

  const navigate = useNavigate();
  const userInfo = localStorage.getItem('user');
  const user = JSON.parse(userInfo);

  const profilePic = user?.photo?.startsWith('http')
    ? user.photo
    : null;

  const redirectToLogin = () => navigate(`/login`);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      toast.success("Logout successful. Redirecting to login...");
      setTimeout(redirectToLogin, 3000);
    }
  };

  return (
    <section className='fixed bg-white w-full mx-auto px-5 min-h-[3rem] py-1 z-30'>
      <nav className='flex justify-between items-center px-1 lg:px-[5rem]'>
        <div className="logo py-3 flex items-center gap-1">
          <img src={logo} alt="logo" className='w-8 h-7' />
          <span className='font-semibold text-lg'>BLOGIFY</span>
        </div>

        <div className="nav-links flex items-center gap-5">
          {navItems?.map((item) => (
            <Link key={item.name} className="link" to={item.href}>
              <div className="flex items-center gap-1.5 !text-primary">
                {item.icon} {item.name}
              </div>
            </Link>
          ))}

          <div className="md:hidden cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
            <RiMenu4Line />
          </div>

          <div className="nav-user-info mr-5 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
            {profilePic
              ? <img src={profilePic} className='w-5 h-5 rounded-full object-cover' alt="profile pic" />
              : <FaUserTie />
            }
          </div>
        </div>
      </nav>

      {showDropdown && (
        <div className="mobile-menu-div">
          <NavLink to={`/profile/${user?._id}`} className="flex items-center gap-2">
            <FaUserAlt className='!text-primary' /> {user?.name}
          </NavLink>
          <button className='flex items-center gap-2' onClick={handleLogout}>
            <FaPowerOff className='text-red-500' /> Logout
          </button>
        </div>
      )}

      {/* MOBILE MENU */}
      <div className="nav-links dropdown-div">
        {showMenu && navItems?.map((item) => (
          <Link key={item.name} className="first:pt-4 last:pb-5 flex items-center gap-2 !text-primary" to={item.href}>
            {item.mobileIcon} {item.name}
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Navbar