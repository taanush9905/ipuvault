export const BRANCHES = [
  { code: "CSE", name: "Computer Science", icon: "💻" },
  { code: "CST", name: "Computer Sci. & Tech.", icon: "🖥️" },
  { code: "IT", name: "Information Technology", icon: "🌐" },
  { code: "ECE", name: "Electronics & Comm.", icon: "📡" },
  { code: "EE", name: "Electrical Engineering", icon: "⚡" },
  { code: "EEE", name: "Electrical & Electronics", icon: "🔌" },
  { code: "ICE", name: "Instrumentation & Control", icon: "🎛️" },
  { code: "ME", name: "Mechanical Engineering", icon: "⚙️" },
  { code: "CE", name: "Civil Engineering", icon: "🏗️" },
  { code: "MAE", name: "Mechanical & Automation", icon: "🤖" },
];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const EXAM_TYPES = [
  "Mid Term",
  "End Term",
  "Sessional",
  "Practical",
  "Supplementary",
] as const;

// Common first-year subjects shared across all branches
const SEM1_COMMON = [
  "Applied Mathematics-I",
  "Applied Physics",
  "Basic Electrical Engineering",
  "Manufacturing Processes",
  "Communication Skills",
  "Environmental Studies",
];

const SEM2_COMMON = [
  "Applied Mathematics-II",
  "Applied Chemistry",
  "Programming in C / Python",
  "Basic Electronics Engineering",
  "Engineering Mechanics",
  "Professional Communication",
  "Applied Physics/Chemistry Lab",
];

const CSE_LIKE: Record<number, string[]> = {
  3: ["Data Structures", "Digital Logic Design", "Discrete Mathematics", "Computer Organization & Architecture", "Object Oriented Programming", "Technical Communication"],
  4: ["Database Management Systems", "Operating Systems", "Design & Analysis of Algorithms", "Theory of Computation", "Microprocessors", "Computer Networks"],
  5: ["Software Engineering", "Compiler Design", "Web Technologies", "Artificial Intelligence", "Data Communication", "Probability & Statistics"],
  6: ["Machine Learning", "Cryptography & Network Security", "Cloud Computing", "Mobile Computing", "Data Warehousing & Mining", "Open Electives"],
  7: ["Big Data Analytics", "Internet of Things", "Blockchain Technology", "Project Work", "Industrial Training"],
  8: ["Major Project", "Seminar", "Electives"],
};

const ECE_SEMS: Record<number, string[]> = {
  3: ["Network Analysis", "Signals & Systems", "Analog Electronics", "Digital Electronics", "Electronic Devices", "Control Systems"],
  4: ["Network Analysis", "Signals & Systems", "Analog Electronics", "Digital Electronics", "Electronic Devices", "Control Systems"],
  5: ["Communication Systems", "VLSI Design", "Microwave Engineering", "Embedded Systems", "Digital Signal Processing"],
  6: ["Communication Systems", "VLSI Design", "Microwave Engineering", "Embedded Systems", "Digital Signal Processing"],
  7: ["Optical Communication", "Wireless Communication", "IoT", "Major Project"],
  8: ["Optical Communication", "Wireless Communication", "IoT", "Major Project"],
};

const ME_SEMS: Record<number, string[]> = {
  3: ["Thermodynamics", "Fluid Mechanics", "Strength of Materials", "Manufacturing Processes", "Machine Drawing"],
  4: ["Thermodynamics", "Fluid Mechanics", "Strength of Materials", "Manufacturing Processes", "Machine Drawing"],
  5: ["Heat Transfer", "Machine Design", "Refrigeration & Air Conditioning", "Dynamics of Machines", "Industrial Engineering"],
  6: ["Heat Transfer", "Machine Design", "Refrigeration & Air Conditioning", "Dynamics of Machines", "Industrial Engineering"],
  7: ["CAD/CAM", "Automobile Engineering", "Robotics", "Project Work"],
  8: ["CAD/CAM", "Automobile Engineering", "Robotics", "Project Work"],
};

const CE_SEMS: Record<number, string[]> = {
  3: ["Surveying", "Building Materials", "Structural Analysis", "Fluid Mechanics", "Geotechnical Engineering"],
  4: ["Surveying", "Building Materials", "Structural Analysis", "Fluid Mechanics", "Geotechnical Engineering"],
  5: ["RCC Design", "Steel Structures", "Transportation Engineering", "Environmental Engineering"],
  6: ["RCC Design", "Steel Structures", "Transportation Engineering", "Environmental Engineering"],
  7: ["Estimation & Costing", "Construction Management", "Earthquake Engineering", "Major Project"],
  8: ["Estimation & Costing", "Construction Management", "Earthquake Engineering", "Major Project"],
};

const EE_SEMS: Record<number, string[]> = {
  3: ["Electrical Machines", "Network Theory", "Power Systems", "Control Systems"],
  4: ["Electrical Machines", "Network Theory", "Power Systems", "Control Systems", "Power Electronics"],
  5: ["Power Electronics", "Switchgear & Protection", "Renewable Energy Systems", "Control Systems"],
  6: ["Power Electronics", "Switchgear & Protection", "Renewable Energy Systems"],
  7: ["Project Work", "Electives"],
  8: ["Major Project", "Electives"],
};

function build(branch: string, semMap: Record<number, string[]>): Record<number, string[]> {
  return {
    1: SEM1_COMMON,
    2: SEM2_COMMON,
    ...semMap,
  };
}

export const SUBJECTS_BY_BRANCH_SEM: Record<string, Record<number, string[]>> = {
  CSE: build("CSE", CSE_LIKE),
  CST: build("CST", CSE_LIKE),
  IT: build("IT", CSE_LIKE),
  ECE: build("ECE", ECE_SEMS),
  EE: build("EE", EE_SEMS),
  EEE: build("EEE", EE_SEMS),
  ICE: build("ICE", EE_SEMS),
  ME: build("ME", ME_SEMS),
  MAE: build("MAE", ME_SEMS),
  CE: build("CE", CE_SEMS),
};

export const YEARS = [2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019];

export function getSubjects(branch: string, semester: number): string[] {
  return SUBJECTS_BY_BRANCH_SEM[branch]?.[semester] ?? [];
}
