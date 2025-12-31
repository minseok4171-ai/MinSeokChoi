import React, { useState } from 'react';
import ReportPreview from './components/ReportPreview';
import ReportForm from './components/ReportForm';
import { ReportData, INITIAL_REPORT_DATA } from './types';
import { Printer, Download, Loader2, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>(INITIAL_REPORT_DATA);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isImageDownloading, setIsImageDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById('report-preview');
    if (!element) return;

    setIsImageDownloading(true);
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `${reportData.studentName || '학생'}_${reportData.date}_평가서.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Failed to save image:', error);
        alert('이미지 저장 중 오류가 발생했습니다.');
    } finally {
        setIsImageDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('report-preview');
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const widthRatio = pageWidth / canvas.width;
      const heightRatio = pageHeight / canvas.height;
      const ratio = Math.min(widthRatio, heightRatio);

      const canvasWidth = canvas.width * ratio;
      const canvasHeight = canvas.height * ratio;
      
      const marginX = (pageWidth - canvasWidth) / 2;
      const marginY = 0;

      pdf.addImage(imgData, 'PNG', marginX, marginY, canvasWidth, canvasHeight);
      
      const fileName = `${reportData.studentName || '학생'}_${reportData.date}_평가서.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center no-print sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <div className="bg-orange-500 text-white p-1 rounded font-bold text-lg italic">WAWA</div>
            <h1 className="text-xl font-bold text-gray-800">학습 평가서 생성기</h1>
        </div>
        <div className="flex items-center gap-2">
            <button
            onClick={handleDownloadImage}
            disabled={isImageDownloading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
            >
            {isImageDownloading ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
            <span>이미지 저장</span>
            </button>
            <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
            >
            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            <span>PDF 다운로드</span>
            </button>
            <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
            >
            <Printer size={18} />
            <span>인쇄하기</span>
            </button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8 flex flex-col lg:flex-row gap-8 overflow-hidden">
        <div className="w-full lg:w-1/2 xl:w-5/12 h-full no-print overflow-hidden flex flex-col">
            <ReportForm data={reportData} onChange={setReportData} />
        </div>
        <div className="w-full lg:w-1/2 xl:w-7/12 flex justify-center items-start overflow-y-auto bg-gray-200/50 p-4 rounded-xl border border-gray-300">
          <ReportPreview data={reportData} />
        </div>
      </main>
    </div>
  );
};

export default App;