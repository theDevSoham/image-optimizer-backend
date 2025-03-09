import Job from "../models/Job";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (ensure these env variables are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const processJobImages = async (jobId: string) => {
  // Run in background without blocking request
  setImmediate(async () => {
    try {
      const job = await Job.findById(jobId);
      if (!job) return;
      job.status = "processing";
      await job.save();

      // Process each product sequentially (could be parallelized)
      for (const product of job.products) {
        const outputUrls: string[] = [];
        for (const imageUrl of product.inputImageUrls) {
          try {
            // Download image buffer from the provided URL
            const response = await axios.get(imageUrl, {
              responseType: "arraybuffer",
            });
            const inputBuffer = Buffer.from(response.data);

            // Upload image to Cloudinary with transformation to reduce quality to 50%
            const uploadResult = await new Promise<any>((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  quality: "50", // Transformation: reduce quality to 50%
                  folder: "compressed_images", // Optional folder
                },
                (error, result) => {
                  if (error) {
                    return reject(error);
                  }
                  resolve(result);
                }
              );
              uploadStream.end(inputBuffer);
            });

            // Save the secure URL from Cloudinary as the output image URL
            outputUrls.push(uploadResult.secure_url);
          } catch (err) {
            console.error(`Error processing image ${imageUrl}:`, err);
            outputUrls.push("error-processing");
          }
        }
        product.outputImageUrls = outputUrls;
      }
      job.status = "completed";
      await job.save();

      // Trigger webhook in real time (if a webhook URL is provided)
      if (job.webhookUrl) {
        try {
          await axios.post(job.webhookUrl, {
            requestId: job.requestId,
            status: job.status,
            products: job.products,
          });
        } catch (webhookErr) {
          console.error("Error triggering webhook:", webhookErr);
        }
      }
    } catch (error) {
      console.error("Error processing job images:", error);
      if (jobId) await Job.findByIdAndUpdate(jobId, { status: "failed" });
    }
  });
};
