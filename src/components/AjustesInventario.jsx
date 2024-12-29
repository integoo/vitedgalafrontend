import React, { useState, useEffect, useRef } from 'react';

import SelectSucursales from './utils/SelectSucursales';
import InputCodigoBarras from './utils/InputCodigoBarras';

import './AjustesInventario.css'

const AjustesInventario = ({ onProps }) => {

    const origin = onProps.origin
    const accessToken = onProps.accessToken
    const Administrador = onProps.Administrador
    const Usuario = onProps.User
    const ColaboradorId = onProps.ColaboradorId
    const [SucursalId, setSucursalId] = useState(onProps.SucursalId)
    const [detalles, setDetales] = useState([])
    const [CodigoBarras, setCodigoBarras] = useState("")
    const [Descripcion, setDescripcion] = useState("")
    const [TipoAjusteId, setTipoAjusteId] = useState("")
    const [UnidadesInventario, setUnidadesInventario] = useState(0)
    const [UnidadesAjustadas, setUnidadesAjustadas] = useState("")
    const [AfectaCosto, setAfectaCosto] = useState("")
    const [Movimiento, setMovimiento] = useState("")
    const [detallesTipoAjustes, setDetallesTipoAjustes] = useState([])
    const [detallesAjustesRecientes, setDetallesAjustesRecientes] = useState([])
    const [SoloInventariable, setSoloInventariable] = useState('S')
    const UnidadesAjustadasInput = useRef()
    const CodigoBarrasInput = useRef()

        
    useEffect(()=>{
        async function fetchaData(){
            const arregloTipoAjustes = await handleCargaTipoAjustes()
            const TipoAjusteId = parseInt(arregloTipoAjustes[0].TipoAjusteId)
            const AfectaCosto = arregloTipoAjustes[0].AfectaCosto
            const Movimiento = arregloTipoAjustes[0].Movimiento
            const arregloAjustesRecientes = await handleCargaAjustes()
    
                setDetallesTipoAjustes(arregloTipoAjustes)
                setDetallesAjustesRecientes(arregloAjustesRecientes)
                setTipoAjusteId(TipoAjusteId)
                setAfectaCosto(AfectaCosto)
                setMovimiento(Movimiento)
        }
        fetchaData()
    },[])

    const handleCargaTipoAjustes = async () => {
        try {
            const url = origin + `/api/consultatipoajustes`
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json()
            return data
        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }

    const handleCargaAjustes = async () => {
        // const SucursalId = this.state.SucursalId
        try {
            const url = origin + `/api/consultaajustesinventariorecientes/${SucursalId}`
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json()
            return data
        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }

    const handleSucursal = (vSucursalId) => {
            setSucursalId(vSucursalId)
        CodigoBarrasInput.current.handleRefSucursalId(vSucursalId)
    }

    const onhandleCodigoBarras = (vCodigoBarras) => {
            setCodigoBarras(vCodigoBarras)
            setDescripcion("")
            setUnidadesInventario(0)
            setUnidadesAjustadas("")
    }

    const onhandleConsulta = (vCodigoBarras, vDescripcion, vUnidadesInventario) => {
            setDescripcion(vDescripcion)
            setUnidadesInventario(vUnidadesInventario)
        UnidadesAjustadasInput.current.focus()
    }

    const handleTipoAjuste = (e) => {
        const vTipoAjusteId = parseInt(e.target.value)
        const arregloTipoAjustes = detallesTipoAjustes.filter(element => parseInt(element.TipoAjusteId) === vTipoAjusteId)
        const AfectaCosto = arregloTipoAjustes[0].AfectaCosto
        const vMovimiento = arregloTipoAjustes[0].Movimiento
            setTipoAjusteId(vTipoAjusteId)
            setAfectaCosto(AfectaCosto)
            setMovimiento(Movimiento)

        UnidadesAjustadasInput.current.focus()
    }

    const onChange = (e) => {
        const vUnidadesAjustadas = e.target.value
        // const vMovimiento = this.state.Movimiento

        if (vUnidadesAjustadas > 10 || vUnidadesAjustadas < -10) {
            if (!window.confirm("El Ajuste es por más de 10 piezas. ¿Desea Continuar?")) {
                return
            }
        }


        let re = /^[-0-9\b]+$/; //Permite números ENTEROS POSITIVOS Y NEGATIVOS

        if (Movimiento === "+-") {
            re = /^[-0-9\b]+$/; //Permite números ENTEROS POSITIVOS Y NEGATIVOS
        }
        if (Movimiento === "+") {
            re = /^[0-9\b]+$/; //Permite número ENTEROS sólo POSITIVOS
        }
        if (Movimiento === "-" && vUnidadesAjustadas > 0) {
            alert("El Tipo de Ajuste sólo permite Ajuste de Unidades Negativo")
            return;
        }
        if (vUnidadesAjustadas === '' || re.test(vUnidadesAjustadas)) {
                setUnidadesAjustadas(e.target.value)
        }
    }

    const onhandleSubmit = async (e) => {
        e.preventDefault()
        // const UnidadesAjustadas = this.state.UnidadesAjustadas
        // const UnidadesInventario = this.state.UnidadesInventario


        if (UnidadesInventario < 0) {
            if (UnidadesAjustadas < 0) {
                    setUnidadesAjustadas("")
                alert("No se permite un Ajuste Negativo porque el Inventario es Negativo")
                return
            }
        }
        if ((parseInt(UnidadesInventario) + parseInt(UnidadesAjustadas)) < 0) {
            alert("Error....El Ajuste da Inventario Negativo")
                setUnidadesAjustadas("")
            return
        }


        const json = {
            SucursalId: SucursalId,
            CodigoBarras: CodigoBarras,
            TipoAjusteId: TipoAjusteId,
            AfectaCosto: AfectaCosto,
            UnidadesAjustadas: UnidadesAjustadas,
            ColaboradorId: ColaboradorId,
            Usuario: Usuario,
        }
        try {
            const url = origin + `/api/grabaajustesinventario`
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json()
            if (data.error) {
                alert(data.error)
                return
            }

            const varregloAjustesRecientes = await handleCargaAjustes()
                setDetallesAjustesRecientes(varregloAjustesRecientes)
                setDescripcion("")
                setUnidadesInventario(0)
                setUnidadesAjustadas("")
            CodigoBarrasInput.current.handleRefCodigoBarrasInput()
            alert(JSON.stringify(data))

        } catch (error) {
            console.log(error.message)
            alert(error.message)
            return
        }
    }

    const onhandleCancelar = () => {
            setDescripcion("")
            setUnidadesInventario(0)
            setUnidadesAjustadas("")
        CodigoBarrasInput.current.handleRefCodigoBarrasInput()
    }

    const handleRender = () => {
        return (
            <div className="container container-ajustesinventario">

                <div className="main">
                    <div className="col-md-6 xheader">
                        <form onSubmit={onhandleSubmit}>
                            <h4>Ajustes Inventario</h4>
                            <SelectSucursales accessToken={accessToken} url={origin} SucursalAsignada={SucursalId} onhandleSucursal={handleSucursal} Administrador={Administrador} />
                            <InputCodigoBarras accessToken={accessToken} url={origin} handleCodigoBarrasProp={onhandleCodigoBarras} handleConsultaProp={onhandleConsulta} CodigoBarrasProp={CodigoBarras} SoloInventariable={SoloInventariable} ref={CodigoBarrasInput} />
                            <label htmlFor="">Descripcion</label>
                            <input id="descripcion" name="descripcion" size="40" maxLength="38" value={Descripcion} readOnly />
                            <br />
                            <label htmlFor="">Unidades Inventario</label>
                            <input id="unidadesinventario" name="unidadesinventario" size="6" value={UnidadesInventario} readOnly />
                            <br />
                            <label htmlFor="">Tipo Ajuste</label>
                            <select value={TipoAjusteId} onChange={handleTipoAjuste}>
                                {detallesTipoAjustes.map((element, i) =>
                                    <option key={i} value={element.TipoAjusteId}>{element.Ajuste}</option>)}
                            </select>
                            <span className="badge badge-secondary ml-2">{Movimiento}</span>
                            <br />
                            <label>Unidades Ajustadas</label>
                            <input onChange={onChange} id="unidadesajustadas" name="unidadesajustadas" value={UnidadesAjustadas} ref={UnidadesAjustadasInput} autoComplete="off" required />
                            <br />
                            <br />
                            <div className="displaybuttons">
                                <button type="reset" id="reset" className="btn btn-danger btn-lg ml-1" onClick={onhandleCancelar}>CANCELAR</button>
                                <button type="submit" id="buttonSubmit" className="btn btn-primary btn-lg mr-1">GRABAR</button>
                                <br />
                            </div>
                        </form>
                    </div>
                    <div className="col-md-6 xfooter">
                        {detallesAjustesRecientes ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>Folio</th>
                                        <th>Tipo Ajuste</th>
                                        <th>Descripcion</th>
                                        <th>Unidades Ajustadas</th>
                                        <th>FechaHora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detallesAjustesRecientes.map((element, i) => (
                                        <tr key={i}>
                                            <td>{element.FolioId}</td>
                                            <td>{element.TipoAjuste}</td>
                                            <td>{element.Descripcion}</td>
                                            <td>{element.UnidadesAjustadas}</td>
                                            <td>{element.FechaHora}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                            : null}
                    </div>

                </div>
            </div>

        )
    }

    return (
        <>
            {detallesTipoAjustes.length > 0 ? handleRender() : <h3>"Loading..."</h3>}
        </>
    )
}
export default AjustesInventario;