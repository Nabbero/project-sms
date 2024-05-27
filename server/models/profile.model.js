const { Schema } = require('mongoose');

const studentSchema = new Schema({
    additionalInfo: {
      bloodGroup: String,
      photo: String,
      altPhone: String,
      email: String,
      nationality: String,
      religion: String,
      languages: [String],
      hobbies: [String],
      address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
      }
    },
    parents: {
      father: {
        name: String,
        occupation: String,
        phone: String,
        email:String
      },
      mother: {
        name: String,
        occupation: String,
        phone: String,
        email: String,
      },
      guardian: {
        name: String,
        relation: String,
        phone: String,
        email: String,
      }
    },
    academicInfo: {
      enrollmentDate: Date,
      completionDate : Date,
      grade: String,
      section: String,
      rollNo: String,
      classroom:String,
      previousSchool: String,
      activities: [String]
    },
    adminInfo: {
      admissionNo: String,
      admissionDate: Date,
      status:String,
      scholarship: { 
        status:Boolean, 
        type: String, 
        amount: String, 
        renewalDate: Date
      },
      busRoute: String,
      libraryCard: String,
      hostel: { 
        status:Boolean, 
        name: String,
        room: String
    }
    },
    documents: [
      { type: String, url: String }
    ]
  }
  )