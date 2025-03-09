import { Request, Response } from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Job from "../models/Job";
import { parseCSV } from "../utils/csvParser";
import { processJobImages } from "../services/imageProcessor";

export const uploadCSV = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required." });
    }
    // Read CSV file contents
    const fileContent = fs.readFileSync(req.file.path, "utf8");
    const records = await parseCSV(fileContent);
    // Validate format (basic check)
    const expectedHeader = ["S. No.", "Product Name", "Input Image Urls"];
    const header = records.header;
    if (!header || header.length < expectedHeader.length) {
      return res
        .status(400)
        .json({ message: "CSV header is missing required columns." });
    }
    for (let i = 0; i < expectedHeader.length; i++) {
      if (header[i].trim().toLowerCase() !== expectedHeader[i].toLowerCase()) {
        return res.status(400).json({
          message: `CSV header mismatch at column ${i + 1}: expected "${
            expectedHeader[i]
          }" but got "${header[i]}".`,
        });
      }
    }
    // Expecting columns: SerialNumber, ProductName, InputImageUrls
    const products = records.rows.map((row) => {
      const [serialNumber, productName, inputImageUrlsRaw] = row;
      const inputImageUrls = inputImageUrlsRaw
        .split(",")
        .map((url: string) => url.trim());
      return { serialNumber, productName, inputImageUrls, outputImageUrls: [] };
    });
    const requestId = uuidv4();
    const job = new Job({
      requestId,
      products,
      status: "pending",
      webhookUrl: req.body.webhookUrl || null,
    });
    await job.save();
    // Start background image processing (asynchronously)
    processJobImages(job._id as string);
    // Remove the uploaded file after processing starts
    fs.unlinkSync(req.file.path);
    res.json({ requestId });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
