/**
 * ABC School Management System - Core Dataset & Sibling Discount Engine
 * Contains 18 detailed pre-loaded student records across family units.
 */

const CORE_SUBJECTS = [
  "Social Studies",
  "Mathematics",
  "General Science",
  "English",
  "Urdu",
  "Islamic Studies",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Arts"
];

// Central Currency Formatter (Rupees)
function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString()}`;
}

// Base Fee Schedule by Grade Range (in Rupees)
const GRADE_BASE_FEES = {
  1: 5000,
  2: 5000,
  3: 5500,
  4: 6000,
  5: 6500,
  6: 7000,
  7: 7500,
  8: 8000,
  9: 9000,
  10: 10000
};

// Sibling Discount Rules
// 1 child = 0%, 2 siblings = 10% each, 3+ siblings = 20% each
function calculateDiscountRate(siblingCount) {
  if (siblingCount >= 3) return 20;
  if (siblingCount === 2) return 10;
  return 0;
}

// Initial 18 Student Records
const INITIAL_STUDENTS = [
  // --- KHAN FAMILY (3 Siblings) ---
  {
    id: "STU-801",
    rollNo: "801",
    name: "Ahmed Khan",
    grade: 8,
    section: "A",
    parentId: "PAR-101",
    parentName: "Tariq Khan",
    parentEmail: "tariq.khan@email.com",
    parentPhone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    baseFee: 200,
    feeStatus: "Paid", // Paid
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-28",
    attendance: { present: 17, absent: 3, total: 20 },
    marks: {
      "Social Studies": 58,
      "Mathematics": 55,
      "General Science": 62,
      "English": 65,
      "Urdu": 60,
      "Islamic Studies": 70,
      "Computer Science": 64,
      "Physics": 54,
      "Chemistry": 56,
      "Biology": 58,
      "Arts": 58
    },
    teacherNotes: "Ahmed shows strong potential in Humanities and Tech. Working on strengthening math problem solving."
  },
  {
    id: "STU-501",
    rollNo: "501",
    name: "Mohammad Khan",
    grade: 5,
    section: "B",
    parentId: "PAR-101",
    parentName: "Tariq Khan",
    parentEmail: "tariq.khan@email.com",
    parentPhone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    baseFee: 180,
    feeStatus: "Paid",
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-28",
    attendance: { present: 24, absent: 1, total: 25 },
    marks: {
      "Social Studies": 92,
      "Mathematics": 95,
      "General Science": 91,
      "English": 88,
      "Urdu": 87,
      "Islamic Studies": 94,
      "Computer Science": 96,
      "Physics": 89,
      "Chemistry": 86,
      "Biology": 88,
      "Arts": 84
    },
    teacherNotes: "Exceptional student! Mohammad consistently ranks at the top of Class 5."
  },
  {
    id: "STU-201",
    rollNo: "201",
    name: "Ahmed Jr. Khan",
    grade: 2,
    section: "A",
    parentId: "PAR-101",
    parentName: "Tariq Khan",
    parentEmail: "tariq.khan@email.com",
    parentPhone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200",
    baseFee: 150,
    feeStatus: "Paid",
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-28",
    attendance: { present: 25, absent: 0, total: 25 },
    marks: {
      "Social Studies": 98,
      "Mathematics": 100,
      "General Science": 100,
      "English": 98,
      "Urdu": 99,
      "Islamic Studies": 100,
      "Computer Science": 99,
      "Physics": 98,
      "Chemistry": 98,
      "Biology": 99,
      "Arts": 100
    },
    teacherNotes: "Perfect academic record! Ahmed Jr. is brilliant, polite, and eager to learn."
  },

  // --- AHMED FAMILY (2 Siblings) ---
  {
    id: "STU-701",
    rollNo: "701",
    name: "Bilal Ahmed",
    grade: 7,
    section: "A",
    parentId: "PAR-102",
    parentName: "Zubair Ahmed",
    parentEmail: "zubair.ahmed@email.com",
    parentPhone: "+1 (555) 345-6789",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    baseFee: 200,
    feeStatus: "Pending",
    dueDate: "2026-10-10",
    lastPaymentDate: "2026-08-30",
    attendance: { present: 22, absent: 3, total: 25 },
    marks: {
      "Social Studies": 80,
      "Mathematics": 85,
      "General Science": 84,
      "English": 81,
      "Urdu": 78,
      "Islamic Studies": 88,
      "Computer Science": 86,
      "Physics": 80,
      "Chemistry": 79,
      "Biology": 83,
      "Arts": 78
    },
    teacherNotes: "Solid performer with good conceptual understanding in Science & Math."
  },
  {
    id: "STU-401",
    rollNo: "401",
    name: "Ayesha Ahmed",
    grade: 4,
    section: "B",
    parentId: "PAR-102",
    parentName: "Zubair Ahmed",
    parentEmail: "zubair.ahmed@email.com",
    parentPhone: "+1 (555) 345-6789",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    baseFee: 170,
    feeStatus: "Pending",
    dueDate: "2026-10-10",
    lastPaymentDate: "2026-08-30",
    attendance: { present: 23, absent: 2, total: 25 },
    marks: {
      "Social Studies": 87,
      "Mathematics": 90,
      "General Science": 89,
      "English": 86,
      "Urdu": 85,
      "Islamic Studies": 92,
      "Computer Science": 90,
      "Physics": 84,
      "Chemistry": 86,
      "Biology": 88,
      "Arts": 91
    },
    teacherNotes: "Ayesha is creative and enthusiastic in class activities."
  },

  // --- 13 INDIVIDUAL STUDENTS (Single Child Families) ---
  {
    id: "STU-101",
    rollNo: "101",
    name: "Zainab Malik",
    grade: 1,
    section: "A",
    parentId: "PAR-103",
    parentName: "Tariq Malik",
    parentEmail: "tariq.malik@email.com",
    parentPhone: "+1 (555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    baseFee: 150,
    feeStatus: "Paid",
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-25",
    attendance: { present: 24, absent: 1, total: 25 },
    marks: {
      "Social Studies": 95,
      "Mathematics": 94,
      "General Science": 96,
      "English": 93,
      "Urdu": 92,
      "Islamic Studies": 96,
      "Computer Science": 95,
      "Physics": 92,
      "Chemistry": 94,
      "Biology": 95,
      "Arts": 97
    },
    teacherNotes: "Very active and bright student in Grade 1."
  },
  {
    id: "STU-301",
    rollNo: "301",
    name: "Hamza Sheikh",
    grade: 3,
    section: "A",
    parentId: "PAR-104",
    parentName: "Usman Sheikh",
    parentEmail: "usman.sheikh@email.com",
    parentPhone: "+1 (555) 567-8901",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200",
    baseFee: 160,
    feeStatus: "Paid",
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-27",
    attendance: { present: 21, absent: 4, total: 25 },
    marks: {
      "Social Studies": 76,
      "Mathematics": 82,
      "General Science": 78,
      "English": 75,
      "Urdu": 74,
      "Islamic Studies": 84,
      "Computer Science": 80,
      "Physics": 76,
      "Chemistry": 75,
      "Biology": 78,
      "Arts": 80
    },
    teacherNotes: "Good progress. Needs encouragement in daily reading."
  },
  {
    id: "STU-601",
    rollNo: "601",
    name: "Fatima Ali",
    grade: 6,
    section: "B",
    parentId: "PAR-105",
    parentName: "Asad Ali",
    parentEmail: "asad.ali@email.com",
    parentPhone: "+1 (555) 678-9012",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    baseFee: 190,
    feeStatus: "Pending",
    dueDate: "2026-10-10",
    lastPaymentDate: "2026-08-28",
    attendance: { present: 23, absent: 2, total: 25 },
    marks: {
      "Social Studies": 84,
      "Mathematics": 87,
      "General Science": 86,
      "English": 83,
      "Urdu": 82,
      "Islamic Studies": 89,
      "Computer Science": 88,
      "Physics": 83,
      "Chemistry": 84,
      "Biology": 86,
      "Arts": 84
    },
    teacherNotes: "Consistent academic performance across science and languages."
  },
  {
    id: "STU-901",
    rollNo: "901",
    name: "Omar Farooq",
    grade: 9,
    section: "A",
    parentId: "PAR-106",
    parentName: "Farooq Azam",
    parentEmail: "farooq.azam@email.com",
    parentPhone: "+1 (555) 789-0123",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200",
    baseFee: 220,
    feeStatus: "Paid",
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-29",
    attendance: { present: 24, absent: 1, total: 25 },
    marks: {
      "Social Studies": 90,
      "Mathematics": 94,
      "General Science": 92,
      "English": 89,
      "Urdu": 88,
      "Islamic Studies": 93,
      "Computer Science": 95,
      "Physics": 92,
      "Chemistry": 90,
      "Biology": 91,
      "Arts": 87
    },
    teacherNotes: "High achiever in STEM subjects and Computer Science."
  },
  {
    id: "STU-1001",
    rollNo: "1001",
    name: "Sara Hassan",
    grade: 10,
    section: "A",
    parentId: "PAR-107",
    parentName: "Hassan Mahmood",
    parentEmail: "hassan.mahmood@email.com",
    parentPhone: "+1 (555) 890-1234",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    baseFee: 250,
    feeStatus: "Paid",
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-26",
    attendance: { present: 25, absent: 0, total: 25 },
    marks: {
      "Social Studies": 94,
      "Mathematics": 98,
      "General Science": 96,
      "English": 93,
      "Urdu": 92,
      "Islamic Studies": 97,
      "Computer Science": 99,
      "Physics": 96,
      "Chemistry": 95,
      "Biology": 96,
      "Arts": 89
    },
    teacherNotes: "Class prefect. Outstanding leadership and academic excellence."
  },
  {
    id: "STU-802",
    rollNo: "802",
    name: "Mustafa Raza",
    grade: 8,
    section: "B",
    parentId: "PAR-108",
    parentName: "Raza Hussein",
    parentEmail: "raza.hussein@email.com",
    parentPhone: "+1 (555) 901-2345",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    baseFee: 200,
    feeStatus: "Pending",
    dueDate: "2026-10-10",
    lastPaymentDate: "2026-08-25",
    attendance: { present: 19, absent: 6, total: 25 },
    marks: {
      "Social Studies": 70,
      "Mathematics": 68,
      "General Science": 73,
      "English": 72,
      "Urdu": 71,
      "Islamic Studies": 78,
      "Computer Science": 75,
      "Physics": 69,
      "Chemistry": 70,
      "Biology": 73,
      "Arts": 73
    },
    teacherNotes: "Mustafa is improving. Extra tuition in Physics & Math recommended."
  },
  {
    id: "STU-502",
    rollNo: "502",
    name: "Hania Siddiqui",
    grade: 5,
    section: "A",
    parentId: "PAR-109",
    parentName: "Bilal Siddiqui",
    parentEmail: "bilal.siddiqui@email.com",
    parentPhone: "+1 (555) 012-3456",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    baseFee: 180,
    feeStatus: "Paid",
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-24",
    attendance: { present: 23, absent: 2, total: 25 },
    marks: {
      "Social Studies": 86,
      "Mathematics": 88,
      "General Science": 87,
      "English": 85,
      "Urdu": 84,
      "Islamic Studies": 90,
      "Computer Science": 89,
      "Physics": 85,
      "Chemistry": 86,
      "Biology": 88,
      "Arts": 89
    },
    teacherNotes: "Disciplined and punctual student. Well mannered."
  },
  {
    id: "STU-702",
    rollNo: "702",
    name: "Usman Qureshi",
    grade: 7,
    section: "B",
    parentId: "PAR-110",
    parentName: "Adnan Qureshi",
    parentEmail: "adnan.qureshi@email.com",
    parentPhone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200",
    baseFee: 200,
    feeStatus: "Paid",
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-27",
    attendance: { present: 22, absent: 3, total: 25 },
    marks: {
      "Social Studies": 78,
      "Mathematics": 81,
      "General Science": 80,
      "English": 79,
      "Urdu": 77,
      "Islamic Studies": 84,
      "Computer Science": 83,
      "Physics": 79,
      "Chemistry": 78,
      "Biology": 81,
      "Arts": 80
    },
    teacherNotes: "Good teamwork skills and active in school sports."
  },
  {
    id: "STU-202",
    rollNo: "202",
    name: "Maryam Shah",
    grade: 2,
    section: "B",
    parentId: "PAR-111",
    parentName: "Shahbaz Shah",
    parentEmail: "shahbaz.shah@email.com",
    parentPhone: "+1 (555) 234-5679",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    baseFee: 150,
    feeStatus: "Pending",
    dueDate: "2026-10-10",
    lastPaymentDate: "2026-08-20",
    attendance: { present: 24, absent: 1, total: 25 },
    marks: {
      "Social Studies": 92,
      "Mathematics": 95,
      "General Science": 94,
      "English": 91,
      "Urdu": 90,
      "Islamic Studies": 96,
      "Computer Science": 93,
      "Physics": 91,
      "Chemistry": 92,
      "Biology": 94,
      "Arts": 95
    },
    teacherNotes: "Delightful student with excellent artistic abilities."
  },
  {
    id: "STU-902",
    rollNo: "902",
    name: "Ibrahim Hashmi",
    grade: 9,
    section: "B",
    parentId: "PAR-112",
    parentName: "Hashim Hashmi",
    parentEmail: "hashim.hashmi@email.com",
    parentPhone: "+1 (555) 345-6780",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    baseFee: 220,
    feeStatus: "Paid",
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-29",
    attendance: { present: 21, absent: 4, total: 25 },
    marks: {
      "Social Studies": 74,
      "Mathematics": 78,
      "General Science": 76,
      "English": 75,
      "Urdu": 73,
      "Islamic Studies": 80,
      "Computer Science": 79,
      "Physics": 74,
      "Chemistry": 73,
      "Biology": 76,
      "Arts": 78
    },
    teacherNotes: "Capable student. Focused on improving attendance."
  },
  {
    id: "STU-602",
    rollNo: "602",
    name: "Layla Mahmoud",
    grade: 6,
    section: "A",
    parentId: "PAR-113",
    parentName: "Mahmoud Nabil",
    parentEmail: "mahmoud.nabil@email.com",
    parentPhone: "+1 (555) 456-7891",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    baseFee: 190,
    feeStatus: "Paid",
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-28",
    attendance: { present: 23, absent: 2, total: 25 },
    marks: {
      "Social Studies": 88,
      "Mathematics": 90,
      "General Science": 89,
      "English": 87,
      "Urdu": 86,
      "Islamic Studies": 92,
      "Computer Science": 91,
      "Physics": 87,
      "Chemistry": 88,
      "Biology": 90,
      "Arts": 91
    },
    teacherNotes: "Great analytical skills and strong participation in science fairs."
  },
  {
    id: "STU-1002",
    rollNo: "1002",
    name: "Rayan Baig",
    grade: 10,
    section: "B",
    parentId: "PAR-114",
    parentName: "Kamran Baig",
    parentEmail: "kamran.baig@email.com",
    parentPhone: "+1 (555) 567-8902",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    baseFee: 250,
    feeStatus: "Pending",
    dueDate: "2026-10-10",
    lastPaymentDate: "2026-08-22",
    attendance: { present: 22, absent: 3, total: 25 },
    marks: {
      "Social Studies": 81,
      "Mathematics": 85,
      "General Science": 84,
      "English": 82,
      "Urdu": 80,
      "Islamic Studies": 87,
      "Computer Science": 86,
      "Physics": 82,
      "Chemistry": 81,
      "Biology": 84,
      "Arts": 81
    },
    teacherNotes: "Solid senior student preparing well for board examinations."
  },
  {
    id: "STU-402",
    rollNo: "402",
    name: "Emaan Mirza",
    grade: 4,
    section: "A",
    parentId: "PAR-115",
    parentName: "Faisal Mirza",
    parentEmail: "faisal.mirza@email.com",
    parentPhone: "+1 (555) 678-9013",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    baseFee: 170,
    feeStatus: "Paid",
    dueDate: "2026-10-05",
    lastPaymentDate: "2026-09-27",
    attendance: { present: 25, absent: 0, total: 25 },
    marks: {
      "Social Studies": 95,
      "Mathematics": 98,
      "General Science": 96,
      "English": 94,
      "Urdu": 93,
      "Islamic Studies": 98,
      "Computer Science": 97,
      "Physics": 94,
      "Chemistry": 95,
      "Biology": 97,
      "Arts": 99
    },
    teacherNotes: "Top of Class 4! Emaan displays exemplary dedication and academic rigor."
  }
];

/**
 * Helper to calculate overall percentage across all 11 core subjects
 */
function calculateOverallPercentage(marks) {
  if (!marks) return 0;
  const keys = Object.keys(marks);
  if (keys.length === 0) return 0;
  const sum = keys.reduce((acc, k) => acc + Number(marks[k] || 0), 0);
  return Math.round((sum / (keys.length * 100)) * 1000) / 10;
}

/**
 * Grade letter classifier
 */
function getGradeLetter(score) {
  if (score >= 90) return { letter: "A+", bg: "bg-emerald-100", text: "text-emerald-800", badge: "Distinction" };
  if (score >= 80) return { letter: "A", bg: "bg-blue-100", text: "text-blue-800", badge: "Excellent" };
  if (score >= 70) return { letter: "B", bg: "bg-indigo-100", text: "text-indigo-800", badge: "Good" };
  if (score >= 60) return { letter: "C", bg: "bg-amber-100", text: "text-amber-800", badge: "Satisfactory" };
  return { letter: "F", bg: "bg-rose-100", text: "text-rose-800", badge: "Needs Improvement" };
}

/**
 * Sibling Discount Engine - Processes a list of student objects and dynamically decorates them
 * with sibling count, discount percentage, discount amount, and net payable fee.
 */
function enrichStudentsWithSiblingDiscounts(studentList) {
  // Count siblings per parentId
  const parentCounts = {};
  studentList.forEach(s => {
    if (s.parentId) {
      parentCounts[s.parentId] = (parentCounts[s.parentId] || 0) + 1;
    }
  });

  return studentList.map(s => {
    const siblingCount = parentCounts[s.parentId] || 1;
    const discountPercent = calculateDiscountRate(siblingCount);
    // Use Rupee base fee if baseFee is missing or old dollar value (< 1000)
    const baseFee = (s.baseFee && s.baseFee >= 1000) ? s.baseFee : (GRADE_BASE_FEES[s.grade] || 5000);
    const discountAmount = Math.round((baseFee * discountPercent) / 100);
    const netFee = baseFee - discountAmount;
    const overallPercentage = calculateOverallPercentage(s.marks);

    return {
      ...s,
      baseFee,
      siblingCount,
      discountPercent,
      discountAmount,
      netFee,
      overallPercentage
    };
  });
}

// Data Store Manager with LocalStorage persistence
class SchoolDataStore {
  constructor() {
    this.storageKey = "abc_school_data_v1";
    this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const raw = JSON.parse(stored);
        this.students = enrichStudentsWithSiblingDiscounts(raw);
      } else {
        this.students = enrichStudentsWithSiblingDiscounts(INITIAL_STUDENTS);
        this.saveData();
      }
    } catch (e) {
      console.error("Error loading school data from localStorage, fallback to default", e);
      this.students = enrichStudentsWithSiblingDiscounts(INITIAL_STUDENTS);
    }
  }

  saveData() {
    try {
      // Re-run enrichment before saving
      this.students = enrichStudentsWithSiblingDiscounts(this.students);
      localStorage.setItem(this.storageKey, JSON.stringify(this.students));
    } catch (e) {
      console.error("Error saving school data", e);
    }
  }

  resetData() {
    this.students = enrichStudentsWithSiblingDiscounts(INITIAL_STUDENTS);
    this.saveData();
  }

  getStudents() {
    return this.students;
  }

  getStudentById(id) {
    return this.students.find(s => s.id === id);
  }

  getStudentsByParentId(parentId) {
    return this.students.filter(s => s.parentId === parentId);
  }

  updateStudentAvatar(studentId, newAvatarUrl) {
    const student = this.getStudentById(studentId);
    if (student) {
      student.avatar = newAvatarUrl;
      this.saveData();
      return true;
    }
    return false;
  }

  getAllParents() {
    const parentMap = new Map();
    this.students.forEach(s => {
      if (!parentMap.has(s.parentId)) {
        parentMap.set(s.parentId, {
          parentId: s.parentId,
          parentName: s.parentName,
          parentEmail: s.parentEmail,
          parentPhone: s.parentPhone,
          children: []
        });
      }
      parentMap.get(s.parentId).children.push(s);
    });
    return Array.from(parentMap.values());
  }

  // Add Single or Multiple Students (Family Admission)
  addFamilyAdmission(familyData) {
    // familyData = { parentName, parentEmail, parentPhone, parentId, children: [{ name, grade, section, rollNo, avatar }] }
    let parentId = familyData.parentId;
    if (!parentId || parentId.trim() === "") {
      parentId = "PAR-" + (100 + Math.floor(Math.random() * 899));
    }

    const newStudentObjects = familyData.children.map(child => {
      const stuId = "STU-" + (child.grade * 100 + Math.floor(Math.random() * 90 + 10));
      const baseFee = GRADE_BASE_FEES[child.grade] || 5000;
      
      // Default baseline marks for 11 subjects
      const marks = {};
      CORE_SUBJECTS.forEach(sub => {
        marks[sub] = Math.floor(Math.random() * 25) + 70; // 70-95
      });

      const defaultAvatar = `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&q=80&w=200`;

      return {
        id: stuId,
        rollNo: child.rollNo || String(Math.floor(Math.random() * 800) + 100),
        name: child.name,
        grade: Number(child.grade),
        section: child.section || "A",
        parentId: parentId,
        parentName: familyData.parentName,
        parentEmail: familyData.parentEmail,
        parentPhone: familyData.parentPhone,
        avatar: child.avatar || defaultAvatar,
        baseFee: baseFee,
        feeStatus: "Pending",
        dueDate: "2026-10-15",
        lastPaymentDate: "-",
        attendance: { present: 20, absent: 0, total: 20 },
        marks: marks,
        teacherNotes: "Newly admitted student. Eager to excel."
      };
    });

    this.students.push(...newStudentObjects);
    this.saveData(); // Dynamic discount re-calculation happens inside saveData()
    return newStudentObjects;
  }

  // Toggle Fee Payment Status
  toggleFeeStatus(studentId) {
    const student = this.getStudentById(studentId);
    if (student) {
      student.feeStatus = student.feeStatus === "Paid" ? "Pending" : "Paid";
      if (student.feeStatus === "Paid") {
        student.lastPaymentDate = new Date().toISOString().split("T")[0];
      }
      this.saveData();
    }
  }

  // Record Attendance for a single student or class bulk
  updateAttendance(studentId, isPresent) {
    const student = this.getStudentById(studentId);
    if (student) {
      if (!student.attendance) {
        student.attendance = { present: 0, absent: 0, total: 0 };
      }
      student.attendance.total += 1;
      if (isPresent) {
        student.attendance.present += 1;
      } else {
        student.attendance.absent += 1;
      }
      this.saveData();
    }
  }

  bulkUpdateAttendance(updates) {
    // updates = [{ studentId, isPresent }]
    updates.forEach(u => {
      const student = this.getStudentById(u.studentId);
      if (student) {
        if (!student.attendance) {
          student.attendance = { present: 0, absent: 0, total: 0 };
        }
        student.attendance.total += 1;
        if (u.isPresent) {
          student.attendance.present += 1;
        } else {
          student.attendance.absent += 1;
        }
      }
    });
    this.saveData();
  }

  // Update Marks for a student in a specific subject
  updateStudentSubjectMarks(studentId, subjectName, score) {
    const student = this.getStudentById(studentId);
    if (student) {
      if (!student.marks) student.marks = {};
      student.marks[subjectName] = Math.min(100, Math.max(0, Number(score)));
      this.saveData();
    }
  }

  // Delete student
  deleteStudent(studentId) {
    this.students = this.students.filter(s => s.id !== studentId);
    this.saveData();
  }
}

// Instantiate Global Store
window.schoolStore = new SchoolDataStore();
