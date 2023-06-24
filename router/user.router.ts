import e, { Router } from "express";
import { authenticateUser } from "../middleware/authenticate";

import {
  generateOTP,
  validateOTP,
  loginViaCredential,
  updateUser,
  getUserDetails,
  uploadProfilePhoto,
} from "../controller/user.controller";
import { roles } from "../helper/enums";
import {
  insertAirlineAdmin,
  getAirlineAdminDetails,
} from "../controller/airline_admin.controller";

export const userRouter: Router = e.Router();

userRouter.post("/generateotp", generateOTP);
userRouter.post("/validateotp", validateOTP);
userRouter.put("/updateprofile", updateUser);
userRouter.post("/updateprofile/uploadphoto", uploadProfilePhoto);
userRouter.post("/login", loginViaCredential);
userRouter.get("/mydetails", getUserDetails);

userRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.SuperAdmin)
);

userRouter.post("/addAdmin", insertAirlineAdmin);
userRouter.get("/adminDetails", getAirlineAdminDetails);
