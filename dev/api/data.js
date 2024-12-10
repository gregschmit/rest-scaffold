import { faker } from "@faker-js/faker"

function copy(from) {
  return JSON.parse(JSON.stringify(from))
}

function mutateCopy(from, to) {
  to.length = 0
  for (const row of copy(from)) {
    to.push(row)
  }
}

faker.seed(1234)
const USERS = Array.from({ length: 40 }, (_, i) => {
  const id = i + 1
  const login = faker.internet.username()
  let name = faker.person.fullName()
  const active = faker.datatype.boolean(0.9)
  let birth_date = faker.date
    .birthdate({ mode: "age", min: 18, max: 90 })
    .toISOString()
    .split("T")[0]
  let birth_time = faker.date.future().toISOString().split("T")[1].split(".")[0]
  let next_exam = faker.date.future().toISOString()
  const risk_score = faker.number.float({ min: 0, max: 10000, fractionDigits: 3 })
  const balance = faker.finance.amount()
  const created_at = faker.date.past({ years: 10 }).toISOString()

  if (i == 1) {
    name = `<b>${name}</b>`
    birth_date = `${birth_date} <script>alert("hi!")</script>`
    birth_time = `${birth_time} <script>alert("hi!")</script>`
    next_exam = `${next_exam} <script>alert("hi!")</script>`
  }

  return {
    id,
    login,
    name,
    active,
    birth_date,
    birth_time,
    next_exam,
    risk_score,
    balance,
    created_at,
  }
})

function setup() {
  console.log("Setting up database.")
  let users = copy(USERS)

  return [
    users,
    () => {
      console.log("Resetting database.")
      mutateCopy(USERS, users)
    },
  ]
}

export let [users, reset] = setup()
