/*import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname:{type:String, required: true},
  email: {type:String , required:true},
  password: {type:String},
  address: [{detail:{type:String}, for:{type:String}}],
  phoneNumber: [{type:Number}]
},
{
  timestamps: true
});

export const UserModel = mongoose.model("Users",UserSchema);
*/

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  fullname:{type:String, required: true},
  email: {type:String , required:true},
  password: {type:String},
  address: [{detail:{type:String}, for:{type:String}}],
  phoneNumber: [{type:Number}]
},
{
  timestamps: true
});

UserSchema.methods.generateJwtToken = function() {
  return jwt.sign({user: this._id.toString()}, "ZomatoApp");
}

UserSchema.statics.findEmailAndPhone = async ({email, phoneNumber}) => {
  //check whether the email exits
  const checkUserByEmail = await UserModel.findOne({ email });

  //check whether the phoneNumber Exists
  const checkUserByPhone = await UserModel.findOne({ phoneNumber });
  if(checkUserByEmail || checkUserByPhone) {
    throw new Error("User already Exists");
  }
  return false;
};


UserSchema.pre("save",function(next) {
  const user = this;
  //checking if password is not modified
  if(!user.isModified("password")) return next();

//generating bcrpyt salt
  bcrypt.genSalt(8,(error,salt)=>{
    if(error) return next(error);

    //hashing the password
    bcrypt.hash(user.password, salt, (error,hash)=> {
      if(error) return next(error);

      //assigning hashed password
      user.password = hash;
      return next();
    });
  });

});

export const UserModel = mongoose.model("Users",UserSchema);
