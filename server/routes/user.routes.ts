import { Router } from "express";
import { register, login } from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/user.validation";

const router = Router();


router.post(
  "/register",
  validate(registerUserSchema),
  register
);


router.post(
  "/login",
  validate(loginUserSchema),
  login
);


export default router;