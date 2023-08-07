import {Router} from "express";
import { confirmEmail, confirmForget, forgetPass, resendConfirmEmail, signIn, signUp, unsubscribe } from "./controller/Auth.js";
import { validation } from "../../middleware/Validation.js";
import * as validators from "./validation.js";
//import { auth } from "../../middelware/auth.js";
const router = Router();

router.post("/signUp/:flag",validation(validators.signUp),signUp);
router.post("/signIn",validation(validators.signIn),signIn);
router.get("/confirmEmail/:token",validation(validators.confirmEmail),confirmEmail);
router.get("/resendConfirmEmail/resend/:token",validation(validators.resendConfirmEmail),resendConfirmEmail);
router.put("/forgetPass", validation(validators.forgetPass), forgetPass);
router.post("/confirmForget/:token",validation(validators.confirmForget), confirmForget);
router.get("/unsubscribe/:token",validation(validators.unsubscribe),unsubscribe);
export default router;