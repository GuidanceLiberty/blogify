import * as yup from 'yup';

export const registerSchema = yup.object().shape({
    name: yup.string().min(5, "Minimum of 5 characters required").required("Name Required"),
    email: yup.string().email("Email not valid").required("Email required"),
    password: yup.string().min(6, "Password required minimum of 6 characters").required("password required")
});

export const loginSchema = yup.object({
    email: yup.string().email('').required('email required'),
    password: yup.string().min(6).required('password required')
});

export const CategorySchema = yup.object({
    name: yup.string().min(5, "minimum of 5 character").required('name required'),
    description: yup.string().min(15, "minimum of 15 characters required").required('description required')
});

export const postSchema = yup.object({
    title: yup.string().min(5, "minimum of 5 character").required('title required'),
    body: yup.string().min(15, "minimum of 15 characters required").required('body required'),
    categories: yup.string().min(5, "minimum of 5 character").required('category required'),
    author: yup.string().min(24, "minimum of 24 hexadecimal character required").required('author required'),
});