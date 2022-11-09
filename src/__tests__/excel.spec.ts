import { describe, it } from "mocha";
import { JIRA, JIRATOexcel, XLS, generateXLSReport} from './excel'
import { convertArrayOfKeyValuesToJSON } from "./utility";
import { JIRAerror } from "../jiratype";
import {queries as deviceAccessoryQuery} from '../../script/deviceaccessory'
import * as dotenv from 'dotenv';
import { queries } from "../../script/deviceaccessory";
import { assert } from "chai";



dotenv.config();

const deviceOptions= queries.filter(query=>query.sheetname=='devicesupported')[0]
const accessoriesOptions= queries.filter(query=>query.sheetname=='accessoriessupported')[0]
const deprecatedOptions= queries.filter(query=>query.sheetname=='deprecated')[0]


describe('full excel', function(){
    this.timeout(10000);
    const device:JIRATOexcel = new JIRATOexcel(deviceOptions.jiraQuery,deviceOptions.jirafields)
    const deprecated:JIRATOexcel = new JIRATOexcel(deprecatedOptions.jiraQuery,deprecatedOptions.jirafields)
    const accessory:JIRATOexcel = new JIRATOexcel(accessoriesOptions.jiraQuery,accessoriesOptions.jirafields)

    it.skip('create xls file', async () => {
        
        const xls=new XLS()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const preparexls=(jiraopt:JIRA,data:any):JIRAerror=>{
            xls.addWorkSheet(jiraopt.sheetname)
            xls.fillsheet(jiraopt.sheetname,jiraopt.excelmapping,data)
            return {error:null}
        }
        await accessory.init()
        await accessory.getjiralist()
        const dataacc=accessory.prepareForExcel()
        const dataReadyacc=dataacc.map((dd: { key: string; value: string; }[][])=> convertArrayOfKeyValuesToJSON(dd))
        preparexls(accessoriesOptions,dataReadyacc)        
        
        await deprecated.init()
        await deprecated.getjiralist()
        const datadeprecated=deprecated.prepareForExcel()
        const dataReadydeprecated=datadeprecated.map((dd: { key: string; value: string; }[][])=> convertArrayOfKeyValuesToJSON(dd))
        preparexls(deprecatedOptions,dataReadydeprecated)        
        
        await device.init()
        await device.getjiralist()
        const data=device.prepareForExcel()
        const dataReady=data.map((dd: { key: string; value: string; }[][])=> convertArrayOfKeyValuesToJSON(dd))
        preparexls(deviceOptions,dataReady)        


        await xls.savexls('texti.xlsx')
        console.log('file written')
 
    });
    it('generate device report', async () => {
        await generateXLSReport(deviceAccessoryQuery,'toto')
        .then(res=>{
            // console.log(res)
            assert(JSON.stringify(res)===JSON.stringify({error: null, message: 'file toto.xlsx written' }))
        })
        .catch(err=> {console.log(err)})
        
    });

});

