import mongoose from "mongoose";
import { UserInterface } from "./types/UserInterface";

// User Schema
const UserSchema = new mongoose.Schema<UserInterface>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model<UserInterface>("User", UserSchema);

export { User };