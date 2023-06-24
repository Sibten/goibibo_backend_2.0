import e from "express";
import { addRole, deleteRole } from "../controller/role.controller";

export const roleRouter = e.Router();

roleRouter.post("/add", addRole);
roleRouter.delete("/delete", deleteRole);
