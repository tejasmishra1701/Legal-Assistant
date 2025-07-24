import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Styles using standard fonts
const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 60,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 60,
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    textDecoration: 'underline',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 20,
    marginTop: 20,
  },
  section: {
    marginBottom: 10,
  },
  rightAlign: {
    textAlign: 'right',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  listItemNumber: {
    width: 20,
  },
  listItemContent: {
    flex: 1,
  },
  partyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  footerContainer: {
    marginTop: 40,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  center: {
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  applicantItem: {
    marginBottom: 5,
  },
});

export const Section125MaintenancePDF = ({ data }) => {
  // Defensive check for top-level properties
  if (!data || !data.courtDetails || !data.parties || !data.applicationBody) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>Error: Core data structure is missing. Unable to generate PDF.</Text>
        </Page>
      </Document>
    );
  }

  // Safely access applicants and grounds, providing empty arrays as fallbacks
  const applicants = Array.isArray(data.parties.applicants) ? data.parties.applicants : [];
  const grounds = Array.isArray(data.applicationBody.grounds) ? data.applicationBody.grounds : [];

  const verificationText = `VERIFICATION: I, ${data.parties.applicants[0]?.name}, the Applicant above-named, do hereby verify on oath that the contents of the above application are true and correct to my knowledge and belief and nothing material has been concealed therefrom.`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>
          APPLICATION FOR MAINTENANCE UNDER SECTION 125 OF CRPC, 1973
        </Text>
        
        <Text style={styles.header}>
          IN THE COURT OF {data.courtDetails.courtType}, {data.courtDetails.district.toUpperCase()}.
        </Text>
        
        <View style={styles.section}>
          <Text style={[styles.bold, styles.center]}>
            MAINTENANCE APPLICATION NO. {data.courtDetails.applicationNumber || '______'} OF {data.courtDetails.applicationYear}
          </Text>
        </View>
        
        <Text style={styles.section}>IN THE MATTER OF:</Text>
        
        {/* Applicants Section */}
        <View style={styles.partyContainer}>
            <View>
                {applicants.map((applicant, index) => (
                  <View key={index} style={styles.applicantItem}>
                    <Text>{`${index + 1}. ${applicant.name}`}</Text>
                    <Text>{applicant.relation}</Text>
                    {/* --- THIS IS THE LINE THAT WAS ADDED --- */}
                    <Text>R/o {applicant.address}</Text>
                  </View>
                ))}
            </View>
            <Text style={styles.bold}>.....APPLICANTS</Text>
        </View>
        
        <Text style={[styles.bold, styles.center]}>VERSUS</Text>
        
        {/* Respondent Section */}
        <View style={styles.partyContainer}>
          <View>
            <Text>{data.parties.respondent?.name || 'Respondent Name'}</Text>
            <Text>R/o {data.parties.respondent?.address || 'Respondent Address'}</Text>
          </View>
          <Text style={styles.bold}>.....RESPONDENT</Text>
        </View>
        
        <Text style={styles.title}>
          {data.applicationTitle}
        </Text>
        
        <Text style={[styles.bold, { marginBottom: 15 }]}>{data.applicationBody.introduction}</Text>
        
        {grounds.map((fact, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listItemNumber}>{index + 1}.</Text>
            <Text style={styles.listItemContent}>{fact}</Text>
          </View>
        ))}
        
        <Text style={[styles.bold, { marginTop: 20, marginBottom: 10 }]}>{data.prayer?.heading}</Text>
        <Text style={{ marginBottom: 15 }}>{data.prayer?.text}</Text>
        
        <View style={styles.footerContainer}>
          <View style={styles.footerRow}>
            <Text>Place: {data.footer?.place}</Text>
            <Text style={styles.bold}>APPLICANTS</Text>
          </View>
          <View style={styles.footerRow}>
            <Text>Date: {data.footer?.verificationDate}</Text>
            <Text>THROUGH</Text>
          </View>
          <View style={[styles.footerRow, styles.rightAlign]}>
            <Text></Text>
            <View>
              <Text>{data.footer?.advocateName}</Text>
              <Text style={styles.bold}>ADVOCATE</Text>
            </View>
          </View>
        </View>
        
        <Text style={[styles.section, { marginTop: 20 }]}>{verificationText}</Text>
        <Text style={[styles.bold, { marginTop: 5 }]}>Verified at {data.footer?.place} on this day of {data.footer?.verificationDate}.</Text>

      </Page>
    </Document>
  );
};