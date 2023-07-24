const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Contact = require("../models/contact");

const initialContacts = [
  {
    name: "Carlos",
    number: "0473564811",
  },
  {
    name: "Coni",
    number: "0473939897",
  },
];

beforeEach(async () => {
  await Contact.deleteMany({});
  let contactObject = new Contact(initialContacts[0]);
  await contactObject.save();
  contactObject = new Contact(initialContacts[1]);
  await contactObject.save();
}, 100000);

test("contacts are returned as JSON", async () => {
  await api
    .get("/api/persons")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("all contacts are returned", async () => {
  const response = api.get("/api/contacts");
  expect(response.body).toHaveLength(initialContacts.length);
});

test("there are two contacts", async () => {
  const response = await api.get("/api/persons");
  expect(response.body).toHaveLength(2);
});

test("first contact is named Carlos", async () => {
  const response = await api.get("/api/persons");
  expect(response.body[0].name).toBe("Carlos");
});

test("a specific contact is within the returned contacts", async () => {
  const response = await api.get("/api/persons");
  const contacts = response.body.map((contact) => contact.name);
  expect(contacts).toContain("Coni");
});

afterAll(async () => {
  await mongoose.connection.close();
});
