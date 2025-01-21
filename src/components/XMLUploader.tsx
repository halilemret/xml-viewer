import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface XMLUploaderProps {
  onXMLLoad: (xmlContent: string) => void;
}

export default function XMLUploader({ onXMLLoad }: XMLUploaderProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result as string;
      onXMLLoad(content);
    };

    reader.onerror = () => {
      setError('Dosya okuma hatası oluştu.');
    };

    reader.readAsText(file);
  }, [onXMLLoad]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/xml': ['.xml'],
    },
    multiple: false,
  });

  const handleURLSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('URL\'den XML yüklenemedi');
      
      const xmlContent = await response.text();
      onXMLLoad(xmlContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ease-in-out
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' 
            : 'border-gray-300 dark:border-gray-600'}
          hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {isDragActive
              ? 'Dosyayı buraya bırakın'
              : 'XML dosyasını sürükleyin veya seçmek için tıklayın'}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-100 dark:bg-gray-900 text-gray-500">
            veya
          </span>
        </div>
      </div>

      <form onSubmit={handleURLSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            XML URL'si
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="url"
              name="url"
              id="url"
              className="flex-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 
                dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 
                transition-colors duration-200 sm:text-sm"
              placeholder="https://ornek.com/veri.xml"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="ml-3 inline-flex items-center px-6 py-2.5 border border-transparent 
                text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r 
                from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              {loading ? 'Yükleniyor...' : 'Yükle'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/30 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Hata</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 