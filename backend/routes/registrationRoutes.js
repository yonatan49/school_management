import express from 'express';
import { Registration } from '../models/registrationModel.js';
import { Student } from '../models/studentModel.js';
import { Course } from '../models/courseModel.js';

const router = express.Router();

// Create a new registration
router.post('/', async (req, res) => {
    const {
        studentId,
        courseIds,
        totalFee,
        discount = 0,
        discountedFee,
        paidOn1,
        paidAmount1,
        paymentReceipt1 = '',
        paidOn2 = null,
        paidAmount2 = 0,
        paymentReceipt2 = '',
        approvedBy = '',
    } = req.body;

    try {
        // Validate the studentId
        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Validate the courseIds
        const courses = await Course.find({ _id: { $in: courseIds } });
        if (courses.length !== courseIds.length) {
            return res.status(404).json({ message: 'Some courses not found' });
        }

        const newRegistration = new Registration({
            studentId,
            courseIds,
            totalFee,
            discount,
            discountedFee,
            paidOn1,
            paidAmount1,
            paymentReceipt1,
            paidOn2,
            paidAmount2,
            paymentReceipt2,
            approvedBy,
        });

        const savedRegistration = await newRegistration.save();
        res.status(201).json(savedRegistration);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all registrations
router.get('/', async (req, res) => {
    try {
        const registrations = await Registration.find();
        res.status(200).json({
            count: registrations.length,
            data: registrations
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get a single registration by ID
router.get('/:id', async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        res.status(200).json(registration);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update a registration
router.put('/:id', async (req, res) => {
    const {
        studentId,
        courseIds,
        totalFee,
        discount = 0,
        discountedFee,
        paidOn1,
        paidAmount1,
        paymentReceipt1 = '',
        paidOn2 = null,
        paidAmount2 = 0,
        paymentReceipt2 = '',
        approvedBy = '',
    } = req.body;

    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        registration.studentId = studentId || registration.studentId;
        registration.courseIds = courseIds.length ? courseIds : registration.courseIds;
        registration.totalFee = totalFee || registration.totalFee;
        registration.discount = discount || registration.discount;
        registration.discountedFee = discountedFee || registration.discountedFee;
        registration.paidOn1 = paidOn1 || registration.paidOn1;
        registration.paidAmount1 = paidAmount1 || registration.paidAmount1;
        registration.paymentReceipt1 = paymentReceipt1 || registration.paymentReceipt1;
        registration.paidOn2 = paidOn2 || registration.paidOn2;
        registration.paidAmount2 = paidAmount2 || registration.paidAmount2;
        registration.paymentReceipt2 = paymentReceipt2 || registration.paymentReceipt2;
        registration.approvedBy = approvedBy || registration.approvedBy;

        const updatedRegistration = await registration.save();
        res.status(200).json(updatedRegistration);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete a registration
router.delete('/:id', async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        await registration.remove();
        res.status(200).json({ message: 'Registration deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

export default router;
