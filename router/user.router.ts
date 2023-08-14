import e, { Router } from "express";
import { authorizedUser } from "../middleware/authorized";

import {
  generateOTP,
  validateOTP,
  loginViaCredential,
  updateUser,
  getUserDetails,
  uploadProfilePhoto,
  getMyTrips,
  logout,
  createAdminUser,
  changePassword,
  getRole,
  genAdminOTP,
  verifyAdminOTP,
} from "../controller/user.controller";
import { roles } from "../helper/enums";
import {
  insertAirlineAdmin,
  getAirlineAdminDetails,
} from "../controller/airline_admin.controller";

export const userRouter: Router = e.Router();

userRouter.post("/generateotp", generateOTP);
userRouter.post("/validateotp", validateOTP);
userRouter.post("/admin/login", loginViaCredential);
userRouter.get("/getrole", getRole);
userRouter.post("/admin/generateotp", genAdminOTP);
userRouter.post("/admin/verifyotp", verifyAdminOTP);
userRouter.put("/admin/changepassword", changePassword);

userRouter.use((req, res, next) => authorizedUser(req, res, next, roles.User));
userRouter.get("/mydetails", getUserDetails);
userRouter.get("/my_trips", getMyTrips);
userRouter.put("/updateprofile", updateUser);
userRouter.post("/updateprofile/uploadphoto", uploadProfilePhoto);
userRouter.get("/logout", logout);

userRouter.use((req, res, next) => authorizedUser(req, res, next, roles.Admin));

userRouter.use((req, res, next) =>
  authorizedUser(req, res, next, roles.SuperAdmin)
);
userRouter.post("/createAdmin", createAdminUser);
userRouter.get("/adminDetails", getAirlineAdminDetails);

