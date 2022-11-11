import {  Workbook, Worksheet } from 'exceljs';
import { WorkbookUtils} from "./xlsreader"
import { intersectionStringArray } from "./util";

const fileA='./src/__tests__/sample/Book1_versionA.xlsx'
const fileB='./src/__tests__/sample/Book1_versionB.xlsx'

/* Steps Comparison of 2 excels files
inputs fileA, file B as workbook
output fileComp
- direct comparison between fileA & file B
- sheets created for all files  (differences + intersection)
    - for each sheets, display
        intersection
        diffA
        diffB
output is a workbook 
*/
function _union(arr1:string[],arr2:string[]):string[]{
    const arr2Unique=arr2.filter(a2=>!arr1.includes(a2))
    return [...arr1, ...arr2Unique]
}
function differenceperSheet(sheet1:Worksheet|null,sheet2:Worksheet|null,comparisonSheet:Worksheet){
    const separator=('|')
    const row1=sheet1?getRows(sheet1):[]
    const row2=sheet2?getRows(sheet2):[]
    const analyse= intersectionStringArray(row1,row2)
    formatHeaderRow(comparisonSheet, "Common between the two worksheet")
    analyse.intersection.forEach (r=> comparisonSheet.addRow(r.split(separator)))
    formatHeaderRow(comparisonSheet, "Not included in sheet1")
    analyse.diff1.forEach (r=> comparisonSheet.addRow(r.split(separator)))
    formatHeaderRow(comparisonSheet, "Not included in Sheet2")
    analyse.diff2.forEach (r=> comparisonSheet.addRow(r.split(separator)))
    return analyse
}
function formatHeaderRow(sheet:Worksheet, text:string){
    sheet.addRow([text])
    const row= sheet.lastRow
    if (row) {
         row.font ={size:16}
         row.border = {
            top: {style:'thick', color: {argb:'00000000'}},
            bottom: {style:'thick', color: {argb:'00000000'}},
         }
         row.height= 40
         row.alignment= {vertical:'middle'}
         row.fill={
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'00DADA'},
         }
    }
}
function getRows(sheet:Worksheet):string[]{
    return <string[]>sheet.getRows(1,sheet.rowCount)?.map(row=>WorkbookUtils.CSVifyRow(row))
}
function compareWorkbook (wb1:WorkbookUtils,wb2:WorkbookUtils):Workbook {
    // initiate WBcompare
    const WSList=_union(wb1.sheetList,wb2.sheetList)
    const WBcompare = new WorkbookUtils()
    WSList.forEach(ws=> {
        WBcompare.wb.addWorksheet(ws)
        differenceperSheet(wb1.wb.getWorksheet(ws),wb2.wb.getWorksheet(ws),WBcompare.wb.getWorksheet(ws))
    })
    return WBcompare.wb
}
const main = async  (fileAPath:string, fileBPath:string,outputComparisonPath:string)=>{
    const wb1:WorkbookUtils=new WorkbookUtils()
    const wb2:WorkbookUtils=new WorkbookUtils()
    await wb1.loadExcelFile(fileAPath)
    await wb2.loadExcelFile(fileBPath)
    const WBresult= compareWorkbook(wb1,wb2)
    WBresult.xlsx.writeFile(outputComparisonPath)
    console.log(`${outputComparisonPath} written`)
}


main(fileA,fileB,'test3.xlsx')

