import React, { useState, useRef } from 'react'

import './Kardex.css'
import SelectSucursales from './utils/SelectSucursales'
import InputCodigoBarras from './utils/InputCodigoBarras'

const Kardex = ({onProps}) => {
    const origin = onProps.origin
    const accessToken = onProps.accessToken 
    const Administrador = onProps.Administrador 

    const [SucursalId, setSucursalId] = useState(onProps.SucursalId)
    const [detalles, setDetalles] = useState([])
    const [CodigoBarras, setCodigoBarras] = useState("")
    const [CodigoId, setCodigoId] = useState("")
    const [Descripcion, setDescripcion] = useState("")
    const [FechaInicial, setFechaInicial] = useState(new Date().toISOString().split("T")[0])
    const [FechaFinal, setFechaFinal] = useState(new Date().toISOString().split("T")[0])
    const [SoloInventariable, setSoloInventariable] = useState('S')
    const CodigoBarrasInput = useRef();



    // const today = new Date().toISOString().split("T")[0];

    // const fechaActual = () => {
    //     alert("Hola")
    //     const d = new Date();
    //     let vfecha =
    //         d.getFullYear() +
    //         "-" +
    //         ("0" + (d.getMonth() + 1)).slice(-2) +
    //         "-" +
    //         ("0" + d.getDate()).slice(-2);

    //         alert(vfecha)
    //     return vfecha;
    // }

    const handleSucursal = (vSucursalId) => {
        setSucursalId(vSucursalId)
        CodigoBarrasInput.current.handleRefSucursalId(vSucursalId)

    }

    const handleCodigoBarras = (e) => {
        const vCodigoBarras = e.target.value.toUpperCase()
            setCodigoBarras(vCodigoBarras)
    }

    const handleFechaInicial = (e) => {
        const vFechaInicial = e.target.value
            setFechaInicial(vFechaInicial)
    }

    const handleFechaFinal = (e) => {
        const vFechaFinal = e.target.value
            setFechaFinal(vFechaFinal)
    }

    const onhandleBuscar = async (e) => {
        e.preventDefault()
        const id = CodigoBarras
        if (!id) {
            return
        }
        const url = origin + `/api/productodescripcion/${id}`
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json()
            if (data.error) {
                console.log(data.error)
                alert(data.error)
                    setCodigoBarras("")
                return
            }
                setCodigoId(data[0].CodigoId)
                setDescripcion(data[0].Descripcion)
        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }


    const onhandleCodigoBarras = (vCodigoBarras) => {
            setCodigoBarras(vCodigoBarras)
            setDescripcion("")
    }

    const onhandleConsulta = (vCodigoBarras, vDescripcion, UnidadesInventario) => {
            setDescripcion(vDescripcion)
    }

    const onhandCancel = (e) => {
        e.preventDefault()
            setCodigoBarras("")
            setDescripcion("")
            setDetalles([])
        CodigoBarrasInput.current.handleRefCodigoBarrasInput()
    }

    const onhandleSummit = async (e) => {
        e.preventDefault()
        // const SucursalId = state.SucursalId
        // const CodigoBarras = state.CodigoBarras
        // const FechaInicial = state.FechaInicial
        // const FechaFinal = state.FechaFinal
        const url = origin + `/api/kardex/${SucursalId}/${CodigoBarras}/${FechaInicial}/${FechaFinal}`
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json()
            if (data.error) {
                console.log(data.error)
                alert(data.error)
                return
            }
                setDetalles(data)
        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }

    const handlerRender = () => {
        return (
            <div className="container container-kardex">

                <div className="row">
                    <div className="col-md-5 kardexmain">
                        <span className="badge badge-success">Kardex</span>
                        <form>
                            <label htmlFor="">Sucursales</label>
                            <SelectSucursales accessToken={accessToken} url={origin} SucursalAsignada={SucursalId} onhandleSucursal={handleSucursal} Administrador={Administrador} />

                            <InputCodigoBarras accessToken={accessToken} url={origin} handleCodigoBarrasProp={onhandleCodigoBarras} handleConsultaProp={onhandleConsulta} CodigoBarrasProp={CodigoBarras} SoloInventariable={SoloInventariable} ref={CodigoBarrasInput} />
                            <label htmlFor="">Descripcion</label>
                            <input id="descripcion" name="descripcion" size="37" value={Descripcion} readOnly />
                            <br />
                            <label htmlFor="">Fecha Inicial</label>
                            <input onChange={handleFechaInicial} type="date" value={FechaInicial} />
                            <br />
                            <label htmlFor="">Fecha Final</label>
                            <input onChange={handleFechaFinal} type="date" value={FechaFinal} />
                            <br />
                            <br />
                            <button onClick={onhandleSummit} className="btn btn-primary">Consultar</button>
                            <button onClick={onhandCancel} className="btn btn-danger ml-3">Cancelar</button>
                        </form>
                        <div className="contenido">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Movimiento</th>
                                        <th>Folio</th>
                                        <th>Unidades</th>
                                        <th>Unidades Inventario Antes</th>
                                        <th>Unidades Inventario Despues</th>
                                        <th>Costo Compra</th>
                                        <th>Costo Promedio</th>
                                        <th>Precio Venta Sin Imp</th>
                                        <th>Precio Venta Con Imp</th>
                                        <th>Fecha Hora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalles.map((element, i) => (<tr key={i}><td>{element.Movimiento}</td>
                                        <td>{element.FolioId}</td>
                                        <td>{element.Unidades}</td>
                                        <td>{element.UnidadesInventarioAntes}</td>
                                        <td>{element.UnidadesInventarioDespues}</td>
                                        <td>{element.CostoCompra}</td>
                                        <td>{element.CostoPromedio}</td>
                                        <td>{element.PrecioVentaSinImpuesto}</td>
                                        <td>{element.PrecioVentaConImpuesto}</td>
                                        <td>{element.FechaHora}</td>
                                    </tr>))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        )
    }



    return (



        <div>
            {1 === 1 ? handlerRender() : <h2>Loading ....</h2>}
        </div>
    )
}

export default Kardex





