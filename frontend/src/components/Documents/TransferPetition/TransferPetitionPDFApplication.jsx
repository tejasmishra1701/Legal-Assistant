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
    marginBottom: 15,
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
    marginTop: 10,
    marginBottom: 10,
  },
  prayerSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  smallText: {
    fontSize: 10,
  },
  underline: {
    textDecoration: 'underline',
  },
});

export const TransferPetitionApplicationPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        {data.applicationTitle}
      </Text>
      
      <Text style={styles.header}>
        IN THE {data.courtDetails.targetCourtType} OF INDIA
      </Text>
      
      <Text style={styles.header}>
        ORIGINAL CIVIL JURISDICTION
      </Text>
      
      <View style={styles.section}>
        <Text style={[styles.center, styles.bold]}>
          TRANSFER PETITION (CIVIL) NO. {data.courtDetails.transferPetitionNumber}/{data.courtDetails.transferPetitionYear}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.center, styles.smallText, { marginBottom: 20 }]}>
          (UNDER SECTION 25 OF THE CODE OF CIVIL PROCEDURE, READ WITH ORDER XLI, SUPREME COURT RULES, 2013.)
        </Text>
      </View>

      <Text style={[styles.section, styles.underline]}>IN THE MATTER OF:</Text>
      
      <View style={styles.section}>
        <Text>{data.parties.petitioner.name}</Text>
        <Text>S/o {data.parties.petitioner.guardianName}</Text>
        <Text>R/o {data.parties.petitioner.address}</Text>
      </View>
      
      <View style={styles.partyContainer}>
        <Text></Text>
        <Text>...PETITIONER</Text>
      </View>
      
      <Text style={[styles.center, styles.bold]}>VERSUS</Text>
      
      <View style={styles.section}>
        {data.parties.respondents.map((respondent, index) => (
          <View key={index} style={{ marginBottom: 5 }}>
            <Text>{index + 1}. {respondent.name}</Text>
            <Text>    {respondent.address}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.partyContainer}>
        <Text></Text>
        <Text>...RESPONDENTS</Text>
      </View>

      <Text style={[styles.title, { marginTop: 30 }]}>
        AND IN THE MATTER OF:
      </Text>

      <Text style={[styles.center, { marginBottom: 20 }]}>
        TRANSFER OF CIVIL WRIT PETITION NO.{data.courtDetails.originalCaseNumber}/{data.courtDetails.originalCaseYear} FILED BY THE PETITIONER AGAINST THE RESPONDENTS PENDING IN THE {data.courtDetails.originalCourtType} OF {data.courtDetails.originalCourtLocation}, TO THE {data.courtDetails.targetCourtType} OF JUDICATURE AT {data.courtDetails.targetCourtLocation}.
      </Text>

      <View style={styles.section}>
        <Text style={{ marginBottom: 10 }}>To</Text>
        <Text>The Hon'ble Chief Justice of India,</Text>
        <Text style={{ marginBottom: 20 }}>And his Companion Justices of the Hon'ble Supreme Court of India at New Delhi</Text>
      </View>

      <Text style={[styles.bold, { marginBottom: 10 }]}>MOST RESPECTFULLY SHOWETH:</Text>

      {data.applicationBody.grounds.map((ground, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemNumber}>{index + 1}.</Text>
          <Text style={styles.listItemContent}>{ground}</Text>
        </View>
      ))}

      <View style={styles.prayerSection}>
        <Text style={[styles.bold, { marginBottom: 10 }]}>PRAYER:</Text>
        <Text>{data.prayer.text}</Text>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footerRow}>
          <Text>DATE OF DRAWN _______________</Text>
          <Text style={styles.bold}>FILED BY:</Text>
        </View>
        <View style={styles.footerRow}>
          <Text>DATE OF FILING</Text>
          <Text>ADVOCATE FOR THE PETITIONER</Text>
        </View>
        <View style={[styles.footerRow]}>
          <Text>{data.footer.place}</Text>
          <Text></Text>
        </View>
      </View>

      <Text style={[styles.section, { marginTop: 20 }]}>{data.footer.note}</Text>
      <Text style={styles.center}>* * * * *</Text>
    </Page>
  </Document>
);