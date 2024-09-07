import mongoose from "mongoose";

const userCollection = "user";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  admin: Boolean,
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
