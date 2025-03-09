import multer from "multer";
import { Request } from "express";
import path from "path";
import { config } from "dotenv";

config();

export const upload = multer({
	dest: "uploads/",
	fileFilter(req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
		const extName = path.extname(file.originalname).toString();
		const acceptedFileTypes = (process.env.ACCEPTED_FILES as string).split(",");

		if (acceptedFileTypes.includes(extName)) {
			callback(new Error("Unaccepted file type"));
			callback(null, false);
		}

		callback(null, true);
	},
})