import React, { useState, useEffect, useRef } from 'react'

import './Egresos.css'

import { numberWithCommas, sanitizeNumericInput } from './utils/FuncionesGlobales'

const Egresos = ({ onProps, naturalezaCC }) => {
  const accessToken = onProps.accessToken;
  const origin = onProps.origin;
  const User = onProps.User

  const [fecha, setFecha] = useState("")
  const [periodoAbierto, setPeriodoAbierto] = useState([])
  const [periodoAbiertoPrimerDia, setPeriodoAbiertoPrimerDia] = useState("")
  const [periodoAbiertoUltimoDia, setPeriodoAbiertoUltimoDia] = useState("")
  const [sucursales, setSucursales] = useState([])
  // const [SucursalId, setSucursalId] = useState(onProps.SucursalId)
  const [SucursalId, setSucursalId] = useState(1)
  const [unidadesDeNegocio, setUnidadesDeNegocio] = useState([])
  const [UnidadDeNegocioId, setUnidadDeNegocioId] = useState(1)
  const [cuentasContables, setCuentasContables] = useState([])
  const [CuentaContableId, setCuentaContableId] = useState(0)
  const [subcuentasContables, setSubcuentasContables] = useState([])
  const [SubcuentaContableId, setSubcuentaContableId] = useState("")
  const [monto, setMonto] = useState("")
  const [comentarios, setComentarios] = useState("")
  const [egresosCadenaMes, setEgresosCadenaMes] = useState([])
  const [ventanaModifica, setVentanaModifica] = useState("none")

  const [sucursalIdModifica, setSucursalIdModifica] = useState(0)
  const [sucursalNombreModifica, setSucursalNombreModifica] = useState("")
  const [unidadDeNegocioIdModifica, setUnidadDeNegocioIdModifica] = useState(0)
  const [unidadDeNegocioModifica, setUnidadDeNegocioModifica] = useState(0)
  const [cuentaContableIdModifica, setCuentaContableIdModifica] = useState(0)
  const [cuentaContableModifica, setCuentaContableModifica] = useState(0)
  const [subcuentaContableIdModifica, setSubcuentaContableIdModifica] = useState("")
  const [subcuentaContableModifica, setSubcuentaContableModifica] = useState("")
  const [folioIdModifica, setFolioIdModifica] = useState(0)
  const [montoModifica, setMontoModifica] = useState(0)
  const [comentariosModifica, setComentariosModifica] = useState("")

  const montoInputRef = useRef()
  const montoModificaRef = useRef()

  useEffect(() => {
    async function fetchData() {
      let vFecha = await fechaActual()
      const jsonPA = await getPeriodoAbierto(vFecha)
      vFecha = jsonPA.Fecha
      const vPeriodoAbierto = jsonPA.PeriodoAbierto
      const vPeriodoAbiertoUltimoDia = jsonPA.PeriodoAbiertoUltimoDia
      const arregloSucursales = await getSucursales()
      const arregloUnidadesDeNegocio = await getUnidadesNegocioCatalogo()
      const vUnidadDeNegocioId = parseInt(arregloUnidadesDeNegocio[0].UnidadDeNegocioId)
      const arregloCuentasContables = await getCuentasContablesCatalogo()
      const arregloSubcuentasContables = await getSubcuentasContablesCatalogo()
      const arregloEgresosCadenaMes = await getEgresos(vFecha, "mes", SucursalId, vUnidadDeNegocioId)

      setFecha(jsonPA.Fecha)
      setPeriodoAbierto(jsonPA.PeriodoAbierto)
      setPeriodoAbiertoPrimerDia(jsonPA.PeriodoAbiertoPrimerDia)
      setPeriodoAbiertoUltimoDia(jsonPA.PeriodoAbiertoUltimoDia)
      setPeriodoAbierto(jsonPA.PeriodoAbierto)
      setSucursales(arregloSucursales)
      setSucursalId(parseInt(arregloSucursales[0].SucursalId))
      setUnidadesDeNegocio(arregloUnidadesDeNegocio)
      setUnidadDeNegocioId(vUnidadDeNegocioId)
      setCuentasContables(arregloCuentasContables)
      setCuentaContableId(parseInt(arregloCuentasContables[0].CuentaContableId))
      setSubcuentasContables(arregloSubcuentasContables)
      setSubcuentaContableId(arregloSubcuentasContables[0].SubcuentaContableId)
      setEgresosCadenaMes(arregloEgresosCadenaMes)

      montoInputRef.current.focus()
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (SucursalId && unidadesDeNegocio.length > 0 && cuentasContables.length > 0 && subcuentasContables.length > 0) {
      const unidadDeNegocio = unidadesDeNegocio.find(element => element.SucursalId === SucursalId);
      const vUnidadDeNegocioId = unidadDeNegocio?.UnidadDeNegocioId;

      const cuentaContable = cuentasContables.find(
        element => element.SucursalId === SucursalId && element.UnidadDeNegocioId === vUnidadDeNegocioId
      );
      const vCuentaContableId = cuentaContable?.CuentaContableId;

      const subcuentaContable = subcuentasContables.find(
        element =>
          element.SucursalId === SucursalId &&
          element.UnidadDeNegocioId === vUnidadDeNegocioId &&
          element.CuentaContableId === vCuentaContableId
      );
      const vSubcuentaContableId = subcuentaContable?.SubcuentaContableId;

      setUnidadDeNegocioId(vUnidadDeNegocioId);
      setCuentaContableId(vCuentaContableId);
      setSubcuentaContableId(vSubcuentaContableId);

      montoInputRef.current.focus()
    }
  }, [SucursalId]);




  useEffect(() => {
    if (UnidadDeNegocioId && cuentasContables.length > 0 && subcuentasContables.length > 0) {
      const vCuentaContableId = cuentasContables.filter(element => element.SucursalId === SucursalId && element.UnidadDeNegocioId === UnidadDeNegocioId)[0]?.CuentaContableId
      const vSubcuentaContableId = subcuentasContables.filter(element => element.SucursalId === SucursalId && element.UnidadDeNegocioId === UnidadDeNegocioId && element.CuentaContableId === vCuentaContableId)[0]?.SubcuentaContableId

      setCuentaContableId(vCuentaContableId)
      setSubcuentaContableId(vSubcuentaContableId)
    }

    montoInputRef.current.focus()
  }, [UnidadDeNegocioId])

  useEffect(() => {
    if (CuentaContableId && subcuentasContables.length > 0) {
      const vSubcuentaContableId = subcuentasContables.filter(element => element.SucursalId === SucursalId && element.UnidadDeNegocioId === UnidadDeNegocioId && element.CuentaContableId === CuentaContableId)[0]?.SubcuentaContableId

      setSubcuentaContableId(vSubcuentaContableId)
    }
    montoInputRef.current.focus()
  }, [CuentaContableId])

  useEffect(() => {
    montoInputRef.current.focus()
  }, [SubcuentaContableId])


  const fechaActual = async () => {
    let Fecha;
    const url = origin + `/api/fechaactual`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.error) {
        console.log(data.error);
        alert(data.error);
        return;
      }
      Fecha = data[0].Fecha.substring(0, 10);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return Fecha
  };








  const getSucursales = async () => {
    const url = origin + `/api/sucursales/${naturalezaCC}`;
    let data = []
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Sucursales" };
        return;
      }
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return data
  };

  const getUnidadesNegocioCatalogo = async () => {
    let data = []
    const url =
      origin + `/api/ingresos/unidadesdenegociocatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Unidades de Negocio" };
        return;
      }
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return data
  };

  const getCuentasContablesCatalogo = async () => {
    let data = []
    const url =
      origin + `/api/ingresos/cuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Cuentas Contables" };
        return;
      }
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return data
  };

  const getSubcuentasContablesCatalogo = async () => {
    let data = []
    const url =
      origin + `/api/ingresos/subcuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Subcuentas Contables" };
        return;
      }
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return data
  };

  const getPeriodoAbierto = async (Fecha) => {
    const url = origin + `/api/periodoabierto`;
    let PeriodoAbierto;
    let PeriodoAbiertoPrimerDia;
    let PeriodoAbiertoUltimoDia;
    //let bandera = false
    let data = []
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }
      //EU PeriodoAbierto = data.rows[0].Periodo;
      PeriodoAbierto = data[0].Periodo;
      //EU PeriodoAbiertoPrimerDia = data.rows[0].PrimerDiaMes.substring(0, 10);
      PeriodoAbiertoPrimerDia = data[0].PrimerDiaMes.substring(0, 10);
      //EU PeriodoAbiertoUltimoDia = data.rows[0].UltimoDiaMes.substring(0, 10);
      PeriodoAbiertoUltimoDia = data[0].UltimoDiaMes.substring(0, 10);

      if (Fecha > PeriodoAbiertoUltimoDia) {
        Fecha = PeriodoAbiertoUltimoDia
      }
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }

    const json = {
      PeriodoAbierto: PeriodoAbierto,
      PeriodoAbiertoPrimerDia: PeriodoAbiertoPrimerDia,
      PeriodoAbiertoUltimoDia: PeriodoAbiertoUltimoDia,
      Fecha: Fecha,
    }
    return json
  };




  const getEgresos = async (vfecha, accesoDB, SucursalId, UnidadDeNegocioId) => {
    const trans = "Egresos"

    let data = [];

    // if (accesoDB === "mes" || accesoDB === "dia") {
    const url =
      origin +
      `/api/ingresos/getIngresosEgresos/${vfecha}/${naturalezaCC}/${accesoDB}/${trans}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }
    } catch (error) {
      console.log(error.message)
      alert(error.message)
      return
    }
    return data
  };


  const handleMonto = (e) => {
    const valor = e.target.value
    const formattedValue = sanitizeNumericInput(valor)
    setMonto(formattedValue)
  }

  const handleCancelar = () => {
    setMonto("")
    setComentarios("")
    montoInputRef.current.focus()
  }

  const handleGrabar = async () => {
    if (fecha < periodoAbiertoPrimerDia) {
      alert("No se puede modificar un Periodo Cerrado")
      return
    }

    if (monto === "" || monto === undefined) {
      montoInputRef.current.focus()
      return
    }
    // alert("Grabar")

    let data = [];

    //### Validar si existe un movimiento Sucursal,UnidadesDeNegocio,Cuenta y Subcuenta Contable Igual###
    // data = await this.handleValidaMovimiento(
    //   SucursalId,
    //   UnidadDeNegocioId,
    //   CuentaContableId,
    //   SubcuentaContableId,
    //   Fecha
    // );
    // if (data.error) {
    //   console.log(data.error);
    //   alert(data.error);
    //   return;
    // }
    // if (data[0].cuantos > 0) {
    //   if (
    //     !window.confirm(
    //       "Ya existe(n) " +
    //         data[0].cuantos +
    //         " Movimiento(s) para la Sucursal, UnidadDeNegocio, Cuenta, Subcuenta Contable y Fecha. ¿Desea Continuar?"
    //     )
    //   ) {
    //     return;
    //   }
    // }
    //###################################################################################################
    let json = {
      SucursalId: SucursalId,
      UnidadDeNegocioId: UnidadDeNegocioId,
      CuentaContableId: CuentaContableId,
      SubcuentaContableId: SubcuentaContableId,
      Fecha: fecha,
      Monto: parseFloat(monto) * parseInt(naturalezaCC),
      Comentarios: comentarios,
      Usuario: User,
    };

    try {
      const url = origin + `/api/ingresos/grabaingresos`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(json), //JSON.stringify(data)
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

      setMonto("")
      setComentarios("")
      const arregloEgresos = await getEgresos(fecha, "mes", SucursalId, UnidadDeNegocioId)
      setEgresosCadenaMes(arregloEgresos)
      alert(JSON.stringify(data));
      montoInputRef.current.focus()
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  const handleComentarios = (e) => {
    const vTextArea = e.target.value.toUpperCase()
    setComentarios(vTextArea)
  }

  const handleFecha = async (e) => {
    const vFecha = e.target.value
    setFecha(vFecha)
    const arregloEgresos = await getEgresos(vFecha, "mes", SucursalId, UnidadDeNegocioId)
    setEgresosCadenaMes(arregloEgresos)
    montoInputRef.current.focus()
  }

  const handleModifica = (element) => {
    if (fecha < periodoAbiertoPrimerDia) {
      return
    }
    if (ventanaModifica === "block") {
      setVentanaModifica("none")
      setSucursalIdModifica(0)
      setSucursalNombreModifica("")
      setUnidadDeNegocioIdModifica(0)
      setUnidadDeNegocioModifica("")
      setCuentaContableIdModifica(0)
      setCuentaContableModifica("")
      setSubcuentaContableIdModifica(0)
      setSubcuentaContableModifica("")
      setFolioIdModifica(0)
      setMontoModifica("")
      setMonto("")
      setComentariosModifica("")
      setComentarios("")

      setTimeout(() => {
        montoInputRef.current.focus()
      }, 0)
    }
    else {
      setVentanaModifica("block")
      setSucursalIdModifica(element.SucursalId)
      setSucursalNombreModifica(element.SucursalNombre)
      setUnidadDeNegocioIdModifica(element.UnidadDeNegocioId)
      setUnidadDeNegocioModifica(element.UnidadDeNegocioNombre)
      setCuentaContableIdModifica(element.CuentaContableId)
      setCuentaContableModifica(element.CuentaContable)
      setSubcuentaContableIdModifica(element.SubcuentaContableId)
      setSubcuentaContableModifica(element.SubcuentaContable)
      setFolioIdModifica(element.FolioId)

      setMontoModifica(Math.abs(element.Monto))
      setMonto(Math.abs(element.Monto)) //Esto lo hago para comparar vs montoModifica.

      setComentariosModifica(element.Comentarios)
      setComentarios(element.Comentarios) //Esto es para comparar vs comentariosModifica

      setTimeout(() => {
        montoModificaRef.current.focus()
        montoModificaRef.current.select()
      }, 0)
    }
  }

  const handleCancelarModifica = () => {
    setVentanaModifica("none")

    setSucursalIdModifica(0)
    setSucursalNombreModifica("")
    setUnidadDeNegocioIdModifica(0)
    setUnidadDeNegocioModifica("")
    setCuentaContableIdModifica(0)
    setCuentaContableModifica("")
    setSubcuentaContableIdModifica(0)
    setSubcuentaContableModifica("")
    setFolioIdModifica(0)
    setMontoModifica("")
    setMonto("")
    setComentariosModifica("")
    setComentarios("")

    montoInputRef.current.focus()
  }

  const handleMontoModifica = (e) => {
    const vMonto = e.target.value
    const formattedValue = sanitizeNumericInput(vMonto)
    setMontoModifica(formattedValue)
  }

  const handleMontoActualiza = async () => {
    if (montoModifica === "" || montoModifica === undefined) {
      alert("Monto incorrecto :" + montoModifica)
      setVentanaModifica("none")
      montoInputRef.current.focus()
    }


    if (parseFloat(Math.abs(monto)) === parseFloat(Math.abs(montoModifica)) && comentarios === comentariosModifica) {
      return
    }

    const url = origin + `/api/actualizaingresosegresos`

    const json = {
      SucursalId: parseInt(sucursalIdModifica),
      FolioId: parseInt(folioIdModifica),
      Monto: parseFloat(montoModifica) * -1,
      Comentarios: comentariosModifica,
      Usuario: User
    }


    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(json),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json()
    if (data.error) {
      console.log(data.error)
      alert(data.error)
      return
    }

    const arregloEgresos = await getEgresos(fecha, "mes", SucursalId, UnidadDeNegocioId)
    setEgresosCadenaMes(arregloEgresos)

    alert(data.message)

    // montoInputRef.current.focus()

    setVentanaModifica("none")

    setSucursalIdModifica(0)
    setSucursalNombreModifica("")
    setUnidadDeNegocioIdModifica(0)
    setUnidadDeNegocioModifica("")
    setCuentaContableIdModifica(0)
    setCuentaContableModifica("")
    setSubcuentaContableIdModifica(0)
    setSubcuentaContableModifica("")
    setFolioIdModifica(0)
    setMontoModifica("")
    setMonto("")
    setComentariosModifica("")
    setComentarios("")

    montoInputRef.current.focus()

  }

  const handleComentariosModifica = (e) => {
    setComentariosModifica(e.target.value.toUpperCase())
  }

  return (
    <div className='container container-egresos'>
      <div className="item item1">

        <div className="item1-header">
          <div className="ventanaModifica" style={{ display: ventanaModifica }}>
            <h3 style={{ textAlign: "center" }}>Modifica Monto</h3>
            <div className="item-vm">
              <label>Sucursal</label>
              <input type="text" value={sucursalNombreModifica} readOnly />
            </div>

            <div className="item-vm">
              <label>Unidad de Negocio</label>
              <input type="text" value={unidadDeNegocioModifica} readOnly />
            </div>

            <div className="item-vm">
              <label>Cuenta Contable</label>
              <input type="text" value={cuentaContableModifica} readOnly />
            </div>

            <div className="item-vm">
              <label>Subcuenta Contable</label>
              <input type="text" value={subcuentaContableModifica} readOnly />
            </div>

            <div className="item-vm">
              <label>Folio</label>
              <input type="text" value={folioIdModifica} readOnly />
            </div>

            <div className="item-vm">
              <label>Monto</label>
              <input type="text" style={{ textAlign: "right" }} value={numberWithCommas(montoModifica)} onChange={handleMontoModifica} ref={montoModificaRef} />
            </div>

            <div className="item-vm">
              <label>Comentarios</label>
              <input type="text" value={comentariosModifica} onChange={handleComentariosModifica} />
            </div>

            <div className="botones-vm">
              <div className="btn-mod">
                <button className="btn btn-success" onClick={handleMontoActualiza}>Modificar</button>
              </div>
              <div className="btn-mod">
                <button className="btn btn-danger" onClick={handleCancelarModifica}>Cancelar</button>
              </div>
            </div>

          </div>



          <div className="subitem1">
            <label>Fecha</label>
            <input id="id-fecha" type="date" value={fecha} onChange={handleFecha} />
          </div>
          <div className="subitem1">
            <label>Sucursal</label>
            <select name="name-select-sucursal" id="id-select-Sucursal" value={SucursalId} onChange={(e) => setSucursalId(parseInt(e.target.value))}>
              {sucursales.map((element, i) => (<option key={i} value={element.SucursalId}>{element.SucursalNombre}</option>))}
            </select>
          </div>
          <div className="subitem1">
            <label>Unidad De Negocio</label>
            <select name="name-select-UnidadDeNegocio" id="id-select-UnidadDeNegocio" value={UnidadDeNegocioId} onChange={(e) => setUnidadDeNegocioId(parseInt(e.target.value))}>
              {unidadesDeNegocio.filter(element => element.SucursalId === SucursalId).map((element, i) => (<option key={i} value={element.UnidadDeNegocioId}>{element.UnidadDeNegocio}</option>))}
            </select>
          </div>
          <div className="subitem1">
            <label>Cuenta Contable</label>
            <select name="name-select-CuentaContable" id="id-select-CuentaContable" value={CuentaContableId} onChange={(e) => setCuentaContableId(parseInt(e.target.value))}>
              {cuentasContables.filter(element => element.SucursalId === SucursalId && element.UnidadDeNegocioId === UnidadDeNegocioId).map((element, i) => (<option key={i} value={element.CuentaContableId}>{element.CuentaContable}</option>))}
            </select>
          </div>
          <div className="subitem1">
            <label>Subcuenta Contable</label>
            <select name="name-select-SubcuentaContable" id="id-select-SubcuentaContable" value={SubcuentaContableId} onChange={(e) => setSubcuentaContableId(e.target.value)}>
              {subcuentasContables.filter(element => element.SucursalId === SucursalId && element.UnidadDeNegocioId === UnidadDeNegocioId && element.CuentaContableId === CuentaContableId).map((element, i) => (<option key={i} value={element.SubcuentaContableId}>{element.SubcuentaContable}</option>))}
            </select>
          </div>
          <div className="subitem1">
            <label>Monto Pesos</label>
            <input name="input-monto" id="input-monto" type="text" value={numberWithCommas(monto)} onChange={handleMonto} placeholder="Monto $$$" ref={montoInputRef} autoComplete='off' />
          </div>
          <br />
          <textarea name="" id="" value={comentarios} onChange={handleComentarios} placeholder='Comentarios...'></textarea>
          <br />
          <div className="contenedor-botones">
            <button className="btn btn-success" type="button" onClick={handleGrabar}>Grabar</button>
            <button className="btn btn-danger" type="button" onClick={handleCancelar}>Cancelar</button>
          </div>
        </div>

        <div className="item1-footer">
          <span className="badge bg-primary">DIA</span>
          <div className="dia">
            <div className="enca-dia">
              <span className="badge bg-danger">{sucursales.find(element => element.SucursalId === SucursalId)?.Sucursal}</span>
              <span className="badge bg-primary">{unidadesDeNegocio.find(element => element.UnidadDeNegocioId === UnidadDeNegocioId)?.UnidadDeNegocio}</span>
            </div>
            <div className="enca-dia">
              <span className="badge bg-success">Fecha:</span>
              <span className="badge bg-warning" style={{ color: "black" }}>{fecha}</span>
              <span className="badge bg-success">Total:</span>
              <span className="badge bg-warning" style={{ color: "black" }}>{numberWithCommas(egresosCadenaMes.filter(element => element.Fecha === fecha && element.SucursalId === SucursalId && element.UnidadDeNegocioId === UnidadDeNegocioId).reduce((acumula, item) => acumula + parseFloat(item.Monto), 0))}</span>
            </div>
          </div>
          <div className="table1-scroll">
            <table>
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Cuenta Contable </th>
                  <th>Subcuenta Contable</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {egresosCadenaMes.filter(element => element.SucursalId === SucursalId && element.UnidadDeNegocioId === UnidadDeNegocioId && element.Fecha === fecha).map((element, i) =>
                (<tr key={i}>
                  <td>{element.FolioId}</td>
                  <td>{element.CuentaContable}</td>
                  <td>{element.SubcuentaContable}</td>
                  <td style={{ minWidth: "74px" }}>{element.Fecha}</td>
                  <td style={{ textAlign: "right" }}>{numberWithCommas(element.Monto)}</td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="item item2">
        <span className="badge bg-primary">MES</span>
        <div className="mes">
          <div className="enca-mes">
            <span className="badge bg-danger">{sucursales.find(element => element.SucursalId === SucursalId)?.Sucursal}</span>
            <span className="badge bg-primary">{unidadesDeNegocio.find(element => element.UnidadDeNegocioId === UnidadDeNegocioId)?.UnidadDeNegocio}</span>
          </div>
          <div className="enca-mes">
            <span className="badge bg-success">Periodo:</span>
            <span className="badge bg-warning" style={{ color: "black" }}>{periodoAbierto}</span>
            <span className="badge bg-success">Total:</span>
            <span className="badge bg-warning" style={{ color: "black" }}>{numberWithCommas(egresosCadenaMes.filter(element => element.SucursalId === SucursalId && element.UnidadDeNegocioId === UnidadDeNegocioId).reduce((acumula, item) => acumula + parseFloat(item.Monto), 0))}</span>
          </div>
        </div>
        <div className="table2-scroll">

          <table>
            <thead>
              <tr>
                <th>Folio</th>
                <th>Cuenta Contable </th>
                <th>Subcuenta Contable</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {egresosCadenaMes.filter(element => element.SucursalId === SucursalId && element.UnidadDeNegocioId === UnidadDeNegocioId).map((element, i) =>
              (<tr key={i}>
                <td>{element.FolioId}</td>
                <td>{element.CuentaContable}</td>
                <td>{element.SubcuentaContable}</td>
                <td style={{ minWidth: "74px" }}>{element.Fecha}</td>
                <td style={{ textAlign: "right" }}>{numberWithCommas(element.Monto)}</td>
                <td><button className="btn btn-danger" style={{ fontSize: ".7em" }} onClick={() => handleModifica(element)}>Modificar</button></td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default Egresos
