const { Schema, default: mongoose } = require('mongoose');

const clientSchema = new Schema({
    name:{
        type:String,
        required:[true, "Name is a required field"],
        unique:true
    },
    adminID:{
        type:String,
        required:[true, "Admin ID is a required field"],
        unique:true
    },
    adminPassword : {
        type:String,
        required:[true, "Admin Password is a required field"]
    },
    dateOfRegistration : {
        type:Date,
        required:false,
        default:Date.now()
    },
    dateOfBilling : {
        type:Date,
        required:false,
        default:Date.now()
    },
    contactName : {
        type:String,
        required:[true, "Primary contact name is a required field"]
    },
    contactPhone : {
        type:String,
        required:[true, "Primary contact phone is a required field"]
    },
    contactEmail : {
        type:String,
        required:[true, "Primary contact email is a required field"]
    },
    city : {
        type:String,
        required:[true, "City is a required field"]
    },
    state : {
        type:String,
        required:[true, "State is a required field"]
    }
});
// Method to hide password when converting to JSON
clientSchema.methods.toJSON = function() {
    const client = this.toObject();
    delete client.adminPassword;
    return client;
  };

const Client = mongoose.model('Clients',clientSchema);
module.exports = {Client};