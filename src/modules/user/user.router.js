import {Router} from "express";
import { changePass, deleteUser, getAll, logOut, profileCoverImage, profileCoverImageCloud, profileImage, profileImageCloud, softDeleteUser, updateUser } from "./controller/user.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/Validation.js";
import * as validators from "./validation.js";
import { fileUploadCloud, fileValidationCloud } from "../../utils/multer.cloud.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
const router = Router();


router.get("/getAll",getAll);
router.put("/changePass",validation(validators.changePass),auth,changePass);
router.put("/updateUser",validation(validators.updateUser),auth,updateUser);
router.delete("/deleteUser",auth,deleteUser);
router.delete("/softDeleteUser",auth,softDeleteUser);
router.get("/logOut", auth, logOut);


router.patch("/profile/image",auth,fileUpload("user/profile",fileValidation.image).single('image'),profileImage);


router.patch("/profile/cover/image",auth,fileUpload("user/profile",fileValidation.image).array('image',5),profileCoverImage);


router.patch("/profile/image/cloud",auth,fileUploadCloud(fileValidationCloud.image).single('image'),profileImageCloud)


router.patch("/profile/cover/image/cloud",auth,fileUploadCloud(fileValidationCloud.image).array('image',7),profileCoverImageCloud);
export default router