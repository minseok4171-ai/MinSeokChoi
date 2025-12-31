import React, { useEffect } from 'react';
import { ReportData } from '../types';
import { generateCoachingComment } from '../services/geminiService';
import { Loader2, Wand2, Palette } from 'lucide-react';

interface ReportFormProps {
  data: ReportData;
  onChange: (newData: ReportData) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ data, onChange }) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleFieldChange = (field: keyof ReportData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Color mapping for subjects
  const subjectColors: Record<string, string> = {
    '수학': '#FF7043',   // Orange
    '영어': '#7C4DFF',   // Purple
    '국어': '#26A69A',   // Teal
    '과학': '#42A5F5',   // Blue
    '사회': '#8D6E63',   // Brown
    '입시컨설팅': '#5C6BC0', // Indigo
    '기타': '#78909C'    // Grey
  };

  // Auto-set color when subject changes via Select
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubject = e.target.value;
    const newColor = subjectColors[newSubject] || data.themeColor;
    
    onChange({ 
        ...data, 
        subject: newSubject,
        themeColor: newColor
    });
  };

  const handleGenerateComment = async () => {
    setIsGenerating(true);
    const comment = await generateCoachingComment(data);
    onChange({ ...data, comment });
    setIsGenerating(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">📋 리포트 작성</h2>
        <div className="flex items-center gap-2">
             <Palette size={16} className="text-gray-500"/>
             <input 
                type="color" 
                value={data.themeColor}
                onChange={(e) => handleFieldChange('themeColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-none"
                title="테마 색상 변경"
             />
        </div>
      </div>

      {/* Basic Info */}
      <section className="mb-8 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">기본 정보</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">지점명</label>
                <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                value={data.academyName}
                onChange={(e) => handleFieldChange('academyName', e.target.value)}
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">리포트 제목</label>
                <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                value={data.reportTitle}
                onChange={(e) => handleFieldChange('reportTitle', e.target.value)}
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">테스트 일자</label>
                <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                value={data.date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">담당 코치</label>
                <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    value={data.coachName}
                    onChange={(e) => handleFieldChange('coachName', e.target.value)}
                >
                    <option value="">선택해주세요</option>
                    <option value="배서영">배서영</option>
                    <option value="최민석">최민석</option>
                    <option value="송영섭">송영섭</option>
                    <option value="안슬기">안슬기</option>
                </select>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
             <div>
                <label className="block text-sm font-medium text-gray-700">학생 이름</label>
                <input
                type="text"
                placeholder="예: 김철수"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                value={data.studentName}
                onChange={(e) => handleFieldChange('studentName', e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">학교/학년</label>
                <input
                type="text"
                placeholder="예: 목동중2"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                value={data.schoolInfo}
                onChange={(e) => handleFieldChange('schoolInfo', e.target.value)}
                />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">과목 (자동 색상 변경)</label>
                <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    value={data.subject}
                    onChange={handleSubjectChange}
                >
                    {Object.keys(subjectColors).map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
            </div>
        </div>
      </section>

      {/* Test Info */}
      <section className="mb-8 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">주간 테스트 결과</h3>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">진도/테스트 범위</label>
            <input
            type="text"
            placeholder="예: 2단원 3.함수의 극한 (p.45 ~ p.50)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            value={data.testRange}
            onChange={(e) => handleFieldChange('testRange', e.target.value)}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">점수</label>
                <input
                type="text"
                placeholder="예: 90"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                value={data.testScore}
                onChange={(e) => handleFieldChange('testScore', e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">결과</label>
                 <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    value={data.testResult}
                    onChange={(e) => handleFieldChange('testResult', e.target.value)}
                >
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                    <option value="Re-test">재시험</option>
                    <option value="Hold">보류</option>
                </select>
            </div>
        </div>
      </section>

      {/* Evaluation Sliders */}
      <section className="mb-8 space-y-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">학습 평가 (1-5점)</h3>
        
        {[
            { label: '이해도', key: 'understanding' as keyof ReportData },
            { label: '집중도', key: 'concentration' as keyof ReportData },
            { label: '숙제 완성도', key: 'homeworkAchievement' as keyof ReportData }
        ].map((item) => (
            <div key={item.key}>
                <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">{item.label}</label>
                    <span className="text-sm font-bold" style={{ color: data.themeColor }}>{data[item.key] as number}점</span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="1"
                    value={data[item.key] as number}
                    onChange={(e) => handleFieldChange(item.key, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: data.themeColor }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                </div>
            </div>
        ))}
      </section>

      {/* Comment Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">수업 내용 및 전달사항</h3>
            <button
                onClick={handleGenerateComment}
                disabled={isGenerating}
                className="flex items-center gap-2 px-3 py-1.5 text-white rounded-md text-sm font-medium transition-all disabled:opacity-50"
                style={{ backgroundColor: data.themeColor }}
            >
                {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
                자동 작성
            </button>
        </div>
        <textarea
          rows={10}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-3 leading-relaxed"
          placeholder="학생의 오늘 학습 태도나 전달사항을 입력해주세요. (자동 작성 버튼을 누르면 AI가 도와줍니다)"
          value={data.comment}
          onChange={(e) => handleFieldChange('comment', e.target.value)}
        />
        <p className="text-xs text-gray-400 mt-2 text-right">**텍스트** 형태로 입력하면 미리보기에서 굵게 표시됩니다.</p>
      </section>
    </div>
  );
};

export default ReportForm;