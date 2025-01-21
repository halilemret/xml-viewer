import React, { useState } from 'react';
import { isObject, isArray } from '@/utils/xmlUtils';

interface TreeNodeProps {
  data: any;
  name: string;
  level: number;
  onSelect?: (path: string, value: any) => void;
  selectedPaths?: Set<string>;
  path: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  data, 
  name, 
  level, 
  onSelect,
  selectedPaths,
  path 
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelect) {
      onSelect(path, data);
    }
  };

  if (isObject(data)) {
    return (
      <div className="ml-4">
        <div className={`flex items-center space-x-2 py-2 px-3 rounded-lg transition-all duration-200
          ${selectedPaths?.has(path) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
          {onSelect && (
            <input
              type="checkbox"
              checked={selectedPaths?.has(path) || false}
              onChange={handleSelect}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 
                focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200"
            />
          )}
          <button
            onClick={handleToggle}
            className="flex-1 flex items-center space-x-3 text-left group"
          >
            <span className={`flex items-center justify-center w-5 h-5 rounded-full 
              ${isExpanded ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-700'}
              transition-all duration-200`}>
              <svg 
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200
                  ${isExpanded ? 'transform rotate-90' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {name}
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 
              text-gray-500 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
              {Object.keys(data).length} öğe
            </span>
          </button>
        </div>
        {isExpanded && (
          <div className="ml-6 mt-1 border-l-2 border-gray-200 dark:border-gray-700">
            {Object.entries(data).map(([key, value]) => (
              <TreeNode
                key={`${path}.${key}`}
                data={value}
                name={key}
                level={level + 1}
                onSelect={onSelect}
                selectedPaths={selectedPaths}
                path={`${path}.${key}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  } else if (isArray(data)) {
    return (
      <div className="ml-4">
        <div className={`flex items-center space-x-2 py-2 px-3 rounded-lg transition-all duration-200
          ${selectedPaths?.has(path) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
          {onSelect && (
            <input
              type="checkbox"
              checked={selectedPaths?.has(path) || false}
              onChange={handleSelect}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 
                focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200"
            />
          )}
          <button
            onClick={handleToggle}
            className="flex-1 flex items-center space-x-3 text-left group"
          >
            <span className={`flex items-center justify-center w-5 h-5 rounded-full 
              ${isExpanded ? 'bg-purple-100 dark:bg-purple-900/50' : 'bg-gray-100 dark:bg-gray-700'}
              transition-all duration-200`}>
              <svg 
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200
                  ${isExpanded ? 'transform rotate-90' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
              {name}
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 
              text-gray-500 dark:text-gray-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30">
              {data.length} öğe
            </span>
          </button>
        </div>
        {isExpanded && (
          <div className="ml-6 mt-1 border-l-2 border-gray-200 dark:border-gray-700">
            {data.map((item: any, index: number) => (
              <TreeNode
                key={`${path}[${index}]`}
                data={item}
                name={getArrayItemTitle(item, index)}
                level={level + 1}
                onSelect={onSelect}
                selectedPaths={selectedPaths}
                path={`${path}[${index}]`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Leaf node (son düğüm) için görünüm
  return (
    <div className={`ml-4 flex items-center space-x-3 py-2 px-3 rounded-lg transition-all duration-200
      ${selectedPaths?.has(path) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
      {onSelect && (
        <input
          type="checkbox"
          checked={selectedPaths?.has(path) || false}
          onChange={handleSelect}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 
            focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200"
        />
      )}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{name}:</span>
        <span className="text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 
          px-2 py-0.5 rounded">{String(data)}</span>
      </div>
    </div>
  );
};

interface XMLTreeViewProps {
  data: any;
  onSelect?: (path: string, value: any) => void;
  selectedPaths?: Set<string>;
}

// Dizi elemanı için başlık oluşturan yardımcı fonksiyon
const getArrayItemTitle = (item: any, index: number): string => {
  // Eğer item bir nesne ise
  if (typeof item === 'object' && item !== null) {
    // Öncelikli alanları kontrol et (öncelik sırasına göre)
    const priorityFields = [
      // En yüksek öncelik: İsim/Ad ile ilgili
      'ad', 'isim', 'name',
      'urunadi', 'urunad', 'urunismi', 'productname', 'productTitle',
      'musteriadi', 'musteriismi', 'customerName',
      'kategoriadi', 'categoryName',
      'baslik', 'title',
      
      // Orta öncelik: Açıklama ve detaylar
      'aciklama', 'description',
      'ozet', 'summary',
      'etiket', 'label',
      
      // Düşük öncelik: Tür/Tip
      'tur', 'tip', 'type',
      'kategori', 'category',
      'grup', 'group',
      
      // En düşük öncelik: Teknik tanımlayıcılar
      'id', 'kimlik', 
      'kod', 'code', 
      'no', 'numara',
      
      // En son: Diğer yaygın alanlar
      'tarih', 'date',
      'fiyat', 'price',
      'miktar', 'quantity',
      'durum', 'status'
    ];

    // Büyük-küçük harf ve Türkçe karakter duyarsız arama için yardımcı fonksiyon
    const normalizeStr = (str: string) => 
      str.toLowerCase()
         .replace(/ı/g, 'i')
         .replace(/ğ/g, 'g')
         .replace(/ü/g, 'u')
         .replace(/ş/g, 's')
         .replace(/ö/g, 'o')
         .replace(/ç/g, 'c');

    // Nesnenin tüm anahtarlarını normalize et
    const normalizedKeys = Object.keys(item).map(key => ({
      original: key,
      normalized: normalizeStr(key)
    }));

    // Öncelikli alanları kontrol et
    for (const field of priorityFields) {
      const normalizedField = normalizeStr(field);
      const match = normalizedKeys.find(k => k.normalized === normalizedField);
      if (match && item[match.original]) {
        const value = item[match.original];
        // Değer çok uzunsa kısalt
        const strValue = String(value);
        const maxLength = 30;
        const displayValue = strValue.length > maxLength 
          ? strValue.slice(0, maxLength) + '...' 
          : strValue;
        return `${match.original}: ${displayValue}`;
      }
    }
    
    // Eğer öncelikli alan bulunamazsa, ilk string veya number değeri kullan
    const firstValue = Object.entries(item).find(([_, value]) => 
      typeof value === 'string' || typeof value === 'number'
    );
    if (firstValue) {
      const [key, value] = firstValue;
      const strValue = String(value);
      const maxLength = 30;
      const displayValue = strValue.length > maxLength 
        ? strValue.slice(0, maxLength) + '...' 
        : strValue;
      return `${key}: ${displayValue}`;
    }
  }
  
  // Eğer item bir string veya number ise
  if (typeof item === 'string' || typeof item === 'number') {
    const maxLength = 30;
    const value = String(item);
    return value.length > maxLength ? value.slice(0, maxLength) + '...' : value;
  }
  
  // Hiçbir özel durum yoksa indeks numarasını kullan
  return `Öğe ${index + 1}`;
};

export default function XMLTreeView({ data, onSelect, selectedPaths }: XMLTreeViewProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      {Object.entries(data).map(([key, value]) => (
        <TreeNode
          key={key}
          data={value}
          name={key}
          level={0}
          onSelect={onSelect}
          selectedPaths={selectedPaths}
          path={key}
        />
      ))}
    </div>
  );
} 