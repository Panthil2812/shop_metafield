import mongoose from "mongoose";

const metafieldSchema = mongoose.Schema(
  {
    shop: {
      type: String,
      trim: true,
      require: true,
    },
    content: {
      type: JSON,
      trim: true,
      require: true,
    },
    updated_date: {
      type: Date,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const metafield = mongoose.model(
  "country_wise_content_metafields",
  metafieldSchema
);

export default metafield;
