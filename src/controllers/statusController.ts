import { Request, Response } from "express";
import Job from "../models/Job";

export const checkStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { requestId } = req.params;
    const job = await Job.findOne({ requestId });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({
      requestId: job.requestId,
      status: job.status,
      products: job.products,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
