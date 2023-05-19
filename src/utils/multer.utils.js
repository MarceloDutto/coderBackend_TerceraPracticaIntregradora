import multer from "multer";
import __dirname from "./dirname.utils.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + 'public/img/products')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

export const uploader = multer({storage});