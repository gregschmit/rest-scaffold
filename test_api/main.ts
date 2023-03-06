import { USERS } from "./data"
import express from "express"

const app = express()

// Setup local data, and a function to reset it.
let users = JSON.parse(JSON.stringify(USERS)) as typeof USERS
function reset() {
  users = JSON.parse(JSON.stringify(USERS))
}

app.post("/api/reset", (_req, res) => {
  reset()
  res.json({ message: "Data reset." })
})

app.get("/api/plain/users", (_req, res) => {
  res.json(users)
})

app.get("/api/plain/users/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const user = users.find((user) => user.id === id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: "Not found." })
  }
})

app.post("/api/plain/users", express.json(), (req, res) => {
  const user = req.body

  // Validates presence of login.
  if (!user.login) {
    res.status(400).json({ message: "Login is required.", errors: [{ login: "is required." }] })
    return
  }

  // Validates uniqueness of login.
  if (users.find((u) => u.login === user.login)) {
    res
      .status(400)
      .json({ message: "Login is already taken.", errors: [{ login: "is already taken." }] })
    return
  }

  user.id = users.slice(-1)[0].id + 1
  users.push(user)
  res.status(201).json({ message: "Created." })
})

app.put("/api/plain/users/:id", express.json(), (req, res) => {
  const id = parseInt(req.params.id)
  const user = users.find((user) => user.id === id)
  if (user) {
    Object.assign(user, req.body)
    res.json({ message: "Updated." })
  } else {
    res.status(404).json({ message: "Not found." })
  }
})

app.delete("/api/plain/users/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const index = users.findIndex((user) => user.id === id)
  if (index >= 0) {
    users.splice(index, 1)
    res.json({ message: "Deleted." })
  } else {
    res.status(404).json({ message: "Not found." })
  }
})

export const handler = app
