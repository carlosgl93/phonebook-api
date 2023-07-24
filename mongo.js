const mongoose = require("mongoose");

console.log(process.argv);

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://cgumucio93:${password}@helsinki.k8kmjpw.mongodb.net/testPhonebookDb?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length < 4) {
  Contact.find({}).then((res) => {
    console.log("Phonebook Contacts:");
    res.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
  return;
}

const newContactName = process.argv[3];
const newContactNumber = process.argv[4];

const newContact = new Contact({
  name: newContactName,
  number: newContactNumber,
});

newContact.save().then(() => {
  console.log(
    `Added ${newContactName} number: ${newContactNumber} to phonebook`
  );
  mongoose.connection.close();
});
