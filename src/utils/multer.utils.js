import multer from "multer";
import __dirname from "./dirname.utils.js";

export const prodImgStorage = multer.diskStorage({
    destination: function (req, files, cb) {
        cb(null, __dirname + '/public/img/products')
    },
    filename: function (req, file, cb) {
        cb(null, 'product-' + Date.now() + '-' + file.originalname)
    }
}); 

export const profImgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/img/profile')
    },
    filename: function (req, file, cb) {
        cb(null, 'profile-' + Date.now() + '-' + file.originalname)
    }
});

export const docStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/documents')
    },
    filename: function(req, file, cb) {
        cb(null, 'document-' + Date.now() + '-' + file.originalname)
    }
});