import React, { useState, useEffect } from 'react';

import "./IELimpiaduriaBI.css";
import { FormatoMatrizMeses1, FormatoMatrizMeses2, numberWithCommas } from './utils/FuncionesGlobales'
// import { FormatoMatrizMeses1, FormatoMatrizMeses2 } from './utils/FuncionesGlobales'


const IELimpiaduriaBI = ({onProps}) => {
    const origin = onProps.origin
    const accessToken = onProps.accessToken
    const Administrador = onProps.Administrador

    const [arreglo, setArreglo] = useState([])
    const [arreglodetalle, setArregloDetalle] = useState([])
    const [years, setYears] = useState([])
    const [year, setYear] = useState(0)
    const [radiobox, setRadioBox] = useState("cuenta")
    const [radioboxSort, setRadioBoxSort] = useState("porconcepto")
    const [total, setTotal] = useState(0)
    const [totaldetalle, setTotalDetalle] = useState(0)


useEffect(()=>{
    async function fetchData(){
        const vYears = await getConsultaAnios()
        const vYear = vYears[0].Year

        setYears(vYears)
        setYear(vYear)

        handleEgresosLimpiaduriaCuentaContable(vYear)
    }
    fetchData()
},[])



    const getConsultaAnios = async () => {
        const url = origin + `/api/consultaaniosactivos`;
        let data = []
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            data = await response.json();
            return data

        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    };


    const handleYear = async (e) => {
        const vYear = e.target.value
            setYear(vYear)
            setRadioBox("cuenta")
            setRadioBoxSort("porconcepto")
            await handleEgresosLimpiaduriaCuentaContable(vYear)
    }

    const handleEgresosLimpiaduriaCuentaContable = async (vYear) => {
        const consulta = radiobox
        const url = origin + `/api/egresoslimpiaduriacuentacontable/${vYear}/${consulta}`
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
            const data = await response.json()
            let vArreglo = []
            if (consulta === "cuenta") {
                vArreglo = FormatoMatrizMeses1(data)
            }
            if (consulta === "subcuenta") {
                vArreglo = FormatoMatrizMeses2(data)
            }
            let total = 0
            vArreglo.forEach((element) => {
                total += element.Total
            })

            vArreglo.forEach(element => {
                element.Porcentaje = (element.Total / total * 100).toFixed(2)
            })
                setArreglo(vArreglo)
                setTotal(total)
        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }

    const handleEgresosLimpiaduriaCSMes = async (year, mes, CuentaContableId, SubcuentaContableId, TipoConsulta) => {
        const url = origin + `/api/egresoslimpiaduriacuentacontablesubcuentacontablemes/${year}/${mes}/${CuentaContableId}/${SubcuentaContableId}/${TipoConsulta}`
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
            const data = await response.json()
            let total = 0
            data.forEach((element) => {
                total += parseFloat(element.Monto)
            })
                setArregloDetalle(data)
                setTotalDetalle(Math.round(total))
        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }


    const handleCuentaSubcuentaContable = async(e) => {
        const option = e.target.value
            setRadioBox(option)
            setRadioBoxSort("porconcepto")
            await handleEgresosLimpiaduriaCuentaContable(year)
    }

    const handleSortArray = (e) => {
        const option = e.target.value
        const arregloTemp = [...arreglo]
        let arregloSort = []
        if (option === "portotal") {
            //Para no modificar el state brincándose el setState hay que hacer un shallow Copy del arreglo [...array]
            arregloSort = [...arregloTemp].sort((a, b) => a.Total - b.Total) //Este es un ordenamiento numérico
            // arregloSort = arreglo.sort((a,b) => (a.Total > b.Total) ? 1 : -1)
            // alert(JSON.stringify(arregloSort))
        }

        if (option === "porconcepto") {
            //Para no modificar el state brincándose el setState hay que hacer un shallow Copy del arreglo [...array]
            arregloSort = [...arregloTemp].sort((a, b) => a.id - b.id) //Este es un ordenamiento numérico
        }
            setRadioBoxSort(option)
            setArreglo(arregloSort)
    }

    return (
        <>
            {arreglo.length === 0 ? (
                <h1>Loading ....</h1>
            ) : (
                <div className="container container-IELimpiaduriaBI">
                    <br />
                    <div className="principal">
                        <h3>
                            Egresos Limpiaduría (No Incluye Pagos Melate)
                        </h3>
                        <form action="">
                            <div className="formparent">
                                <select onChange={handleYear} value={year}>
                                    {years.map((element, i) => (
                                        <option key={i} value={element.Year}>{element.Year}</option>
                                    ))}
                                </select>
                                <div className="radiogroup">
                                    <p>Agrupar Por:</p>
                                    <input type="radio" value="cuenta" checked={radiobox === "cuenta"} id="cuenta" onChange={handleCuentaSubcuentaContable} name="opcionescuentas" />
                                    <label>Cuenta Contable</label>
                                    <br />
                                    <input type="radio" value="subcuenta" checked={radiobox === "subcuenta"} id="subcuenta" onChange={handleCuentaSubcuentaContable} name="opcionescuentas" />
                                    <label>Subcuenta Contable</label>
                                </div>
                                <div className="radiogroup">
                                    <p>Ordenar Por:</p>
                                    <input type="radio" value="porconcepto" checked={radioboxSort === "porconcepto"} id="porconcepto" onChange={handleSortArray} name="opcionesordenar" />
                                    <label>Concepto</label>
                                    <br />
                                    <input type="radio" value="portotal" checked={radioboxSort === "portotal"} id="portotal" onChange={handleSortArray} name="opcionesordenar" />
                                    <label>Monto</label>
                                </div>
                            </div>

                        </form>
                        <table className="t1">
                            <thead>
                                <tr>
                                    {radiobox === "cuenta"
                                        ? (<th>Concepto</th>)
                                        : (<><th>Concepto1</th><th>Concepto2</th></>)
                                    }
                                    <th>Ene</th>
                                    <th>Feb</th>
                                    <th>Mar</th>
                                    <th>Abr</th>
                                    <th>Mayo</th>
                                    <th>Jun</th>
                                    <th>Jul</th>
                                    <th>Ago</th>
                                    <th>Sep</th>
                                    <th>Oct</th>
                                    <th>Nov</th>
                                    <th>Dic</th>
                                    <th>Total</th>
                                    <th>%</th>

                                </tr>
                            </thead>
                            <tbody>
                                {arreglo.map((element, i) => (
                                    <tr key={i}>
                                        {radiobox === "cuenta"

                                            ? <td style={{ textAlign: "left" }}>
                                                {element.Concepto}
                                            </td>
                                            :
                                            <>
                                                <td style={{ textAlign: "left" }}>
                                                    {element.Concepto1}
                                                </td>
                                                <td style={{ textAlign: "left" }}>
                                                    {element.Concepto2}
                                                </td>
                                            </>
                                        }
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.Ene.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.Ene.Monto)}</button></td>
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.Feb.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.Feb.Monto)}</button></td>
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.Mar.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.Mar.Monto)}</button></td>
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.Abr.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.Abr.Monto)}</button></td>
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.May.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.May.Monto)}</button></td>
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.Jun.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.Jun.Monto)}</button></td>
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.Jul.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.Jul.Monto)}</button></td>
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.Ago.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.Ago.Monto)}</button></td>
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.Sep.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.Sep.Monto)}</button></td>
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.Oct.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.Oct.Monto)}</button></td>
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.Nov.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.Nov.Monto)}</button></td>
                                        <td><button style={{ border: "none", borderBottom: "2px solid red" }} onClick={() => (handleEgresosLimpiaduriaCSMes(year, element.Dic.Mes, element.key1, element.key2, radiobox))}>{numberWithCommas(element.Dic.Monto)}</button></td>
                                        <td>{numberWithCommas(element.Total)}</td>
                                        <td><b>{element.Porcentaje}</b></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="sumatoria">
                            <span style={{ margin: "10px" }}>Gran Total</span>
                            <input type="text" size="12" value={numberWithCommas(total)} readOnly />
                        </div>


                        {arreglodetalle.length > 0
                            ?
                            <>
                                <span style={{ marginRight: "10px" }}>Cuenta Contable</span>
                                <input type="text" size="70" value={arreglodetalle[0].CuentaContable} style={{ marginRight: "10px" }} />
                                <input type="text" size="20" value={numberWithCommas(totaldetalle)} style={{ textAlign: "right" }} />
                                <table className="t2">
                                    <thead>
                                        <tr>
                                            <th>SubcuentaContable</th>
                                            <th>Monto</th>
                                            <th>Comentarios</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {arreglodetalle.map((element, i) => (
                                            <tr key={i}>
                                                <td style={{ textAlign: "left" }}>{element.SubcuentaContable}</td>
                                                <td>{numberWithCommas(element.Monto)}</td>
                                                <td style={{ textAlign: "left" }}>{element.Comentarios}</td>
                                            </tr>
                                        ))}
                                        <tr>

                                        </tr>

                                    </tbody>
                                </table>
                                <br />
                            </>
                            : null
                        }



                    </div>
                </div>
            )}
        </>
    )
}

export default IELimpiaduriaBI
