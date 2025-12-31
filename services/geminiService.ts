import { GoogleGenAI } from "@google/genai";
import { ReportData } from "../types";

export const generateCoachingComment = async (data: ReportData): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are a professional academic coach at a Korean private academy (Wawa Learning Coaching Center).
      Write a polite, encouraging, and detailed "Coaching Comment" for a parent regarding their child's weekly test and class performance.

      Student Information:
      - Name: ${data.studentName}
      - School/Grade: ${data.schoolInfo}
      - Subject: ${data.subject}
      - Date: ${data.date}
      - Coach: ${data.coachName}

      Weekly Test Result:
      - Range: ${data.testRange}
      - Score: ${data.testScore}
      - Result: ${data.testResult}

      Attitude Evaluation (1-5 scale):
      - Understanding: ${data.understanding}/5
      - Concentration: ${data.concentration}/5
      - Homework Completion: ${data.homeworkAchievement}/5

      Instructions:
      1. Language: Korean (Polite/Formal tone - "학부모님께", "~했습니다", "~입니다").
      2. Structure:
         - **학습 내용 요약**: Briefly explain what was covered (based on test range).
         - **테스트 결과 분석**: Comment on the score and result (praise if high/passed, encourage if low).
         - **학습 태도 피드백**: Mention their understanding, concentration, and homework efforts based on the 1-5 scores.
         - **가정에서의 지도 요청**: Suggest simple ways parents can help at home.
      3. Tone: Professional, warm, specific, and future-oriented. Consider the student's grade (${data.schoolInfo}) when writing.
      4. Length: About 5-8 sentences.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "코멘트를 생성할 수 없습니다.";
  } catch (error) {
    console.error("Error generating comment:", error);
    return "AI 코멘트 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};