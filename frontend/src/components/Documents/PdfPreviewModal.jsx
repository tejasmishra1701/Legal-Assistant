import { useEffect, useRef, useState } from 'react';
import './RegularBailForm.css';

const PdfPreviewModal = ({ htmlContent, onClose, onDownload }) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      setIsLoading(true);
      const iframe = iframeRef.current;
      const handleLoad = () => setIsLoading(false);
      iframe.addEventListener('load', handleLoad);

      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(htmlContent);
      doc.close();

      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }
  }, [htmlContent]);

  return (
    <div className="pdf-modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="pdf-modal">
        <div className="pdf-modal-header">
          <h2>Document Preview</h2>
          <button onClick={onClose} className="close-button" aria-label="Close modal">
            &times;
          </button>
        </div>
        
        <div className="pdf-modal-content">
          {isLoading && (
            <div className="loading-spinner">
              <p>Loading preview...</p>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            title="Document Preview"
            sandbox="allow-same-origin"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: isLoading ? 'none' : 'block'
            }}
          />
        </div>
        
        <div className="pdf-modal-footer">
          <button onClick={onDownload} className="download-btn" disabled={!htmlContent}>
            📄 Download PDF
          </button>
          <button onClick={onClose} className="close-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;