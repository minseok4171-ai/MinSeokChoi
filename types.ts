export interface ReportData {
  themeColor: string;
  academyName: string;
  reportTitle: string; // e.g. "동탄목동 와와학습코칭학원 주간 리포트"
  subTitle: string; // e.g. "COACHING REPORT"
  
  studentName: string;
  schoolInfo: string; // New: School and Grade
  coachName: string;
  subject: string;
  date: string; // YYYY-MM-DD
  
  // Weekly Test Summary
  testRange: string;
  testScore: string;
  testResult: string; // e.g. "Pass"
  
  // Learning Evaluation (1-5 scale)
  understanding: number;
  concentration: number;
  homeworkAchievement: number;

  comment: string;
}

export const INITIAL_REPORT_DATA: ReportData = {
  themeColor: "#FF7043", // Default Orange
  academyName: "동탄목동점", 
  reportTitle: "주간리포트", // Changed from Weekly Test
  subTitle: "COACHING REPORT",
  
  studentName: "",
  schoolInfo: "",
  coachName: "",
  subject: "수학",
  date: new Date().toISOString().split('T')[0],
  
  testRange: "",
  testScore: "",
  testResult: "Pass",
  
  understanding: 5,
  concentration: 5,
  homeworkAchievement: 5,
  
  comment: "작성된 내용이 없습니다."
};