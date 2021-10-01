import mongoose from "mongoose";
/*  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false*/

export default async () => {
  return mongoose.connect(process.env.MONGO_URL,{


  });
};
