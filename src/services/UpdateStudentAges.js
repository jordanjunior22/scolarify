const Student = require('../models/Student'); 
async function updateAllStudentAges() {
    try {
      const students = await Student.find({ dob: { $exists: true, $ne: null } });
  
      const updates = students.map(student => {
        const today = new Date();
        const dob = new Date(student.dob);
  
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
  
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
  
        student.age = age;
        return student.save(); // Save the updated student
      });
  
      await Promise.all(updates);
      console.log(`Updated ${updates.length} students with correct ages.`);
    } catch (error) {
      console.error('Error updating student ages:', error);
    }
  }
  
  module.exports = {updateAllStudentAges };  
  