import express from "express"

import morgan from "morgan"
import nocache from "nocache"

import api from "./api/index.js"

const app = express()

// Middleware
app.use(morgan("tiny"))
app.use(nocache())

// Routes
app.use("/", express.static("public"))
app.use("/dist", express.static("dist"))
app.use("/api", api)

console.log("Starting dev server...")

app.listen(8080, () => {
  console.log("Started dev server at: http://localhost:8080")
})
