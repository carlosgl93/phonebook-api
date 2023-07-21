const express = require("express");
const morgan = require("morgan");
const app = express();

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
    ].join(" ");
  })
);
app.use(express.json());

let contacts = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456",
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345",
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 99999999);
};

app.get("/api/persons", (req, res) => {
  res.json(contacts);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const contact = contacts.find((c) => Number(id) === c.id);

  if (!contact) {
    res.status(404).end();
    return;
  }

  res.json(contact);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedContacts = contacts.filter((c) => id !== c.id);
  console.log(updatedContacts, "new contacts");
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number)
    return res.status(400).send({
      error: "Contact needs a name and a number",
    });

  if (contacts.find((c) => c.name === body.name))
    return res.status(400).json({ error: "That contact already exists" });

  const newContact = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  contacts = contacts.concat(newContact);
  console.log(contacts);

  res.status(201).json(newContact);
});

app.get("/info", (req, res) => {
  const numberOfContacts = contacts.length;
  console.log(numberOfContacts);
  const date = new Date();

  res.send(`<div>
    <p>
      Phonebook has info for ${numberOfContacts} people
    </p>
    <p>
      ${date}
    </p>
  </div>`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
