import mongoose from "mongoose";

const registrationSchema = mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true,
        },
        courseIds: {
            type: Array,
            required: true,
        },
        totalFee: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: false,
        },
        discountedFee: {
            type: Number,
            required: true,
        },
        paidOn1: {
            type: Date,
            required: true,
        },
        paidAmount1: {
            type: Number,
            required: true,
        },
        paymentReceipt1: {
            type: String,
            required: false,
        },
        paidOn2: {
            type: Date,
            required: false,
        },
        paidAmount2: {
            type: Number,
            required: false,
        },
        paymentReceipt2: {
            type: String,
            required: false,
        },
        approvedBy: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

export const Registration = mongoose.model('Registration', registrationSchema);