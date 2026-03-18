import { Router } from "express"
import { shortURL } from "../controllers/shortURL.controller.js"

const router = Router()

router.route("/short-it").post(shortURL)

export default router 

