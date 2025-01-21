'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import XMLUploader from '@/components/XMLUploader';
import XMLTreeView from '@/components/XMLTreeView';
import { parseXMLToJSON } from '@/utils/xmlUtils';
import XMLExporter from '@/components/XMLExporter';

export default function Home() {
  const [xmlContent, setXmlContent] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());

  const handleXMLLoad = async (content: string) => {
    try {
      setXmlContent(content);
      const parsedData = await parseXMLToJSON(content);
      setJsonData(parsedData);
      setError(null);
    } catch (err) {
      setError('XML ayrıştırma hatası oluştu');
      console.error(err);
    }
  };

  const handleSelect = (path: string, value: any) => {
    const newSelectedPaths = new Set(selectedPaths);
    if (newSelectedPaths.has(path)) {
      newSelectedPaths.delete(path);
    } else {
      newSelectedPaths.add(path);
    }
    setSelectedPaths(newSelectedPaths);
  };

  return (
    <Layout>
      <div className="space-y-6 pb-20">
        {!xmlContent && (
          <XMLUploader onXMLLoad={handleXMLLoad} />
        )}
        
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Hata</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {jsonData && (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  XML İçeriği
                </h2>
                <button
                  onClick={() => {
                    setXmlContent(null);
                    setJsonData(null);
                    setSelectedPaths(new Set());
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Temizle
                </button>
              </div>
              <XMLTreeView 
                data={jsonData} 
                onSelect={handleSelect}
                selectedPaths={selectedPaths}
              />
            </div>
            <XMLExporter 
              data={jsonData}
              selectedPaths={selectedPaths}
            />
          </>
        )}
      </div>
    </Layout>
  );
} 