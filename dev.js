import express from "express"

import morgan from "morgan"
import nocache from "nocache"

const app = express()

// Setup EJS view engine.
app.set("view engine", "ejs")
app.set("views", "./views")

// Middleware
app.use(morgan("tiny"))
app.use(nocache())

// Routes
app.use("/dist", express.static("dist"))
app.get("/", (req, res) => res.render("home", { page: "home" }))
app.get("/iife", (req, res) => res.render("iife", { page: "iife" }))

console.log("Starting dev server...")

app.listen(8080, () => console.log("Started dev server at: http://localhost:8080"))
