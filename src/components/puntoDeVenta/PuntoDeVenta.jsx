import React, { useState, useEffect, useRef } from 'react';

import './PuntoDeVenta.css'
import PuntoDeVenta1Header from './PuntoDeVenta1Header'
import PuntoDeVenta3NotasP from './PuntoDeVenta3NotasP';
import PuntoDeVenta4Footer from './PuntoDeVenta4Footer';
import { handleGetMethod } from '../utils/FuncionesGlobales'
import PuntoDeVenta2Main from './PuntoDeVenta2Main';

const PuntoDeVenta = ({ onProps }) => {
    const accessToken = onProps.accessToken
    let origin = onProps.origin
    const [SucursalId, setSucursalId] = useState(onProps.SucursalId)
    const ColaboradorId = onProps.ColaboradorId
    const User = onProps.User
    const Administrador = onProps.Administrador


    const [sucursales, setSucursales] = useState([])
    const [CodigoBarras, setCodigoBarras] = useState("")
    const [ventanaProductosDisabled, setVentanaProductosDisabled] = useState(true)
    const [ventanaDescripcion, setVentanaDescripcion] = useState("")
    const [detalles, setDetalles] = useState([])
    const [banderaHandleBuscar, setBanderaHandleBuscar] = useState(false)
    const [backgroundXtimes, setBackgroundXtimes] = useState('');
    const [FolioId, setFolioId] = useState(0)
    const [totalTicket, setTotalTicket] = useState(0.0)
    const [ventasPendientes, setVentasPendientes] = useState([])
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState("")
    const [colorShowAlert, setColorShowAlert] = useState("")
    // const porcentajePorServicio = 70


    const [Unidades, setUnidades] = useState(1)
    // const [ventanaDescripcionDetalles, setVentanaDescripcionDetalles] = useState([])
    const [detallesNotaSeleccionada, setDetallesNotaSeleccionada] = useState([])
    const [clientes, setClientes] = useState([])
    const [ClienteId, setClienteId] = useState(0)

    const codigobarrasInputRef = useRef(null);
    const ventanaDescripcionInputRef = useRef(null)

    //Si sucursal es menor que 1 o mayor que 10 entonces es 1
    if (parseInt(SucursalId, 10) < 1 || parseInt(SucursalId, 10) > 10) {
        setSucursalId(1)
    }



    useEffect(() => {
        const fetchData = async () => {
            try {
                // URLs de las APIs

                const url1 = origin + `/api/catalogos/10venta`;
                const url2 = origin + `/api/consultaventaspendientesarreglo/${SucursalId}`;
                const url3 = origin + `/api/catalogoclientes`;


                // Realizar las tres solicitudes en paralelo
                const [response1, response2, response3] = await Promise.all([
                    await fetch(url1, { headers: { Authorization: `Bearer ${accessToken}`, }, }),
                    await fetch(url2, { headers: { Authorization: `Bearer ${accessToken}`, }, }),
                    await fetch(url3, { headers: { Authorization: `Bearer ${accessToken}`, }, }),
                ]);

                // Manejo de errores si alguna solicitud falla
                if (!response1.ok) throw new Error('Error en la carga de Sucursales');
                if (!response2.ok) throw new Error('Error en la carga de Ventas Pendientes');
                if (!response3.ok) throw new Error('Error en la carga de Catálogo de Clientes');

                // Obtener los datos JSON de cada respuesta
                const [sucursales, ventasPendientes, clientes] = await Promise.all([
                    response1.json(),
                    response2.json(),
                    response3.json(),
                ]);

                // Guardar los datos en el estado
                if (Administrador === "S") { //Si es Administrador habilita todas las sucursales venta
                    setSucursales(sucursales)
                } else {
                    setSucursales(sucursales.filter(jSucursal => jSucursal.SucursalId === SucursalId));
                }
                setVentasPendientes(ventasPendientes);
                setClientes(clientes);
            } catch (error) {
                alert(error.message)
            }
        };
        fetchData();
    }, []); // Se ejecuta solo al montar el componente

    // Al ser una ventana que se pone y se quita. Uso el useEffect para que haga el focus hasta después del render.
    useEffect(() => {
        if (ventanaDescripcionInputRef.current) {
            ventanaDescripcionInputRef.current.focus()
        }

    }, [ventanaProductosDisabled])


    //Una vez que se actualiza el código de barras, corre automáticamente el handleBuscar sin necesidad de <Enter>
    useEffect(() => {
        if (banderaHandleBuscar) {
            handleBuscar()
            setBanderaHandleBuscar(false)
        }
    }, [banderaHandleBuscar])

    //Después de actualizar los detalles del ticket, se actualiza automáticamente el Total Ticket
    useEffect(() => {
        setTotalTicket(detalles.reduce((acumulador, item) => acumulador + (parseFloat(item.PrecioVentaConImpuesto) * parseInt(item.Unidades)), 0))
    }, [detalles])


    const handleCodeBarFocus = () => {
        codigobarrasInputRef.current.focus()
    }
    const handleSucursales = (vSucursalId) => {
        setSucursalId(vSucursalId)
        // codigobarrasInputRef.current.focus()
    }

    const handleClientes = (vClienteId) => {
        // codigobarrasInputRef.current.focus()
    }


    const handleUnidades = (vUnidades) => {
        setUnidades(vUnidades)
    }

    const handleVentaPendientesRecupera = async (vFolioId) => {
        setFolioId(vFolioId)
        if (detalles.length === 0) {

            //FuncionesGlobales.jsx
            const url = `${origin}/api/consultaventapendienteporfolio/${SucursalId}/${vFolioId}`
            const arregloVentaPendientePorFolio = await handleGetMethod(url, accessToken)


            if (arregloVentaPendientePorFolio.error) {
                console.log(arregloVentaPendientePorFolio.error)
                alert(arregloVentaPendientePorFolio.error)
                return
            }
            let vtotalTicket = 0;
            let arregloDetalles = [];
            let json_elemento;
            let vClienteId;
            arregloVentaPendientePorFolio.forEach((element) => {
                vClienteId = parseInt(element.ClienteId);

                vtotalTicket +=
                    parseFloat(element.PrecioVentaConImpuesto) *
                    parseInt(element.UnidadesRegistradas);

                json_elemento = {
                    SucursalId: SucursalId,
                    ClienteId: vClienteId,
                    FolioId: vFolioId,
                    SerialId: element.SerialId,
                    CodigoId: element.CodigoId,
                    CodigoBarras: element.CodigoBarras,
                    Descripcion: element.Descripcion,
                    Unidades: element.UnidadesRegistradas,
                    PrecioVentaConImpuesto: element.PrecioVentaConImpuesto,
                    Usuario: element.Usuario,
                    ColaboradorId: element.VendedorId,
                    Accion: "X",
                };
                arregloDetalles.push(json_elemento);
            });
            //###### SECCION PARA SELECCIONAR Y DESPLEGAR, ASI COMO QUITAR TEMPORALMENTE DEL ARREGLO ##############
            const detallesNotaSeleccionada = ventasPendientes.filter(
                (element) => parseInt(element.FolioId) === parseInt(vFolioId)
            );

            const detalleNotasArreglo = ventasPendientes.filter(
                (element) => parseInt(element.FolioId) !== parseInt(vFolioId)
            );
            //################## SECCION PARA FORMAR EL ARREGLO PARA DESPLEGAR ###########################

            //####################################################################

            setDetalles([...arregloDetalles])
            setTotalTicket(vtotalTicket)
            setCodigoBarras("")
            setDetallesNotaSeleccionada([...detallesNotaSeleccionada])
            setVentasPendientes([...detalleNotasArreglo])
            codigobarrasInputRef.current.focus();
        }
    };


    const handleRegistrarVentaPendientes = async () => {
        let json = {};
        if (parseInt(FolioId) === 0) {
            //Si FolioId es CERO es que no hay abierta ninguna venta en proceso
            if (detalles.length === 0) {
                codigobarrasInputRef.current.focus();
                return;
            }

            //##################### FORMA json PARA INSERTAR EN BASE DE DATOS #############################
            json = {
                SucursalId: SucursalId,
                FolioId: FolioId,
                ClienteId: ClienteId,
                CajeroId: ColaboradorId,
                VendedorId: ColaboradorId,
                Usuario: User,
                Status: "P",
                detalles: detalles,
            };
            try {
                let url = `${origin}/api/grabaventas`;
                let response = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(json),
                    headers: {
                        Authorization: `Bear ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                let data = await response.json();
                if (data.error) {
                    console.log(data.error);
                    alert(data.error);
                    return;
                }
                //############## CONSULTA VENTAS PENDIENTES EN BASES  DE DATOS  Status = 'P'#################
                url = `${origin}/api/consultaventaspendientesarreglo/${SucursalId}`;
                const arregloVentasPendientes = await handleGetMethod(url, accessToken)
                if (arregloVentasPendientes.error) {
                    console.log(arregloVentasPendientes.error)
                    alert(arregloVentasPendientes.error)
                    return
                }

                //###########################################################################################

                setCodigoBarras("")
                setDetalles([])
                setTotalTicket(0.0)
                setFolioId(0)
                setVentasPendientes(arregloVentasPendientes)


                // setColorShowAlert("yellow")
                setColorShowAlert("#ffd733")
                setMessageAlert("Venta en Proceso (PENDING!!!!): " + data.FolioId)
                setShowAlert(true);  // Mostrar la alerta
                setTimeout(() => {
                    setShowAlert(false);  // Ocultar la alerta después de 1 segundo
                }, 1000);


                codigobarrasInputRef.current.focus();
            } catch (error) {
                console.log(error.message);
                alert(error.message);
                return
            }
            //#################################################
        } else {
            //AQUI EL FOLIOID NO CAMBIO PERO SE VUELVE A GUARDAR COMO PENDIENTE.
            let arregloNotas = ventasPendientes;
            detallesNotaSeleccionada.forEach((element) => {
                arregloNotas.push(element);
            });
            const arregloNotasOrdenadas = arregloNotas.sort(
                (a, b) => parseInt(a.FolioId) - parseInt(b.FolioId)
            );
            setVentasPendientes(arregloNotasOrdenadas)
            setTotalTicket(0.0)
            setDetalles([])
            setFolioId(0)
            codigobarrasInputRef.current.focus();
        }
    };

    // handleRegistrarVenta
    const handleRegistrarVenta = async () => {
        let response = "";
        let url2 = "";
        let data = [];
        let json_enc_det = {};

        if (detalles.length === 0) {
            codigobarrasInputRef.current.focus();
            return;
        }

        if (!window.confirm("Desea Cerrar la Venta?")) { //Cancel entra a la Condición y detiene el proceso. 
            codigobarrasInputRef.current.focus();
            return;
        }

        //############ SECCION PARA HACER EL ARREGLO DE JSON ENCABEZADO Y DETALLES ##################
        let arreglo = [];
        let jsonDetalles;
        let vSerialId = 0
        detalles.map((element, i) => {
            if (FolioId === 0) {
                vSerialId = i + 1
            } else {
                vSerialId = element.SerialId
            }

            jsonDetalles = {
                SerialId: vSerialId,
                CodigoId: element.CodigoId,
                CodigoBarras: element.CodigoBarras,
                Descripcion: element.Descripcion,
                Unidades: element.Unidades,
                PrecioVentaConImpuesto: parseFloat(element.PrecioVentaConImpuesto),
                Accion: element.Accion,
            };
            arreglo.push(jsonDetalles);
        });

        json_enc_det = {
            SucursalId: SucursalId,
            FolioId: FolioId,
            ClienteId: ClienteId,
            CajeroId: ColaboradorId,
            VendedorId: ColaboradorId,
            Usuario: User,
            Status: "V",
            detalles: arreglo,
        };
        //##########################################################################################
        if (FolioId === 0) {
            //Inserta Venta con status 'V' (Cerrara) en la Base de Datos
            try {
                url2 = `${origin}/api/grabaventas`;
                response = await fetch(url2, {
                    method: "POST",
                    body: JSON.stringify(json_enc_det),
                    headers: {
                        Authorization: `Bear ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                data = await response.json();
                if (data.error) {
                    console.log(data.error);
                    alert(data.error);
                    return;
                }
            } catch (error) {
                console.log(error.message);
                alert(error.message);
                return
            }
        } else {
            //Actualiza la Venta Pendiente "P" a Venta Cerrada "V" afectando Inventario
            //Cierra Venta
            url2 = `${origin}/api/cierraventa`;
            try {
                response = await fetch(url2, {
                    method: "PUT",
                    body: JSON.stringify(json_enc_det),
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                data = await response.json();
                if (data.error) {
                    console.log(data.error);
                    alert(data.error);
                    return;
                }
            } catch (error) {
                console.log(error.message);
                alert(error.message);
                return;
            }
        }


        setColorShowAlert("#d4edda")
        setMessageAlert("Venta Registrada: " + data.FolioId)
        setShowAlert(true);  // Mostrar la alerta
        setTimeout(() => {
            setShowAlert(false);  // Ocultar la alerta después de 1 segundo
        }, 1000);



        setCodigoBarras("")
        setDetalles([])
        setTotalTicket(0.0)
        setFolioId(0)
        codigobarrasInputRef.current.focus();
    };

    // const handleUnidadesXTimes = (operacion) => {
    //     if (operacion === "suma") {
    //         setUnidades(Unidades + 1)
    //     }
    //     if (operacion === "resta" && Unidades > 1) {
    //         setUnidades(Unidades - 1)
    //     }
    //     codigobarrasInputRef.current.focus();
    // }


    const handleCancelar = async () => {
        if (detalles.length === 0) {
            codigobarrasInputRef.current.focus();
            if (CodigoBarras) {
                setCodigoBarras("")
            }
            return;
        }

        if (window.confirm("Desea Cancelar la Venta?")) {
        } else {
            return;
        }

        if (parseInt(FolioId) > 0) {
            //Hay una VENTA PENDIENTE en DB y se va cancelar Status="C"
            //Cancela Nota Abierta
            const url2 = origin + `/api/cancelaventapendiente`;

            const json = {
                SucursalId: SucursalId,
                FolioId: FolioId,
                ColaboradorId: ColaboradorId,
                Usuario: User,
            };

            try {
                const response = await fetch(url2, {
                    method: "POST",
                    body: JSON.stringify(json),
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                if (data.error) {
                    alert(data.error);
                    return;
                }

                setColorShowAlert("red")
                setMessageAlert("Venta Cancelada: " + FolioId)
                setShowAlert(true);  // Mostrar la alerta
                setTimeout(() => {
                    setShowAlert(false);  // Ocultar la alerta después de 1 segundo
                }, 1000);


            } catch (error) {
                console.log(error.message);
                alert(error.message);
                return
            }
        }

        setCodigoBarras("")
        setTotalTicket(0.0)
        setDetalles([])
        setFolioId(0)
        codigobarrasInputRef.current.focus();
    };

    const handleEliminar = async (i) => {
        let arregloDetalles = [...detalles]
        const SerialId = parseInt(i) + 1;

        if (FolioId !== 0) {
            //Si hay una NOTA abierta pone el registro con "Status"='C' en la base de datos.

            const CodigoId = arregloDetalles[i].CodigoId

            const json = {
                SucursalId: SucursalId,
                FolioId: FolioId,
                CodigoId: CodigoId,
                SerialId: SerialId,
                Usuario: User,
                ColaboradorId: ColaboradorId,
            };
            const url = `${origin}/api/eliminaregistroventapendiente`;

            try {
                const response = await fetch(url, {
                    method: "PUT",
                    body: JSON.stringify(json),
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                if (data.error) {
                    console.log(data.error);
                    alert(data.error);
                    return;
                }
            } catch (error) {
                console.log(error.message);
                alert(error.message);
                return;
            }
        }

        //Elimina el registro "Cancelado" en el arreglo Memoria RAM para ya no desplegarlo en Pantalla.

        const detallesTmp = [...detalles]
        detallesTmp.splice(i, 1); //Borra el json dentro del arreglo en la posición i
        setDetalles(detallesTmp)

        let vtotalTicket = 0;
        for (let ii = 0; ii < detallesTmp.length; ii++) {
            vtotalTicket +=
                parseFloat(detallesTmp[ii].PrecioVentaConImpuesto) *
                parseInt(detallesTmp[ii].Unidades);
        }

        setCodigoBarras("")
        setTotalTicket(vtotalTicket)
        setFolioId(0)


        if (codigobarrasInputRef.current) {
            codigobarrasInputRef.current.focus();
        }
    }

    // const handlerRowClicked = (i) => {
    //     const codigoBarras = ventanaDescripcionDetalles[i].CodigoBarras
    //     setCodigoBarras(codigoBarras)
    //     setBanderaHandleBuscar(true) //Manda llamar hook useEffect para correr handleBuscar()
    //     setVentanaProductosDisabled(true)
    //     setVentanaDescripcion("")
    //     setVentanaDescripcionDetalles([])

    // }

    // const getProductosDescripcion = async (descripcion) => {
    //     const url = `${origin}/api/productosdescripcion/${descripcion}/${SucursalId}`;
    //     try {
    //         const response = await fetch(url, {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //         });
    //         const data = await response.json();

    //         return data;

    //     } catch (error) {
    //         console.log(error.message)
    //         alert(error.message)
    //         return { error: error.message }
    //     }
    // }


    // const handleVentanaDescripcion = async (e) => {
    //     // e.preventDefault()
    //     const descripcion = e.target.value.toUpperCase()
    //     setVentanaDescripcion(descripcion)

    //     if (descripcion === "" || descripcion.length < 3) {
    //         setVentanaDescripcionDetalles([])
    //         return
    //     }

    //     try {
    //         const arreglo_prod_desc = await getProductosDescripcion(descripcion)
    //         if (arreglo_prod_desc.error) {
    //             console.log(arreglo_prod_desc.error)
    //             alert(arreglo_prod_desc.error)
    //             return
    //         }
    //         setVentanaDescripcionDetalles(arreglo_prod_desc)

    //     } catch (error) {
    //         console.error("Error al obtener la descripción de los productos: ", error)
    //     }
    // }

    // const handleVentanaDescripcionKeyDown = (e) => {
    //     if (e.key === "Enter" && ventanaDescripcion === "") {
    //         // e.preventDefault()
    //         setVentanaProductosDisabled(!ventanaProductosDisabled)
    //         codigobarrasInputRef.current.focus();
    //     }
    // };

    const handleCodigoBarras = (vCodigoBarras) => {
        setCodigoBarras(vCodigoBarras)
    }

    // const handleCodigoBarrasKeyDown = (e) => {
    //     if (e.key === "Enter") {
    //         // e.preventDefault()
    //         handleBuscar();
    //     }
    // };

    const handleDetalles = (vArreglo) => {
        setDetalles([...detalles, vArreglo[0]])
    }


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
            setCodigoBarras(vCodigoBs)
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
                setCodigoBarras("")
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
                    setCodigoBarras("")
                    alert("El ticket no incluye Lavadas/Secadas para Servicio por Encargo")
                    codigobarrasInputRef.current.focus()
                    return
                }

            }
            //########################################################################################

            nuevoArreglo[0].Unidades = vUnidades;
            nuevoArreglo[0].CodigoBarras = vCodigoBarras
            nuevoArreglo[0].Accion = "?"
            setDetalles([...detalles, nuevoArreglo[0]])
            setCodigoBarras("")
            setUnidades(1)
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


    // const numberWithCommas = (x) => {
    //     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // }


    const handleRender = () => {
        return (
            <>
                <div className="puntodeventa-container">

                    <div className="header">
                        <PuntoDeVenta1Header sucursales={sucursales} SucursalId={SucursalId} onhandleSucursales={handleSucursales} clientes={clientes} ClienteId={ClienteId} onhandleClientes={handleClientes} Unidades={Unidades} onUnidades={handleUnidades} CodigoBarras={CodigoBarras} onCodigoBarras={handleCodigoBarras} detalles={detalles} onDetalles={handleDetalles} origin={origin} accessToken={accessToken} codigobarrasInputRef={codigobarrasInputRef} ventanaDescripcionInputRef={ventanaDescripcionInputRef} />
                    </div>
                    <div className="main">
                        <PuntoDeVenta2Main detalles={detalles} onhandleEliminar={handleEliminar} showAlert={showAlert} colorShowAlert={colorShowAlert} messageAlert={messageAlert} FolioId={FolioId} />
                    </div>
                    <div className="notes">
                        <PuntoDeVenta3NotasP ventasPendientes={ventasPendientes} FolioId={FolioId} setFolioId={setFolioId} onhandleVentasPendientesRecupera={handleVentaPendientesRecupera} />
                    </div>
                    <div className="footer">
                        <PuntoDeVenta4Footer onTotalTicket={totalTicket} onhandleRegistrarVenta={handleRegistrarVenta}
                            onhandleRegistrarVentaPendientes={handleRegistrarVentaPendientes}
                            onhandleCancelar={handleCancelar} onhandleCodBarFocus={handleCodeBarFocus}
                        />
                    </div>
                </div>

            </>
        );
    };


    return (
        sucursales.length ? handleRender() : <h3>Loading...</h3>
    )

}


export default PuntoDeVenta;
