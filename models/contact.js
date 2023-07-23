const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactsSchema = new Schema({
  name: { type: String, required: true, minLength: 3 },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: (v) => {
        // eslint-disable-next-line
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
          v
        );
      },
      message: (props) =>
        `${props.value} must be in one of the following formats: 123-12345678 or 12-12345678`,
    },
  },
});

contactsSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Contact = mongoose.model("Contact", contactsSchema);

module.exports = Contact;
