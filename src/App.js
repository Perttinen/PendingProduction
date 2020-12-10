import React, { useState, useEffect} from 'react';
import './App.css';
import axios from 'axios'




const printOneOrderLine = (r) => {  
  return( 
    <tr key={r.orderId+r.loadingDate}> 
      <td>{r.loadingDate}</td>
      <td>{r.orderId}</td>                                         
      <td>{r.buildingSite}</td>                                                
      <td>{r.cadorKg}</td>
      <td>{r.permaticKg}</td>
      <td>{r.perfektKg}</td>
      <td>{r.syntaxKg}</td>
      <td>{r.ympyratKg}</td>
      <td>{r.conceptKg}</td>                                           
      <td>{r.minisyntaxKg}</td>
      <td>{r.formatKg}</td>
      <td>{r.progressKg}</td>
    </tr>
  )
}

const printOneOrderLineNodate = (r) => {
  return(
    <tr key={r.orderId+r.loadingDate}> 
      <td>{''}</td>
      <td>{r.orderId }</td>                                          
      <td>{r.buildingSite}</td>                                              
      <td>{r.cadorKg}</td>
      <td>{r.permaticKg}</td>
      <td>{r.perfektKg}</td>
      <td>{r.syntaxKg}</td>
      <td>{r.ympyratKg}</td>
      <td>{r.conceptKg}</td>                                           
      <td>{r.minisyntaxKg}</td>
      <td>{r.formatKg}</td>
      <td>{r.progressKg}</td>
    </tr>
  )
}

const printOneDayTotalWeightByMachineLine = (day, data) => {
  let allMachines = {Cador:null, Permatic:null, Perfekt:null, Syntax:null, Ympyrät:null, Concept:null, MiniSyntax:null, Format:null, Progress:null}
  for(let i = 0; i<data.length; i++){
    if(data[i].loadingDate.includes(day)){    
        allMachines.Cador += data[i].cadorKg
        allMachines.Permatic += data[i].permaticKg
        allMachines.Perfekt += data[i].perfektKg
        allMachines.Syntax += data[i].syntaxKg
        allMachines.Ympyrät += data[i].ympyratKg
        allMachines.Concept += data[i].conceptKg
        allMachines.MiniSyntax += data[i].minisyntaxKg
        allMachines.Format += data[i].formatKg
        allMachines.Progress += data[i].progressKg
    }
  }
  for(let i = 0; i < Object.keys(allMachines).length; i++){
    if(allMachines[Object.keys(allMachines)[i]] === 0){
      allMachines[Object.keys(allMachines)[i]] = null
    }
  }
  return(
    <tr className="sumLine" key={day}> 
      <td>{''}</td>
      <td>{''}</td>                                         
      <td>{''}</td>                                                
      <td>{allMachines.Cador}</td>
      <td>{allMachines.Permatic}</td>
      <td>{allMachines.Perfekt}</td>
      <td>{allMachines.Syntax}</td>
      <td>{allMachines.Ympyrät}</td>
      <td>{allMachines.Concept}</td>                                           
      <td>{allMachines.MiniSyntax}</td>
      <td>{allMachines.Format}</td>
      <td>{allMachines.Progress}</td>
    </tr>
  )
}

const Body = ({data}) => {
  let rivit = []
  rivit[0] = printOneOrderLine(data[0])

  for(let i = 1; i<data.length;i++){
    if(data[i].loadingDate !== data[i-1].loadingDate){
      rivit = rivit.concat(printOneDayTotalWeightByMachineLine(data[i-1].loadingDate, data))
    }
    if(data[i].loadingDate === data[i-1].loadingDate){
    rivit = rivit.concat(printOneOrderLineNodate(data[i]))
    }else{
      rivit=rivit.concat(printOneOrderLine(data[i]))
    }
    if( i === data.length-1){
      rivit = rivit.concat(printOneDayTotalWeightByMachineLine(data[i].loadingDate, data))
    }
  }
  return rivit
}

const Show = ({data}) => {
  if(data.length>1){
    const pData = formatData(data)
    return (
      <table>
        <thead>
          <tr>
            <th width="7%" >lastaus pv</th><th width="7%">tilausnro</th><th width="15%">kohde</th><th>cador</th><th>tupla</th><th>pöytä</th><th>syntax</th>
            <th>ympyrät</th><th>concept</th><th>mini-syntax</th><th>format</th><th>progress</th>   
          </tr>
        </thead>
         <tbody>
          <Body data={pData}/>
         </tbody>
      </table>
    )
  }
  return 'Ladataan...'
}

const formatData = (data) => {
  if(data.length > 1){
    let newData = []
    for(let i = 0 ; i < data.length ; i++){
      if(!(data[i].building_site === "" || data[i].order_id.includes('ai'))){ 
        let tempOrder = {
          loadingDate: data[i].loading_date,
          orderId: data[i].order_id,
          buildingSite: data[i].building_site,
          cadorKg: data[i].cador_kg === undefined ? null : data[i].cador_kg === 0 ? null : Math.round(data[i].cador_kg), 
          conceptKg: data[i].concept_kg === undefined ? null : data[i].concept_kg === 0 ? null : Math.round(data[i].concept_kg),
          formatKg: data[i].format_kg === undefined ? null : data[i].format_kg === 0 ? null : Math.round(data[i].format_kg),
          manualShearKg: data[i].manual_shear_kg === undefined ? null : data[i].manual_shear_kg === 0 ? null : Math.round(data[i].manual_shear_kg),
          minisyntaxKg: data[i].minisyntax_kg === undefined ? null : data[i].minisyntax_kg === 0 ? null : Math.round(data[i].minisyntax_kg),
          perf2Kg: data[i].perf2_kg === undefined ? null : data[i].perf2_kg === 0 ? null : Math.round(data[i].perf2_kg),
          perfKg: data[i].perf_kg === undefined ? null : data[i].perf_kg === 0 ? null : Math.round(data[i].perf_kg),
          permaticKg: data[i].permatic_kg === undefined ? null : data[i].permatic_kg === 0 ? null : Math.round(data[i].permatic_kg),
          progressKg: data[i].progress_kg === undefined ? null : data[i].progress_kg === 0 ? null : Math.round(data[i].progress_kg),
          radiusBenderKg: data[i].radius_bender_kg === undefined ? null : data[i].radius_bender_kg === 0 ? null : Math.round(data[i].radius_bender_kg),
          spiralKg: data[i].spiral_kg === undefined ? null : data[i].spiral_kg === 0 ? null : Math.round(data[i].spiral_kg),
          syntaxKg: data[i].syntax_kg === undefined ? null : data[i].syntax_kg === 0 ? null : Math.round(data[i].syntax_kg),
          perf3Kg: data[i].perf3_kg === undefined ? null : data[i].perf3_kg === 0 ? null : Math.round(data[i].perf3_kg)
        }
        const poydat = tempOrder.perfKg + tempOrder.perf2Kg + tempOrder.perf3Kg
        delete tempOrder['perfKg']
        delete tempOrder['perf2Kg']
        delete tempOrder['perf3Kg']
        tempOrder.perfektKg = poydat === 0 ? null : poydat

        const ympyrat = tempOrder.radiusBenderKg + tempOrder.spiralKg
        delete tempOrder['radiusBenderKg']
        delete tempOrder['spiralKg']
        tempOrder.ympyratKg = ympyrat === 0 ? null : ympyrat

        newData.push(tempOrder)
      }
    }
    newData = newData.sort((a,b) => a.loadingDate.replaceAll('-','') - b.loadingDate.replaceAll('-',''))
    return newData
  }
}

const App = () => {

  const [data,setData] = useState([])

  const url2 = 'http://s237-0075:3005/indalgo/management/optimizer/production_report.json'

  useEffect(() => {
    // setInterval(() => {
    axios
    .get(url2)
    .then(res =>{setData(res.data) 
      // console.log(new Date())
          })
    // },20000)
    }      
  ,[])

  const pop = () => {
    alert('popopo')
  }

  return(
    <div>

      <h1>STEELNET</h1>
      <Show data={data}/>

    </div>
  )
}

export default App;
