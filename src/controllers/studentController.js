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

const getStudentsBySchoolId = async (req, res) => {
  const { schoolId } = req.query;
  if (!schoolId) {
    return res.status(400).json({ message: 'Missing schoolId in query' });
  }

  try {
    const students = await Student.find({ school_id: schoolId });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// // Create a new student record
const createStudent = async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, school_id } = req.body;

    // Validate required fields (optional but good practice)
    if (!first_name || !last_name || !date_of_birth || !school_id) {
      return res.status(400).json({ message: 'Missing required student fields.' });
    }

    // Find existing student
    const existingStudent = await Student.findOne({
      first_name: new RegExp(`^${first_name}$`, 'i'),
      last_name: new RegExp(`^${last_name}$`, 'i'),
      date_of_birth: new Date(date_of_birth),
      school_id,
    });

    if (existingStudent) {
      // Only update allowed fields
      const updatableFields = ['school_id', 'address', 'class', 'phone_number', 'email'];

      updatableFields.forEach(field => {
        if (req.body[field] !== undefined) {
          existingStudent[field] = req.body[field];
        }
      });

      await existingStudent.save();

      return res.status(200).json({
        message: 'Student already existed. Allowed fields updated.',
        student: existingStudent,
      });
    }

    // Create new student
    const studentId = await ensureUniqueId(Student, 'student_id', 'STD');
    const newStudent = new Student({ student_id: studentId, ...req.body });
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (err) {
    console.error('Error creating/updating student:', err);
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

const getStudentById = async (req, res) => {
  try {
    let student = await Student.findOne({student_id:req.params.id});
    if (!student) {
      student = await Student.findOne({_id:req.params.id});
      if(!student){
        return res.status(404).json({ message: 'Student not found' });
      }
      return res.json(student);
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err. Message });
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

const importStudentsFromCSV = async (req, res) => {
  const csv = require('csv-parser');
  const fs = require('fs');
  const Student = require('../models/Student');
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const inserted = await Promise.all(
          results.map(async (row) => {
            const student = new Student({
              student_id: row.student_id,
              first_name: row.first_name,
              last_name: row.last_name,
              middle_name: row.middle_name || '',
              gender: row.gender,
              nationality: row.nationality,
              date_of_birth: new Date(row.date_of_birth),
              school_id: row.school_id,
              class_id: row.class_id || null,
              class_level: row.class_level || null,
              address: row.address,
              phone: row.phone,
              guardian_name: row.guardian_name,
              guardian_phone: row.guardian_phone,
              guardian_relationship: row.guardian_relationship,
              guardian_address: row.guardian_address,
              status: row.status || 'not enrolled', // ✅ Use status from CSV
            });

            return await student.save();
          })
        );

        fs.unlinkSync(req.file.path);
        res.status(200).json({
          message: 'Students imported successfully',
          count: inserted.length,
        });
      } catch (error) {
        res.status(500).json({
          error: 'Error importing students',
          details: error.message,
        });
      }
    });
};

module.exports = {
  testStudentResponse,
  getAllStudents,
  createStudent,
  getStudentById,
  updateStudentById,
  deleteStudentById,
  deleteMultipleStudents,
  getStudentsByClassAndSchool,
  getStudentsBySchoolId,
  importStudentsFromCSV,
};
