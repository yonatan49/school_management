import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        imageURL: {
            type: String,
            required: false,
        },
        studentId: {
            type: String,
            required: true,
            unique: true,
        },
        gender: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        education: {
            type: String,
            required: true,
        },
        guardianPhoneNumber: {
            type: String,
            required: true,
        },
        admissionDate: {
            type: Date,
            required: true,
        },
        nationality: {
            type: String,
            required: true,
        },
        maritalStatus: {
            type: String,
            required: true,
        },
        disability: {
            type: String,
            required: true,
        },
        employment: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        subCity: {
            type: String,
            required: true,
        },
        wereda: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

export const Student = mongoose.model('Student', studentSchema);