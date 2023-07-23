const contactsRouter = require("express").Router();
const Contact = require("../models/contact");

contactsRouter.get("/", (req, res) => {
  Contact.find({})
    .then((result) => {
      res.status(200);
      res.json(result);
      return;
    })
    .catch((error) => {
      res.status(400);
      res.send(error.message);
    });
});

contactsRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Contact.findById(id)
    .then((contact) => {
      if (contact) {
        res.status(200);
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

contactsRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;

  Contact.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

contactsRouter.post("/", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number)
    return res.status(400).send({
      error: "Contact needs a name and a number",
    });

  const newContact = new Contact({
    name: body.name,
    number: body.number,
  });

  newContact
    .save()
    .then(() => {
      res.status(201).json(newContact);
    })
    .catch((error) => next(error));
});

contactsRouter.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  const updatedContact = {
    name,
    number,
  };

  Contact.findByIdAndUpdate(id, updatedContact, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => res.status(200).json(result))
    .catch((error) => next(error));
});

contactsRouter.get("/info", (req, res) => {
  Contact.find({}).then((result) => {
    console.log(result);
    const numberOfContacts = result.length;
    const date = new Date();
    res.send(`<div>
    <p>
      Phonebook has info for ${numberOfContacts} people.
    </p>
    <p>
      ${date}
    </p>
  </div>`);
  });
});

module.exports = contactsRouter;
