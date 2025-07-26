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
    width: 30,
    minWidth: 30,
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
  verification: {
    marginTop: 30,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginTop: 20,
    marginBottom: 10,
    textDecoration: 'underline',
  },
});

export const WrittenStatementApplicationPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>
        IN THE COURT OF SHRI {data.courtDetails.judgeName} CIVIL JUDGE
      </Text>
      <Text style={styles.header}>
        (DISTRICT {data.courtDetails.district}), {data.courtDetails.state}
      </Text>
      
      <View style={styles.section}>
        <Text style={[styles.rightAlign]}>
          SUIT NO. {data.courtDetails.suitNumber} OF {data.courtDetails.suitYear}
        </Text>
      </View>

      <View style={styles.section}>
        <Text>X {data.parties.plaintiff.name}</Text>
      </View>
      
      <View style={styles.partyContainer}>
        <Text></Text>
        <Text style={styles.bold}>... PLAINTIFF</Text>
      </View>
      
      <Text style={[styles.bold, styles.center]}>VERSUS</Text>
      
      <View style={styles.section}>
        <Text>Y {data.parties.defendant.name}</Text>
      </View>
      
      <View style={styles.partyContainer}>
        <Text></Text>
        <Text style={styles.bold}>....DEFENDANT</Text>
      </View>

      <Text style={styles.title}>
        {data.applicationTitle}
      </Text>

      <Text style={[styles.bold, { marginBottom: 10 }]}>MOST RESPECTFULLY SHOWETH:</Text>

      <Text style={styles.sectionTitle}>PRELIMINARY OBJECTIONS:</Text>

      {data.applicationBody.preliminaryObjections.map((objection, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemNumber}>{index + 1}.</Text>
          <Text style={styles.listItemContent}>{objection}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>ON MERITS :</Text>

      <Text style={{ marginBottom: 10 }}>
        Without prejudice to the preliminary objections stated above, the reply on merits, which is without prejudice to one another, is as under:-
      </Text>

      {data.applicationBody.onMerits.map((merit, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemNumber}>{index + 1}.</Text>
          <Text style={styles.listItemContent}>{merit}</Text>
        </View>
      ))}

      <View style={styles.prayerSection}>
        <Text style={[styles.bold, { marginBottom: 10 }]}>PRAYER:</Text>
        <Text style={{ marginBottom: 10 }}>It is, therefore most respectfully prayed that this Hon'ble Court may be pleased to:</Text>
        
        {data.prayer.items.map((item, index) => (
          <View key={index} style={styles.prayerItem}>
            <Text style={styles.prayerLetter}>{String.fromCharCode(97 + index)})</Text>
            <Text style={styles.prayerContent}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footerRow}>
          <Text>{data.footer.place}</Text>
          <Text style={styles.bold}>DEFENDANT</Text>
        </View>
        <View style={styles.footerRow}>
          <Text>Dated</Text>
          <Text>THROUGH</Text>
        </View>
        <View style={[styles.footerRow, styles.rightAlign]}>
          <Text></Text>
          <Text style={styles.bold}>ADVOCATE</Text>
        </View>
      </View>

      <View style={styles.verification}>
        <Text style={[styles.bold, { marginBottom: 10 }]}>VERIFICATION :</Text>
        <Text>{data.verification.text}</Text>
        <View style={[styles.footerRow, { marginTop: 20 }]}>
          <Text></Text>
          <Text style={styles.bold}>DEFENDANT</Text>
        </View>
        <Text style={[styles.section, { marginTop: 10 }]}>{data.footer.note}</Text>
      </View>

      <Text style={styles.center}>* * * * *</Text>
    </Page>
  </Document>
);