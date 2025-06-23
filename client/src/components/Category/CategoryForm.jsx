import { FaCube, FaFileAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { CategorySchema } from '../../schema';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';

const CategoryForm = ({mutate, user}) => {

    const URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();

        const onSubmit = async(values, actions) => {
                        
            try {
                const response = await fetch(`${URL}/categories`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                     },
                    body: JSON.stringify(values),
            });
                const res = await response.json();
                    if(res.success){
                        toast.success(res.message);
                        mutate();
                        await new Promise((resolve) => setTimeout(resolve, 3000));
                        actions.resetForm()
                        return navigate(`/categories`);
                    }
                    else{
                        toast.error(res.message);
                    }
                } catch (error) {
                    toast.error("Error occurred while creating categories : ", error.message);
                    console.log("Error occurred while creating categories : ", error.message);
                }
        }

const { values, touched, isSubmitting, errors, handleBlur, handleChange, handleSubmit } = useFormik({
            initialValues: {
                name: "",
                description: "",
             
            },
            validationSchema: CategorySchema,
            onSubmit
        });
        
        
        



  return (
    <div className="category-section">

        <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-6 w-full">
                <label htmlFor="name" className="label"> <FaCube />  
                <span> FullName <span className='req'>*</span></span> 
                {touched.name && errors.name ? <p className="form-error">{errors.name}</p>: null}
                </label>
                <input type="name" id="name" placeholder="Enter Fullname"
                className={`placeholder:text-[#bec6d3] placeholder:font-light text-input-reg `}
                value={values?.name} onChange={handleChange} onBlur={handleBlur}
                />
            </div>

            <div className="flex flex-col mb-8 w-full">
                <label htmlFor="name" className="label"> <FaCube />  
                <span> Description <span className='req'>*</span></span> 
                {touched.description && errors.description ? <p className="form-error">{errors.description}</p>: null}
                </label>
                <textarea rows={4} id="description" placeholder="Enter description"
                    className={`placeholder:text-[#bec6d3] placeholder:font-light text-input`}
                    value={values?.description} onChange={handleChange} onBlur={handleBlur}
                />
            </div>

            <button type="submit" className="btn-dark-full" disabled={isSubmitting}> 
                {
                    isSubmitting ? 
                    <Loader className='animate-spin' />:
                    <span className="flex items-center gap-2"> 
                    <span> Create Category</span>  
                    </span>
                }
            </button>
        </form>
    </div>
  )
}

export default CategoryForm