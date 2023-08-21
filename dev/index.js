import express from "express"

import nocache from "nocache"

import api from "./api/index.js"

const app = express()

// Middleware
app.use(nocache())

// Routes
app.use("/", express.static("public"))
app.use("/dist", express.static("dist"))
app.use("/api", api)

console.log("Dev server running on http://localhost:8080")

app.listen(8080)
