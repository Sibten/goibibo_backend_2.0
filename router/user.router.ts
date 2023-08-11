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
} from "../controller/user.controller";
import { roles } from "../helper/enums";
import {
  insertAirlineAdmin,
  getAirlineAdminDetails,
} from "../controller/airline_admin.controller";

export const userRouter: Router = e.Router();

userRouter.post("/generateotp", generateOTP);
userRouter.post("/validateotp", validateOTP);

userRouter.use((req, res, next) => authorizedUser(req, res, next, roles.User));
userRouter.put("/updateprofile", updateUser);
userRouter.post("/updateprofile/uploadphoto", uploadProfilePhoto);
userRouter.post("/login", loginViaCredential);
userRouter.get("/mydetails", getUserDetails);
userRouter.get("/my_trips", getMyTrips);
userRouter.get("/logout", logout);
userRouter.post("/admin/login", loginViaCredential);

userRouter.use((req, res, next) => authorizedUser(req, res, next, roles.Admin));
userRouter.put("/admin/changepassword", changePassword);
userRouter.use((req, res, next) =>
  authorizedUser(req, res, next, roles.SuperAdmin)
);
userRouter.post("/createAdmin", createAdminUser);
userRouter.get("/adminDetails", getAirlineAdminDetails);

