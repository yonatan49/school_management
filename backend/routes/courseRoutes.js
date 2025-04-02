import express from "express";
import { Course } from "../models/courseModel.js";

const router = express.Router();

//route for adding a new course
router.post('/', async (request, response) => {
    try {
        const {
            courseName,
            campus,
            courseFee,
            description,
            durationDays,
            durationHours,
            durationWeeks,
            material,
            registrationFee,
            tests
        } = request.body;

        if (
            courseName === undefined ||
            campus === undefined ||
            courseFee === undefined ||
            description === undefined ||
            durationDays === undefined ||
            durationHours === undefined ||
            durationWeeks === undefined ||
            material === undefined ||
            registrationFee === undefined ||
            !Array.isArray(tests) || tests.length === 0
        ) {
            return response.status(400).send({ message: 'Send all required fields' });
        }

        const newCourse = {
            courseName,
            campus,
            courseFee,
            description,
            durationDays,
            durationHours,
            durationWeeks,
            material,
            registrationFee,
            tests
        };

        const course = await Course.create(newCourse);

        return response.status(201).send(course);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//route for getting all courses from database
router.get('/', async (request, response) => {
    try {
        const courses = await Course.find({});

        return response.status(200).json({
            count: courses.length,
            data: courses
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//route for getting one course from database by id
router.get('/:id', async (request, response) => {
    try {

        const { id } = request.params;

        const course = await Course.findById(id);

        return response.status(200).json(course);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//route for updating a course
router.put('/:id', async (request, response) => {
    try {
        const {
            courseName,
            campus,
            courseFee,
            description,
            durationDays,
            durationHours,
            durationWeeks,
            material,
            registrationFee,
            tests
        } = request.body;
        if (
            courseName === undefined ||
            campus === undefined ||
            courseFee === undefined ||
            description === undefined ||
            durationDays === undefined ||
            durationHours === undefined ||
            durationWeeks === undefined ||
            material === undefined ||
            registrationFee === undefined ||
            !Array.isArray(tests) || tests.length === 0
        ) {
            return response.status(400).send({ message: 'Send all required fields' });
        }

        const { id } = request.params;

        const result = await Course.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({ message: "Course not found" });
        }

        return response.status(200).json({ message: "Course updated successfully" });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

//route for deleting a course
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const result = await Course.findByIdAndDelete(id);
        
        if (!result) {
            return response.status(404).json({ message: "Course not found" });
        }

        return response.status(200).send({ message: "Course deleted successfully" });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message })
    }
})

export default router;