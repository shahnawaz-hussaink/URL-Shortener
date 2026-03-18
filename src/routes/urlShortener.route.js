import { Router } from "express"
import { creatShortURL } from "../controllers/shortURL.controller.js"

const router = Router()

router.route("/short-it/:customId").post(creatShortURL)

export default router 

