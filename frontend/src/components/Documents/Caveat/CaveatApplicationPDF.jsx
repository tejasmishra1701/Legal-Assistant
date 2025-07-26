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
});

export const CaveatApplicationPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        {data.applicationTitle}
      </Text>
      <Text style={styles.header}>
        IN THE {data.courtDetails.courtType} OF DELHI AT {data.courtDetails.courtLocation}
      </Text>
      
      <View style={styles.section}>
        <Text style={[styles.center]}>
          CAVEAT NO. {data.courtDetails.caveatNumber}/{data.courtDetails.caveatYear}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.center, { fontSize: 10, marginBottom: 20 }]}>
          (ARISING OUT OF THE JUDGMENT AND ORDER DATED ........ IN SUIT NO. {data.courtDetails.originalSuitNumber} TITLED AS ABC v. XYZ PASSED BY SH. {data.courtDetails.originalJudgeName}, CIVIL JUDGE, {data.courtDetails.originalDistrict} DISTRICT, DELHI)
        </Text>
      </View>

      <Text style={styles.section}>In the matter of:</Text>
      
      <View style={styles.section}>
        <Text>XYZ {data.parties.petitioner.name}</Text>
        <Text>S/o {data.parties.petitioner.guardianName}</Text>
        <Text>R/o {data.parties.petitioner.address}</Text>
      </View>
      
      <View style={styles.partyContainer}>
        <Text></Text>
        <Text>...Petitioner</Text>
      </View>
      
      <Text style={[styles.center]}>Versus</Text>
      
      <View style={styles.section}>
        <Text>ABC {data.parties.caveator.name}</Text>
        <Text>S/o {data.parties.caveator.guardianName}</Text>
        <Text>R/o {data.parties.caveator.address}</Text>
      </View>
      
      <View style={styles.partyContainer}>
        <Text></Text>
        <Text>...Respondent/Caveator</Text>
      </View>

      <Text style={styles.title}>
        {data.applicationSubtitle}
      </Text>

      <Text style={[styles.bold, { marginBottom: 10 }]}>Most Respectfully Showeth:</Text>

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
          <Text>{data.footer.place}</Text>
          <Text style={styles.bold}>Caveator</Text>
        </View>
        <View style={styles.footerRow}>
          <Text>Dated:</Text>
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