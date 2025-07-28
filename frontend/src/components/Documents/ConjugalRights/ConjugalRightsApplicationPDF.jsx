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
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
    marginTop: 10,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 2,
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
  },
  tableColWide: {
    width: '33.33%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
  },
  tableCellHeader: {
    margin: 'auto',
    marginTop: 2,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Helvetica-Bold',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 2,
    fontSize: 8,
    textAlign: 'center',
  },
  proceedingsTable: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
    marginTop: 10,
  },
  proceedingsColHeader: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 2,
  },
  proceedingsCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
  },
});

export const ConjugalRightsApplicationPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        {data.applicationTitle}
      </Text>
      
      <Text style={styles.header}>
        IN THE COURT OF {data.courtDetails.courtType}, {data.courtDetails.courtLocation}
      </Text>
      
      <View style={styles.section}>
        <Text style={[styles.center, styles.bold]}>
          HMA PETITION NO. {data.courtDetails.petitionNumber} OF {data.courtDetails.petitionYear}
        </Text>
      </View>

      <Text style={[styles.section, styles.underline, { marginTop: 20, marginBottom: 10 }]}>IN THE MATTER OF :</Text>
      
      <View style={styles.section}>
        <Text>X {data.parties.petitioner.name}</Text>
        <Text>s/o {data.parties.petitioner.guardianName}</Text>
        <Text>R/o {data.parties.petitioner.address}</Text>
      </View>
      
      <View style={styles.partyContainer}>
        <Text></Text>
        <Text>... PETITIONER</Text>
      </View>
      
      <Text style={[styles.center, styles.bold]}>VERSUS</Text>
      
      <View style={styles.section}>
        <Text>Y {data.parties.respondent.name}</Text>
        <Text>w/o {data.parties.respondent.guardianName}</Text>
        <Text>R/o {data.parties.respondent.address}</Text>
      </View>
      
      <View style={styles.partyContainer}>
        <Text></Text>
        <Text>...RESPONDENT</Text>
      </View>

      <Text style={[styles.title, { marginTop: 30 }]}>
        {data.applicationSubtitle}
      </Text>

      <Text style={[styles.bold, { marginBottom: 10, marginTop: 20 }]}>Most Respectfully Showeth:</Text>

      {data.applicationBody.grounds.map((ground, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listItemNumber}>{index + 1}.</Text>
          <Text style={styles.listItemContent}>{ground}</Text>
        </View>
      ))}

      {/* Status Table */}
      {data.statusTable && (
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColWide}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={styles.tableColWide}>
              <Text style={styles.tableCellHeader}>Husband</Text>
            </View>
            <View style={styles.tableColWide}>
              <Text style={styles.tableCellHeader}>Wife</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Status</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Age</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Place of Residence</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Status</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Age</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Place of Residence</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>(i) Before marriage</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.husband.beforeMarriage.status}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.husband.beforeMarriage.age}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.husband.beforeMarriage.residence}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.wife.beforeMarriage.status}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.wife.beforeMarriage.age}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.wife.beforeMarriage.residence}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>(ii) At the time of filing the petition</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.husband.atFiling.status}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.husband.atFiling.age}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.husband.atFiling.residence}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.wife.atFiling.status}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.wife.atFiling.age}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{data.statusTable.wife.atFiling.residence}</Text>
            </View>
          </View>
        </View>
      )}

      <Text style={[styles.smallText, { marginTop: 10, marginBottom: 10 }]}>
        (Whether a party is a Hindu by religion or not is as part of his or her status).
      </Text>

      {/* Children Details */}
      {data.children && data.children.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.bold, { marginBottom: 10, marginTop: 10 }]}>
         That the (In this paragraph state the names of the children, if any, of the marriage together with their sex, dates of birth or ages).
          </Text>
          {data.children.map((child, index) => (
            <Text key={index} style={{ marginBottom: 5, fontSize: 10 }}>
              {index + 1}. {child.name}, {child.sex}, Born: {child.dateOfBirth}, Age: {child.age}
            </Text>
          ))}
        </View>
      )}

      {/* Or Section for Previous Proceedings */}
      <Text style={[styles.center, { marginTop: 15, marginBottom: 10 }]}>Or</Text>

      {/* Previous Proceedings Table */}
      {data.previousProceedings && data.previousProceedings.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.bold, { marginBottom: 10 }]}>
            There have been the following previous proceedings with regard to the marriage by or on behalf of the parties:
          </Text>
          <View style={styles.proceedingsTable}>
            <View style={styles.tableRow}>
              <View style={styles.proceedingsColHeader}>
                <Text style={styles.tableCellHeader}>Serial</Text>
              </View>
              <View style={styles.proceedingsColHeader}>
                <Text style={styles.tableCellHeader}>Name of Parties</Text>
              </View>
              <View style={styles.proceedingsColHeader}>
                <Text style={styles.tableCellHeader}>Nature of Proceedings with Section of that Act</Text>
              </View>
              <View style={styles.proceedingsColHeader}>
                <Text style={styles.tableCellHeader}>Number and year of the case</Text>
              </View>
              <View style={styles.proceedingsColHeader}>
                <Text style={styles.tableCellHeader}>Name and location of court</Text>
              </View>
              <View style={styles.proceedingsColHeader}>
                <Text style={styles.tableCellHeader}>Result</Text>
              </View>
            </View>
            {data.previousProceedings.map((proceeding, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.proceedingsCol}>
                  <Text style={styles.tableCell}>{proceeding.serialNo}</Text>
                </View>
                <View style={styles.proceedingsCol}>
                  <Text style={styles.tableCell}>{proceeding.nameOfParties}</Text>
                </View>
                <View style={styles.proceedingsCol}>
                  <Text style={styles.tableCell}>{proceeding.natureOfProceedings}</Text>
                </View>
                <View style={styles.proceedingsCol}>
                  <Text style={styles.tableCell}>{proceeding.caseNumber}</Text>
                </View>
                <View style={styles.proceedingsCol}>
                  <Text style={styles.tableCell}>{proceeding.courtName}</Text>
                </View>
                <View style={styles.proceedingsCol}>
                  <Text style={styles.tableCell}>{proceeding.result}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={[styles.smallText, { marginTop: 5 }]}>
            (Choose whichever is applicable to the facts)
          </Text>
        </View>
      )}

      <View style={styles.prayerSection}>
        <Text style={[styles.bold, { marginBottom: 10 }]}>PRAYER:</Text>
        <Text>{data.prayer.text}</Text>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footerRow}>
          <Text></Text>
          <Text style={styles.bold}>PETITIONER</Text>
        </View>
        <View style={styles.footerRow}>
          <Text></Text>
          <Text>Through</Text>
        </View>
        <View style={styles.footerRow}>
          <Text>Place: {data.footer.place}</Text>
          <Text></Text>
        </View>
        <View style={styles.footerRow}>
          <Text>Date:</Text>
          <Text style={styles.bold}>ADVOCATE</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.bold, { marginTop: 20, marginBottom: 10 }]}>VERIFICATION:</Text>
        <Text>{data.footer.verification}</Text>
      </View>

      <View style={styles.footerContainer}>
        <Text>Verified at..................................(Place)</Text>
        <Text>Dated.......................</Text>
        <Text style={[styles.rightAlign, { marginTop: 20 }]}>PETITIONER</Text>
      </View>

      <Text style={[styles.section, { marginTop: 20 }]}>{data.footer.note}</Text>
      <Text style={styles.center}>* * * * *</Text>
    </Page>
  </Document>
);