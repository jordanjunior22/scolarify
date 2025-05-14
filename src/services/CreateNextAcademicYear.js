const AcademicYear = require('../models/AcademicYear')

const createNextAcademicYear = async () => {
    try {
      const currentMonth = new Date().getMonth(); // 0 = January, 6 = July
  
      // Only proceed if current month is July (6)
      if (currentMonth !== 6) {
        console.log("Academic year generation is only allowed in July.");
        return;
      }
  
      const lastAcademicYear = await AcademicYear.findOne().sort({ createdAt: -1 });
  
      if (!lastAcademicYear) {
        const newAcademicYear = new AcademicYear({
          academic_year: "2024/2025",
          start_date: new Date("2024-09-01"),
          end_date: new Date("2025-06-30"),
        });
  
        await newAcademicYear.save();
        console.log("New academic year created:", newAcademicYear.academic_year);
        return;
      }
  
      const [startYearStr, endYearStr] = lastAcademicYear.academic_year.split('/');
      const startYear = parseInt(startYearStr, 10);
      const endYear = parseInt(endYearStr, 10);
  
      const newStartYear = startYear + 1;
      const newEndYear = endYear + 1;
      const nextAcademicYear = `${newStartYear}/${newEndYear}`;
  
      const existingYear = await AcademicYear.findOne({ academic_year: nextAcademicYear });
      if (existingYear) {
        console.log("Academic year already exists:", nextAcademicYear);
        return;
      }
  
      const newStartDate = new Date(`${newStartYear}-09-01`);
      const newEndDate = new Date(`${newEndYear}-06-30`);
  
      const academicYear = new AcademicYear({
        academic_year: nextAcademicYear,
        start_date: newStartDate,
        end_date: newEndDate,
      });
  
      await academicYear.save();
      console.log("New academic year created:", nextAcademicYear);
    } catch (error) {
      console.error("Error creating new academic year:", error);
    }
  };
  
  module.exports = {createNextAcademicYear };  