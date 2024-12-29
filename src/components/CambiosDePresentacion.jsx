import React, { useState, useEffect, useRef } from 'react';

import SelectSucursales from './utils/SelectSucursales';

import './CambiosDePresentacion.css'

const CambiosDePresentacion = ({ onProps }) => {
    const origin = onProps.origin
    const accessToken = onProps.accessToken
    const Administrador = onProps.Administrador
    const Usuario = onProps.User
    const ColaboradorId = onProps.ColaboradorId

    const [SucursalId, setSucursalId] = useState(onProps.SucursalId)
    const [CodigoIdPadre, setCodigoIdPadre] = useState("")
    const [CodigoBarrasPadre, setCodigoBarrasPadre] = useState("")
    const [DescripcionPadre, setDescripcionPadre] = useState("")
    const [UnidadesInventarioPadre, setUnidadesInventarioPadre] = useState("")
    const [CodigoIdHijo, setCodigoIdHijo] = useState("")
    const [CodigoBarrasHijo, setCodigoBarrasHijo] = useState("")
    const [DescripcionHijo, setDescripcionHijo] = useState("")
    const [FactorConversion, setFactorConversion] = useState("")
    const [UnidadesInventarioHijo, setUnidadesInventarioHijo] = useState("")
    const [UnidadesConvertir, setUnidadesConvertir] = useState("")
    const [detallesPadres, setDetallesPadres] = useState([])
    const [detallesHijos, setDetallesHijos] = useState([])
    const [disabledPadre, setDisabledPadre] = useState(false)
    const [disabledPadreBuscar, setDisabledPadreBuscar] = useState(false)
    // const [disbledPadreDescripcion, setDisabledPadreDescripcion] = useState(false)
    const [disabledUnidadesConvertir, setDisabledUnidadesConvertir] = useState(true)
    const [UnidadesHijoRecibe, setUnidadesHijoRecibe] = useState("")


    const [isDisabledDescripcionPadre, setIsDisabledDescripcionPadre] = useState(true)

    const CodigoBarrasInput = useRef()
    const DescripcionInput = useRef()
    const UnidadesConvertirInput = useRef()



    useEffect(() => {
        CodigoBarrasInput.current.focus()
    }, [])

    //########
    const handleSucursal = (vSucursalId) => {
        setSucursalId(vSucursalId)
        CodigoBarrasInput.current.focus()
    }

    //#######

    const onhandleCodigoBarrasPadre = (e) => {
        const vCodigoBarras = e.target.value.toUpperCase()
        setCodigoBarrasPadre(vCodigoBarras)
    }

    const onhandleCodigoBarraPadreKeyDown = (e) => {
        if (e.key === 'Enter' && CodigoBarrasPadre === "") {
            handleBuscar()
        }
    }

    const onhandleDescripcion = (e) => {
        const vDescripcion = e.target.value.toUpperCase();

        setDescripcionPadre(vDescripcion)

        if (vDescripcion.length > 3){
            handleconsultaPadres(vDescripcion)
        }else{
            setDetallesPadres([])
        }
    }

    const handleconsultaPadres = async (vDescripcionPadre) => {
        if (vDescripcionPadre === "") {
            setDescripcionPadre("")
        }
        const url = origin + `/api/consultaproductospadres/${SucursalId}/${vDescripcionPadre}`
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
            setDetallesPadres(data)
        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }

    const handleBuscar = () => {
        if (isDisabledDescripcionPadre && CodigoBarrasPadre === ""){
            setIsDisabledDescripcionPadre(false)

            setTimeout(() =>{
                DescripcionInput.current.focus()
            }, 0)

        }else{
            //eu Aquí faltaria buscar por código de barras
            setIsDisabledDescripcionPadre(true)
            CodigoBarrasInput.current.focus()

        }
    }

    // const handleHijosOpt = (vCodigoId, vcodigobarras, vdescripcion, vUnidadesInventario) => {
    //     let detallesHijos = detallesPadres.find(element => parseInt(element.CodigoIdPadre) === parseInt(vCodigoId))
    //     setCodigoBarrasPadre(vcodigobarras)
    //     setDescripcionPadre(vdescripcion)
    //     setUnidadesInventarioPadre(vUnidadesInventario)
    //     setCodigoIdPadre(vCodigoId)
    //     setDetallesPadres([])
    //     setDetallesHijos(detallesHijos.detalles)
    //     setDisabledPadre(true)
    //     setDisabledPadreBuscar(true)
    //     addRowHandlersHijos();

    //     if (detallesHijos.detalles.length === 1) {
    //         setCodigoIdHijo(detallesHijos.detalles[0].CodigoIdHijo)
    //         setCodigoBarrasHijo(detallesHijos.detalles[0].CodigoBarrasHijo)
    //         setDescripcionHijo(detallesHijos.detalles[0].DescripcionHijo)
    //         setFactorConversion(detallesHijos.detalles[0].FactorConversion)
    //         setUnidadesInventarioHijo(detallesHijos.detalles[0].UnidadesInventarioHijo)
    //         setDisabledUnidadesConvertir(false)
    //         UnidadesConvertirInput.current.focus()
    //     } else {
    //         document.querySelector(".tablaBusquedaHijos").style.display = "block";
    //     }

    //     document.querySelector(".tablaBusquedaProductos").style.display = "none";
    //     document.querySelector("#descripcion").disabled = true;

    // }

    // const addRowHandlers = () => {
    //     const table = document.getElementById("table1");
    //     const rows = table.getElementsByTagName("tr");
    //     //let detallesHijos=[]
    //     for (let i = 1; i < rows.length; i++) { //IMPORANTE: SE PONE DESDE 1 PORQUE EL 0 SON LOS ENCABEZADOS
    //         let currentRow = table.rows[i];
    //         let createClickHandler = (row) => {
    //             return () => {
    //                 let cell = row.getElementsByTagName("td")[1];
    //                 let vcodigobarras = cell.innerHTML;
    //                 cell = row.getElementsByTagName("td")[2];
    //                 let vdescripcion = cell.innerHTML;
    //                 cell = row.getElementsByTagName("td")[3];
    //                 let vUnidadesInventario = cell.innerHTML;
    //                 cell = row.getElementsByTagName("td")[0];
    //                 let vCodigoId = cell.innerHTML;
    //                 if (vUnidadesInventario <= 0) {
    //                     alert("El Producto Padre No tiene Existencia")
    //                     document.querySelector(".tablaBusquedaProductos").style.display = "none";
    //                     document.querySelector("#descripcion").disabled = true;
    //                     this.CodigoBarrasInput.current.focus()
    //                     return
    //                 }
    //                 handleHijosOpt(vCodigoId, vcodigobarras, vdescripcion, vUnidadesInventario)
    //             };
    //         };
    //         currentRow.onclick = createClickHandler(currentRow);
    //     }
    // };

    // const addRowHandlersHijos = () => {
    //     const table = document.getElementById("table2");
    //     const rows = table.getElementsByTagName("tr");
    //     for (let i = 1; i < rows.length; i++) { //IMPORANTE: SE PONE DESDE 1 PORQUE EL 0 SON LOS ENCABEZADOS
    //         let currentRow = table.rows[i];
    //         let createClickHandler = (row) => {
    //             return () => {
    //                 let cell = row.getElementsByTagName("td")[0];
    //                 let vCodigoId = cell.innerHTML;
    //                 cell = row.getElementsByTagName("td")[1];
    //                 let vcodigobarras = cell.innerHTML;
    //                 cell = row.getElementsByTagName("td")[2];
    //                 let vdescripcion = cell.innerHTML;
    //                 cell = row.getElementsByTagName("td")[3];
    //                 let vUnidadesInventario = cell.innerHTML;
    //                 cell = row.getElementsByTagName("td")[4];
    //                 let vFactorConversion = cell.innerHTML;

    //                 setCodigoBarrasHijo(vcodigobarras)
    //                 setDescripcionHijo(vdescripcion)
    //                 setUnidadesInventarioHijo(vUnidadesInventario)
    //                 setCodigoIdHijo(vCodigoId)
    //                 setFactorConversion(vFactorConversion)
    //                 setDisabledUnidadesConvertir(false)
    //                 UnidadesConvertirInput.current.focus()
    //                 document.querySelector(".tablaBusquedaHijos").style.display = "none";
    //             };
    //         };
    //         currentRow.onclick = createClickHandler(currentRow);
    //     }
    // };


    const onhandleUnidadesConvertir = (e) => {
        const UnidadesConvertir = e.target.value
        if (parseInt(UnidadesConvertir) > parseInt(UnidadesInventarioPadre)) {
            alert("Las Unidades Convertir No pueden Exceder su Inventario")
            return
        }
        let numbers = /^[0-9]+$/;
        if (UnidadesConvertir.match(numbers) || UnidadesConvertir === "") {
            setUnidadesConvertir(UnidadesConvertir)
            setUnidadesHijoRecibe(UnidadesConvertir * parseFloat(FactorConversion))
        }
    }

    const onhandleGrabar = async () => {
        if (UnidadesConvertir === "" || parseInt(UnidadesConvertir) <= 0 || parseInt(UnidadesConvertir) > parseInt(UnidadesInventarioPadre)) {
            alert("Hay datos requeridos faltantes o que no cumplen con lo requerido")
            UnidadesConvertirInput.current.focus()
            return
        }

        const json = {
            SucursalId: SucursalId,
            CodigoIdPadre: CodigoIdPadre,
            CodigoBarrasPadre: CodigoBarrasPadre,
            UnidadesConvertir: UnidadesConvertir,
            FactorConversion: FactorConversion,
            CodigoIdHijo: CodigoIdHijo,
            CodigoBarrasHijo: CodigoBarrasHijo,
            UnidadesHijoRecibe: UnidadesHijoRecibe,
            ColaboradorId: ColaboradorId,
            Usuario: Usuario,
        }

        const url = origin + `/api/cambiosdepresentacionajustes`
        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json()

            if (data.error) {
                console.log(data.error)
                alert(data.error)
                return
            }
            onhandleCancelar()
            alert(JSON.stringify(data))
        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }

    const onhandleCancelar = () => {
        setCodigoBarrasPadre("")
        setDescripcionPadre("")
        setUnidadesInventarioPadre("")
        setCodigoBarrasHijo("")
        setDescripcionHijo("")
        setUnidadesInventarioHijo("")
        setUnidadesConvertir("")
        setFactorConversion("")
        setUnidadesHijoRecibe("")
        setDisabledPadre(false)
        setDisabledPadreBuscar(false)
        setDisabledUnidadesConvertir(true)
        CodigoBarrasInput.current.focus()

    }

    const handleSeleccionaPadre = (element) =>{
        setIsDisabledDescripcionPadre(true)
        setDescripcionPadre("")
        setDetallesPadres([])
        setCodigoIdPadre(element.CodigoIdPadre)
        setCodigoBarrasPadre(element.CodigoBarrasPadre)
        setDescripcionPadre(element.DescripcionPadre)
        setUnidadesInventarioPadre(element.UnidadesInventarioPadre)
        setDisabledUnidadesConvertir(false)
        setTimeout(() =>{
            UnidadesConvertirInput.current.focus()
        },0)
        if (parseInt(element.CantidadHijos) === 1){
            setCodigoIdHijo(element.detalles[0].CodigoIdHijo)
            setCodigoBarrasHijo(element.detalles[0].CodigoBarrasHijo)
            setDescripcionHijo(element.detalles[0].DescripcionHijo)
            setUnidadesInventarioHijo(element.detalles[0].UnidadesInventarioHijo)
            setFactorConversion(element.detalles[0].FactorConversion)
        }else{
            setDetallesHijos(element.detalles)
        }
    }

    const handleSeleccionaHijo = (element) =>{
        setDetallesHijos([])
        setCodigoIdHijo(element.CodigoIdHijo)
        setCodigoBarrasHijo(element.CodigoBarrasHijo)
        setDescripcionHijo(element.DescripcionHijo)
        setUnidadesInventarioHijo(element.UnidadesInventarioHijo)
        setFactorConversion(element.FactorConversion)

        setTimeout(() =>{
            UnidadesConvertirInput.current.focus()
        },0)
    }

    const handleRender = () => {
        return (
            <div className="container container-cambiosdepresentacion">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <span className="badge bg-primary">Cambios de Presentación</span>
                                <br />
                                <br />
                                <SelectSucursales accessToken={accessToken} url={origin} SucursalAsignada={SucursalId} onhandleSucursal={handleSucursal} Administrador={Administrador} />
                                <br />
                                <label htmlFor="codigobarraspadre" style={{ width: "8rem" }}><small>Código Barras Padre</small></label>
                                <input onChange={onhandleCodigoBarrasPadre} onKeyDown={onhandleCodigoBarraPadreKeyDown} id="codigobarraspadre" name="codigobarraspadre" value={CodigoBarrasPadre} ref={CodigoBarrasInput} disabled={disabledPadre} />
                                <button onClick={handleBuscar} className="btn btn-success btn-sm ml-2" disabled={disabledPadreBuscar}>Buscar</button>
                                <br />
                                <label htmlFor="descripcion">Descripción</label>
                                <input onChange={onhandleDescripcion} value={DescripcionPadre} id="descripcion" name="descripcion" style={{ width: "100%", textTransfor: "uppercase" }} ref={DescripcionInput} disabled={isDisabledDescripcionPadre} autoComplete='off' />
                                <div className="tablaBusquedaPadre mt-2" style={{display: isDisabledDescripcionPadre ? "none" : "block"}}>
                                    <table id="table1">
                                        <thead>
                                            <tr>
                                                <th>Código</th>
                                                <th>Código Barras</th>
                                                <th>Descripcion</th>
                                                <th>Unidades Inventario</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detallesPadres.map((element, i) => (
                                                <tr key={i} onClick={()=> handleSeleccionaPadre(element)}>
                                                    <td>{element.CodigoIdPadre}</td>
                                                    <td>{element.CodigoBarrasPadre}</td>
                                                    <td>{element.DescripcionPadre}</td>
                                                    <td>{element.UnidadesInventarioPadre}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <label htmlFor="unidadesinventariopadre" style={{ width: "12rem" }}>Unidades Inventario Padre</label>
                                <input id="unidadesinventariopadre" name="unidadesinventariopadre" style={{ width: "4rem" }} value={UnidadesInventarioPadre} readOnly />











                                <hr />
                                <div className="tablaSeleccionHijos" style={{display: detallesHijos.length > 0 ? "block" : "none"}}>
                                    <table id="table2">
                                        <thead>
                                            <tr>
                                                <th>Código</th>
                                                <th>Código Barras</th>
                                                <th>Descripcion</th>
                                                <th>Unidades Inventario</th>
                                                <th>Factor Conversión</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detallesHijos.map((element, i) => (
                                                <tr key={i} onClick={()=> handleSeleccionaHijo(element)}>
                                                    <td>{element.CodigoIdHijo}</td>
                                                    <td>{element.CodigoBarrasHijo}</td>
                                                    <td>{element.DescripcionHijo}</td>
                                                    <td>{element.UnidadesInventarioHijo}</td>
                                                    <td>{element.FactorConversion}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <label htmlFor="codigobarrashijo" style={{ width: "8rem" }}><small>Código Barras Hijo</small></label>
                                <input id="codigobarrashhijo" name="codigobarrashijo" value={CodigoBarrasHijo} readOnly />
                                <br />
                                <label htmlFor="descripcionhijo">Descripción</label>
                                <br />
                                <input value={DescripcionHijo} id="descripcionhijo" name="descripcionhijo" style={{ width: "100%" }} readOnly />
                                <br />
                                <label htmlFor="unidadesexistenciahijo" style={{ width: "12rem" }}>Unidades Inventario Hijo</label>
                                <input id="unidadesexistenciahijo" name="unidadesexistenciahijo" value={UnidadesInventarioHijo} style={{ width: "4rem" }} readOnly />
                            </div>
                            <div className="card-footer">
                                <label htmlFor="" style={{ width: "5rem" }}>Unidades Padre Convertir</label>
                                <input onChange={onhandleUnidadesConvertir} id="unidadesconvertir" name="unidadesconvertir" value={UnidadesConvertir} style={{ width: "4rem", textAlign: "right" }} ref={UnidadesConvertirInput} disabled={disabledUnidadesConvertir} />
                                <label htmlFor="factorconversion" style={{ width: "5.5rem", marginLeft: "2rem" }}>Factor Conversión</label>
                                <input id="factorconversion" name="factorconversion" value={FactorConversion} style={{ width: "4rem", fontSize: ".7rem", textAlign: "right" }} readOnly />
                                <label htmlFor="" style={{ width: "4.5rem" }}>Unidades Hijo Recibe </label>
                                <input id="unidadeshijorecibe" name="unidadeshijorecibe" value={UnidadesHijoRecibe} style={{ width: "4rem", textAlign: "right" }} readOnly />
                                <button onClick={onhandleGrabar} className="btn btn-primary d-block w-100 mt-4">Grabar</button>
                                <button onClick={onhandleCancelar} className="btn btn-danger d-block w-100 mt-2">Cancelar</button>
                                <br />
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    return (
        <>
            { 1== 1 ? handleRender() : <h2>Loading ...</h2>}
        </>
    )

}

export default CambiosDePresentacion;