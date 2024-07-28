import { multerFilter } from '../utilities/uploadImage.utilities.js';
import multer from 'multer';
const upload = multer({
    limits: { fileSize: 500000 },
    fileFilter: multerFilter
});
export const multerMiddleware = (req, res, next) => {
    upload.single('file')(req, res, (error) => {
        if (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
        }
        next();
    });
};
