import React, { useState, useEffect, useRef } from 'react';

import SelectSucursales from "./utils/SelectSucursales"
import InputCodigoBarras from "./utils/InputCodigoBarras"

import './TraspasosSalidaEntrada.css'

const TraspasosSalidaEntrada = ({ onProps }) => {

    const origin = onProps.origin
    const accessToken = onProps.accessToken
    const Administrador = onProps.Administrador
    const ColaboradorId = onProps.ColaboradorId
    const User = onProps.User

    const [SucursalId, setSucursalId] = useState(onProps.SucursalId)
    const [SucursalIdDestino, setSucursalIdDestino] = useState("")
    const [Sucursales, setSucursales] = useState([])
    const [CodigoBarras, setCodigoBarras] = useState("")
    const [CodigoId, setCodigoId] = useState("")
    const [Descripcion, setDescripcion] = useState("")
    const [UnidadesExistencia, setUnidadesExistencia] = useState("")
    const [UnidadesDisponibles, setUnidadesDisponibles] = useState("")
    const [UnidadesPedidas, setUnidadesPedidas] = useState("")
    const [detalles, setDetalles] = useState([])
    const [SoloInventariable, setSoloInventariable] = useState('S')
    const [IsDisabled, setIsDisabled] = useState(false)

    const CodigoBarrasInput = useRef();
    const UnidadesPedidasInput = useRef();


    useEffect(() => {
        async function fetchData() {
            const Sucursales = await handleSucursales(SucursalId)
            setSucursalIdDestino(Sucursales[0].SucursalId)
            setSucursales(Sucursales)
        }
        fetchData()
    }, [])


    const getSucursales = async () => {
        const url = origin + `/api/catalogos/10`
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            let data = await response.json()
            return data;
        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }

    const handleSucursales = async (vSucursalId) => {
        const arregloSucursales = await getSucursales()
        const Sucursales = arregloSucursales.filter(element => parseInt(element.SucursalId) !== parseInt(vSucursalId))
        return Sucursales
    }

    const handleSucursal = async (vSucursalId) => {
        const vSucursales = await handleSucursales(vSucursalId)
        setSucursalId(vSucursalId)
        setSucursales(vSucursales)
        CodigoBarrasInput.current.handleRefSucursalId(vSucursalId)
    }

    const onhandleSucursalDestino = (e) => {
        const SucursalIdDestino = parseInt(e.target.value)
        setSucursalIdDestino(SucursalIdDestino)
        CodigoBarrasInput.current.handleRefCodigoBarrasInput()
    }

    const onhandleCodigoBarras = (vCodigoBarras) => {
        setCodigoBarras(vCodigoBarras)
        setDescripcion("")
    }

    const onhandleConsulta = (vCodigoBarras, vDescripcion, vUnidadesExistencia, vUnidadesDisponibles, vCodigoId) => {
        setDescripcion(vDescripcion)
        setUnidadesExistencia(vUnidadesExistencia)
        setUnidadesDisponibles(vUnidadesDisponibles)
        setCodigoId(vCodigoId)
        UnidadesPedidasInput.current.focus()
    }

    const onhandleUnidadesPedidas = (e) => {
        e.preventDefault()
        let vUnidadesPedidas = e.target.value
        if (vUnidadesPedidas === "") {
            return
        }
        const vUnidadesDisponibles = parseInt(UnidadesDisponibles)
        if (parseInt(vUnidadesPedidas) <= 0) {
            alert("Unidades Pedidas deben ser Mayor que CERO")
            vUnidadesPedidas = ""
        }
        if (parseInt(vUnidadesPedidas) > vUnidadesDisponibles) {
            alert("Unidades Pedidas NO pueden ser Mayor a Unidades Disponibles")
            vUnidadesPedidas = ""
        }
        setUnidadesPedidas(vUnidadesPedidas)
    }

    const onhandleUnidadesPedidasKeyDown = (e) => {
        if (e.key === "Enter") {
            onhandleAgregar(e)
        }
    }

    const onhandleAgregar = (e) => {
        e.preventDefault()
        if (CodigoBarras === "") {
            CodigoBarrasInput.current.handleRefCodigoBarrasInput()
        }
        if (UnidadesPedidas === "") {
            UnidadesPedidasInput.current.focus()
            return
        }
        let arreglo = [...detalles]
        if (arreglo.find((element) => parseInt(element.CodigoId) === parseInt(CodigoId))) {
            alert("El Producto ya Existe en esta Transaccion")
            setCodigoBarras("")
            setDescripcion("")
            setUnidadesExistencia(0)
            setUnidadesDisponibles(0)
            setUnidadesPedidas("")
            setCodigoId("")
            CodigoBarrasInput.current.handleRefCodigoBarrasInput()
            return
        }

        const json = {
            CodigoId: parseInt(CodigoId),
            CodigoBarras: CodigoBarras,
            Descripcion: Descripcion,
            UnidadesPedidas: parseInt(UnidadesPedidas),
        }
        arreglo.push(json)


        setDescripcion("")
        setUnidadesExistencia(0)
        setUnidadesDisponibles(0)
        setUnidadesPedidas("")
        setDetalles(arreglo)
        setIsDisabled(true)
        CodigoBarrasInput.current.handleRefCodigoBarrasInput()
    }

    const onhandleCancelar = (e) => {
        e.preventDefault()
        setCodigoBarras("")
        setDescripcion("")
        setUnidadesExistencia(0)
        setUnidadesDisponibles(0)
        setUnidadesPedidas("")
        setCodigoId("")
        CodigoBarrasInput.current.handleRefCodigoBarrasInput()
    }

    const onhandleCerrarTraspaso = async () => {
        let detallesPost = [];
        let jsonPost;

        if (detalles.length === 0) {
            if (CodigoBarras === "") {
                CodigoBarrasInput.current.handleRefCodigoBarrasInput()
            }
            return
        }
        if (!window.confirm('Desea Cerrar el Traspaso?')) {
            return
        }

        detalles.forEach((element) => {
            jsonPost = {
                CodigoId: parseInt(element.CodigoId),
                CodigoBarras: element.CodigoBarras,
                UnidadesPedidas: parseInt(element.UnidadesPedidas)
            }
            detallesPost.push(jsonPost)
        })

        const json = {
            SucursalIdOrigen: parseInt(SucursalId),
            SucursalIdDestino: parseInt(SucursalIdDestino),
            ColaboradorIdOrigen: ColaboradorId,
            Usuario: User,
            detallesPost: detalles,
        }

        const url = origin + `/api/grabatraspasosalida`
        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json()

            alert(JSON.stringify(data))


            setCodigoBarras("")
            setDescripcion("")
            setUnidadesExistencia(0)
            setUnidadesDisponibles(0)
            setUnidadesPedidas("")
            setDetalles([])
            setCodigoId("")
            setIsDisabled(false)
            CodigoBarrasInput.current.handleRefCodigoBarrasInput()


        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }

    const onhandleCancelarTraspaso = () => {
        setCodigoBarras("")
        setDescripcion("")
        setUnidadesExistencia(0)
        setUnidadesDisponibles(0)
        setUnidadesPedidas("")
        setDetalles([])
        setCodigoId("")
        setIsDisabled(false)
        CodigoBarrasInput.current.handleRefCodigoBarrasInput()
    }


    const handleRender = () => {
        return (
            <div className="container container-traspasossalidaentrada">

                <div className="row">
                    <div className="col-md-6">
                        <form>
                            <div className="card">
                                <div className="card-body">
                                    <div className="form-group">
                                        <span className="badge bg-primary">Traspasos Salida/Entrada</span>
                                        <br />
                                        <br />
                                        <label htmlFor="">Sucursal Origen</label>
                                        <SelectSucursales accessToken={accessToken} url={origin} SucursalAsignada={SucursalId} onhandleSucursal={handleSucursal} Administrador={Administrador} />
                                        <br />
                                        <label htmlFor="">Sucursal Destino</label>
                                        <select onChange={onhandleSucursalDestino} id="sucursaldestino" name="sucursaldestino" value={SucursalIdDestino} disabled={IsDisabled}>
                                            {Sucursales.map((element, i) => (
                                                <option key={i} value={element.SucursalId}>{element.Sucursal}</option>
                                            ))}
                                        </select>
                                        <InputCodigoBarras accessToken={accessToken} url={origin} handleCodigoBarrasProp={onhandleCodigoBarras} handleConsultaProp={onhandleConsulta} CodigoBarrasProp={CodigoBarras} SoloInventariable={SoloInventariable} ref={CodigoBarrasInput} />
                                        <br />
                                        <label htmlFor="codigoId">Código</label>
                                        <input id="codigoId" name="codigoId" value={CodigoId} readOnly />
                                        <br />
                                        <label htmlFor="">Descripcion</label>
                                        <br />
                                        <input id="descripcion" name="descripcion" value={Descripcion} readOnly />
                                        <br />
                                        <br />
                                        <label htmlFor="" style={{ width: "10rem" }}>Unidades Disponibles</label>
                                        <input id="unidadesdisponibles" name="unidadesdisponibles" style={{ width: "4rem", textAlign: "right" }} value={UnidadesDisponibles} readOnly />
                                        <br />
                                        <label htmlFor="unidadespedidias" style={{ width: "10rem" }}>Unidades Pedidas</label>
                                        <input onChange={onhandleUnidadesPedidas} onKeyDown={onhandleUnidadesPedidasKeyDown} id="unidadespedidas" name="unidadespedidas" type="number" style={{ width: "4rem", textAlign: "right" }} value={UnidadesPedidas} ref={UnidadesPedidasInput} autoComplete="off" />
                                        <div className="botones">
                                            <button className="btn btn-danger" onClick={onhandleCancelar}>CANCELAR</button>
                                            <button className="btn btn-success" onClick={onhandleAgregar}>AGREGAR</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </form>
                        <hr />
                        <button onClick={onhandleCerrarTraspaso} className="btn btn-primary btn-block w-100 mb-3">CERRAR TRASPASO</button>
                        <button onClick={onhandleCancelarTraspaso} className="btn btn-danger btn-block w-100">CANCELAR TRASPASO</button>
                    </div>
                    <div className="col-md-6">
                        {detalles.length > 0
                            ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Código Barras</th>
                                        <th>Descripcion</th>
                                        <th>Unidades Pedidas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalles.map((element, i) => (
                                        <tr key={i}>
                                            <td>{element.CodigoId}</td>
                                            <td>{element.CodigoBarras}</td>
                                            <td>{element.Descripcion}</td>
                                            <td>{element.UnidadesPedidas}</td>
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
            {Administrador !== "" ? handleRender() : <h3>Loading . . .</h3>}
        </>
    )

}

export default TraspasosSalidaEntrada;