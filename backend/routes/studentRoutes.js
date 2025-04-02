import express from "express";
import { Student } from "../models/studentModel.js";

const router = express.Router();

// Route for adding a new student
router.post('/', async (req, res) => {
    try {
        const {
            fullName,
            imageURL,
            studentId,
            gender,
            phoneNumber,
            age,
            education,
            guardianPhoneNumber,
            admissionDate,
            nationality,
            maritalStatus,
            disability,
            employment,
            city,
            subCity,
            wereda
        } = req.body;

        if (
            fullName === undefined ||
            studentId === undefined ||
            gender === undefined ||
            phoneNumber === undefined ||
            age === undefined ||
            education === undefined ||
            guardianPhoneNumber === undefined ||
            admissionDate === undefined ||
            nationality === undefined ||
            maritalStatus === undefined ||
            disability === undefined ||
            employment === undefined ||
            city === undefined ||
            subCity === undefined
        ) {
            return res.status(400).send({ message: 'Send all required fields' });
        }

        const newStudent = {
            fullName,
            imageURL,
            studentId,
            gender,
            phoneNumber,
            age,
            education,
            guardianPhoneNumber,
            admissionDate,
            nationality,
            maritalStatus,
            disability,
            employment,
            city,
            subCity,
            wereda
        };

        const student = await Student.create(newStudent);

        return res.status(201).send(student);

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for getting all students from the database
router.get('/', async (req, res) => {
    try {
        const students = await Student.find({});

        return res.status(200).json({
            count: students.length,
            data: students
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for getting one student by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        return res.status(200).json(student);

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

//Route for getting one student by studentId
router.get('/check/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await Student.findOne({ studentId });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        return res.status(200).json(student);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for updating a student
router.put('/:id', async (req, res) => {
    try {
        const {
            fullName,
            imageURL,
            studentId,
            gender,
            phoneNumber,
            age,
            education,
            guardianPhoneNumber,
            admissionDate,
            nationality,
            maritalStatus,
            disability,
            employment,
            city,
            subCity,
            wereda
        } = req.body;

        if (
            !fullName ||
            !studentId ||
            !gender ||
            !phoneNumber ||
            !age ||
            !education ||
            !guardianPhoneNumber ||
            !admissionDate ||
            !nationality ||
            !maritalStatus ||
            disability === undefined ||
            employment === undefined ||
            !city ||
            !subCity
        ) {
            return res.status(400).send({ message: 'Send all required fields' });
        }

        const { id } = req.params;

        const updatedStudent = {
            fullName,
            imageURL,
            studentId,
            gender,
            phoneNumber,
            age,
            education,
            guardianPhoneNumber,
            admissionDate,
            nationality,
            maritalStatus,
            disability,
            employment,
            city,
            subCity,
            wereda
        };

        const result = await Student.findByIdAndUpdate(id, updatedStudent, { new: true });

        if (!result) {
            return res.status(404).json({ message: "Student not found" });
        }

        return res.status(200).json({ message: "Student updated successfully", data: result });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for deleting a student
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Student.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Student not found" });
        }

        return res.status(200).send({ message: "Student deleted successfully" });

    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

export default router;
