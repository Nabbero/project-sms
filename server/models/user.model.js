const { Schema, default: mongoose } = require('mongoose');

const userSchema = new Schema({
    name:{
        type:String,
        required:[true, "Name is a required field"]
    },
    userID:{
        type:String,
        required:[true, "User ID is a required field"],
        unique:true
    },
    userPassword:{
        type:String,
        required:[true, "User Password is a required field"]
    },
    userType:{
        type:String,
        required:[true, "User Type is a required field"]
    },
    gender:{
        type:String,
        required:[true, "Gender is a required field"]
    },
    dateOdBirth:{
        type:Date,
        required:[true, "Date of birth is a required field"]
    },
    dateOfRegistration:{
        type:Date,
        default:Date.now()
    },
    contactNumber:{
        type:String,
        required:[true, "Contact number is a required field"]
    },
    clientID : {
        type : Schema.Types.ObjectId,
        ref : 'Clients'
    },
    lastModifiedDate:{
        type:Date,
        default:Date.now()
    },
});

// Method to hide password when converting to JSON
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.userPassword;
    return user;
  };


const User = mongoose.model('Users',userSchema);

module.exports= {User};