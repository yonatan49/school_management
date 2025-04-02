import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true,
        },
        campus: {
            type: String,
            required: true,
        },
        courseFee: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        durationDays: {
            type: Number,
            required: true,
        },
        durationHours: {
            type: Number,
            required: true,
        },
        durationWeeks: {
            type: Number,
            required: true,
        },
        material: {
            type: String,
            required: true,
        },
        registrationFee: {
            type: Number,
            required: true,
        },
        tests: {
            type: [{ type: String }],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Course = mongoose.model('Course', courseSchema);