import React, { useState, useEffect, useRef } from 'react'

import { handleGetMethod } from "../utils/FuncionesGlobales"

const PuntoDeVenta1Header = ({ sucursales, SucursalId, onhandleSucursales, clientes, ClienteId, onhandleClientes, Unidades, onUnidades, CodigoBarras, onCodigoBarras, detalles, onDetalles, origin, accessToken, codigobarrasInputRef, ventanaDescripcionInputRef }) => {

    const [backgroundXtimes, setBackgroundXtimes] = useState('');
    // const [detalles, setDetalles] = useState([])
    const [ventanaProductosDisabled, setVentanaProductosDisabled] = useState(true)
    const [ventanaDescripcion, setVentanaDescripcion] = useState("")
    const [ventanaDescripcionDetalles, setVentanaDescripcionDetalles] = useState([])
    const [banderaHandleBuscar, setBanderaHandleBuscar] = useState(false)
    const porcentajePorServicio = 70

    // const codigobarrasInputRef = useRef(null);
    // const ventanaDescripcionInputRef = useRef(null)

    //Una vez que se actualiza el código de barras, corre automáticamente el handleBuscar sin necesidad de <Enter>
    useEffect(() => {
        if (banderaHandleBuscar) {
            handleBuscar()
            setBanderaHandleBuscar(false)
        }
    }, [banderaHandleBuscar])


    useEffect(() => {
        ventanaDescripcionInputRef.current.focus()
    }, [ventanaProductosDisabled])

    const handleSucursales = (e) => {
        const vSucursalId = e.target.value
        onhandleSucursales(vSucursalId)
        // setSucursalId(vSucursalId)
        codigobarrasInputRef.current.focus()
    }

    const handleClientes = (e) => {
        const vClienteId = e.target.value
        onhandleClientes(vClienteId)
        codigobarrasInputRef.current.focus()
    }

    const handleUnidadesXTimes = (operacion) => {
        if (operacion === "suma") {
            onUnidades(Unidades + 1)
        }
        if (operacion === "resta" && Unidades > 1) {
            onUnidades(Unidades - 1)
        }
        codigobarrasInputRef.current.focus();
    }
    const handleCodigoBarras = (e) => {
        onCodigoBarras(e.target.value.toUpperCase())
    }
    const handleCodigoBarrasKeyDown = (e) => {
        if (e.key === "Enter") {
            handleBuscar();
        }
    };

    const getProducto = async (vCodigoBarras) => {
        if (!vCodigoBarras) {
            return { error: "El código de barras es obligatorio." };
        }
        const url = `${origin}/api/productosdatosventa/${SucursalId}/${vCodigoBarras}`;
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const message = `Error ${response.status}: ${response.statusText}`;
                return { error: message }
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al obtener producto: ", error.message)
            return { error: "No se pudo conectar al servidor. Intente nuevamente" }

        }
    }

    const getProductosDescripcion = async (descripcion) => {
        const url = `${origin}/api/productosdescripcion/${descripcion}/${SucursalId}`;
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();

            return data;

        } catch (error) {
            console.log(error.message)
            alert(error.message)
            return { error: error.message }
        }
    }

    const handlerRowClicked = (i) => {
        const vCodigoBarras = ventanaDescripcionDetalles[i].CodigoBarras
        onCodigoBarras(vCodigoBarras)
        setBanderaHandleBuscar(true) //Manda llamar hook useEffect para correr handleBuscar()
        setVentanaProductosDisabled(true)
        setVentanaDescripcion("")
        setVentanaDescripcionDetalles([])

    }

    const handleVentanaDescripcion = async (e) => {
        const descripcion = e.target.value.toUpperCase()
        setVentanaDescripcion(descripcion)

        if (descripcion === "" || descripcion.length < 3) {
            setVentanaDescripcionDetalles([])
            return
        }

        try {
            const arreglo_prod_desc = await getProductosDescripcion(descripcion)
            if (arreglo_prod_desc.error) {
                console.log(arreglo_prod_desc.error)
                alert(arreglo_prod_desc.error)
                return
            }
            setVentanaDescripcionDetalles(arreglo_prod_desc)

        } catch (error) {
            console.error("Error al obtener la descripción de los productos: ", error)
        }
    }
    const handleVentanaDescripcionKeyDown = (e) => {
        if (e.key === "Enter" && ventanaDescripcion === "") {
            // e.preventDefault()
            setVentanaProductosDisabled(!ventanaProductosDisabled)
            codigobarrasInputRef.current.focus();
        }
    };

    const handleBuscar = async () => {
        let vCodigoBarras = CodigoBarras

        //####### Funcionalidad para Capturar Códigos Internos y lo convierte a su Codigo de Barras #######
        //### Para Marcado Rápido productos que empiezan con I y que su longitud es menor que 6 lo toma como
        //### código interno para buscar su Código de Barras Principal
        if (vCodigoBarras[0] === "I" && vCodigoBarras.length < 6) {
            const CodigoId = parseInt(CodigoBarras.substring(1));



            const url = `${origin}/api/codigobarrasprincipal/${CodigoId}`;
            const vdata = await handleGetMethod(url, accessToken)
            if (vdata.error) {
                console.log(vdata.error)
                alert(vdata.error)
                return
            }



            const vCodigoBs = vdata[0].CodigoBarras
            if (vCodigoBs === "") {
                alert("Codigo Interno No Existen");
                return;
            }
            vCodigoBarras = vCodigoBs
            // setCodigoBarras(vCodigoBs)
        }
        //##############################################################################################


        if (vCodigoBarras !== "") {
            let nuevoArreglo = await getProducto(vCodigoBarras)
            if (nuevoArreglo.error) {
                console.error(nuevoArreglo.error)
                alert(nuevoArreglo.error)
                codigobarrasInputRef.current.focus()
                return
            }
            if (nuevoArreglo[0].UnidadesDisponibles <= 0 && nuevoArreglo[0].Inventariable === 'S') {
                onCodigoBarras("")
                alert("Producto No tiene Inventario Disponible")
                codigobarrasInputRef.current.focus()
                return
            }
            const vUnidades = Unidades

            //########################################################################################
            // PROCESO SERVICIO POR ENCARGO
            if (vCodigoBarras === "I000000000065") {
                if (detalles.find(element => element.CategoriaId === 3)) {
                    const vTotalCategoria3 = detalles
                        .filter(item => item.CategoriaId === 3)
                        .reduce((acumulador, item) => acumulador + (parseInt(item.PrecioVentaConImpuesto) * parseInt(item.Unidades)), 0)

                    nuevoArreglo[0].PrecioVentaConImpuesto = (parseFloat(vTotalCategoria3) * (parseFloat(porcentajePorServicio / 100)))
                } else {
                    onCodigoBarras("")
                    alert("El ticket no incluye Lavadas/Secadas para Servicio por Encargo")
                    codigobarrasInputRef.current.focus()
                    return
                }

            }
            //########################################################################################

            nuevoArreglo[0].Unidades = vUnidades;
            nuevoArreglo[0].CodigoBarras = vCodigoBarras
            nuevoArreglo[0].Accion = "?"
            // onDetalles([...detalles, nuevoArreglo[0]])
            onDetalles(nuevoArreglo)
            onCodigoBarras("")
            onUnidades(1)
            setBackgroundXtimes('')
            codigobarrasInputRef.current.focus()
        }

        if (vCodigoBarras === "") {
            setVentanaProductosDisabled(!ventanaProductosDisabled)
            if (ventanaProductosDisabled) {
                ventanaDescripcionInputRef.current.focus()
                setVentanaDescripcion("")
                setVentanaDescripcionDetalles([])
            } else {
                codigobarrasInputRef.current.focus()
            }

        }
    };



    return (
        <div className='pdv-header'>
            <div className="father">

                <div className="child child1">

                    <select
                        onChange={handleSucursales}
                        id="sucursales"
                        name="sucursales"
                        value={SucursalId}
                        style={{ fontSize: ".7em" }}
                    >
                        {sucursales.map((element, i) => (
                            <option key={i} value={element.SucursalId}>
                                {element.Sucursal}
                            </option>
                        ))}
                    </select>
                    <select
                        onChange={handleClientes}
                        className="ml-2"
                        id="clientes"
                        name="clientes"
                        value={ClienteId}
                        style={{ fontSize: ".7em" }}
                    >
                        {clientes.map((element, i) => (
                            <option key={i} value={element.ClienteId}>
                                {element.Cliente}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <div className="child child2">

                        <button onClick={() => handleUnidadesXTimes("resta")} style={{ background: "green", color: "white", width: "30px", height: "28px", borderRadius: "5px", margin: "1px", border: "none" }}>-</button>

                        <span className="badge text-bg-warning" style={{ width: "70px" }} onClick={() => codigobarrasInputRef.current.focus()}>{Unidades}<sup>  Unidades</sup></span>

                        <button onClick={() => handleUnidadesXTimes("suma")} style={{ background: "green", color: "white", width: "30px", height: "28px", borderRadius: "5px", margin: "1px", border: "none" }}>+</button>
                    </div>
                </div>
            </div>

            <label
                htmlFor="codigobarras"
                style={{ fontSize: ".8em", width: "87px" }}
            >
                Código Barras
            </label>
            <input
                ref={codigobarrasInputRef}
                onChange={handleCodigoBarras}
                onKeyDown={handleCodigoBarrasKeyDown}
                id="codigobarras"
                name="codigobarras"
                size="15"
                maxLength="13"
                value={CodigoBarras}
                style={{ fontSize: ".7em" }}
                autoComplete="off"
                autoFocus
            />

            <button
                onClick={handleBuscar}
                className="btn btn-primary btn-sm ms-2"
            >
                Buscar
            </button>
            <br />





            {/* Ventana Consulta Productos */}
            <div
                className="ventanaproductos p-2"
                style={{
                    display: ventanaProductosDisabled ? "none" : "block",
                }}
            >
                <label htmlFor="ventanadescripcion" style={{ width: "6rem" }}>
                    Descripcion
                </label>

                <input
                    ref={ventanaDescripcionInputRef}
                    onChange={handleVentanaDescripcion}
                    onKeyDown={handleVentanaDescripcionKeyDown}
                    id="ventanadescripcion"
                    name="ventanadescripcion"
                    value={ventanaDescripcion}
                    size="40"
                    autoComplete="off"
                />
                {/* <table id="table1" className="m-2" style={{width:"300px"}} > */}
                <table id="table1" className="m-2" >
                    <thead>
                        <tr>
                            <th>Codigo</th>
                            <th>Codigo Barras</th>
                            <th>Descripcion</th>
                            <th>Inventario</th>
                            <th>Precio Venta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventanaDescripcionDetalles.map((element, i) => (
                            <tr key={i} onClick={() => handlerRowClicked(i)} style={{ cursor: 'pointer' }}>
                                <td>{element.CodigoId}</td>
                                <td>{element.CodigoBarras}</td>
                                <td>{element.Descripcion}</td>
                                <td>{element.UnidadesDisponibles}</td>
                                <td>{element.PrecioVentaConImpuesto}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>







            <br />
            {/* </div> */}
        </div>
    )
}

export default PuntoDeVenta1Header
