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
});

export const TemporaryInjunctionApplicationPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>
        {data.applicationTitle}
      </Text>
      <Text style={styles.header}>
        IN THE COURT OF {data.courtDetails.courtType} (DISTRICT {data.courtDetails.district}), {data.courtDetails.state}
      </Text>
      
      <View style={styles.section}>
        <Text style={[styles.bold, styles.rightAlign]}>
          {data.courtDetails.caseType} NO. {data.courtDetails.caseNumber} OF {data.courtDetails.caseYear}
        </Text>
        <Text style={[styles.rightAlign]}>IN</Text>
        <Text style={[styles.rightAlign]}>
          SUIT NO. {data.courtDetails.suitNumber} OF {data.courtDetails.suitYear}
        </Text>
      </View>

      <Text style={styles.section}>IN THE MATTER OF:</Text>
      
      <View style={styles.partyContainer}>
        <View>
          <Text>{data.parties.plaintiff.name}</Text>
          <Text>{data.parties.plaintiff.guardianRelation === 'father' ? 'S/o' : 'C/o'} {data.parties.plaintiff.guardianName}</Text>
          <Text>R/o {data.parties.plaintiff.address}</Text>
        </View>
        <Text style={styles.bold}>.....PLAINTIFF/APPLICANT</Text>
      </View>
      
      <Text style={[styles.bold, styles.center]}>VERSUS</Text>
      
      {data.parties.defendants.map((defendant, index) => (
        <View key={index} style={styles.partyContainer}>
          <View>
            <Text>{index + 1}. {defendant.name}</Text>
            <Text>{defendant.guardianRelation === 'father' ? 'S/o' : 'C/o'} {defendant.guardianName}</Text>
            <Text>R/o {defendant.address}</Text>
          </View>
          <Text style={styles.bold}>.....DEFENDANTS/RESPONDENTS</Text>
        </View>
      ))}

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

      <Text style={[styles.bold, { marginTop: 20, marginBottom: 10 }]}>PRAYER:</Text>
      <Text>{data.prayer.text}</Text>

      <View style={styles.footerContainer}>
        <View style={styles.footerRow}>
          <Text>Place: {data.footer.place}</Text>
          <Text style={styles.bold}>Plaintiff/Applicant</Text>
        </View>
        <View style={styles.footerRow}>
          <Text>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          <Text>Through</Text>
        </View>
        <View style={[styles.footerRow, styles.rightAlign]}>
          <Text></Text>
          <View>
            <Text>{data.footer.advocateName}</Text>
            <Text style={styles.bold}>Advocate</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.section, { marginTop: 20 }]}>{data.footer.note}</Text>
      <Text style={styles.center}>* * * * *</Text>
    </Page>
  </Document>
);