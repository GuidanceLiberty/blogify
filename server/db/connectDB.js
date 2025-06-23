import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.set('strictQuery', false); 
        const connect = await mongoose.connect(process.env.DB_URI);
        console.log('connected')
    } catch (error) {
        console.log(`Error: error occur while connecting to database ${error}`);
        process.exit(1);
    }
}

export default connectDB;