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
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    textDecoration: 'underline',
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  listItemNumber: {
    width: 20,
    minWidth: 20,
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
  prayerSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  prayerItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  prayerLetter: {
    width: 20,
    minWidth: 20,
  },
  prayerContent: {
    flex: 1,
  },
});

export const IndigentPersonApplicationPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>
        {data.applicationTitle}
      </Text>
      <Text style={styles.header}>
        IN THE COURT OF {data.courtDetails.courtType} COURT (DIST {data.courtDetails.district}), {data.courtDetails.state}
      </Text>
      
      <View style={styles.section}>
        <Text style={[styles.rightAlign]}>
          SUIT NO. {data.courtDetails.suitNumber} OF {data.courtDetails.suitYear}
        </Text>
      </View>

      <Text style={styles.section}>IN THE MATTER OF :</Text>
      
      <View style={styles.section}>
        <Text>X {data.parties.applicant.name}</Text>
        <Text>S/o {data.parties.applicant.guardianName}</Text>
        <Text>R/o {data.parties.applicant.address}</Text>
      </View>
      
      <View style={styles.partyContainer}>
        <Text></Text>
        <Text style={styles.bold}>...APPLICANT/PLAINTIFF</Text>
      </View>
      
      <Text style={[styles.bold, styles.center]}>Versus</Text>
      
      <View style={styles.section}>
        <Text>Y {data.parties.respondent.name}</Text>
        <Text>S/o {data.parties.respondent.guardianName}</Text>
        <Text>R/o {data.parties.respondent.address}</Text>
      </View>
      
      <View style={styles.partyContainer}>
        <Text></Text>
        <Text style={styles.bold}>...RESPONDENT/DEFENDANT</Text>
      </View>

      <Text style={styles.title}>
        {data.applicationSubtitle}
      </Text>

      <Text style={[styles.bold, { marginBottom: 10 }]}>MOST RESPECTFULLY SHOWETH:</Text>

      {data.applicationBody.grounds.map((ground, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemNumber}>{index + 1}.</Text>
          <Text style={styles.listItemContent}>{ground}</Text>
        </View>
      ))}

      <View style={styles.prayerSection}>
        <Text style={[styles.bold, { marginBottom: 10 }]}>PRAYER:</Text>
        <Text style={{ marginBottom: 10 }}>It is therefore most respectfully prayed that the Hon'ble Court may:</Text>
        
        {data.prayer.items.map((item, index) => (
          <View key={index} style={styles.prayerItem}>
            <Text style={styles.prayerLetter}>{String.fromCharCode(97 + index)}.</Text>
            <Text style={styles.prayerContent}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footerRow}>
          <Text>Date:</Text>
          <Text style={styles.bold}>Applicant</Text>
        </View>
        <View style={styles.footerRow}>
          <Text>Place:</Text>
          <Text>Through</Text>
        </View>
        <View style={[styles.footerRow, styles.rightAlign]}>
          <Text></Text>
          <Text style={styles.bold}>Advocate</Text>
        </View>
      </View>

      <Text style={[styles.section, { marginTop: 20 }]}>{data.footer.note}</Text>
      <Text style={styles.center}>* * * * *</Text>
    </Page>
  </Document>
);