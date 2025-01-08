import React, { useState } from 'react'

import "./VentasConsultaFechaProducto.css";

import SelectSucursales from './utils/SelectSucursales';
import InputFecha from './utils/InputFecha';

const VentasConsultaFechaProducto = ({ onProps }) => {
    const [SucursalId, setSucursalId] = useState(onProps.SucursalId)
    const accessToken = onProps.accessToken
    const origin = onProps.origin
    const Administrador = onProps.Administrador


    const [FechaInicial, setFechaInicial] = useState("")
    const [FechaFinal, setFechaFinal] = useState("")
    const [detalles, setDetalles] = useState([])


    const handleSucursal = (vSucursalId) => {
        setSucursalId(vSucursalId)
    }

    const handleFechaInicial = (vFecha) => {
        setFechaInicial(vFecha)
    }

    const handleFechaFinal = (vFecha) => {
        setFechaFinal(vFecha)
    }

    const handleConsultar = async () => {
        // const SucursalId = this.state.SucursalId 
        // const FechaInicial = this.state.FechaInicial
        // const FechaFinal = this.state.FechaFinal
        const url = origin + `/api/ventasconsultafechaproducto/${SucursalId}/${FechaInicial}/${FechaFinal}`
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
            const data = await response.json()
            if (data.error) {
                alert(data.error)
                return
            }
            setDetalles(data)
        } catch (error) {
            console.log(error.message)
            alert(error.message)
            return
        }
    }

        return (
            <div className="container consultaventafechaproductomain">
                    <span className="badge bg-danger">Consulta Ventas(Fecha/Producto)</span>
                    <br />
                    <label htmlFor="">Sucursales</label>
                    <br />
                    <SelectSucursales accessToken={accessToken} url={origin} SucursalAsignada={SucursalId} onhandleSucursal={handleSucursal} Administrador={Administrador} />
                    <br />
                    <label htmlFor="">Fecha Inicial</label>
                    <InputFecha onhandleFecha={handleFechaInicial} />
                    <label htmlFor="">Fecha Final</label>
                    <InputFecha onhandleFecha={handleFechaFinal} />
                    <br />
                    <button onClick={handleConsultar} className="btn btn-success w-100">Consultar</button>
                    <div className="detalles">
                        <table>
                            <thead>
                                <tr>
                                    <th>CodigoId</th>
                                    <th>CodigoBarras</th>
                                    <th>Descripcion</th>
                                    <th>ExtUnidadesVendidas</th>
                                    <th>ExtVenta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.map((element, i) => (<tr key={i}>
                                    <td>{element.CodigoId}</td>
                                    <td>{element.CodigoBarras}</td>
                                    <td>{element.Descripcion}</td>
                                    <td>{element.ExtUnidadesVendidas}</td>
                                    <td>{element.ExtVenta}</td>
                                </tr>))}
                            </tbody>
                        </table>
                    </div>
            </div>
        )
    }






export default VentasConsultaFechaProducto




