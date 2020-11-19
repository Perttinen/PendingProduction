import React, { useState, useEffect} from 'react';
import './App.css';
import axios from 'axios'

const printOneOrderLine = (r) => {
  return <tr key={r.so}> 
  <td>{r.lDate}</td>
  <td>{r.so}</td>                                         
  <td>{r.site}</td>                                                
  <td>{r.machines.Cador}</td>
  <td>{r.machines.Permatic}</td>
  <td>{r.machines.Perfekt}</td>
  <td>{r.machines.Syntax}</td>
  <td>{r.machines.Concept}</td>                                           
  <td>{r.machines.MiniSyntax}</td>
  <td>{r.machines.Format}</td>
  <td>{r.machines.Progress}</td>
</tr>
}
const printOneOrderLineNodate = (r) => {
  return <tr key={r.so}> 
  <td>{''}</td>
  <td>{r.so}</td>                                         
  <td>{r.site}</td>                                                
  <td>{r.machines.Cador}</td>
  <td>{r.machines.Permatic}</td>
  <td>{r.machines.Perfekt}</td>
  <td>{r.machines.Syntax}</td>
  <td>{r.machines.Concept}</td>                                           
  <td>{r.machines.MiniSyntax}</td>
  <td>{r.machines.Format}</td>
  <td>{r.machines.Progress}</td>
</tr>
}

const printOneDayTotalWeightByMachineLine = (day, data) => {
  let allMachines = {Cador:null, Permatic:null, Perfekt:null, Syntax:null, Concept:null, MiniSyntax:null, Format:null, Progress:null}
  for(let i = 0; i<data.length; i++){
    if(data[i].lDate.includes(day)){
    
      for(let c = 0; c<Object.keys(data[i].machines).length; c++){
        allMachines[Object.keys(data[i].machines)[c]] += data[i].machines[Object.keys(data[i].machines)[c]]
      }
  }

  // for(let i = 0; i<Object.keys(allMachines).length;i++){
  //   if(allMachines[Object.keys(allMachines)[i]] === 0){
  //     allMachines[Object.keys(allMachines)[i]] = null
  //   }
  // }
  
  }
  return <tr class="sumLine"> 
  <td>{''}</td>
  <td>{''}</td>                                         
  <td>{''}</td>                                                
  <td>{allMachines.Cador}</td>
  <td>{allMachines.Permatic}</td>
  <td>{allMachines.Perfekt}</td>
  <td>{allMachines.Syntax}</td>
  <td>{allMachines.Concept}</td>                                           
  <td>{allMachines.MiniSyntax}</td>
  <td>{allMachines.Format}</td>
  <td>{allMachines.Progress}</td>
</tr>
}

const createOrderObjects = (data) => {
if(data.length > 1){
  let orderObjects = []
  orderObjects[0] = {
    so: data[0].order_id,
    lDate: data[0].loading_date,
    site: data[0].building_site,
    machines: {
      [data[0].machine]: data[0].weight_kg,
      }
    }

  for(let i = 1; i < data.length; i++){
    for(let c = 0; c < orderObjects.length; c++){
      if(data[i].order_id === orderObjects[c].so){
        if(Object.keys(orderObjects[c].machines).includes(data[i].machine_name)){
        orderObjects[c].machines[data[i].machine_name] += data[i].weight_kg
        }else{
          orderObjects[c].machines[data[i].machine_name] = data[i].weight_kg
        }
        break
      }
      if(c === orderObjects.length - 1){
        orderObjects = orderObjects.concat({
          so: data[i].order_id,
          lDate: data[i].loading_date,
          site: data[i].building_site,
          machines: {
            [data[i].machine_name]: data[i].weight_kg
          }
        })
        c++
      }
    }
  }
  orderObjects = orderObjects.sort((a,b) => a.lDate.replaceAll('-','') -b.lDate.replaceAll('-',''))
  
  return orderObjects
}

}

const Show = ({data}) => {
  if(data.length>1){
    data.forEach(e => {
      if(e.machine_name.includes('Mini S')){e.machine_name = 'MiniSyntax'}
      if(e.machine_name.includes('Perf')){e.machine_name = 'Perfekt'}
      if(e.machine_name.includes('ine')){e.machine_name = 'Syntax'}  
  })
  
  let orderObjects = createOrderObjects(data)

    const J = () => {
      let rivit = []
      rivit[0] = printOneOrderLine(orderObjects[0])

      for(let i = 1; i<orderObjects.length;i++){
        if(orderObjects[i].lDate !== orderObjects[i-1].lDate){
          rivit = rivit.concat(printOneDayTotalWeightByMachineLine(orderObjects[i-1].lDate, orderObjects))
        }
        if(orderObjects[i].lDate === orderObjects[i-1].lDate){
        rivit = rivit.concat(printOneOrderLineNodate(orderObjects[i]))
        }else{
          rivit=rivit.concat(printOneOrderLine(orderObjects[i]))
        }

      }
      printOneDayTotalWeightByMachineLine('2020-11-24', orderObjects)
      return rivit
    }
    return (
      <table>
        <thead>
          <tr>
            <th>PVM</th><th>Tilausnumero</th><th>Kohde</th><th>Cador</th><th>Tupla</th><th>Pöytä</th><th>Syntax</th><th>Concept</th><th>Minisyntax</th>
            <th>Format</th><th>Progress</th>
          </tr>
        </thead>
        <tbody>
          <J/>
        </tbody>
      </table>
    )
  }
  return 'Ladataan...'
}

const App = () => {

  const [data,setData] = useState([])

  // useEffect(() => {
  
  //   setInterval(() => {
  //   axios
  //     .get('http://s237-0075:3005/indalgo/management/optimizer/get_table_data/pending_production')
  //     .then(res =>{ setData(res.data) 
  //     console.log(new Date())  }              
  //     ) },120000)
  //     }    
  //     ,[])

      useEffect(() => {
        axios
          .get('http://s237-0075:3005/indalgo/management/optimizer/get_table_data/pending_production')
          .then(res =>setData(res.data))
          }    
          ,[])

          createOrderObjects(data)


  return (
    
    <div>
    <h1>SteelReporter</h1>
<Show data={data}/>
 
    </div>
    
  )
}

export default App;
