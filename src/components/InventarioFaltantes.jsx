import React, { useState, useEffect, useRef } from 'react';

import './InventarioFaltantes.css'


const InventarioFaltantes = ({ onProps }) => {
    const origin = onProps.origin
    const accessToken = onProps.accessToken
    const Administrador = onProps.Administrador
    const ColaboradorId = onProps.ColaboradorId
    const User = onProps.User

    const [detalles, setDetalles] = useState([])
    const [SucursalId, setSucursalId] = useState(onProps.SucursalId)
    const [sucursales, setSucursales] = useState([])


    useEffect(() => {
        async function fetchData() {
            // const SucursalId = state.SucursalId
            const arregloSucursales = await getSucursales()
            if (arregloSucursales.error) {
                alert(arregloSucursales.error)
                return
            }
            const arregloInventarioFaltantes = await getInventarioFaltantes(SucursalId)
            if (arregloInventarioFaltantes.error) {
                alert(arregloInventarioFaltantes.error)
                return
            }
            setDetalles(arregloInventarioFaltantes)
            setSucursales(arregloSucursales)
        }
        fetchData()
    }, [])


    const getInventarioFaltantes = async (vSucursalId) => {
        let data = []
        const url = origin + `/api/inventariofaltantes/${vSucursalId}`
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            data = await response.json()
        } catch (error) {
            data = []
            console.log(error.message)
            alert(error.message)
        }
        return data
    }

    const getSucursales = async () => {
        const url = origin + `/api/catalogos/10fisicasycedis`;
        // const Administrador = props.Administrador
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            let data = await response.json();
            const vSucursalAsignada = parseInt(SucursalId)
            if (Administrador !== 'S') {
                data = data.filter(element => element.SucursalId === vSucursalAsignada)
            }
            if (data.length === 0) {
                data = { error: "Error en Sucursales" };
            }
            return data;
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }

    const handleSucursales = async (e) => {
        const vSucursalId = e.target.value
        const arregloInventarioFaltantes = await getInventarioFaltantes(vSucursalId)
        if (arregloInventarioFaltantes.error) {
            alert(arregloInventarioFaltantes.error)
            return
        }
        setSucursalId(vSucursalId)
        setDetalles(arregloInventarioFaltantes)
    }

    const handleRender = () => {
        return (
            <div className="container maincontainer container-inventariofaltantes">
                <div className="mainheader">Faltantes Inventario</div>
                <div className="main">
                    <select
                        style={{ marginTop: "10px" }}
                        onChange={handleSucursales}
                        id="Sucursales"
                        name="Sucursales"
                        value={SucursalId}
                    >
                        {sucursales.map((element, i) => (
                            <option key={i} value={element.SucursalId}>
                                {element.Sucursal}
                            </option>
                        ))}
                    </select>

                    <div className="maindetalles">
                        <table>
                            <thead>
                                <tr>
                                    {/* <th>Sucursal</th> */}
                                    <th>Codigo</th>
                                    <th style={{width: "650px"}}>Descripcion</th>
                                    <th>Máximo</th>
                                    <th>Mínimo</th>
                                    <th>Unidades Inventario</th>
                                    <th>Unidades Vendidas</th>
                                    <th>Unidades Inventario CEDIS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.map((element, i) => (
                                    <tr key={i}>
                                        {/* <td>{element.SucursalId}</td> */}
                                        <td>{element.CodigoId}</td>
                                        <td style={{ textAlign: "left" }}>
                                            {element.Descripcion}
                                        </td>
                                        <td>{element.Maximo}</td>
                                        <td>{element.Minimo}</td>
                                        <td>{element.UniInv}</td>
                                        <td>{element.UnidadesDesplazadas}</td>
                                        <td>{element.UniInvCedis}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
                <br />
                <div className="mainfooter">

                </div>
            </div>
        );
    }


    return (
        sucursales.length > 0 ? handleRender() : <h3>Loading ...</h3>
    )
}

export default InventarioFaltantes;
