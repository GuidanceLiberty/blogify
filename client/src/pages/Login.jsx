import { Link, useNavigate } from "react-router-dom";
import authBG from "../assets/images/auth-bg.jpg";
import { FaEnvelope, FaUnlockAlt } from "react-icons/fa";
import { useFormik } from "formik";
import { loginSchema } from "../schema";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";




const Login = () => {

const URL = process.env.REACT_APP_BASE_URL;
const navigate = useNavigate();

const onSubmit = async(values, actions) => {
    let res;
    try {
        const response = await fetch(`${URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values), 
        });
        res = await response.json();
        if(!res.success){
            return toast.error(res.message);
        }
        localStorage.setItem('user', JSON.stringify(res.user));
        toast.success(res.message);
        await new Promise((resolve) => {
            setTimeout(resolve, 3500)
        });

        actions.resetForm();
        return navigate('/');

    } catch (error) {
        toast.error("Error occurred while login : ", error.message);
        console.log("Error occurred while login : ", error.message);
    }
}




const { values, touched, isSubmitting, errors, handleBlur, handleChange, handleSubmit } = useFormik 
({
    initialValues: {
        email: "",
        password: "",
    },
    validationSchema: loginSchema, 
    onSubmit,
});


    
  return (

    <main className="login-div">
        <div className="auth-left">
            <img src={authBG} alt="auth bg image"/>

            <div className="auth-form">
                <div className="w-full max-w-sm mx-auto">
                    <h1 className="font-roboto text-2xl font-light tracking-medium text-center text-primary mb-8">
                        Login
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="email" className="label"> <FaEnvelope /> 
                            <span> Email <span className='req'>*</span></span> 
                            {touched.email && errors.email ? <p className="form-error">{errors.email}</p>: null}
                            </label>
                            <input type="text" id="email" placeholder="Enter email"
                                className={`placeholder:text-[#bec6d3] placeholder:font-light text-input `}
                                values={values?.email} onChange={handleChange} onBlur={handleBlur}
                            />
                        </div>

                        <div className="flex flex-col mb-6 w-full">
                            <label htmlFor="password" className="label"> <FaUnlockAlt /> 
                            <span> Password <span className='req'>*</span></span>
                            {touched.password && errors.password ? <p className="form-error">{errors.password}</p>: null} 
                            </label>
                            <input type="password" id="password" placeholder="Enter password"
                                className={`placeholder:text-[#bec6d3] placeholder:font-light text-input`}
                                values={values?.password} onChange={handleChange} onBlur={handleBlur}
                            />
                        </div>

                        <Link to="/forgot-password" className="text-sm font-medium text-gray-500">
                        Forgot password?
                        </Link>

                        <button type="submit" className="btn-dark-full " disabled={isSubmitting}> 
                            {
                                isSubmitting ?
                                <Loader className="animate-spin"/>:
                                <span className="flex items-center gap-2"> 
                                    <span> Sign In </span>  
                                </span> 
                            }
                        </button>

                        <p className="flex justify-between items-center text-sm font-semibold text-[#5a7184]"> Do not have an account?{" "}
                        <Link to="/register" className="text-primary"> Register now </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </main>
      
  );
};

export default Login;