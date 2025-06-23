import jwt from 'jsonwebtoken';
import { User } from '../model/User.js';

export const verifyToken = async(req, res, next) => {
    const { authorization } = req.headers;   //return console.log("TOKEN ::: ", token);
    if(!authorization){
        return res.status(401).json({ success: false, message: "Unauthorized - no or invalid token provided" });
    }
    const token = authorization.split(' ')[1];
    try {
            const {_id} = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findOne({ _id }).select('_id');
            next();

    } catch (error) {
        console.log("Error while verifying token : ", error);
        return res.status(401).json({ success: false, message: "Request not authorized" });
    }
}

// export const verifyToken = async(req, res, next) => {
//     const token = req?.cookies?.token;
//     if(!token){
//         return res.status(401).json({
//             success: false, message: 'Unauthorized access - no token provided'
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         if(!decoded){
//             return res.status(401).json({
//                 success: false, message: 'Unauthorized access - invalid token'
//             });
//         }

//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         console.log("Error while verifying token: ", error);
//         return res.status(401).json({
//             success: false, message: "Server error"
//         });
//     }
// }