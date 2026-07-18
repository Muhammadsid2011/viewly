import { Router } from "express";
import {
  register,
  login,
  logout,
  changePassword,
  refreshAccessToken
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
} from "../validations/user.validation";
import { verifyJWT } from "../middlewares/user.middleware";

const router = Router();

router.post("/register",validate(registerUserSchema),register);

router.post("/login",validate(loginUserSchema),login);

router.post("/logout", verifyJWT, logout)

router.post("/change-password", verifyJWT, validate(changePasswordSchema), changePassword)

router.post("/refres-accesstoken", verifyJWT, refreshAccessToken)

export default router;