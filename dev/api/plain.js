import express from "express"

import { USERS } from "./data.js"

// Setup local data, and a function to reset it.
let users = JSON.parse(JSON.stringify(USERS))
function reset() {
  users = JSON.parse(JSON.stringify(USERS))
}

// Setup the router.
let router = express.Router()

router.get("/", (_req, res) => {
  res.send("Plain API.")
})

router.post("/reset", (_req, res) => {
  reset()
  res.json({ message: "Data reset." })
})

router.get("/users", async (_req, res) => {
  await new Promise((r) => setTimeout(r, 700))
  res.json(users)
})

router.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const user = users.find((user) => user.id === id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: "Not found." })
  }
})

router.post("/users", express.json(), (req, res) => {
  const user = req.body

  // Validates presence of login.
  if (!user.login) {
    res.status(400).json({
      message: "Login is required.",
      errors: [{ login: "is required." }],
    })
    return
  }

  // Validates uniqueness of login.
  if (users.find((u) => u.login === user.login)) {
    res.status(400).json({
      message: "Login is already taken.",
      errors: [{ login: "is already taken." }],
    })
    return
  }

  user.id = users.slice(-1)[0].id + 1
  users.push(user)
  res.status(201).json({ message: "Created." })
})

router.put("/users/:id", express.json(), (req, res) => {
  const id = parseInt(req.params.id)
  const user = users.find((user) => user.id === id)
  if (user) {
    Object.assign(user, req.body)
    res.json({ message: "Updated." })
  } else {
    res.status(404).json({ message: "Not found." })
  }
})

router.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const index = users.findIndex((user) => user.id === id)
  if (index >= 0) {
    users.splice(index, 1)
    res.json({ message: "Deleted." })
  } else {
    res.status(404).json({ message: "Not found." })
  }
})

export default router