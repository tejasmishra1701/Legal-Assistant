import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Section125MaintenancePDF } from './Section125MaintenancePDF';

const Section125PdfPreviewModal = ({ data, onClose, onWordDownload }) => {
  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal">
        <div className="pdf-modal-header">
          <h2>Section 125 Maintenance Application Preview</h2>
          <button onClick={onClose} className="close-button" aria-label="Close modal">&times;</button>
        </div>
       
        <div className="pdf-modal-content">
          <PDFViewer style={{ width: '100%', height: '100%' }}>
            <Section125MaintenancePDF data={data} />
          </PDFViewer>
        </div>
       
        <div className="pdf-modal-footer">
          <PDFDownloadLink
            document={<Section125MaintenancePDF data={data} />}
            fileName={`section_125_maintenance_application_${data.parties.applicants[0]?.name.replace(/\s+/g, '_') || 'document'}.pdf`}
          >
            {({ loading }) => (
              <button className="download-btn" disabled={loading}>
                {loading ? 'Loading...' : '📄 Download PDF'}
              </button>
            )}
          </PDFDownloadLink>
         
          <button className="download-btn" onClick={onWordDownload}>
            📝 Download Word Document
          </button>
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default Section125PdfPreviewModal;