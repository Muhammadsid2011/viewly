import { Router } from "express";
import {
  register,
  login,
  logout,
  changePassword,
  refreshAccessToken,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserWatchHistory
} from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
  updateUserProfileSchema,
} from "../validations/user.validation";
import { verifyJWT } from "../middlewares/user.middleware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.post("/register", validate(registerUserSchema), register);

router.post("/login", validate(loginUserSchema), login);

router.post("/logout", verifyJWT, logout)

router.post("/change-password", verifyJWT, validate(changePasswordSchema), changePassword)

router.post("/refresh-accesstoken", refreshAccessToken)

router.get("/current-user", verifyJWT, getCurrentUser)

router.patch("/update-user-profile", verifyJWT, validate(updateUserProfileSchema), updateUserProfile)

router.patch("/update-user-avatar", verifyJWT, upload.fields([
  { name: "avatar", maxCount: 1 }
]), updateUserAvatar)

router.patch("/update-user-cover-image", verifyJWT, upload.fields([
  { name: "coverImage", maxCount: 1 }
]), updateUserCoverImage)

router.get("/channel/:channelUsername", verifyJWT, getUserChannelProfile)

router.get("/watch-history", verifyJWT, getUserWatchHistory)

export default router;