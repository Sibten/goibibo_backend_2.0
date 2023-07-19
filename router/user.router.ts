import e, { Router } from "express";
import { authenticateUser } from "../middleware/authenticate";

import {
  generateOTP,
  validateOTP,
  loginViaCredential,
  updateUser,
  getUserDetails,
  uploadProfilePhoto,
  getMyTrips,
} from "../controller/user.controller";
import { roles } from "../helper/enums";
import {
  insertAirlineAdmin,
  getAirlineAdminDetails,
} from "../controller/airline_admin.controller";

export const userRouter: Router = e.Router();

userRouter.post("/generateotp", generateOTP);
userRouter.post("/validateotp", validateOTP);

userRouter.use((req, res, next) =>
  authenticateUser(req, res, next, roles.User)
);
userRouter.put("/updateprofile", updateUser);
userRouter.post("/updateprofile/uploadphoto", uploadProfilePhoto);
userRouter.post("/login", loginViaCredential);
userRouter.get("/mydetails", getUserDetails);
userRouter.get("/my_trips", getMyTrips);

userRouter.post(
  "/addAdmin",
  userRouter.use((req, res, next) =>
    authenticateUser(req, res, next, roles.SuperAdmin)
  ),
  insertAirlineAdmin
);
userRouter.get(
  "/adminDetails",
  userRouter.use((req, res, next) =>
    authenticateUser(req, res, next, roles.SuperAdmin)
  ),
  getAirlineAdminDetails
);



