const Student = require('../models/Student'); // Assuming you have a Student model

const testStudentResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is student' });
};

// // Get all student records
// const getAllStudents = async (req, res) => {
//   try {
//     const students = await Student.find();
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Create a new student record
// const createStudent = async (req, res) => {
//   try {
//     const newStudent = new Student(req.body);
//     await newStudent.save();
//     res.status(201).json(newStudent);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // Get a student record by ID
// const getStudentById = async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }
//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Update student record by ID
// const updateStudentById = async (req, res) => {
//   try {
//     const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedStudent) {
//       return res.status(404).json({ message: 'Student not found' });
//     }
//     res.json(updatedStudent);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // Delete student record by ID
// const deleteStudentById = async (req, res) => {
//   try {
//     const deletedStudent = await Student.findByIdAndDelete(req.params.id);
//     if (!deletedStudent) {
//       return res.status(404).json({ message: 'Student not found' });
//     }
//     res.json({ message: 'Student record deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

module.exports = {
  testStudentResponse,
//   getAllStudents,
//   createStudent,
//   getStudentById,
//   updateStudentById,
//   deleteStudentById,
};
