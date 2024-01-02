import { Router } from "express";
import { getChannelProfileForNotLoggedInUser } from "../controllers/search.controller.js";

const router = Router();
router.route("/profile/:username").get(getChannelProfileForNotLoggedInUser);

// TODO: implement route /videos/:username


export default router;

