import mongoose, { Document, Schema } from "mongoose";

interface Product {
  serialNumber: string;
  productName: string;
  inputImageUrls: string[];
  outputImageUrls: string[];
}

export interface JobDocument extends Document {
  requestId: string;
  status: "pending" | "processing" | "completed" | "failed";
  products: Product[];
  webhookUrl?: string;
}

const ProductSchema = new Schema<Product>({
  serialNumber: { type: String, required: true },
  productName: { type: String, required: true },
  inputImageUrls: { type: [String], required: true },
  outputImageUrls: { type: [String], default: [] },
});

const JobSchema = new Schema<JobDocument>(
  {
    requestId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    products: [ProductSchema],
    webhookUrl: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model<JobDocument>("Job", JobSchema);
