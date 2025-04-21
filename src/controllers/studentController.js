const Student = require('../models/Student'); // Assuming you have a Student model
const { ensureUniqueId } = require('../utils/generateId'); 

const testStudentResponse = (req, res) => {
  res.status(200).json({ message: 'Hi, this is student' });
};

// // Get all student records
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Create a new student record
const createStudent = async (req, res) => {
  try {
    const StudentId = await ensureUniqueId(Student, 'student_id', 'STD');
    const newStudent = new Student({student_id:StudentId,...req.body});
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getStudentsByClassAndSchool = async (req, res) => {
  const { classId, schoolId } = req.params;

  try {
    const students = await Student.find({
      class_id: classId,
      school_id: schoolId,
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Get a student record by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({student_id:req.params.id});
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Update student record by ID
const updateStudentById = async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate({student_id:req.params.id}, req.body, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// // Delete student record by ID
const deleteStudentById = async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({student_id:req.params.id});
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete multiple student records by IDs
const deleteMultipleStudents = async (req, res) => {
  const { ids } = req.body; // Expecting an array of student IDs in the request body
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid input: ids should be a non-empty array' });
  }

  try {
    // Delete student records where _id is in the provided array of IDs
    const result = await Student.deleteMany({ _id: { $in: ids } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No student records found for the provided IDs' });
    }
    
    res.json({ message: `${result.deletedCount} student records deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  testStudentResponse,
  getAllStudents,
  createStudent,
  getStudentById,
  updateStudentById,
  deleteStudentById,
  deleteMultipleStudents,
  getStudentsByClassAndSchool
};
