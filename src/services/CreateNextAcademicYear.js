const mongoose = require('mongoose');
const AcademicYear = require('../models/AcademicYear'); // Assuming your AcademicYear model is in 'models/AcademicYear'

// Function to create the next academic year
const createNextAcademicYear = async () => {
  try {
    // Find the most recent academic year
    const lastAcademicYear = await AcademicYear.findOne().sort({ createdAt: -1 });

    // If no academic year exists, we start with the first one (e.g., "2024/2025")
    if (!lastAcademicYear) {
      const newAcademicYear = new AcademicYear({
        academic_year: "2024/2025", // Starting academic year
        start_date: new Date("2024-09-01"), // Example start date
        end_date: new Date("2025-06-30"), // Example end date
      });

      await newAcademicYear.save();
      console.log('New academic year created:', newAcademicYear.academic_year);
    } else {
      // Determine the next academic year based on the last academic year
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      
      // Format the next academic year as "2025/2026" from "2024/2025"
      const nextAcademicYear = `${currentYear + 1}/${nextYear}`;
      
      // Check if the next academic year already exists
      const existingYear = await AcademicYear.findOne({ academic_year: nextAcademicYear });
      if (existingYear) {
        console.log('Academic year already exists:', nextAcademicYear);
        return; // Avoid creating a duplicate
      }

      // Create new academic year
      const newStartDate = new Date(`${nextYear}-09-01`);
      const newEndDate = new Date(`${nextYear + 1}-06-30`);

      const academicYear = new AcademicYear({
        academic_year: nextAcademicYear,
        start_date: newStartDate,
        end_date: newEndDate,
      });

      await academicYear.save();
      console.log('New academic year created:', nextAcademicYear);
    }
  } catch (error) {
    console.error('Error creating new academic year:', error);
  }
};

// Run the function when appropriate (for example, every day at midnight)
createNextAcademicYear();
