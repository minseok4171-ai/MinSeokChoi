import React from 'react';
import { BookOpen, User, CheckCircle2 } from 'lucide-react';
import { ReportData } from '../types';

interface ReportPreviewProps {
  data: ReportData;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ data }) => {
  const themeColor = data.themeColor || '#FF7043';
  
  // Convert hex to lighter version for backgrounds
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const lightThemeColor = hexToRgba(themeColor, 0.1);

  return (
    <div id="report-preview" className="w-full max-w-[210mm] min-h-[297mm] bg-white text-black p-8 mx-auto print-area relative">
      
      {/* 1. Header Card Section */}
      <div 
        className="rounded-[30px] text-white relative mb-16 shadow-lg flex flex-col justify-center items-center text-center h-[180px]"
        style={{ backgroundColor: themeColor }}
      >
        {/* Title Text */}
        <div className="z-10 w-full px-4 pb-4">
            <h1 className="text-4xl font-extrabold tracking-wide whitespace-nowrap break-keep leading-none drop-shadow-md mb-3">
              {data.reportTitle}
            </h1>
            {data.academyName && (
                <h3 className="text-2xl font-bold opacity-95 tracking-wider drop-shadow-sm">
                    {data.academyName}
                </h3>
            )}
        </div>

        {/* Floating Info Bar */}
        <div className="absolute -bottom-10 left-6 right-6 bg-white rounded-xl shadow-lg flex py-4 px-6 text-gray-800 border border-gray-100">
            <div className="flex-1 border-r border-gray-200 px-4 text-center flex flex-col justify-center">
                <span className="block text-xs text-orange-400 font-bold mb-1" style={{ color: themeColor }}>학생 이름</span>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <span className="text-lg font-bold leading-none">{data.studentName || '이름 미입력'}</span>
                  {data.schoolInfo && (
                     <span className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded leading-none">{data.schoolInfo}</span>
                  )}
                </div>
            </div>
            <div className="flex-1 border-r border-gray-200 px-4 text-center">
                <span className="block text-xs text-orange-400 font-bold mb-1" style={{ color: themeColor }}>담당 코치</span>
                <span className="text-lg font-bold">{data.coachName || '미입력'}</span>
            </div>
            <div className="flex-1 px-4 text-center">
                <span className="block text-xs text-orange-400 font-bold mb-1" style={{ color: themeColor }}>과목</span>
                <span className="text-lg font-bold">{data.subject || '미입력'}</span>
            </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8 mt-4">
        
        {/* Left Card: Weekly Test Summary */}
        <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <BookOpen size={20} style={{ color: themeColor }} />
                <h3 className="text-lg font-bold text-gray-800">주간 테스트 요약</h3>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="text-sm text-gray-500 font-medium mb-1">테스트 일자</div>
                    <div className="text-lg font-bold text-gray-800">{data.date}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500 font-medium mb-1">테스트 범위</div>
                    <div className="text-base text-gray-800 font-medium leading-relaxed">
                        {data.testRange || '-'}
                    </div>
                </div>
                <div>
                    <div className="text-sm text-gray-500 font-medium mb-1">점수 및 결과</div>
                    <div className="flex items-baseline gap-2">
                         <span className="text-2xl font-bold" style={{ color: themeColor }}>{data.testScore || '-'}점</span>
                         <span className="text-lg font-medium text-gray-600">({data.testResult || '-'})</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Card: Learning Evaluation */}
        <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <User size={20} style={{ color: themeColor }} />
                <h3 className="text-lg font-bold text-gray-800">학습 평가</h3>
            </div>

            <div className="space-y-6 pt-2">
                {[
                    { label: '이해도', score: data.understanding },
                    { label: '집중도', score: data.concentration },
                    { label: '숙제 완성도', score: data.homeworkAchievement }
                ].map((item, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-bold text-gray-700">{item.label}</span>
                            <span className="text-xs font-bold" style={{ color: themeColor }}>({item.score}점/5점)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div 
                                className="h-3 rounded-full transition-all duration-500" 
                                style={{ width: `${(item.score / 5) * 100}%`, backgroundColor: themeColor }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* 3. Comment Section */}
      <div>
         <div className="flex items-center gap-2 mb-3 px-1">
            <CheckCircle2 size={20} style={{ color: themeColor }} />
            <h3 className="text-lg font-bold text-gray-800">수업 내용 및 전달사항</h3>
         </div>
         
         <div 
            className="rounded-2xl p-8 min-h-[300px] text-sm leading-relaxed whitespace-pre-wrap border border-transparent"
            style={{ backgroundColor: lightThemeColor }}
         >
            {data.comment ? (
                 <div dangerouslySetInnerHTML={{ 
                    __html: data.comment
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    .replace(/\n/g, '<br/>') 
                }} />
            ) : (
                <div className="text-gray-400">작성된 내용이 없습니다.</div>
            )}
         </div>
      </div>

    </div>
  );
};

export default ReportPreview;