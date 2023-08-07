import multer from "multer";

export const fileValidationCloud = {
  image: ["image/jpeg", "image/png", "image/gif"],
  //file : ["application/pdf","application/msword"]
};
export function fileUploadCloud(customValidation = []) {
  const storage = multer.diskStorage({});
  console.log(storage);
  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("In-valid file format", { cause: 400 }), false);
    }
  }
  const upload = multer({ fileFilter, storage });
  return upload;
}
