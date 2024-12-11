import React, { useEffect, useState, useRef } from 'react';

import './Productos.css'

const Productos = ({ onProps }) => {

    const [accessToken, setAccessToken] = useState(onProps.accessToken)
    const [origin, setOrigin] = useState(onProps.origin)
    const [codigoId, setCodigoId] = useState("");
    const [codigoBarras, setCodigoBarras] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoriaId, setCategoriaId] = useState(1);
    const [categorias, setCategorias] = useState([]);
    const [subcategoriaId, setSubcategoriaId] = useState(1);
    const [subcategoriasCatalogo, setSubcategoriasCatalogo] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [medidaCapacidadId, setMedidaCapacidadId] = useState(1);
    const [medidasCapacidad, setMedidasCapacidad] = useState([]);
    const [unidadesCapacidad, setUnidadesCapacidad] = useState("");
    const [medidasVenta, setMedidasVenta] = useState([]);
    const [medidaVentaId, setMedidaVentaId] = useState(1);
    const [unidadesVenta, setUnidadesVenta] = useState("");
    const [marcas, setMarcas] = useState([]);
    const [marcaId, setMarcaId] = useState(1);
    const [colores, setColores] = useState([]);
    const [colorId, setColorId] = useState(1);
    const [sabores, setSabores] = useState([]);
    const [saborId, setSaborId] = useState(1);
    const [ivas, setIvas] = useState([]);
    const [iVAId, setIVAId] = useState(1);
    const [iVA, setIVA] = useState(0);
    const [iVACompra, setIVACompra] = useState("S");
    const [iepss, setIepss] = useState([]);
    const [iEPSId, setIEPSId] = useState(1);
    const [iEPS, setIEPS] = useState(0);
    const [productosRecientes, setProductosRecientes] = useState([]);
    const [checked, setChecked] = useState(false);

    const codigobarrasInputRef = useRef(null);
    const descripcionInputRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const categorias = await getCatalogos(1);
                if (categorias.error) {
                    alert(categorias.error)
                    return;
                }
                const subcategorias = await getCatalogos(2)
                if (subcategorias.error) {
                    alert(subcategorias.error)
                    return;
                }
                const medidasCapacidad = await getCatalogos(3)
                if (medidasCapacidad.error) {
                    alert(medidasCapacidad.error)
                    return;
                }
                const medidasVenta = await getCatalogos(4)
                if (medidasVenta.error) {
                    alert(medidasVenta.error)
                    return;
                }
                const marcas = await getCatalogos(5)
                if (marcas.error) {
                    alert(marcas.error)
                    return;
                }
                const colores = await getCatalogos(6)
                if (colores.error) {
                    alert(colores.error)
                    return;
                }
                const sabores = await getCatalogos(7)
                if (sabores.error) {
                    alert(sabores.error)
                    return;
                }

                const iva = await getCatalogos(8)
                if (iva.error) {
                    alert(iva.error)
                    return;
                }

                const ieps = await getCatalogos(9)
                if (ieps.error) {
                    alert(ieps.error)
                    return;
                }

                const productosRecientes = await getProductosRecientes()
                if (productosRecientes.error) {
                    alert(productosRecientes.error)
                    return;
                }

                setCategorias(categorias)
                setSubcategoriasCatalogo(subcategorias)
                setSubcategorias(subcategorias.filter(element => element.CategoriaId === categoriaId))
                setMedidasCapacidad(medidasCapacidad)
                setMedidasVenta(medidasVenta)
                setMarcas(marcas)
                setColores(colores)
                setSabores(sabores)
                setIvas(iva)
                setIVA(0.00)
                setIepss(ieps)
                setIEPS(0.00)
                setProductosRecientes(productosRecientes)
            } catch (error) {
                console.log(error.message)
                alert(error.message)
            }
        }
        fetchData();
    }, []);



    const getCatalogos = async (id) => {
        const endpoint = `${origin}/api/catalogos/${id}`;
        try {
            const response = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            let data = await response.json()
            if (data.length === 0) {
                data = { "error": `No hay elementos en el Catálogo ${id}` }
            }
            return data;
        } catch (error) {
            console.log(error.message)
            alert(error.message)
            return { error: error.message }
        }
    }


    const getProductosRecientes = async () => {
        const endpoint = `${origin}/api/consultaProductosRecientes`;
        try {
            const response = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            let data = await response.json()
            return data;
        } catch (error) {
            console.log(error.message)
            alert(error.message)
            return { error: error.message }
        }
    }

    const handleCodigoBarras = (e) => {
        const vCodigoBarras = e.target.value

        setCodigoBarras(vCodigoBarras)

    }

    const handleSinCodigoBarras = (e) => {
        if (e.target.checked) {
            document.querySelector('#codigobarras').disabled = true
            setCodigoBarras("I-CODE")
            setChecked(true)
            descripcionInputRef.current.focus();
        } else {
            document.querySelector('#codigobarras').disabled = false
            setCodigoBarras("")
            setChecked(false)
            codigobarrasInputRef.current.focus()
        }
    }

    const handleDescripcion = (e) => {
        const vDescripcion = e.target.value
        setDescripcion(vDescripcion)
    }

    const handleCategorias = (e) => {
        const vCategoriaId = e.target.value
        const subcategorias = subcategoriasCatalogo.filter(element => element.CategoriaId === parseInt(vCategoriaId))
        setCategoriaId(vCategoriaId)
        setSubcategorias(subcategorias)
    }

    const handleSubcategorias = (e) => {
        const vSubcategoriaId = e.target.value
        setSubcategoriaId(vSubcategoriaId)
    }

    const handleUnidadesCapacidad = (e) => {
        const vUnidadesCapacidad = e.target.value
        setUnidadesCapacidad(vUnidadesCapacidad)
    }

    const handleMedidaCapacidad = (e) => {
        const vMedidaCapacidad = e.target.value
        setMedidaCapacidadId(vMedidaCapacidad)
    }

    const handleUnidadesVenta = (e) => {
        const vUnidadesVenta = e.target.value
        setMedidaVentaId(vUnidadesVenta)
    }

    const handleMedidaVenta = (e) => {
        const vUnidadesVenta = e.target.value
        setUnidadesVenta(vUnidadesVenta)
    }

    const handleMarca = (e) => {
        const vMarca = e.target.value
        setMarcaId(vMarca)
    }

    const handleColor = (e) => {
        const vColor = e.target.value
        setColorId(vColor)
    }
    const handleSabor = (e) => {
        const vSabor = e.target.value
        setSaborId(vSabor)
    }

    const handleIVA = (e) => {
        const vIVA = e.target.value
        const arreglo = ivas.filter(element => element.IVAId === parseInt(vIVA))
        setIVAId(vIVA)
        setIVA(arreglo[0].IVA)
    }

    const handleIVACompra = (e) => {
        const vIVACompra = e.target.value
        setIVACompra(vIVACompra)
    }

    const handleIEPS = (e) => {
        const vIEPS = e.target.value
        const arreglo = iepss.filter(element => element.IEPSId === parseInt(vIEPS))
        setIEPSId(vIEPS)
        setIEPS(arreglo[0].IEPS)
    }

    const handleDigitoVerificador = () => {
        const vCodigoBarras = codigoBarras.toUpperCase()
        let sumaPares = 0
        let sumaNones = 0
        for (let i = 0; i < vCodigoBarras.length - 1; i++) {
            if (i % 2 === 0) {
                sumaPares += parseInt(vCodigoBarras[i])
            } else {
                sumaNones += parseInt(vCodigoBarras[i])
            }
        }
        sumaNones = sumaNones * 3  //Multiplica por 3 la sumatoria de Impares

        const sumaTotal = sumaPares + sumaNones  //Suma Pares más Impares * 3

        const sumaTotalRedondeoDecenas = Math.ceil(sumaTotal / 10) * 10  //SumaTotal redondeada a la decena más cercana

        const digitoVerificador = sumaTotalRedondeoDecenas - sumaTotal

        alert("El Dígito Verificador es " + digitoVerificador)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const json = {
            CodigoBarras: codigoBarras.toUpperCase(),
            Descripcion: descripcion.toUpperCase(),
            CategoriaId: categoriaId,
            SubcategoriaId: subcategoriaId,
            UnidadesCapacidad: unidadesCapacidad,
            MedidaCapacidadId: medidaCapacidadId,
            UnidadesVenta: unidadesVenta,
            MedidaVentaId: medidaVentaId,
            MarcaId: marcaId,
            ColorId: colorId,
            SaborId: saborId,
            IVAId: iVAId,
            IVA: iVA,
            IVACompra: iVACompra,
            IEPSId: iEPSId,
            IEPS: iEPS,
            Usuario: sessionStorage.getItem("user")
        }

        try {

            const endpoint = `${origin}/api/altaProductos`
            const response = await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()

            if (data.error) {
                alert("Error antes de cargar productos")
                return
            }

            //Este alert está bien.
            alert(JSON.stringify(data))

            const productosRecientes = await getProductosRecientes()
            if (productosRecientes.error) {
                alert(productosRecientes.error)
                return;
            }
            setCodigoId("")
            setCodigoBarras("")
            setDescripcion("")
            setCategoriaId(1)
            setSubcategoriaId(1)
            setUnidadesCapacidad("")
            setMedidaCapacidadId(1)
            setUnidadesVenta("")
            setMedidaVentaId(1)
            setMarcaId(1)
            setColorId(1)
            setSaborId(1)
            setIVAId(1)
            setIEPSId(1)
            setIVA(1)
            setIVACompra("S")
            setIEPS(1)
            setProductosRecientes(productosRecientes)
            setChecked(false)

            document.querySelector('#codigobarras').disabled = false

            codigobarrasInputRef.current.focus();

        } catch (error) {
            console.log(error.message)
            alert(error.message)
            return
        }
    }




    const handleRender = () => {
        return (

            <div className="container productos-container" >



                <div className="productos-item productos-item1 productos-main" >
                    <form onSubmit={handleSubmit}>
                        <span className="badge rounded-pill text-bg-success fs-4">Productos</span>
                        <br />
                        <label htmlFor="codigo">Código</label>
                        <input value={codigoId} id="codigo" name="codigo" size="6" style={{ backgroundColor: "lightgray" }} autoComplete="off" readOnly />
                        <br />
                        <label htmlFor="codigobarras">Código Barras</label>
                        <input onChange={handleCodigoBarras} value={codigoBarras} id="codigobarras" name="codigobarras" size="15" maxLength="13" autoComplete="off" ref={codigobarrasInputRef} required style={{ "textTransform": "uppercase" }} autoFocus />
                        <div>
                            <input onChange={handleSinCodigoBarras} id="checked" name="checked" type="checkbox" className="ms-2" checked={checked} />
                            <label htmlFor="checked" className="ms-1" style={{ fontSize: ".6rem" }}>Sin Código de Barras</label>

                        </div>

                        <button type="button" onClick={handleDigitoVerificador} style={{ background: "dodgerblue", color: "white", borderRadius: "4px", padding: "0 10px" }}>Valida Dígito Verificador</button>


                        <br />
                        <label htmlFor="descripcion">Descripcion</label>
                        <input onChange={handleDescripcion} value={descripcion} id="descripcion" name="descripcion" size="40" autoComplete="off" style={{ textTransform: "uppercase" }} ref={descripcionInputRef} required />
                        <br />
                        <label htmlFor="categorias">Categorías</label>
                        <select onChange={handleCategorias} id="categorias" name="categorias" value={categoriaId}>
                            {categorias.map((element, i) => (<option key={i} value={element.CategoriaId}>{element.Categoria}</option>))}
                        </select>
                        <br />
                        <label htmlFor="subcategorias">Subcategorías</label>
                        <select onChange={handleSubcategorias} id="subcategorias" name="subcategorias" value={subcategoriaId}>
                            {subcategorias.map((element, i) => (<option key={i} value={element.SubcategoriaId}>{element.Subcategoria}</option>))}
                        </select>
                        <br />

                        <label htmlFor="unidadesCapacidad">Unidades Capacidad</label>
                        <input onChange={handleUnidadesCapacidad} value={unidadesCapacidad} id="unidadesCapacidad" name="unidadesCapacidad" size="6" autoComplete="off" required />
                        <select onChange={handleMedidaCapacidad} id="MedidaCapacidad" name="MedidaCapacidad" value={medidaCapacidadId}>
                            {medidasCapacidad.map((element, i) => (<option key={i} value={element.MedidaCapacidadId}>{element.MedidaCapacidad}</option>))}
                        </select>
                        <br />
                        <label htmlFor="unidadesVenta">Unidades Venta</label>
                        <input onChange={handleMedidaVenta} value={unidadesVenta} id="unidadesVenta" name="unidadesVenta" size="6" autoComplete="off" required />
                        <select onChange={handleUnidadesVenta} id="unidadesVentaselect" name="unidadesVentaselect" value={medidaVentaId}>
                            {medidasVenta.map((element, i) => (<option key={i} value={element.MedidaVentaId}>{element.MedidaVenta}</option>))}
                        </select>
                        <br />
                        <label htmlFor="marca">Marca</label>
                        <select onChange={handleMarca} id="marca" name="marca" value={marcaId}>
                            {marcas.map((element, i) => (<option key={i} value={element.MarcaId}>{element.Marca}</option>))}
                        </select>
                        <br />
                        <label htmlFor="color">Color</label>
                        <select onChange={handleColor} id="color" name="color" value={colorId}>
                            {colores.map((element, i) => (<option key={i} value={element.ColorId}>{element.Color}</option>))}
                        </select>
                        <br />
                        <label htmlFor="sabor">Sabor</label>
                        <select onChange={handleSabor} id="sabor" name="sabor" value={saborId}>
                            {sabores.map((element, i) => (<option key={i} value={element.SaborId}>{element.Sabor}</option>))}
                        </select>
                        <br />
                        <label htmlFor="iva">IVA</label>
                        <select onChange={handleIVA} id="iva" name="iva" value={iVAId}>
                            {ivas.map((element, i) => (<option key={i} value={element.IVAId}>{element.Descripcion}</option>))}
                        </select>
                        <br />
                        <label htmlFor="ivacompra">IVA Compra</label>
                        <select onChange={handleIVACompra} id="ivacompra" name="ivacompra" value={iVACompra}>
                            <option key={1} value="S">S</option>
                            <option key={2} value="N">N</option>
                        </select>
                        <br />
                        <label htmlFor="ieps">IEPS</label>
                        <select onChange={handleIEPS} id="ieps" name="ieps" value={iEPSId}>
                            {iepss.map((element, i) => (<option key={i} value={element.IEPSId}>{element.Descripcion}</option>))}
                        </select>
                        <br />
                        <button type="submit" className="btn btn-primary w-100 mt-2">GRABAR</button>
                    </form>
                </div>





                <div className="productos-item productos-item2 productos-consulta">
                    <span className="badge rounded-pill text-bg-success fs-4 mb-2">Catálogo Productos</span>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover table-sm">
                            <thead className="table-light text-center">
                                <tr>
                                    <th>CodigoId</th>
                                    <th>CodigoBarras</th>
                                    <th>Descripcion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosRecientes.map((element, i) => (
                                    <tr key={i}>
                                        <td>{element.CodigoId}</td>
                                        <td>{element.CodigoBarras}</td>
                                        <td>{element.Descripcion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        )
    }



    return (
        <>
            {productosRecientes.length > 0 ? handleRender() : <h1>Loading....</h1>}
        </>
    )


}


export default Productos;


