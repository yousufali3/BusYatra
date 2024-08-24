import path from "path";
import multer from "multer";

// Storage management for the file that will be uploaded
const busImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/busimage");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const ownerAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/ownerAvatar");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Management of the storage and the file that will be uploaded
// .single expects the name of the file input field
export const uploadBusImage = multer({ storage: busImage }).single("image");
export const uploadOwnerAvatar = multer({ storage: ownerAvatar }).single(
  "photo"
);
