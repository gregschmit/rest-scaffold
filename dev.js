import express from "express"

const app = express()

app.use("/", express.static("public"))
app.use("/dist", express.static("dist"))

console.log("Dev server running on http://localhost:8080")

app.listen(8080)
