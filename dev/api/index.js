import express from "express"

import plainAPI from "./plain.js"
import pagedAPI from "./paged.js"

// Setup the router.
let router = express.Router()

router.get("/", (_req, res) => {
  res.send("Development API.")
})

router.use("/plain", plainAPI)
router.use("/paged", pagedAPI)

export default router
