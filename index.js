require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const app = express()
const Contact = require("./models/Contacts")

app.use(express.static("build"))
app.use(express.json())
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      req.method === "POST" ? JSON.stringify(req.body) : "",
    ].join(" ")
  })
)

app.use(cors())

app.get("/api/persons", (req, res) => {
  Contact.find({})
    .then((result) => {
      res.status(200)
      res.json(result)
      return
    })
    .catch((error) => {
      res.status(400)
      res.send(error.message)
    })
})

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        res.status(200)
        res.json(contact)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id

  Contact.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.post("/api/persons", (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number)
    return res.status(400).send({
      error: "Contact needs a name and a number",
    })

  const newContact = new Contact({
    name: body.name,
    number: body.number,
  })

  newContact
    .save()
    .then(() => {
      res.status(201).json(newContact)
    })
    .catch((error) => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
  const { id } = req.params
  const { name, number } = req.body

  const updatedContact = {
    name,
    number,
  }

  Contact.findByIdAndUpdate(id, updatedContact, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => res.status(200).json(result))
    .catch((error) => next(error))
})

app.get("/info", (req, res) => {
  Contact.find({}).then((result) => {
    console.log(result)
    const numberOfContacts = result.length
    const date = new Date()
    res.send(`<div>
    <p>
      Phonebook has info for ${numberOfContacts} people.
    </p>
    <p>
      ${date}
    </p>
  </div>`)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Bad request, id malformed" })
  } else if (error.name === "ValidationError") {
    console.log(error)
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`)
})
