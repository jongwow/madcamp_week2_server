import * as multer from "multer";
import * as path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, basename + "_" + Date.now() + extension);
  },
});

const myMulter = multer({
  storage: storage,
});

export default myMulter;
