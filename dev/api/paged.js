import express from "express"

import { users, reset } from "./data.js"

// Setup the router.
let router = express.Router()

router.get("/", (_req, res) => {
  res.send("Paged API.")
})

router.post("/reset", (_req, res) => {
  reset()
  res.json({ message: "Data reset." })
})

router.get("/users", async (req, res) => {
  await new Promise((r) => setTimeout(r, 500))

  // if (Math.random() < 0.5) {
  //   res.status(429).end()
  //   return
  // }

  const pageSize = parseInt(req.query.page_size) || 10
  const page = parseInt(req.query.page) || 1

  // Clone the users array.
  let data = [...users]

  // If `order` query param is set, then sort the data by the specified field.
  if (req.query.order) {
    const order = req.query.order
      .split(",")
      .map((item) => (item.startsWith("-") ? [item.slice(1), -1] : [item, 1]))

    for (const [field, direction] of order) {
      data.sort((a, b) => {
        if (a[field] < b[field]) {
          return -1 * direction
        } else if (a[field] > b[field]) {
          return 1 * direction
        } else {
          return 0
        }
      })
    }
  }

  // Page the data.
  data = data.slice((page - 1) * pageSize, page * pageSize)

  res.json({
    count: users.length,
    page: page,
    page_size: pageSize,
    total_pages: Math.ceil(users.length / pageSize),
    results: data,
  })
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
