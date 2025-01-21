import React, { useState } from 'react';
import { createXMLFromPaths, downloadXML } from '@/utils/xmlUtils';

interface XMLExporterProps {
  data: any;
  selectedPaths: Set<string>;
}

export default function XMLExporter({ data, selectedPaths }: XMLExporterProps) {
  const [filename, setFilename] = useState('export.xml');
  
  const handleExport = () => {
    if (selectedPaths.size === 0) return;
    
    // Tüm seçili verileri topla
    const selectedData = getSelectedData(data, selectedPaths);
    // Toplanan verilerden XML oluştur
    const xmlContent = createXMLFromPaths(selectedData, new Set(['']));
    downloadXML(xmlContent, filename);
  };

  const getSelectedData = (data: any, selectedPaths: Set<string>): any => {
    const result: any = {};
    
    selectedPaths.forEach(path => {
      const parts = path.split('.');
      let current = data;
      let currentResult = result;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const arrayMatch = part.match(/(\w+)\[(\d+)\]/);
        
        if (arrayMatch) {
          // Dizi elemanı işleme
          const [_, name, index] = arrayMatch;
          if (!current[name]) break;
          current = current[name][parseInt(index)];
          
          if (i === parts.length - 1) {
            if (!currentResult[name]) currentResult[name] = [];
            currentResult[name][parseInt(index)] = current;
          } else {
            if (!currentResult[name]) currentResult[name] = [];
            if (!currentResult[name][parseInt(index)]) {
              currentResult[name][parseInt(index)] = {};
            }
            currentResult = currentResult[name][parseInt(index)];
          }
        } else {
          // Normal nesne özelliği işleme
          if (!current[part]) break;
          current = current[part];
          
          if (i === parts.length - 1) {
            currentResult[part] = current;
          } else {
            if (!currentResult[part]) currentResult[part] = {};
            currentResult = currentResult[part];
          }
        }
      }
    });
    
    return result;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              {selectedPaths.size} öğe seçildi
            </span>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="dosya-adi.xml"
              className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 
                dark:text-white rounded-lg shadow-sm focus:border-blue-500 
                focus:ring-blue-500 transition-colors duration-200"
            />
          </div>
          <button
            onClick={handleExport}
            disabled={selectedPaths.size === 0}
            className="inline-flex items-center px-6 py-2.5 border border-transparent 
              text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700
              hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            XML Olarak Dışa Aktar
          </button>
        </div>
      </div>
    </div>
  );
} 