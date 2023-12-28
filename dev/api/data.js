function copy(from) {
  return JSON.parse(JSON.stringify(from))
}

function mutateCopy(from, to) {
  to.length = 0
  for (const row of copy(from)) {
    to.push(row)
  }
}

const USERS = [
  { id: 1, login: "alice", first_name: "Alice", last_name: "Smith", note: "" },
  { id: 2, login: "bob", first_name: "Bob", last_name: "Jones", note: "" },
  { id: 3, login: "carol", first_name: "Carol", last_name: "Johnson", note: "" },
  { id: 4, login: "dave", first_name: "Dave", last_name: "Anderson", note: "" },
  { id: 5, login: "eve", first_name: "Eve", last_name: "Herily", note: "" },
  { id: 6, login: "frank", first_name: "Frank", last_name: "Baker", note: "" },
  { id: 7, login: "grace", first_name: "Grace", last_name: "Davis", note: "" },
  { id: 8, login: "heidi", first_name: "Heidi", last_name: "Erickson", note: "" },
  { id: 9, login: "ivan", first_name: "Ivan", last_name: "Ferguson", note: "" },
  { id: 10, login: "judy", first_name: "Judy", last_name: "Garcia", note: "" },
  { id: 11, login: "kelly", first_name: "Kelly", last_name: "Hernandez", note: "" },
  { id: 12, login: "larry", first_name: "Larry", last_name: "Iverson", note: "" },
  { id: 13, login: "mary", first_name: "Mary", last_name: "Johnson", note: "" },
  { id: 14, login: "nancy", first_name: "Nancy", last_name: "Kilpatrick", note: "" },
  { id: 15, login: "olivia", first_name: "Olivia", last_name: "Lopez", note: "" },
  { id: 16, login: "peter", first_name: "Peter", last_name: "Mason", note: "" },
  { id: 17, login: "quinn", first_name: "Quinn", last_name: "Nelson", note: "" },
  { id: 18, login: "robert", first_name: "Robert", last_name: "Olsen", note: "" },
  { id: 19, login: "sally", first_name: "Sally", last_name: "Peters", note: "" },
  { id: 20, login: "tom", first_name: "Tom", last_name: "Quinn", note: "" },
  { id: 21, login: "ursula", first_name: "Ursula", last_name: "Robinson", note: "" },
  { id: 22, login: "victor", first_name: "Victor", last_name: "Smith", note: "" },
  { id: 23, login: "wendy", first_name: "Wendy", last_name: "Thomas", note: "" },
  { id: 24, login: "xavier", first_name: "Xavier", last_name: "Underwood", note: "" },
  { id: 25, login: "yvonne", first_name: "Yvonne", last_name: "Vargas", note: "" },
  { id: 26, login: "zach", first_name: "Zach", last_name: "Williams", note: "" },
  { id: 27, login: "adam", first_name: "Adam", last_name: "Anderson", note: "" },
  { id: 28, login: "barbara", first_name: "Barbara", last_name: "Baker", note: "" },
  { id: 29, login: "charles", first_name: "Charles", last_name: "Carter", note: "" },
  { id: 30, login: "diane", first_name: "Diane", last_name: "Davis", note: "" },
  { id: 31, login: "edward", first_name: "Edward", last_name: "Erickson", note: "" },
  { id: 32, login: "frances", first_name: "Frances", last_name: "Ferguson", note: "" },
  { id: 33, login: "george", first_name: "George", last_name: "Garcia", note: "" },
  { id: 34, login: "helen", first_name: "Helen", last_name: "Hernandez", note: "" },
  { id: 35, login: "ian", first_name: "Ian", last_name: "Iverson", note: "" },
  { id: 36, login: "jane", first_name: "Jane", last_name: "Johnson", note: "" },
  { id: 37, login: "kevin", first_name: "Kevin", last_name: "Kilpatrick", note: "" },
  { id: 38, login: "linda", first_name: "Linda", last_name: "Lopez", note: "" },
]

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
