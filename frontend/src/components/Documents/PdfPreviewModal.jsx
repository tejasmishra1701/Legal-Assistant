import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { BailApplicationPDF } from './BailApplicationPDF'; // Import the document component

const PdfPreviewModal = ({ data, onClose }) => {
  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal">
        <div className="pdf-modal-header">
          <h2>Document Preview</h2>
          <button onClick={onClose} className="close-button" aria-label="Close modal">&times;</button>
        </div>
        
        <div className="pdf-modal-content">
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <BailApplicationPDF data={data} />
          </PDFViewer>
        </div>
        
        <div className="pdf-modal-footer">
          <PDFDownloadLink
            document={<BailApplicationPDF data={data} />}
            fileName={`bail_application_${data.parties.applicant.name.replace(/\s+/g, '_')}.pdf`}
          >
            {({ loading }) => (
              <button className="download-btn" disabled={loading}>
                {loading ? 'Loading...' : '📄 Download PDF'}
              </button>
            )}
          </PDFDownloadLink>
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;