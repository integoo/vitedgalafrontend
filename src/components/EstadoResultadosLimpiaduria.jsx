import React, { useState, useEffect } from 'react'


import "./EstadoResultadosLimpiaduria.css"

const EstadoResultadosLimpiaduria = ({onProps}) => {
    const accessToken = onProps.accessToken
    const origin = onProps.origin
    const Administrador = onProps.Administrador
    const [Fecha, setFecha] = useState("")
    const [Periodo, setPeriodo] = useState("")
    const [PeriodoAbierto, setPeriodoAbierto] = useState("")
    const [PeriodoAbiertoPrimerDia, setPeriodoAbiertoPrimerDia] = useState("")
    const [PeriodoAbiertoUltimoDia, setPeriodoAbiertoUltimoDia] = useState("")
    const [Periodos, setPeriodos] = useState([])
    const [Ayer, setAyer] = useState("")
    const [detallesLimpiaduria, setDetallesLimpiaduria] = useState([])
    const [detallesMelate, setDetallesMelate] = useState([])
    const [GastosPlanta, setGastosPlanta] = useState(0)
    const [GastosPlantaCifraControl, setGastosPlantaCifraControl] = useState(0)
    const [detallesUtilidadOperacionConMelate, setDetallesUtilidadOperacionConMelate] = useState([])
    const [UtilidadDeOperacionConMelate, setUtilidadDeOperacionConMelate] = useState(0)
    const [RentasEmpresa, setRentasEmpresa] = useState(0)
    const [OtrosIngresosEmpresa, setOtrosIngresosEmpresa] = useState(0)
    const [OtrosGastosEmpresa, setOtrosGastosEmpresa] = useState(0)
    const [UAIR, setUAIR] = useState(0)
    const [CifraControlTotal, setCifraControlTotal] = useState(0)
    const [detallesGastosInversiones, setDetallesGastosInversiones] = useState([])
    const [selectedOption, setSelectedOption] = useState("Fecha")
    const [TotalMovimientos, setTotalMovimientos] = useState(0)

    const [Hoy, setHoy] = useState("")
    const [PrimerDiaMes, setPrimerDiaMes] = useState("")
    const [UltimoDiaMes, setUltimoDiaMes] = useState("")
    


    useEffect(()=>{
        async function fetchData(){
            // const vFecha = await fechaActual()
            await fechaActual()
            await getPeriodoAbierto()
            const vPeriodo = await getConsultaPeriodos()
            await getGastosInversionperiodo(vPeriodo)
            await handleEstadoDeResultados(vPeriodo)
            await getRegistroContableCifraControl(vPeriodo)
        }
        fetchData()
    },[])


const fechaActual = async () => {
  let Fecha;
  const url = origin + `/api/fechaactual`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      console.log(data.error);
      alert(data.error);
      return;
    }
    Fecha = data[0].Fecha.substring(0, 10);
    setFecha(Fecha)
    return Fecha
  } catch (error) {
    console.log(error.message);
    alert(error.message);
  }
};

const getPeriodoAbierto = async () => {
  const url = origin + `/api/periodoabierto`;
  let PeriodoAbierto;
  let PeriodoAbiertoPrimerDia;
  let PeriodoAbiertoUltimoDia;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    PeriodoAbierto = data[0].Periodo;
    PeriodoAbiertoPrimerDia = data[0].PrimerDiaMes.substring(0, 10);
    PeriodoAbiertoUltimoDia = data[0].UltimoDiaMes.substring(0, 10);
    
    // if(Fecha > PeriodoAbiertoUltimoDia){
    //   Fecha = PeriodoAbiertoUltimoDia
    // }

    setPeriodoAbierto(PeriodoAbierto)
    setPeriodoAbiertoPrimerDia(PeriodoAbiertoPrimerDia)
    setPeriodoAbiertoUltimoDia(PeriodoAbiertoUltimoDia)
  } catch (error) {
    console.log(error.message);
    alert(error.message);
  }
};

const getRegistroContableCifraControl = async(vPeriodo) =>{
  const url = origin + `/api/estadoderesultadoslimpiaduriacifracontrol/${vPeriodo}`
  try{
      const response = await fetch(url,{
          headers:{
              Authorization: `Bearer ${accessToken}`,
          },
      })
      const data = await response.json()
      if(data.error){
          console.log(data.error)
          alert(data.error)
      }
          setCifraControlTotal(data[0].Monto)

  }catch(error){
      console.log(error.message)
      alert(error.message)
  }
}

const getConsultaPeriodos = async () => {
  const url = origin + `/api/consultaperiodosregistrocontable`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

      setPeriodos(data)
      setAyer(data[0].Ayer)
      setPeriodo(data[0].Periodo)

      setHoy(data[0].Hoy)
      setPeriodo(data[0].Periodo)
      setPrimerDiaMes(data[0].PrimerDiaMes)
      setUltimoDiaMes(data[0].UltimoDiaMes)
    return data[0].Periodo
  } catch (error) {
    console.log(error.message);
    alert(error.message);
  }
};

const getGastosInversionperiodo = async(vPeriodo)=>{
  const url = origin + `/api/consultagastosinversionperiodo/${vPeriodo}`
  let data=[]
  try{
    const response = await fetch(url, {
      headers:{
        Authorization: `Bearer ${accessToken}`,
      },
    })
    data = await response.json()
    if(data.error){
      console.log(data.error)
      alert(data.error)
    }

    let suma = 0
    for(let i =0; i < data.length; i++){
      data[i].Posicion = i
      suma+= parseFloat(data[i].Monto)
    }
      setDetallesGastosInversiones(data)
      setTotalMovimientos(suma)
   
  }catch(error){
    console.log(error.message)
    alert(error.message)
  }
}

const handlePeriodoCambio = async(e) => {
  e.preventDefault();
  const vPeriodo = e.target.value;
  setPeriodo(vPeriodo)
      await getGastosInversionperiodo(vPeriodo)
      await handleEstadoDeResultados(vPeriodo)
};

const handleEstadoDeResultados = async (vPeriodo) => {
  const url =
    origin + `/api/estadoderesultadoslimpiaduria/${vPeriodo}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();

    //################### PREPARA ESTADO DE RESULTADOS DE LIMPIADURIA ##########################
    let dataLimpiaduria = [];
    for (let i = 0; i < 5; i++) {
      dataLimpiaduria.push(data[i]);
    }

    //Total Ventas Sucursales
    const TotalVentas = parseFloat(dataLimpiaduria[0].Suc01) + parseFloat(dataLimpiaduria[0].Suc02) 
      + parseFloat(dataLimpiaduria[0].Suc03) + parseFloat(dataLimpiaduria[0].Suc04)
     + parseFloat(dataLimpiaduria[0].Suc05) + parseFloat(dataLimpiaduria[0].Suc06)

     dataLimpiaduria[0].Total = TotalVentas


    //Gastos Sucursal
     const TotalGastosSucursal = parseFloat(dataLimpiaduria[1].Suc01)
                                  + parseFloat(dataLimpiaduria[1].Suc02)
                                  + parseFloat(dataLimpiaduria[1].Suc03)
                                  + parseFloat(dataLimpiaduria[1].Suc04)
                                  + parseFloat(dataLimpiaduria[1].Suc05)
                                  + parseFloat(dataLimpiaduria[1].Suc06)
     dataLimpiaduria[1].Total = TotalGastosSucursal


     //Utilidad Bruta
     dataLimpiaduria[2].Suc01 = parseFloat(dataLimpiaduria[0].Suc01) + parseFloat(dataLimpiaduria[1].Suc01)
     dataLimpiaduria[2].Suc02 = parseFloat(dataLimpiaduria[0].Suc02) + parseFloat(dataLimpiaduria[1].Suc02)
     dataLimpiaduria[2].Suc03 = parseFloat(dataLimpiaduria[0].Suc03) + parseFloat(dataLimpiaduria[1].Suc03)
     dataLimpiaduria[2].Suc04 = parseFloat(dataLimpiaduria[0].Suc04) + parseFloat(dataLimpiaduria[1].Suc04)
     dataLimpiaduria[2].Suc05 = parseFloat(dataLimpiaduria[0].Suc05) + parseFloat(dataLimpiaduria[1].Suc05)
     dataLimpiaduria[2].Suc06 = parseFloat(dataLimpiaduria[0].Suc06) + parseFloat(dataLimpiaduria[1].Suc06)
     dataLimpiaduria[2].Total = parseFloat(dataLimpiaduria[0].Total) + parseFloat(dataLimpiaduria[1].Total)



     //Prorrateo de Gastos Planta Matriz por cada Sucursal de acuerdo a su venta
     const GastosPlanta = dataLimpiaduria[3].Suc01 
     const GastosPlantaSuc01 = parseFloat(dataLimpiaduria[0].Suc01) / TotalVentas * GastosPlanta
     const GastosPlantaSuc02 = parseFloat(dataLimpiaduria[0].Suc02) / TotalVentas * GastosPlanta
     const GastosPlantaSuc03 = parseFloat(dataLimpiaduria[0].Suc03) / TotalVentas * GastosPlanta
     const GastosPlantaSuc04 = parseFloat(dataLimpiaduria[0].Suc04) / TotalVentas * GastosPlanta
     const GastosPlantaSuc05 = parseFloat(dataLimpiaduria[0].Suc05) / TotalVentas * GastosPlanta
     const GastosPlantaSuc06 = parseFloat(dataLimpiaduria[0].Suc06) / TotalVentas * GastosPlanta


    dataLimpiaduria[3].Suc01 = GastosPlantaSuc01
    dataLimpiaduria[3].Suc02 = GastosPlantaSuc02
    dataLimpiaduria[3].Suc03 = GastosPlantaSuc03
    dataLimpiaduria[3].Suc04 = GastosPlantaSuc04
    dataLimpiaduria[3].Suc05 = GastosPlantaSuc05
    dataLimpiaduria[3].Suc06 = GastosPlantaSuc06

    const GastosPlantaCifraControl = parseFloat(dataLimpiaduria[3].Suc01)
    + parseFloat(dataLimpiaduria[3].Suc02)
    + parseFloat(dataLimpiaduria[3].Suc03)
    + parseFloat(dataLimpiaduria[3].Suc04)
    + parseFloat(dataLimpiaduria[3].Suc05)
    + parseFloat(dataLimpiaduria[3].Suc06)

    dataLimpiaduria[3].Total = GastosPlantaCifraControl


//Valida que los GastosPlanta (DB) menos los GastosPlantaCifraControl (Prorrateados) 
     //no sea mayor a 1 peso de diferencia
     if(Math.abs(parseFloat(GastosPlanta)) - Math.abs(parseFloat(GastosPlantaCifraControl)) > 1){
      alert("Diferencia en Gastos Planta Matriz Prorrateados : "+ GastosPlanta + " "+ GastosPlantaCifraControl)
  }


     //Utilidad de Operación
     dataLimpiaduria[4].Suc01 = parseFloat(dataLimpiaduria[2].Suc01) + parseFloat(dataLimpiaduria[3].Suc01)
     dataLimpiaduria[4].Suc02 = parseFloat(dataLimpiaduria[2].Suc02) + parseFloat(dataLimpiaduria[3].Suc02)
     dataLimpiaduria[4].Suc03 = parseFloat(dataLimpiaduria[2].Suc03) + parseFloat(dataLimpiaduria[3].Suc03)
     dataLimpiaduria[4].Suc04 = parseFloat(dataLimpiaduria[2].Suc04) + parseFloat(dataLimpiaduria[3].Suc04)
     dataLimpiaduria[4].Suc05 = parseFloat(dataLimpiaduria[2].Suc05) + parseFloat(dataLimpiaduria[3].Suc05)
     dataLimpiaduria[4].Suc06 = parseFloat(dataLimpiaduria[2].Suc06) + parseFloat(dataLimpiaduria[3].Suc06)
     dataLimpiaduria[4].Total = parseFloat(dataLimpiaduria[2].Total) + parseFloat(dataLimpiaduria[3].Total)

     //const UtilidadDeOperacionConMelate = dataLimpiaduria[4].Total
    //################### PREPARA ESTADO DE RESULTADOS DE MELATE ##########################
    let dataMelate = [];
    for (let i = 5; i < 9; i++) {
      dataMelate.push(data[i]);
    }

    //Totales Melate
    dataMelate[0].Total = parseFloat(dataMelate[0].Suc01)
                          + parseFloat(dataMelate[0].Suc02)
                          + parseFloat(dataMelate[0].Suc03)
                          + parseFloat(dataMelate[0].Suc04)
                          + parseFloat(dataMelate[0].Suc05)
                          + parseFloat(dataMelate[0].Suc06)

    //Totales Melate Pagos
    dataMelate[1].Total = parseFloat(dataMelate[1].Suc01)
                          + parseFloat(dataMelate[1].Suc02)
                          + parseFloat(dataMelate[1].Suc03)
                          + parseFloat(dataMelate[1].Suc04)
                          + parseFloat(dataMelate[1].Suc05)
                          + parseFloat(dataMelate[1].Suc06)

    //Totales Melate Pagos Clientes
    dataMelate[2].Total = parseFloat(dataMelate[2].Suc01)
                          + parseFloat(dataMelate[2].Suc02)
                          + parseFloat(dataMelate[2].Suc03)
                          + parseFloat(dataMelate[2].Suc04)
                          + parseFloat(dataMelate[2].Suc05)
                          + parseFloat(dataMelate[2].Suc06)

    //Utilidad Melate 
    dataMelate[3].Suc01 = parseFloat(dataMelate[0].Suc01) + parseFloat(dataMelate[1].Suc01) + parseFloat(dataMelate[2].Suc01)
    dataMelate[3].Suc02 = parseFloat(dataMelate[0].Suc02) + parseFloat(dataMelate[1].Suc02) + parseFloat(dataMelate[2].Suc02)
    dataMelate[3].Suc03 = parseFloat(dataMelate[0].Suc03) + parseFloat(dataMelate[1].Suc03) + parseFloat(dataMelate[2].Suc03)
    dataMelate[3].Suc04 = parseFloat(dataMelate[0].Suc04) + parseFloat(dataMelate[1].Suc04) + parseFloat(dataMelate[2].Suc04)
    dataMelate[3].Suc05 = parseFloat(dataMelate[0].Suc05) + parseFloat(dataMelate[1].Suc05) + parseFloat(dataMelate[2].Suc05)
    dataMelate[3].Suc06 = parseFloat(dataMelate[0].Suc06) + parseFloat(dataMelate[1].Suc06) + parseFloat(dataMelate[2].Suc06)
    dataMelate[3].Total = parseFloat(dataMelate[0].Total) + parseFloat(dataMelate[1].Total) + parseFloat(dataMelate[2].Total)
    //############################ UTILIDAD DE OPERACION CON MELATE ##########################
    const json = {
        Concepto: "** UTILIDAD DE OPERACION CON MELATE",
        Suc01: parseFloat(dataLimpiaduria[4].Suc01) + parseFloat(dataMelate[3].Suc01),
        Suc02: parseFloat(dataLimpiaduria[4].Suc02) + parseFloat(dataMelate[3].Suc02),
        Suc03: parseFloat(dataLimpiaduria[4].Suc03) + parseFloat(dataMelate[3].Suc03),
        Suc04: parseFloat(dataLimpiaduria[4].Suc04) + parseFloat(dataMelate[3].Suc04),
        Suc05: parseFloat(dataLimpiaduria[4].Suc05) + parseFloat(dataMelate[3].Suc05),
        Suc06: parseFloat(dataLimpiaduria[4].Suc06) + parseFloat(dataMelate[3].Suc06),
        Total: parseFloat(dataLimpiaduria[4].Total) + parseFloat(dataMelate[3].Total),
    }
    const dataUtilidadOperacionConMelate =  []
    dataUtilidadOperacionConMelate.push(json)

    const UtilidadDeOperacionConMelate = json.Total

    //############################ OTROS INGRESOS OTROS GASTOS ###############################
  //   let dataOtros = [];
  //   for (let i = 9; i < 11; i++) {
  //     dataOtros.push(data[i]);
  //   }
    const RentasEmpresa = data[9].Suc01 
    const OtrosIngresosEmpresa = data[10].Suc01
    const OtrosGastosEmpresa = data[11].Suc01
    const UAIR = parseFloat(UtilidadDeOperacionConMelate) + parseFloat(RentasEmpresa) + parseFloat(OtrosIngresosEmpresa) + parseFloat(OtrosGastosEmpresa)
    
    //##########################################################################################
      setDetallesLimpiaduria(dataLimpiaduria)
      setDetallesMelate(dataMelate)
      setGastosPlanta(GastosPlanta)
      setGastosPlantaCifraControl(GastosPlantaCifraControl)
      setDetallesUtilidadOperacionConMelate(dataUtilidadOperacionConMelate)
      setUtilidadDeOperacionConMelate(UtilidadDeOperacionConMelate)
      setRentasEmpresa(RentasEmpresa)
      setOtrosIngresosEmpresa(OtrosIngresosEmpresa)
      setOtrosGastosEmpresa(OtrosGastosEmpresa)
      setUAIR(UAIR)

   

  } catch (error) {
    console.log(error.message);
    alert(error.message);
  }
};


const handleOptionChange = (e) =>{
  const option = e.target.value 
  let detallesGastosInversionesTemp = []

  if (option === "Fecha"){
    detallesGastosInversionesTemp = detallesGastosInversiones.sort((a,b) => a.Posicion - b.Posicion)
  }
  if (option === "Sucursal"){
    detallesGastosInversionesTemp = detallesGastosInversiones.sort((a,b) => a.SucursalId - b.SucursalId)
  }
  if (option === "CuentaContable"){
    detallesGastosInversionesTemp = detallesGastosInversiones.sort((a,b) => a.CuentaContableId - b.CuentaContableId)
  }
  if (option === "Monto"){
    detallesGastosInversionesTemp = detallesGastosInversiones.sort((a,b) => b.Monto - a.Monto)
  }

    setDetallesGastosInversiones(detallesGastosInversionesTemp)
    setSelectedOption(e.target.value)
}

const numberWithCommas = (x)=> {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const handleRender = () => {
    return (
        <div className='container container-estadoresultadoslimpiaduria'>
        <form>
            <h2>Estados de Resultados</h2>
            <span id="idHeader">
                <label htmlFor="idPeriodo" style={{ width: "3rem" }}>
                <strong>Periodo</strong>
                </label>
                <select
                    onChange={handlePeriodoCambio}
                    value={Periodo}
                    id="idPeriodo"
                    >
                    {Periodos.map((element, i) => (
                        <option key={i} value={element.Periodo}>
                        {element.Periodo}
                        </option>
                    ))}
                </select>
            </span>
        </form>
        <h5>Limpiaduría</h5>
        <table>
          <thead>
            <tr style={{ background: "#33FF90" }}>
              <th style={{width:"20rem"}}>Concepto</th>
              <th style={{width:"8rem"}}> 01 San Pedro</th>
              <th style={{width:"8rem"}}> 02 Limón</th>
              <th style={{width:"8rem"}}> 03 Santa María</th>
              <th style={{width:"8rem"}}> 04 SAD</th>
              <th style={{width:"8rem"}}> 05 Nueva Sucursal</th>
              <th style={{width:"8rem"}}> 06 Nueva Sucursal</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {detallesLimpiaduria.map((element, i) => (
              <tr key={i}>
                <td style={{ textAlign: "left" }}>
                    {i === 2 || i === 4 ? <strong>{element.Concepto}</strong> : element.Concepto}
                    </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc01).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc02).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc03).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc04).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc05).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc06).toFixed(2))}
                </td>
                <td>
                   { i === 2 || i === 4?
                  <strong>{numberWithCommas(parseFloat(element.Total).toFixed(2))}</strong>
                  :
                  numberWithCommas(parseFloat(element.Total).toFixed(2))
                   }
                </td>
              </tr>
                
            ))}
          </tbody>
        </table>
        <br />
        <h5>Melate</h5>
        <table>
          <thead>
            <tr style={{ background: "#33FF90" }}>
              <th style={{width:"20rem"}}>Concepto</th>
              <th style={{width:"8rem"}}>01 San Pedro</th>
              <th style={{width:"8rem"}}>02 Limón</th>
              <th style={{width:"8rem"}}>03 Santa María</th>
              <th style={{width:"8rem"}}>04 SAD</th>
              <th style={{width:"8rem"}}>05 Nueva Sucursal</th>
              <th style={{width:"8rem"}}>06 Nueva Sucursal</th>
              <th style={{width:"8rem"}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {detallesMelate.map((element, i) => (
              <tr key={i}>
                <td style={{ textAlign: "left" }}>{ i=== 3 ? <strong>{element.Concepto}</strong> : element.Concepto}</td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc01).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc02).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc03).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc04).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc05).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc06).toFixed(2))}
                </td>
                <td>
                    {i === 3 ?
                        <strong>{numberWithCommas(parseFloat(element.Total).toFixed(2))}</strong>
                        :
                        numberWithCommas(parseFloat(element.Total).toFixed(2))
                    }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <h5>Utilidad de Operación Con Melate</h5>
        <table>
          <thead>
            <tr style={{ background: "#33FF90" }}>
              <th style={{width:"20rem"}}>Concepto</th>
              <th style={{width:"8rem"}}>01 San Pedro</th>
              <th style={{width:"8rem"}}>02 Limón</th>
              <th style={{width:"8rem"}}>03 Santa María</th>
              <th style={{width:"8rem"}}>04 SAD</th>
              <th style={{width:"8rem"}}>05 Nueva Sucursal</th>
              <th style={{width:"8rem"}}>06 Nueva Sucursal</th>
              <th style={{width:"8rem"}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {detallesUtilidadOperacionConMelate.map((element, i) => (
              <tr key={i}>
                <td style={{ textAlign: "left" }}><strong>{element.Concepto}</strong></td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc01).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc02).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc03).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc04).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc05).toFixed(2))}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Suc06).toFixed(2))}
                </td>
                <td>
                    {i === 0 ?
                  <strong>{numberWithCommas(parseFloat(element.Total).toFixed(2))}</strong>
                  :
                  numberWithCommas(parseFloat(element.Total).toFixed(2))
                    }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <h5 id="idOtrosIngresosGastos">Otros Ingresos/Gastos</h5>
        <div className="otrosingresosgastos">
            <div>
                <label htmlFor="" style={{width:"12rem"}}>Rentas Empresa</label>
                <input style={{width:"6rem",textAlign:"right"}} value={numberWithCommas(parseFloat(RentasEmpresa).toFixed(2))} readOnly/>
                <br />
    
    
                <label htmlFor="" style={{width:"12rem"}}>Otros Ingresos Empresa</label>
                <input style={{width:"6rem",textAlign:"right"}} value={numberWithCommas(parseFloat(OtrosIngresosEmpresa).toFixed(2))} readOnly/>
                <br />
    
    
    
                <label htmlFor="" style={{width:"12rem"}}>Otros Gastos Empresa</label>
                <input style={{width:"6rem",textAlign:"right"}} value={numberWithCommas(parseFloat(OtrosGastosEmpresa).toFixed(2))} readOnly/>
                <br />
                <label htmlFor="" style={{width:"12rem"}}><strong>UAIR</strong></label>
                <input style={{width:"6rem",textAlign:"right",fontWeight:"bold"}} value={numberWithCommas(parseFloat(UAIR).toFixed(2))} readOnly/>
                <br />
                <br />
                <label htmlFor="" style={{width:"12rem"}}>Cifra Control</label>
                <input style={{width:"6rem",textAlign:"right"}} value={numberWithCommas(parseFloat(CifraControlTotal).toFixed(2))} readOnly/>
            </div>
        </div>
    
    
    
    
    
    
    
        <br />
        <h5>Movimientos Detalle</h5>
        <span id="idOrdenamientoRadioGroup">
          <h6>Ordenamiento</h6>
          <input type="radio" id="Fecha" name="orderGI" value="Fecha" checked={selectedOption === "Fecha"} onChange={handleOptionChange} />
          <label htmlFor="Fecha" style={{marginLeft:"5px"}}>Fecha Hora</label>
          <br />
          <input type="radio" id="Sucursal" name="orderGI" value="Sucursal" checked={selectedOption === "Sucursal"} onChange={handleOptionChange} />
          <label htmlFor="Sucursal" style={{marginLeft:"5px"}}>Sucursal</label>
          <br />
          <input type="radio" id="CuentaContable" name="orderGI" value="CuentaContable" checked={selectedOption === "CuentaContable"} onChange={handleOptionChange} />
          <label htmlFor="CuentaContable" style={{marginLeft:"5px"}}>Cuenta Contable</label>
          <br />
          <input type="radio" id="Monto" name="orderGI" value="Monto" checked={selectedOption === "Monto"} onChange={handleOptionChange} />
          <label htmlFor="Monto" style={{marginLeft:"5px"}}>Monto</label>
        </span>
        <table>
          <thead>
            <tr style={{ background: "#33FF90" }}>
              <th style={{width:"20rem"}}>Sucursal</th>
              <th style={{width:"20rem"}}>Unidad De Negocio</th>
              <th style={{width:"8rem"}}>Cuenta Contable</th>
              <th style={{width:"8rem"}}>Subcuenta Contable</th>
              <th style={{width:"8rem"}}>Comentarios</th>
              <th style={{width:"8rem"}}>Monto</th>
              <th style={{width:"8rem"}}>Fecha Hora</th>
              <th style={{width:"8rem"}}>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {detallesGastosInversiones.map((element, i) => (
              <tr key={i}>
                <td style={{ textAlign: "left" }}><strong>{element.Sucursal}</strong></td>
                <td style={{ textAlign: "left" }}><strong>{element.UnidadDeNegocio}</strong></td>
                <td style={{textAlign: "left"}}>
                  {element.CuentaContable}
                </td>
                <td style={{textAlign:"left"}}>
                  {element.SubcuentaContable}
                </td>
                <td style={{textAlign:"left"}}>
                  {element.Comentarios}
                </td>
                <td>
                  {numberWithCommas(parseFloat(element.Monto).toFixed(2))}
                </td>
                <td>
                  {element.FechaHora}
                </td>
                <td>
                  {element.Usuario}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <span className="totalMovimientos">
          <label htmlFor="TotaGI" style={{width:"13rem"}}><b>Total Movimientos Detalle</b></label>
          <input style={{width:"8rem", textAlign:"right"}} value={"$ "+numberWithCommas(TotalMovimientos.toFixed(2))} readOnly/>
        </span>
    
    
    
    
    
    
    
    
    
      </div>
    
      )
};
return (
    <>
      {/* {Periodos.length > 0 ? ( */}
      {1 > 0 ? (
        handleRender()
      ) : (
        <h3>Loading ...</h3>
      )}
    </>
  );



}

export default EstadoResultadosLimpiaduria



  


