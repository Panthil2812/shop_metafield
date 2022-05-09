import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
  scopes: {
    type: String,
    required: true,
    trim: true,
  },
  shop: {
    type: String,
    required: true,
    trim: true,
  },
});

const Session =
  mongoose.models.session || mongoose.model("session", sessionSchema);

export default Session;
