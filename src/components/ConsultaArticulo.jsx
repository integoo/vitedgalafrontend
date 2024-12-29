import React, { useState, useRef } from 'react'

import "./ConsultaArticulo.css";
import SelectSucursales from "./utils/SelectSucursales";
import InputCodigoBarras from "./utils/InputCodigoBarras";

const ConsultaArticulo = ({ onProps }) => {
    const origin = onProps.origin
    const accessToken = onProps.accessToken
    const Administrador = onProps.Administrador


    const [SucursalId, setSucursalId] = useState(onProps.SucursalId)
    const [CodigoBarras, setCodigoBarras] = useState("")
    const [CodigoBarrasDisplay, setCodigoBarrasDisplay] = useState("")
    const [Descripcion, setDescripcion] = useState("")
    const [CodigoId, setCodigoId] = useState("")
    const [Categoria, setCategoria] = useState("")
    const [Subcategoria, setSubcategoria] = useState("")
    const [IVADescripcion, setIVADescripcion] = useState("")
    const [IVACompraProductos, setIVACompraProductos] = useState("")
    const [IEPSIdProductos, setIEPSIdProductos] = useState("")
    const [PadreHijo, setPadreHijo] = useState("")
    const [Hermano, setHermano] = useState("")
    const [Inventariable, setInventariable] = useState("")
    const [CompraVenta, setCompraVenta] = useState("")
    const [ComisionVentaPorcentaje, setComisionVentaPorcentaje] = useState("")
    const [StatusProductos, setStatusProductos] = useState("")
    const [FechaHoraProductos, setFechaHoraProductos] = useState("")
    const [UsuarioProductos, setUsuarioProductos] = useState("")
    const [UnidadesInventario, setUnidadesInventario] = useState("")
    const [UnidadesTransito, setUnidadesTransito] = useState("")
    const [UnidadesComprometidas, setUnidadesComprometidas] = useState("")
    const [CostoCompra, setCostoCompra] = useState("")
    const [CostoPromedio, setCostoPromedio] = useState("")
    const [Margen, setMargen] = useState("")
    const [MargenReal, setMargenReal] = useState("")
    const [PrecioVentaSinImpuesto, setPrecioVentaSinImpuesto] = useState("")
    const [IVAIdInventario, setIVAIdInventario] = useState("")
    const [IVAInventario, setIVAInventario] = useState("")
    const [IVAMontoInventario, setIVAMontoInventario] = useState("")
    const [IEPSIdInventario, setIEPSIdInventario] = useState("")
    const [IEPSInventario, setIEPSInventario] = useState("")
    const [IEPSMontoInventario, setIEPSMontoInventario] = useState("")
    const [PrecioVentaConImpuesto, setPrecioVentaConImpuesto] = useState("")
    const [Maximo, setMaximo] = useState("")
    const [Minimo, setMinimo] = useState("")
    const [FechaCambioPrecio, setFechaCambioPrecio] = useState("")
    const [FechaUltimaVenta, setFechaUltimaVenta] = useState("")
    const [FechaUltimaCompra, setFechaUltimaCompra] = useState("")
    const [FechaUltimoTraspasoSalida, setFechaUltimoTraspasoSalida] = useState("")
    const [FechaUltimoTraspasoEntrada, setFechaUltimoTraspasoEntrada] = useState("")
    const [FechaUltimoAjuste, setFechaUltimoAjuste] = useState("")
    const [StatusInventario, setStatusInventario] = useState("")
    const [FechaHoraInventario, setFechaHoraInventario] = useState("")
    const [UsuarioInventario, setUsuarioInventario] = useState("")
    const [detallesInventarios, setDetallesInventarios] = useState([])

    const SoloInventariable = "S"

    const CodigoBarrasInputRef = useRef();


    const handleSucursal = (vSucursalId) => {
        setSucursalId(vSucursalId)
        onhandleCancel()
        CodigoBarrasInputRef.current.handleRefSucursalId(vSucursalId)
        CodigoBarrasInputRef.current.handleRefCodigoBarrasInput()
    };

    const onhandleCodigoBarras = (vCodigoBarras) => {
        setCodigoBarras(vCodigoBarras)
        setDescripcion("")
        setUnidadesInventario("")
        if (CodigoBarrasDisplay) {
            onhandleCancel()
        }
    };

    const onhandleConsulta = async (vCodigoBarras, vDescripcion, vUnidadesInventario, vUnidadesDisponibles, vCodigoId) => {
        const detalles = await handleProductosInventarioPerpetuo(SucursalId, vCodigoId)
        setCodigoBarras(vCodigoBarras)
        setCodigoBarrasDisplay(vCodigoBarras)
        setDescripcion(vDescripcion)
        setCodigoId(vCodigoId)
        setCategoria(detalles[0].Categoria)
        setSubcategoria(detalles[0].Subcategoria)
        setIVADescripcion(detalles[0].IVADescripcion)
        setIVACompraProductos(detalles[0].IVACompraProductos)
        setIEPSIdProductos(detalles[0].IEPSIdProductos)
        setPadreHijo(detalles[0].PadreHijo)
        setHermano(detalles[0].Hermano)
        setInventariable(detalles[0].Inventariable)
        setCompraVenta(detalles[0].CompraVenta)
        setComisionVentaPorcentaje(detalles[0].ComisionVentaPorcentaje)
        setStatusProductos(detalles[0].StatusProductos)
        setFechaHoraProductos(detalles[0].FechaHoraProductos)
        setUsuarioProductos(detalles[0].UsuarioProductos)
        setUnidadesInventario(detalles[0].UnidadesInventario)
        setUnidadesTransito(detalles[0].UnidadesTransito)
        setUnidadesComprometidas(detalles[0].UnidadesComprometidas)
        setCostoCompra(detalles[0].CostoCompra)
        setCostoPromedio(detalles[0].CostoPromedio)
        setMargen(detalles[0].Margen)
        setMargenReal(detalles[0].MargenReal)
        setPrecioVentaSinImpuesto(detalles[0].PrecioVentaSinImpuesto)
        setIVAIdInventario(detalles[0].IVAIdInventario)
        setIVAInventario(detalles[0].IVAInventario)
        setIVAMontoInventario(detalles[0].IVAMontoInventario)
        setIEPSIdInventario(detalles[0].IEPSIdInventario)
        setIEPSInventario(detalles[0].IEPSInventario)
        setIEPSMontoInventario(detalles[0].IEPSMontoInventario)
        setPrecioVentaConImpuesto(detalles[0].PrecioVentaConImpuesto)
        setMaximo(detalles[0].Maximo)
        setMinimo(detalles[0].Minimo)
        setFechaCambioPrecio(detalles[0].FechaCambioPrecio)
        setFechaUltimaVenta(detalles[0].FechaUltimaVenta || "")
        setFechaUltimaCompra(detalles[0].FechaUltimaCompra || "")
        setFechaUltimoTraspasoSalida(detalles[0].FechaUltimoTraspasoSalida || "")
        setFechaUltimoTraspasoEntrada(detalles[0].FechaUltimoTraspasoEntrada || "")
        setFechaUltimoAjuste(detalles[0].FechaUltimoAjuste || "")
        setStatusInventario(detalles[0].StatusInventario)
        setFechaHoraInventario(detalles[0].FechaHoraInventario)
        setUsuarioInventario(detalles[0].UsuarioInventario)
        setDetallesInventarios(detalles[1])
        CodigoBarrasInputRef.current.handleRefCodigoBarrasInput()

    };

    const onhandleCancel = () => {
        setCodigoBarrasDisplay("")
        setDescripcion("")
        setCodigoId("")
        setCategoria("")
        setSubcategoria("")
        setIVADescripcion("")
        setIVACompraProductos("")
        setIEPSIdProductos("")
        setPadreHijo("")
        setHermano("")
        setInventariable("")
        setCompraVenta("")
        setComisionVentaPorcentaje("")
        setStatusProductos("")
        setFechaHoraProductos("")
        setUsuarioProductos("")
        setUnidadesInventario("")
        setUnidadesTransito("")
        setUnidadesComprometidas("")
        setCostoCompra("")
        setCostoPromedio("")
        setMargen("")
        setMargenReal("")
        setPrecioVentaSinImpuesto("")
        setIVAIdInventario("")
        setIVAInventario("")
        setIVAMontoInventario("")
        setIEPSIdInventario("")
        setIEPSInventario("")
        setIEPSMontoInventario("")
        setPrecioVentaConImpuesto("")
        setMaximo("")
        setMinimo("")
        setFechaCambioPrecio("")
        setFechaUltimaVenta("")
        setFechaUltimaCompra("")
        setFechaUltimoTraspasoSalida("")
        setFechaUltimoTraspasoEntrada("")
        setFechaUltimoAjuste("")
        setStatusInventario("")
        setFechaHoraInventario("")
        setUsuarioInventario("")
        setDetallesInventarios([])

    };

    const handleProductosInventarioPerpetuo = async (vSucursalId, vCodigoId) => {
        const url = origin + `/api/consultaproductosinventarioperpetuo/${vSucursalId}/${vCodigoId}`
        let data;
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            data = await response.json()
            if (data.error) {
                console.log(data.error)
                alert(data.error)
                return
            }
        } catch (error) {
            data = { "error": error.message }
            console.log(error.message)
            alert(error.message)
        }
        return data
    }

    const handleRender = () => {
        return (
            <div className="container container-consultaArticulos">
                <div className="header-row">

                    <label htmlFor="">Sucursales</label>
                    <SelectSucursales
                        accessToken={accessToken}
                        url={origin}
                        SucursalAsignada={SucursalId}
                        onhandleSucursal={handleSucursal}
                        Administrador={Administrador}
                    />
                    <InputCodigoBarras
                        accessToken={accessToken}
                        url={origin}
                        handleCodigoBarrasProp={onhandleCodigoBarras}
                        handleConsultaProp={onhandleConsulta}
                        CodigoBarrasProp={CodigoBarras}
                        SoloInventariable={SoloInventariable}
                        ref={CodigoBarrasInputRef}
                    />
                    <label htmlFor="">Descripcion</label>
                    <input
                        id="descripcion"
                        name="descripcion"
                        value={Descripcion}
                        style={{ width: "45rem" }}
                        readOnly
                    />
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="">Código Barras</label>
                        <input id="codigobarras" name="codigobarras" value={CodigoBarrasDisplay} readOnly />
                        <br />
                        <label htmlFor="">Código</label>
                        <input id="codigo" name="codigo" value={CodigoId} readOnly />
                        <br />
                        <label htmlFor="">Categoría</label>
                        <input id="categoria" name="categoria" value={Categoria} readOnly />
                        <br />
                        <label htmlFor="">Subcategoría</label>
                        <input id="subcategoria" name="subcategoria" value={Subcategoria} readOnly />
                        <br />
                        <label htmlFor="">IVA (Productos)</label>
                        <input id="ivaid" name="ivaid" value={IVADescripcion} readOnly />
                        <br />
                        <label htmlFor="">IVACompra (Productos)</label>
                        <input id="ivacompra" name="ivacompra" value={IVACompraProductos} readOnly />
                        <br />
                        <label htmlFor="">IEPSId</label>
                        <input id="iepsid" name="iepsid" value={IEPSIdProductos} readOnly />
                        <br />
                        <label htmlFor="">PadreHijo</label>
                        <input id="padrehijo" name="padrehijo" value={PadreHijo} readOnly />
                        <br />
                        <label htmlFor="">Hermano</label>
                        <input id="hermano" name="hermano" value={Hermano} readOnly />
                        <br />
                        <label htmlFor="">Inventariable</label>
                        <input id="inventariable" name="inventariable" value={Inventariable} readOnly />
                        <br />
                        <label htmlFor="">CompraVenta</label>
                        <input id="compraventa" name="compraventa" value={CompraVenta} readOnly />
                        <br />
                        <label htmlFor="">Comision Venta Porcentaje</label>
                        <input
                            id="comisionventaporcentaje"
                            name="comisionventaporcentaje"
                            value={ComisionVentaPorcentaje}
                            readOnly
                        />
                        <br />
                        <label htmlFor="">Status (Productos)</label>
                        <input id="statusproductos" name="statusproductos" value={StatusProductos} readOnly />
                        <br />
                        <label htmlFor="">FechaHora (Productos)</label>
                        <input id="fechahoraproductos" name="fechahoraproductos" value={FechaHoraProductos} readOnly />
                        <br />
                        <label htmlFor="">Usuario (Productos)</label>
                        <input id="usuarioproductos" name="usuarioproductos" value={UsuarioProductos} readOnly />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="">Unidades Inventario</label>
                        <input id="unidadesinventario" name="unidadesinventario" value={UnidadesInventario} readOnly />
                        <br />
                        <label htmlFor="">Unidades Transito</label>
                        <input id="unidadestransito" name="unidadestransito" value={UnidadesTransito} readOnly />
                        <br />
                        <label htmlFor="">Unidades Comprometidas</label>
                        <input id="unidadescomprometidas" name="unidadescomprometidas" value={UnidadesComprometidas} readOnly />
                        <br />
                        <label htmlFor="">Costo Compra</label>
                        <input id="costocompra" name="costocompra" value={CostoCompra} readOnly />
                        <br />
                        <label htmlFor="">Costo Promedio</label>
                        <input id="costopromedio" name="costopromedio" value={CostoPromedio} readOnly />
                        <br />
                        <label htmlFor="">Margen</label>
                        <input id="margen" name="margen" value={Margen} readOnly />
                        <br />
                        <label htmlFor="">Margen Real</label>
                        <input id="margenreal" name="margenreal" value={MargenReal} readOnly />
                        <br />
                        <label htmlFor="">Precio Venta Sin Impuesto</label>
                        <input id="precioventasinimpuesto" name="precioventasinimpuesto" value={PrecioVentaSinImpuesto} readOnly />
                        <br />
                        <label htmlFor="">IVAId (Inventario Perpetuo)</label>
                        <input id="ivaidip" name="ivaidip" value={IVAIdInventario} readOnly />
                        <br />
                        <label htmlFor="">IVA</label>
                        <input id="ivaip" name="ivaip" value={IVAInventario} readOnly />
                        <br />
                        <label htmlFor="">IVAMonto</label>
                        <input id="ivamonetoip" name="ivamontoip" value={IVAMontoInventario} readOnly />
                        <br />
                        <label htmlFor="">IEPSId (Inventario Perpetuo)</label>
                        <input id="iepsidip" name="iepsidip" value={IEPSIdInventario} readOnly />
                        <br />
                        <label htmlFor="">IEPS</label>
                        <input id="iepsip" name="iepsip" value={IEPSInventario} readOnly />
                        <br />
                        <label htmlFor="">IEPSMonto</label>
                        <input id="iepsmonetoip" name="iepsmontoip" value={IEPSMontoInventario} readOnly />
                        <br />
                        <label htmlFor="">Precio Venta Con Impuesto</label>
                        <input id="precioventaconimpuesto" name="precioventaconimpuesto" value={PrecioVentaConImpuesto} readOnly />
                        <br />
                        <label htmlFor="">Máximo</label>
                        <input id="maximo" name="maximo" value={Maximo} readOnly />
                        <br />
                        <label htmlFor="">Mínimo</label>
                        <input id="minimo" name="minimo" value={Minimo} readOnly />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="">Fecha Cambio Precio</label>
                        <input id="fechacambioprecio" name="fechacambioprecio" value={FechaCambioPrecio} readOnly />
                        <br />
                        <label htmlFor="">Fecha Última Venta</label>
                        <input id="fechaultimaventa" name="fechaultimventa" value={FechaUltimaVenta} readOnly />
                        <br />
                        <label htmlFor="">Fecha Última Compra</label>
                        <input id="fechaultimacompra" name="fechaultimacompra" value={FechaUltimaCompra} readOnly />
                        <br />
                        <label htmlFor="">Fecha Último Traspaso Salida</label>
                        <input id="fechaultimotraspasosalida" name="fechaultimotraspasosalida" value={FechaUltimoTraspasoSalida} readOnly />
                        <br />
                        <label htmlFor="">Fecha Último Traspaso Entrada</label>
                        <input id="fechaultimotraspasoentrada" name="fechaultimotraspasoentrada" value={FechaUltimoTraspasoEntrada} readOnly />
                        <br />
                        <label htmlFor="">Fecha Último Ajuste</label>
                        <input id="fechaultimoajuste" name="fechaultimoajuste" value={FechaUltimoAjuste} readOnly />
                        <br />
                        <label htmlFor="">Status (IP)</label>
                        <input id="statusip" name="statusip" value={StatusInventario} readOnly />
                        <br />
                        <label htmlFor="">FechaHora (IP)</label>
                        <input id="fechahoraip" name="fechahoraip" value={FechaHoraInventario} readOnly />
                        <br />
                        <label htmlFor="">Usuario (IP)</label>
                        <input id="usuarioip" name="usuarioip" value={UsuarioInventario} readOnly />
                        <div className="containerTable1">
                            <table id="table1" className="table1className">
                                <thead>
                                    <tr>
                                        <th style={{ width: "10rem", textAlign: "center" }}>Sucursal</th>
                                        <th style={{ textAlign: "center" }}>Unidades Disponibles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detallesInventarios.map((element, i) => (
                                        <tr key={i}>
                                            <td>{element.Sucursal}</td>
                                            <td style={{ textAlign: "right" }}>{element.UnidadesDisponibles}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div>
            {1 === 1 ? handleRender() : <h2>Loading ....</h2>}
        </div>
    )
}


export default ConsultaArticulo









