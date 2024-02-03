const mongoose = require('mongoose')
require('dotenv').config();

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI ;

console.log('connecting to', url)

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://your-database-url', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add other options if needed
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Handle error appropriately
  }
}

connectToDatabase();


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true

  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Please use the format xx-xxxxx.`
    },
    



    required: true,
    unique: true

  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('person', personSchema)