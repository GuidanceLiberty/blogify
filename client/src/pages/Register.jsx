import { Link, useNavigate } from "react-router-dom";

import authBG from "../assets/images/auth-bg.jpg";
import { FaEnvelope, FaImage, FaUnlockAlt, FaUserPlus } from "react-icons/fa";
import { useState } from "react";
import avatar from '../assets/images/user.png';
import { useFormik } from 'formik'
import { registerSchema } from '../schema'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Loader } from 'lucide-react';



const Register = () => {

    const URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

    const [photo, setPhoto] = useState(avatar);
    const [file, setFile] = useState(null);


    const onSubmit = async(values, actions) => {
        handleUpload();

        try {
            const response = await fetch(`${URL}/auth/signup`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values, photo }),
            });
            const res = await response.json();
            if(res.success){
                toast.success(res.message);
                await new Promise((resolve) => setTimeout(resolve, 3000));
                actions.resetForm();
                return navigate('/verify-email');
            }
            else{
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Error occurred while creating account : ", error.message);
            console.log("Error occurred while creating account : ", error.message);
        }
    }


  // UPLOAD PHOTO
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPhoto(e.target.value);
  };

  const handleUpload = async () => {  
    if (!file) { return  }

    const formData = new FormData();
    formData.append('file', file);
    // return alert("Uploading photo : ", photo);

    try {
      const res = await axios.post(`${URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(res.data.message);
    } catch (err) {
      toast.error('Upload failed');
    }

  };



    const { values, touched, isSubmitting, errors, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            photo: "",
        },
        validationSchema: registerSchema,
        onSubmit
    })




  return (
    <main className="login-div">
        <div className="auth-left">
            <img src={authBG} alt="auth bg image"/>

            <div className="auth-form !h-[90%]">
                <div className="w-full max-w-sm mx-auto">
                    <h1 className="font-roboto text-2xl font-light tracking-medium text-center text-primary mb-8">
                        Create New Account
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="name" className="label"> <FaUserPlus />  
                            <span> FullName <span className='req'>*</span></span> 
                            {touched.name && errors.name ? <p className='form-error'>{errors.name}</p> : null} 
                            </label>
                            <input type="name" id="name" placeholder="Enter Fullname"
                                className={`placeholder:text-[#bec6d3] placeholder:font-light text-input-reg `}
                                value={values.name} onChange={handleChange} onBlur={handleBlur}
                            />
                        </div>

                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="email" className="label"> <FaEnvelope /> 
                            <span> Email <span className='req'>*</span></span> 
                            {touched.email && errors.email ? <p className="form-error">{errors.email}</p> : null}
                            </label>
                            <input type="text" id="email" placeholder="Enter email"
                                className={`placeholder:text-[#bec6d3] placeholder:font-light text-input `}
                                value={values?.email} onChange={handleChange} onBlur={handleBlur}
                            />
                        </div>

                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="password" className="label"> <FaUnlockAlt /> 
                            <span> Password <span className='req'>*</span></span>
                            {touched.password && errors.password ? <p className="form-error">{errors.password}</p> : null}
                                </label>
                            <input type="password" id="password" placeholder="Enter password"
                                className={`placeholder:text-[#bec6d3] placeholder:font-light text-input`}
                                value={values?.password} onChange={handleChange} onBlur={handleBlur}
                            />
                        </div>

                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="photo" className="label"> <FaImage /> Profile Photo </label>
                            <input type="file" id="photo" accept='.png, .jpeg, .jpg, .gif' className={`placeholder:text-dark-light text-input-reg`}
                            onChange={handleFileChange}
                           />
        
                        </div>

                        <Link to="/forget-password" className="text-sm placeholder:font-old text-primary">
                        Forgot password?
                        </Link>

                        <button type="submit" className="btn-dark-full" disabled={isSubmitting}> 
                            {
                                isSubmitting ?
                                <Loader className='animate-spin' /> :
                                <span className="flex items-center gap-2"> 
                                    <span> Sign Up </span>  
                                </span>
                            }
                        </button>

                        <p className="flex justify-between items-center text-sm font-semibold text-[#5a7184]"> 
                            You have an account?{" "}
                            <Link to="/login" className="text-primary"> Login now </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </main>
      
  );
};

export default Register;