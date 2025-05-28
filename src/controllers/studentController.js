const Student = require('../models/Student'); // Assuming you have a Student model
const ClassLevel = require('../models/ClassLevel');
const fs = require('fs');
const csv = require('csv-parser');
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

    if (!first_name || !last_name || !date_of_birth || !school_id) {
      return res.status(400).json({ message: 'Missing required student fields.' });
    }

    const existingStudent = await Student.findOne({
      first_name: new RegExp(`^${first_name}$`, 'i'),
      last_name: new RegExp(`^${last_name}$`, 'i'),
      date_of_birth: new Date(date_of_birth),
      school_id,
    });

    if (existingStudent) {
      // Dynamically update all fields passed in req.body
      Object.keys(req.body).forEach(key => {
        existingStudent[key] = req.body[key];
      });

      await existingStudent.save();

      return res.status(200).json({
        message: 'Student already existed. Fields updated.',
        student: existingStudent,
      });
    }

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
    let student = await Student.findOne({ student_id: req.params.id });
    if (!student) {
      student = await Student.findOne({ _id: req.params.id });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      return res.json(student);
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.Message });
  }
};

// // Update student record by ID
const updateStudentById = async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate({ student_id: req.params.id }, req.body, { new: true });
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
    const deletedStudent = await Student.findOneAndDelete({ student_id: req.params.id });
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchStudent = async (req, res) => {
  try {
    const { student_id, name, school_id } = req.query;

    if (!school_id) {
      return res.status(400).json({ message: 'Missing required parameter: school_id' });
    }

    // Step 1: Get all students from the school
    const studentsFromSchool = await Student.find({ school_id });

    if (!studentsFromSchool.length) {
      return res.status(404).json({ message: 'No students found in this school.' });
    }

    // Step 2: Filter in-memory
    let filteredStudents = studentsFromSchool;

    if (student_id) {
      filteredStudents = filteredStudents.filter(student => student.student_id === student_id);
    }

    if (name) {
      const nameRegex = new RegExp(name.replace(/\s+/g, '.*'), 'i');

      filteredStudents = filteredStudents.filter(student => {
        const fullName1 = `${student.first_name} ${student.last_name}`;
        const fullName2 = `${student.last_name} ${student.first_name}`;
        return nameRegex.test(fullName1) || nameRegex.test(fullName2);
      });
    }

    if (!filteredStudents.length) {
      return res.status(404).json({ message: 'No matching students found in this school.' });
    }

    // Step 3: Return results
    res.status(200).json(filteredStudents);
  } catch (err) {
    console.error('Student search error:', err);
    res.status(500).json({ message: 'Error searching students.' });
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
  const schoolId = req.params.schoolId;
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ message: 'CSV file is required' });
  }

  const results = [];
  const errors = [];

  const normalizeGender = (gender) => {
    if (!gender) return 'Other';
    const g = gender.trim().toLowerCase();
    if (g === 'm' || g === 'male') return 'Male';
    if (g === 'f' || g === 'female') return 'Female';
    return 'Other';
  };

  const parseStudentName = (name) => {
    if (!name) return { first_name: '', middle_name: '', last_name: '' };
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return {
        first_name: parts[0],
        middle_name: '',
        last_name: 'Unknown',
      };
    }

    if (parts.length === 2) {
      return {
        first_name: parts[0],
        middle_name: '',
        last_name: parts[1],
      };
    }

    return {
      first_name: parts[0],
      middle_name: parts.slice(1, -1).join(' '),
      last_name: parts[parts.length - 1],
    };
  };


  const getClassLevelId = async (label) => {
    if (!label) return null;
    const classLevel = await ClassLevel.findOne({
      name: { $regex: new RegExp(`^${label}$`, 'i') },
      school_id: schoolId,
    });
    return classLevel?._id ?? null;
  };

  try {
    // Parse CSV rows into results array
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => results.push(row))
        .on('error', reject)
        .on('end', resolve);
    });

    for (const [index, row] of results.entries()) {
      try {
        const { 'Student Name': name, Birthday, Gender, 'Class Level': level, 'Place of Birth': place_of_birth } = row;

        if (!name || !Birthday || !level) {
          errors.push({ row: index + 1, error: 'Missing required fields (Student Name, Birthday, or Class Level)' });
          continue;
        }

        const { first_name, middle_name, last_name } = parseStudentName(name);
        if (!first_name || !last_name) {
          errors.push({ row: index + 1, error: 'Invalid Student Name format' });
          continue;
        }

        const class_level = await getClassLevelId(level);
        if (!class_level) {
          errors.push({ row: index + 1, error: `Class Level "${level}" not found for this school` });
          continue;
        }

        const existingStudent = await Student.findOne({
          first_name: new RegExp(`^${first_name}$`, 'i'),
          last_name: new RegExp(`^${last_name}$`, 'i'),
          date_of_birth: new Date(Birthday),
          school_id: schoolId,
        });

        if (existingStudent) {
          errors.push({ row: index + 1, error: 'Student already registered' });
          continue;
        }

        // Generate a temporary student_id - replace with your unique ID generator as needed
        const studentId = await ensureUniqueId(Student, 'student_id', 'STD');

        const student = new Student({
          student_id: studentId,
          first_name,
          middle_name,
          last_name,
          school_id: schoolId,
          gender: normalizeGender(Gender),
          date_of_birth: new Date(Birthday),
          place_of_birth,
          class_level,
          registered: false,
        });

        await student.save();
      } catch (e) {
        errors.push({ row: index + 1, error: e.message });
      }
    }

    // Clean up uploaded file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete uploaded CSV:', err);
    });

    res.status(200).json({
      message: 'Import finished',
      total: results.length,
      successful: results.length - errors.length,
      errors,
    });
  } catch (err) {
    // Clean up on error
    fs.unlink(filePath, () => { });
    res.status(500).json({ message: 'Failed to process CSV', error: err.message });
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
  getStudentsByClassAndSchool,
  getStudentsBySchoolId,
  importStudentsFromCSV,
  searchStudent,
};
