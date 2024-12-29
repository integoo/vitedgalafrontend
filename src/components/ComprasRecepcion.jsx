import React, { useState, useEffect, useRef } from 'react'

import "./ComprasRecepcion.css";
import InputCodigoBarras from './utils/InputCodigoBarras'

const ComprasRecepcion = ({ onProps }) => {
    const origin = onProps.origin
    const accessToken = onProps.accessToken
    const Administrador = onProps.Administrador
    const User = onProps.User


    const [detalles, setDetalles] = useState([])
    const [sucursales, setSucursales] = useState([])
    const [SucursalId, setSucursalId] = useState(99)
    const [proveedores, setProveedores] = useState([])
    const [ProveedorId, setProveedorId] = useState(1)
    const [IVAProveedor, setIVAProveedor] = useState("")
    const [IVA, setIVA] = useState("")
    const [IVACompra, setIVACompra] = useState("")
    const [NumeroFactura, setNumeroFactura] = useState("")
    const [TotalFactura, setTotalFactura] = useState(0.00)
    const [CodigoId, setCodigoId] = useState("")
    const [UnidadesInventario, setUnidadesInventario] = useState("")
    const [IVADescripcion, setIVADescripcion] = useState("")
    const [IVAMonto, setIVAMonto] = useState(0.0)
    const [extIVAMonto, setExtIVAMonto] = useState(0.0)
    const [IEPSId, setIEPSId] = useState(0)
    const [IEPSDescripcion, setIEPSDescripcion] = useState("")
    const [IEPS, setIEPS] = useState(0)
    const [IEPSMonto, setIEPSMonto] = useState(0.0)
    const [extIEPSMonto, setExtIEPSMonto] = useState(0.0)
    const [CodigoBarras, setCodigoBarras] = useState("")
    const [Descripcion, setDescripcion] = useState("")
    const [Unidades, setUnidades] = useState("")
    const [CostoCompra, setCostoCompra] = useState("")
    const [extCostoCompraSinImpuestos, setExtCostoCompraSinImpuestos] = useState(0.0)
    const [extCostoCompra, setExtCostoCompra] = useState(0.0)
    const [socios, setSocios] = useState([])
    const [SocioId, setSocioId] = useState("")
    const [SoloInventariable, setSoloInventariable] = useState('S')

    const unidadesInputRef = useRef();
    const costoCompraInputRef = useRef();
    const CodigoBarrasInputRef = useRef();
    const facturaInputRef = useRef();


    useEffect(() => {
        async function fetchData() {
            const arregloSucursales = await getSucursales();
            if (arregloSucursales.error) {
                alert(arregloSucursales.error);
                return;
            }

            const arregloProveedores = await getProveedores();
            if (arregloProveedores.error) {
                alert(arregloProveedores.error);
                return;
            }

            const arregloSocios = await getSocios();
            if (arregloSocios.error) {
                alert(arregloSocios.error);
                return;
            }

            setSucursales(arregloSucursales)
            setProveedores(arregloProveedores)
            setIVAProveedor(arregloProveedores[0].IVA)
            setSocios(arregloSocios)
            setSocioId(arregloSocios[0].SocioId)
            //Esto es para que cuando se consulte Codigos de Barra despliegue el inventario
            //de SucursalId = 99
            //   CodigoBarrasInputRef.current.handleRefSucursalId(SucursalId)
        }
        fetchData()
    }, [])





    const getSucursales = async () => {
        const url = origin + `/api/catalogos/10fisicasycedis`;
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            let data = await response.json();
            const vSucursalAsignada = parseInt(sessionStorage.getItem('SucursalId'))
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

    const getProveedores = async () => {
        const url = origin + `/api/catalogos/11`;
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            let data = await response.json();
            if (data.length === 0) {
                data = { error: "Error en Proveedores" };
            }
            return data;
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    }

    const getSocios = async () => {
        const url = origin + `/api/catalogos/12`;
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            let data = await response.json();
            if (data.length === 0) {
                data = { error: "Error en Socios" };
            }
            return data;
        } catch (error) {
            console.log(error.message)
            alert(error.message)
        }
    }

    const getProducto = async (id) => {
        const url = origin + `/api/productodescripcion/${id}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        let data = await response.json();
        if (data.length === 0) {
            data = { error: "Producto No Existe" };
        }
        return data;
    }

    const handleSucursales = (e) => {
        const vSucursalId = e.target.value;
        setSucursalId(vSucursalId)
        CodigoBarrasInputRef.current.handleRefSucursalId(vSucursalId)
    };

    const handleProveedores = (e) => {
        const vProveedorId = e.target.value;
        const arregloProveedores = [...proveedores]
        const IVAProveedor = arregloProveedores.find(element => element.ProveedorId === parseInt(vProveedorId))

        setProveedorId(vProveedorId)
        setIVAProveedor(IVAProveedor.IVA)
        facturaInputRef.current.focus();
    };

    const handleFactura = (e) => {
        const vNumeroFactura = e.target.value;
        setNumeroFactura(vNumeroFactura.toUpperCase())
    };

    const handleTotalFactura = (e) => {
        const vTotalFactura = e.target.value;
        if (vTotalFactura > 9999999999) {
            alert("Error: El Dato de Total Factura está fuera de Rango")
            return
        }
        setTotalFactura(vTotalFactura)
    };

    const handleSocios = (e) => {
        const vSocioId = e.target.value;
        setSocioId(vSocioId)
    }

    const handleCodigoBarras = (e) => {
        const vCodigoBarras = e.target.value.toUpperCase();
        setCodigoBarras(vCodigoBarras)
    };

    const handleCodigoBarrasEnter = (e) => {
        if (e.key === "Enter") {
            if (CodigoBarras !== "") {
                handleConsultar(e);
            } else {
                alert("Código de Barras Inválido");
                return;
            }
        }
    };

    const handleConsultar = async (vCodigoBarras) => {
        let arreglo = [];
        if (vCodigoBarras !== "") {
            arreglo = await getProducto(vCodigoBarras);
        } else {
            alert("Código de Barras Inválido");
            return;
        }
        if (arreglo.error) {
            alert(arreglo.error);
            return;
        }
        if (arreglo[0].CompraVenta === 'V') {
            alert("Producto es solo para VENTA")
            setCodigoId("")
            setCodigoBarras("")
            setDescripcion: ("")
            setUnidades("")
            setCostoCompra("")
            setIVADescripcion("")
            setIEPSDescripcion("")

            document.querySelector("#codigobarras").disabled = false;
            CodigoBarrasInputRef.current.handleRefCodigoBarrasInput()
            return
        }

        const detallesAux = detalles;
        //Valida si ya existe el producto en el proceso de recepción
        let vposicion = -1;
        for (let i = 0; i < detallesAux.length; i++) {
            if (detallesAux[i].CodigoId === arreglo[0].CodigoId) {
                vposicion = i;
                continue;
            }
        }

        if (vposicion !== -1) {
            if (
                window.confirm(
                    "El Producto ya existe en en el Proceso de Recepción. Deseas Modificarlo?"
                )
            ) {
                setCodigoId(detallesAux[vposicion].CodigoId)
                setDescripcion(detallesAux[vposicion].Descripcion)
                setIVADescripcion(detallesAux[vposicion].IVADescripcion)
                setIEPSId(detallesAux[vposicion].IEPSId)
                setIEPSDescripcion(detallesAux[vposicion].IEPSDescripcion)
                setIEPS(detallesAux[vposicion].IEPS)
                setUnidades(detallesAux[vposicion].UnidadesRecibidas)
                setCostoCompra(detallesAux[vposicion].CostoCompra)
            } else {
                setCodigoId("")
                setCodigoBarras("")
                setDescripcion: "",
                    setUnidadesInventario("")
                setIVADescripcion("")
                setIEPSDescripcion("")
            }
            CodigoBarrasInputRef.current.handleRefCodigoBarrasInput()
            return;

        } else {
            let vIVA = 0
            let vIVADescripcion = ""
            let vIVAMonto = 0
            if (arreglo[0].IVACompra === 'S') {
                if (arreglo[0].IVAId <= 2) {
                    vIVA = arreglo[0].IVA
                    vIVADescripcion = arreglo[0].IVADescripcion
                } else {
                    vIVADescripcion = "IVA " + IVAProveedor + "%"
                    vIVA = IVAProveedor
                }
                vIVAMonto = parseFloat(arreglo[0].CostoCompra) * parseFloat(vIVA) / 100
            } else {
                vIVADescripcion = "NO IVA COMPRA"
                vIVA = 0
                vIVAMonto = 0
            }
            setCodigoId(arreglo[0].CodigoId)
            setDescripcion(arreglo[0].Descripcion)
            setIVA(vIVA)
            setIVADescripcion(vIVADescripcion)
            setIVAMonto(vIVAMonto)
            setIEPSId(arreglo[0].IEPSId)
            setIEPSDescripcion(arreglo[0].IEPSDescripcion)
            setIEPS(arreglo[0].IEPS)
            setIVACompra(arreglo[0].IVACompra)
        }

        document.querySelector("#codigobarras").disabled = true;
        unidadesInputRef.current.focus();
    };

    const handleAgregarCancelar = (e) => {
        e.preventDefault();
        setCodigoId("")
        setCodigoBarras("")
        setDescripcion: "",
            setUnidadesInventario("")
        setUnidades("")
        setCostoCompra("")
        setIVADescripcion("")
        setIEPSDescripcion("")
        document.querySelector("#codigobarras").disabled = false;
        CodigoBarrasInputRef.current.handleRefCodigoBarrasInput()
    };

    const handleUnidades = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === "" || re.test(e.target.value)) {
            const vUnidades = e.target.value;
            if (vUnidades < 0) {
                alert("No se permite recibir Unidades NEGATIVAS");
                return;
            }
            setUnidades(vUnidades)
        }
    };

    const handleUnidadesEnter = (e) => {
        if (e.key === "Enter") {
            if (e.target.value === "") return;

            costoCompraInputRef.current.focus();
        }
    };

    const handleCostoCompra = (e) => {
        const vCostoCompra = e.target.value;
        if (vCostoCompra < 0) {
            alert("No se permite registrar Costo Compra NEGATIVO");
            return;
        }
        setCostoCompra(vCostoCompra)
    };

    const handleCostoCompraEnter = (e) => {
        if (e.key === 'Enter') {
            if (e.target.value === "") {
                return
            } else {
                handleAgregar()
            }
        }
    }

    const handleAgregar = (e) => {
        if (TotalFactura === "") {
            alert("Total Factura debe ser Número")
            return
        }
        if (
            CodigoId === "" || parseInt(CodigoId) === 0 ||
            CodigoBarras === "" ||
            Descripcion === "" ||
            Unidades === "" ||
            CostoCompra === "" ||
            CostoCompra < 0.10
        ) {
            alert("Error en Dato. Revise los campos de la Forma");
            return;
        }
        let detallesAux = [...detalles]

        //Valida si ya existe el producto en el proceso de recepción
        let vposicion = -1;
        for (let i = 0; i < detallesAux.length; i++) {
            if (detallesAux[i].CodigoBarras === CodigoBarras) {
                vposicion = i;
                continue;
            }
        }

        const vCostoCompraSinImpuestos =
            CostoCompra /
            (1 + (parseFloat(IVA) + parseFloat(IEPS)) / 100);
        const vIVAMonto =
            (vCostoCompraSinImpuestos * parseFloat(IVA)) / 100;
        const vIEPSMonto =
            (vCostoCompraSinImpuestos * parseFloat(IEPS)) / 100;

        if (vposicion === -1) {
            const json = {
                CodigoId: CodigoId,
                CodigoBarras: CodigoBarras,
                Descripcion: Descripcion,
                UnidadesRecibidas: parseInt(Unidades),
                CostoCompra: parseFloat(CostoCompra),
                CostoCompraSinImpuestos: parseFloat(vCostoCompraSinImpuestos),
                IVADescripcion: IVADescripcion,
                IEPSDescripcion: IEPSDescripcion,
                IVA: parseFloat(IVA),
                IVAMonto: vIVAMonto,
                IEPSId: IEPSId,
                IEPS: parseFloat(IEPS),
                IEPSMonto: vIEPSMonto,
            };

            detallesAux.push(json);
        } else {
            detallesAux[vposicion].UnidadesRecibidas = Unidades;
            detallesAux[vposicion].CostoCompra = CostoCompra;
            detallesAux[vposicion].CostoCompraSinImpuestos = vCostoCompraSinImpuestos;
            detallesAux[vposicion].IVAMonto = vIVAMonto;
            detallesAux[vposicion].IEPSMonto = vIEPSMonto;
        }

        setDetalles(detallesAux)
        let extCostoCompra = 0;
        let extIVAMonto = 0;
        let extIEPSMonto = 0;
        detallesAux.map((element, i) => {
            extCostoCompra +=
                parseInt(element.UnidadesRecibidas) * parseFloat(element.CostoCompra);
            extIVAMonto +=
                parseInt(element.UnidadesRecibidas) * parseFloat(element.IVAMonto);
            extIEPSMonto +=
                parseInt(element.UnidadesRecibidas) * parseFloat(element.IEPSMonto);
            return null
        });

        document.querySelector("#sucursales").disabled = true;
        document.querySelector("#proveedores").disabled = true;
        document.querySelector("#IVAProveedor").disabled = true;
        document.querySelector("#factura").disabled = true;
        document.querySelector("#totalfactura").disabled = true;
        document.querySelector("#socios").disabled = true;
        setCodigoId("")
        setCodigoBarras("")
        setDescripcion("")
        setUnidades("")
        setUnidadesInventario("")
        setCostoCompra("")
        setExtCostoCompraSinImpuestos(extCostoCompra - extIVAMonto - extIEPSMonto)
        setExtIVAMonto(extIVAMonto)
        setExtIEPSMonto(extIEPSMonto)
        setExtCostoCompra(extCostoCompra)
        setIVADescripcion("")
        setIEPSDescripcion("")

        document.querySelector("#codigobarras").disabled = false;

        CodigoBarrasInputRef.current.handleRefCodigoBarrasInput()
    };

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const onhandleCodigoBarras = (vCodigoBarras) => {
        setCodigoBarras(vCodigoBarras)
        setDescripcion("")
    }

    const onhandleConsulta = (CodigoBarras, Descripcion, UnidadesInventario) => {
        //alert("Aqui tenemos que adecuar las funcionalidades de handleConsultar")
        setCodigoBarras(CodigoBarras)
        setDescripcion(Descripcion)
        setUnidadesInventario(UnidadesInventario)
        handleConsultar(CodigoBarras)
        unidadesInputRef.current.focus()
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleGrabar = async () => {
        if (detalles.length === 0) {
            alert("No hay Productos Recibidos")
            return
        }

        let json = {
            SucursalId: SucursalId,
            ProveedorId: ProveedorId,
            IVAProveedor: IVAProveedor,  //Junio 8 2021
            NumeroFactura: NumeroFactura,
            TotalFactura: TotalFactura,
            SocioId: SocioId,
            Usuario: User,
            detalles: detalles
        }

        if (window.confirm("Desea Recibir la Orden de Compra en Sucursal " + SucursalId + "?")) {
            try {
                const url = origin + `/api/grabarecepcionordencompra`
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
                alert(JSON.stringify(data))
                setNumeroFactura("")
                setTotalFactura(0.00)
                setCodigoBarras("")
                setDescripcion("")
                setUnidades("")
                setCostoCompra("")
                setDetalles([])
                setExtCostoCompraSinImpuestos(0.0)
                setExtIVAMonto(0.0)
                setExtIEPSMonto(0.0)
                setExtCostoCompra(0.0)
                document.querySelector("#sucursales").disabled = false
                document.querySelector("#proveedores").disabled = false
                document.querySelector("#factura").disabled = false
                document.querySelector("#totalfactura").disabled = false
                document.querySelector("#socios").disabled = false

            } catch (error) {
                console.log(error.message)
                alert(error.message)
            }
        }

    }

    const handleCancelar = () => {
        setDetalles([])
        setSucursalId(1)
        // setUnidadDeNegocioId(1)
        setProveedorId(1)
        setNumeroFactura("")
        setTotalFactura(0)
        setCodigoId("")
        setUnidadesInventario("")
        setIVAMonto(0.0)
        setExtIVAMonto(0.0)
        setIEPSId(0)
        setIEPSDescripcion("")
        setIEPS(0)
        setIEPSMonto(0.0)
        setExtIEPSMonto(0.0)
        setCodigoBarras("")
        setDescripcion("")
        setUnidades("")
        setCostoCompra("")
        setExtCostoCompraSinImpuestos(0.0)
        setExtCostoCompra(0.0)
        document.querySelector("#sucursales").disabled = false;
        document.querySelector("#proveedores").disabled = false;
        document.querySelector("#factura").disabled = false;
        document.querySelector("#totalfactura").disabled = false;
        document.querySelector("#socios").disabled = false;

        CodigoBarrasInputRef.current.handleRefCodigoBarrasInput()
    }




    const handleRender = () => {
        return (
            <div className="container container-comprasRecepcion">
                <form onSubmit={handleSubmit} className="one">
                    <div className="parent">
                        <div className="child01">
                            <span className="badge badge-success">
                                <h3>Compras Recepcion</h3>
                            </span>
                            <br />
                            <br />

                            <label htmlFor="sucursales">Sucursales</label>
                            <select
                                onChange={handleSucursales}
                                id="sucursales"
                                name="sucursales"
                                value={SucursalId}
                            >
                                {sucursales.map((element, i) => (
                                    <option key={i} value={element.SucursalId}>
                                        {element.Sucursal}
                                    </option>
                                ))}
                            </select>
                            <br />

                            <label htmlFor="proveedores">Proveedores</label>
                            <select
                                onChange={handleProveedores}
                                id="proveedores"
                                name="proveedores"
                                value={ProveedorId}
                            >
                                {proveedores.map((element, i) => (
                                    <option key={i} value={element.ProveedorId}>
                                        {element.Proveedor}
                                    </option>
                                ))}
                            </select>

                            <label id="labelivaproveedor">IVA</label>
                            <input
                                id="IVAProveedor"
                                name="IVAProveedor"
                                value={IVAProveedor + "%"}
                                //   disabled
                                readOnly
                            />
                            <br />
                            <label htmlFor="factura">Factura</label>
                            <input
                                onChange={handleFactura}
                                id="factura"
                                name="factura"
                                autoComplete="off"
                                style={{ textTransform: "uppercase" }}
                                value={NumeroFactura}
                                ref={facturaInputRef}
                                required
                            />
                            <br />

                            <label htmlFor="totalfactura">Total Factura</label>
                            <input
                                onChange={handleTotalFactura}
                                id="totalfactura"
                                name="totalfactura"
                                type="number"
                                step="0.01"
                                value={TotalFactura}
                                required
                            />
                            <br />

                            <label>Pago (Socios) </label>
                            <select
                                onChange={handleSocios}
                                id="socios"
                                name="socios"
                                value={SocioId}
                                disabled
                            >
                                {socios.map((element, i) => (
                                    <option key={i} value={element.SocioId}>
                                        {element.Socio}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <br />


                        <div className="child02">


                            <InputCodigoBarras
                                accessToken={accessToken}
                                url={origin}
                                handleCodigoBarrasProp={onhandleCodigoBarras}
                                handleConsultaProp={onhandleConsulta}
                                CodigoBarrasProp={CodigoBarras}
                                SoloInventariable={SoloInventariable}
                                ref={CodigoBarrasInputRef}
                                SucursalId={SucursalId}
                            />

                            <span style={{ marginRight: "10px" }}>Código</span>
                            <input
                                value={CodigoId}
                                style={{ width: "4rem" }}
                                disabled={true}
                                readOnly
                            />
                            <span style={{ margin: "0 10px 0 30px" }}>Unidades Inventario</span>
                            <input
                                value={UnidadesInventario}
                                style={{ width: "4rem" }}
                                disabled={true}
                                readOnly
                            />

                            <br />
                            <input
                                id="iva"
                                name="iva"
                                value={IVADescripcion}
                                readOnly
                            />
                            <input
                                id="ieps"
                                name="ieps"
                                value={IEPSDescripcion}
                                className="ml-2"
                                readOnly
                            />
                            <br />
                            <span>Descripción</span>
                            <br />
                            <input
                                className="descripcion"
                                name="descripcion"
                                value={Descripcion}
                                readOnly
                            />
                            <br />
                            <label style={{ width: "110px" }}>Proveedor Actual</label>
                            <input />
                            <label style={{ width: "130px" }}>Costo Compra Actual</label>
                            <input />
                            <br />
                            <label style={{ width: "110px" }}>Margen Actual</label>
                            <input />
                            <label style={{ width: "130px" }}>Margen Nuevo</label>
                            <input />
                            <br />
                            <br />
                            <span>Unidades</span>
                            <span style={{ marginLeft: "80px" }}>Costo Compra Unitario C/Impuesto</span>
                            <br />
                            <input
                                onChange={handleUnidades}
                                onKeyDown={handleUnidadesEnter}
                                type="number"
                                id="unidades"
                                name="unidades"
                                size="15"
                                autoComplete="off"
                                value={Unidades}
                                ref={unidadesInputRef}
                            />
                            <input
                                onChange={handleCostoCompra}
                                onKeyDown={handleCostoCompraEnter}
                                type="number"
                                step="0.01"
                                id="costocompra"
                                name="costocompra"
                                size="15"
                                style={{ marginLeft: ".5rem" }}
                                autoComplete="off"
                                value={CostoCompra}
                                ref={costoCompraInputRef}
                            />
                            <button
                                type="button"
                                onClick={handleAgregar}
                                className="btn btn-success btn-sm ml-1"
                            >
                                Agregar
                            </button>
                            <button
                                type="button"
                                onClick={handleAgregarCancelar}
                                className="btn btn-danger btn-sm ml-1"
                            >
                                Cancelar
                            </button>
                        </div>

                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Código Barras</th>
                                <th>Descripcion</th>
                                <th>Unidades Recibidas</th>
                                <th>Costo Compra</th>
                                <th>Ext Costo Compra</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalles.map((element, i) => (
                                <tr key={i}>
                                    <td>{element.CodigoId}</td>
                                    <td>{element.CodigoBarras}</td>
                                    <td>{element.Descripcion}</td>
                                    <td style={{ textAlign: "right" }}>
                                        {element.UnidadesRecibidas}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        ${" "}
                                        {numberWithCommas(
                                            parseFloat(element.CostoCompra).toFixed(2)
                                        )}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        ${" "}
                                        {numberWithCommas(
                                            parseFloat(
                                                element.CostoCompra *
                                                parseInt(element.UnidadesRecibidas)
                                            ).toFixed(2)
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <label htmlFor="" style={{ marginLeft: "2rem" }}>
                        Ext Costo Compra Sin Impuestos
                    </label>
                    <label htmlFor="" style={{ marginLeft: "3rem" }}>
                        Ext IEPS
                    </label>
                    <label htmlFor="" style={{ marginLeft: "2rem" }}>
                        Ext IVA
                    </label>
                    <label htmlFor="" style={{ marginLeft: "2rem" }}>
                        Ext Costo Compra
                    </label>
                    <br />
                    <input
                        id="extCostoCompraSinImpuestos"
                        name="extCostoCompraSinImpuestos"
                        style={{ textAlign: "right", marginRight: "10px" }}
                        value={
                            "$ " +
                            numberWithCommas(
                                extCostoCompraSinImpuestos.toFixed(2)
                            )
                        }
                        readOnly
                    />
                    <input
                        id="extIEPSMonto"
                        name="extIEPSMonto"
                        style={{ textAlign: "right", marginRight: "10px" }}
                        value={"$ " + extIEPSMonto.toFixed(2)}
                        readOnly
                    />
                    <input
                        id="extIVAMonto"
                        name="extIVAMonto"
                        style={{ textAlign: "right", marginRight: "10px" }}
                        value={"$ " + extIVAMonto.toFixed(2)}
                        readOnly
                    />
                    <input
                        id="extCostoCompra"
                        name="extCostoCompra"
                        style={{ textAlign: "right" }}
                        value={
                            "$ " +
                            numberWithCommas(extCostoCompra.toFixed(2))
                        }
                        readOnly
                    />
                    <br />
                    <button
                        type="button"
                        onClick={handleGrabar}
                        className="btn btn-success btn-lg m-2"
                    >
                        Grabar
                    </button>
                    <button
                        type="reset"
                        className="btn btn-danger btn-lg"
                        onClick={handleCancelar}
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        );
    };




    return (
        <div>
            {socios.length > 0 ? handleRender() : <h3 style={{ margin: "5px 20px" }}>Loading . . .</h3>}
        </div>
    )
}


export default ComprasRecepcion;
