import { parseString } from 'xml2js';
import { Builder } from 'xml2js';

export const parseXMLToJSON = (xmlContent: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    parseString(xmlContent, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

export const isArray = (item: any): boolean => {
  return Array.isArray(item);
};

export const createXMLFromPaths = (data: any, selectedPaths: Set<string>): string => {
  const builder = new Builder({
    rootName: 'root',
    headless: true,
    renderOpts: {
      pretty: true,
      indent: '  ',
      newline: '\n'
    }
  });

  // Veriyi doğrudan XML'e dönüştür
  return builder.buildObject(data);
};

export const downloadXML = (xmlContent: string, filename: string = 'export.xml') => {
  const blob = new Blob([xmlContent], { type: 'text/xml' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}; 