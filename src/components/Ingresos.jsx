import React, { useEffect, useState, useRef } from 'react'

import './Ingresos.css'

import { numberWithCommas, sanitizeNumericInput } from './utils/FuncionesGlobales'

const Ingresos = ({ onProps, naturalezaCC }) => {
  const User = onProps.User
  const [show, setShow] = useState(false)

  const [unidadesDeNegocioCatalogo, setUnidadesDeNegocioCatalogo] = useState([])
  const [UnidadDeNegocioId, setUnidadDeNegocioId] = useState(0)

  const [cuentasContablesCatalogo, setCuentasContablesCatalogo] = useState([])
  const [CuentaContableId, setCuentaContableId] = useState(0)
  const [cuentasContablesCatalogoFiltrado, setCuentasContablesCatalogoFiltrado] = useState([])

  const [subcuentasContablesCatalogo, setSubcuentasContablesCatalogo] = useState([])
  const [SubcuentaContableId, setSubcuentaContableId] = useState(0)
  const [subcuentasContablesCatalogoFiltrado, setSubcuentasContablesCatalogoFiltrado] = useState([])


  const [totalDia, setTotalDia] = useState(0)
  const [totalMes, setTotalMes] = useState(0)

  const origin = onProps.origin
  const accessToken = onProps.accessToken

  const [fecha, setFecha] = useState("");
  const [periodoAbierto, setPeriodoAbierto] = useState("")
  const [periodoAbiertoPrimerDia, setPeriodoAbiertoPrimerDia] = useState("")
  const [periodoAbiertoUltimoDia, setPeriodoAbiertoUltimoDia] = useState("")

  const [arregloVentasIngresosMes, setArregloVentasIngresosMes] = useState([]) //Este se actualiza cuando accesoDB es true
  const [disabledBotonGrabar, setDisabledBotonGrabar] = useState(false)
  const [isDisabledInputSanPedro, setIsDisabledInputSanPedro] = useState(true)
  const [isDisabledInputLimon, setIsDisabledInputLimon] = useState(true)
  const [isDisabledInputSantaMaria, setIsDisabledInputSantaMaria] = useState(true)
  const [isDisabledInputSAD, setIsDisabledInputSAD] = useState(true)
  const [isDisabledInputEmpresa, setIsDisabledInputEmpresa] = useState(true)
  const [isDisabledVentanaEmpresa, setIsDisabledVentanaEmpresa] = useState(true)
  const [isDisabledBotonModSanPedro, setIsDisabledBotonModSanPedro] = useState(false)
  const [isDisabledBotonModLimon, setIsDisabledBotonModLimon] = useState(false)
  const [isDisabledBotonModSantaMaria, setIsDisabledBotonModSantaMaria] = useState(false)
  const [isDisabledBotonModSad, setIsDisabledBotonModSad] = useState(false)
  const [isDisabledBotonModEmpresa, setIsDisabledBotonModEmpresa] = useState(false)

  const [sanPedroTotal, setSanPedroTotal] = useState("")
  const [limonTotal, setLimonTotal] = useState("")
  const [santaMariaTotal, setSantaMariaTotal] = useState("")
  const [sadTotal, setSadTotal] = useState("")
  const [empresaTotal, setEmpresaTotal] = useState("")


  const sanPedroInputRef = useRef(null)
  const limonInputRef = useRef(null)
  const santaMariaInputRef = useRef(null)
  const sadInputRef = useRef(null)
  const empresaInputRef = useRef(null)
  const modificaMontoInputRef = useRef(null)

  const [colorShowAlert, setColorShowAlert] = useState("")
  const [messageAlert, setMessageAlert] = useState("")
  const [showAlert, setShowAlert] = useState(true);
  const [statusDisplay, setStatusDisplay] = useState("none")

  const [ventanaModifica, setVentanaModifica] = useState(false)

  const [sucursalIdModifica, setSucursalIdModifica] = useState(0)
  const [sucursalNombreModifica, setSucursalNombreModifica] = useState("")
  const [folioIdModifica, setFolioIdModifica] = useState(0)
  const [montoModifica, setMontoModifica] = useState(0)

  useEffect(() => {
    async function fetchData() {
      const vUnidadDeNegocioId = await getUnidadesDeNegocio()
      const vCuentaContableId = await getCuentasContables(vUnidadDeNegocioId)
      const vSubcuentaContableId = await getSubcuentasContables(vCuentaContableId)
      const vFechaHoy = await getFechaHoy()
      const vFecha = await getPeriodoAbierto(vFechaHoy)
      const aIngresos = await handleConsultaIngresos(vFecha, "mes")
      handleActualizaValores(vFecha, aIngresos, vUnidadDeNegocioId, vCuentaContableId, vSubcuentaContableId)


      if (isDisabledVentanaEmpresa) {
        sanPedroInputRef.current.select()
        sanPedroInputRef.current.focus()
        if (sanPedroInputRef.current) {
          sanPedroInputRef.current.focus();
        }

      }

    }
    fetchData()
    setShow(true)
  }, [])


  const handleModificaSanPedro = () => {
    if(fecha < periodoAbiertoPrimerDia){
      alert("No se permite modificar movimientos de meses cerrados")
      return
    }
    setVentanaModifica(true)
    const arregloAModificar = arregloVentasIngresosMes.filter(item => item.Fecha === fecha && item.SucursalId === 1 && item.UnidadDeNegocioId === parseInt(UnidadDeNegocioId) && item.CuentaContableId === parseInt(CuentaContableId) && item.SubcuentaContableId === SubcuentaContableId)

    setSucursalIdModifica(parseInt(arregloAModificar[0].SucursalId))
    setSucursalNombreModifica(arregloAModificar[0].SucursalNombre)
    setFolioIdModifica(parseInt(arregloAModificar[0].FolioId))
    setMontoModifica(arregloAModificar[0].Monto)

    setTimeout(() => {
      modificaMontoInputRef.current.focus();  // Hace foco en el input
      modificaMontoInputRef.current.select(); // Selecciona el texto
    }, 0);

  }

  const handleModificaLimon = () => {
    if(fecha < periodoAbiertoPrimerDia){
      alert("No se permite modificar movimientos de meses cerrados")
      return
    }

    setVentanaModifica(true)
    const arregloAModificar = arregloVentasIngresosMes.filter(item => item.Fecha === fecha && item.SucursalId === 2 && item.UnidadDeNegocioId === parseInt(UnidadDeNegocioId) && item.CuentaContableId === parseInt(CuentaContableId) && item.SubcuentaContableId === SubcuentaContableId)

    setSucursalIdModifica(parseInt(arregloAModificar[0].SucursalId))
    setSucursalNombreModifica(arregloAModificar[0].SucursalNombre)
    setFolioIdModifica(parseInt(arregloAModificar[0].FolioId))
    setMontoModifica(arregloAModificar[0].Monto)

    setTimeout(() => {
      modificaMontoInputRef.current.focus();  // Hace foco en el input
      modificaMontoInputRef.current.select(); // Selecciona el texto
    }, 0);

  }

  const handleModificaSantaMaria = () => {
    if(fecha < periodoAbiertoPrimerDia){
      alert("No se permite modificar movimientos de meses cerrados")
      return
    }

    setVentanaModifica(true)
    const arregloAModificar = arregloVentasIngresosMes.filter(item => item.Fecha === fecha && item.SucursalId === 3 && item.UnidadDeNegocioId === parseInt(UnidadDeNegocioId) && item.CuentaContableId === parseInt(CuentaContableId) && item.SubcuentaContableId === SubcuentaContableId)

    setSucursalIdModifica(parseInt(arregloAModificar[0].SucursalId))
    setSucursalNombreModifica(arregloAModificar[0].SucursalNombre)
    setFolioIdModifica(parseInt(arregloAModificar[0].FolioId))
    setMontoModifica(arregloAModificar[0].Monto)

    setTimeout(() => {
      modificaMontoInputRef.current.focus();  // Hace foco en el input
      modificaMontoInputRef.current.select(); // Selecciona el texto
    }, 0);

  }

  const handleModificaSad = () => {
    if(fecha < periodoAbiertoPrimerDia){
      alert("No se permite modificar movimientos de meses cerrados")
      return
    }

    setVentanaModifica(true)
    const arregloAModificar = arregloVentasIngresosMes.filter(item => item.Fecha === fecha && item.SucursalId === 4 && item.UnidadDeNegocioId === parseInt(UnidadDeNegocioId) && item.CuentaContableId === parseInt(CuentaContableId) && item.SubcuentaContableId === SubcuentaContableId)

    setSucursalIdModifica(parseInt(arregloAModificar[0].SucursalId))
    setSucursalNombreModifica(arregloAModificar[0].SucursalNombre)
    setFolioIdModifica(parseInt(arregloAModificar[0].FolioId))
    setMontoModifica(arregloAModificar[0].Monto)

    setTimeout(() => {
      modificaMontoInputRef.current.focus();  // Hace foco en el input
      modificaMontoInputRef.current.select(); // Selecciona el texto
    }, 0);

  }

  const handleModificaEmpresa = () => {
    if(fecha < periodoAbiertoPrimerDia){
      alert("No se permite modificar movimientos de meses cerrados")
      return
    }

    setVentanaModifica(true)
    const arregloAModificar = arregloVentasIngresosMes.filter(item => item.Fecha === fecha && item.SucursalId === 101 && item.UnidadDeNegocioId === parseInt(UnidadDeNegocioId) && item.CuentaContableId === parseInt(CuentaContableId) && item.SubcuentaContableId === SubcuentaContableId)

    setSucursalIdModifica(parseInt(arregloAModificar[0].SucursalId))
    setSucursalNombreModifica(arregloAModificar[0].SucursalNombre)
    setFolioIdModifica(parseInt(arregloAModificar[0].FolioId))
    setMontoModifica(arregloAModificar[0].Monto)

    setTimeout(() => {
      modificaMontoInputRef.current.focus();  // Hace foco en el input
      modificaMontoInputRef.current.select(); // Selecciona el texto
    }, 0);


  }


  const handleActualizaValores = (vFecha, vArregloVentasIngresosMes, vUnidadDeNegocioId, vCuentaContableId, vSubcuentaContableId) => {
    setSanPedroTotal(vArregloVentasIngresosMes.filter((element) => element.SucursalId === 1 && element.Fecha === vFecha && element.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && element.CuentaContableId === parseInt(vCuentaContableId) && element.SubcuentaContableId === vSubcuentaContableId)[0]?.Monto || "")
    setLimonTotal(vArregloVentasIngresosMes.filter((element) => element.SucursalId === 2 && element.Fecha === vFecha && element.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && element.CuentaContableId === parseInt(vCuentaContableId) && element.SubcuentaContableId === vSubcuentaContableId)[0]?.Monto || "")
    setSantaMariaTotal(vArregloVentasIngresosMes.filter((element) => element.SucursalId === 3 && element.Fecha === vFecha && element.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && element.CuentaContableId === parseInt(vCuentaContableId) && element.SubcuentaContableId === vSubcuentaContableId)[0]?.Monto || "")
    setSadTotal(vArregloVentasIngresosMes.filter((element) => element.SucursalId === 4 && element.Fecha === vFecha && element.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && element.CuentaContableId === parseInt(vCuentaContableId) && element.SubcuentaContableId === vSubcuentaContableId)[0]?.Monto || "")
    setEmpresaTotal(vArregloVentasIngresosMes.filter((element) => element.SucursalId === 101 && element.Fecha === vFecha && element.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && element.CuentaContableId === parseInt(vCuentaContableId) && element.SubcuentaContableId === vSubcuentaContableId)[0]?.Monto || "")

    const vTotalDia = vArregloVentasIngresosMes.filter(item => item.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && item.Fecha === vFecha && item.CuentaContableId === parseInt(vCuentaContableId) && item.SubcuentaContableId === vSubcuentaContableId).reduce((acumula, item) => acumula + parseFloat(item.Monto) || 0, 0)
    setTotalDia(vTotalDia)
    const vTotalMes = vArregloVentasIngresosMes.filter(item => item.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId)).reduce((acumula, item) => acumula + parseFloat(item.Monto) || 0, 0)
    setTotalMes(vTotalMes)


    const lengthSanPedro = vArregloVentasIngresosMes.filter((element) => element.SucursalId === 1 && element.Fecha === vFecha && element.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && element.CuentaContableId === parseInt(vCuentaContableId) && element.SubcuentaContableId === vSubcuentaContableId).length
    const lengthLimon = vArregloVentasIngresosMes.filter((element) => element.SucursalId === 2 && element.Fecha === vFecha && element.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && element.CuentaContableId === parseInt(vCuentaContableId) && element.SubcuentaContableId === vSubcuentaContableId).length
    const lengthSantaMaria = vArregloVentasIngresosMes.filter((element) => element.SucursalId === 3 && element.Fecha === vFecha && element.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && element.CuentaContableId === parseInt(vCuentaContableId) && element.SubcuentaContableId === vSubcuentaContableId).length
    const lengthSad = vArregloVentasIngresosMes.filter((element) => element.SucursalId === 4 && element.Fecha === vFecha && element.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && element.CuentaContableId === parseInt(vCuentaContableId) && element.SubcuentaContableId === vSubcuentaContableId).length
    const lengthEmpresa = vArregloVentasIngresosMes.filter((element) => element.SucursalId === 101 && element.Fecha === vFecha && element.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && element.CuentaContableId === parseInt(vCuentaContableId) && element.SubcuentaContableId === vSubcuentaContableId).length


    if (lengthSanPedro > 0 ) {
      setIsDisabledBotonModSanPedro(false)
      setIsDisabledInputSanPedro(true)
    } else {
      setIsDisabledBotonModSanPedro(true)
      setIsDisabledInputSanPedro(false)
      if (vUnidadDeNegocioId === 1 || vUnidadDeNegocioId === 2) {
        setTimeout(() => {
          sanPedroInputRef.current.focus()
        }, 0);
      }
    }

    if (lengthLimon > 0 ) {
      setIsDisabledBotonModLimon(false)
      setIsDisabledInputLimon(true)
    } else {
      setIsDisabledBotonModLimon(true)
      setIsDisabledInputLimon(false)
    }

    if (lengthSantaMaria > 0 ) {
      setIsDisabledBotonModSantaMaria(false)
      setIsDisabledInputSantaMaria(true)
    } else {
      setIsDisabledBotonModSantaMaria(true)
      setIsDisabledInputSantaMaria(false)
    }

    if (lengthSad > 0 ) {
      setIsDisabledBotonModSad(false)
      setIsDisabledInputSAD(true)
    } else {
      setIsDisabledBotonModSad(true)
      setIsDisabledInputSAD(false)
    }

    if (lengthEmpresa > 0 ) {
      setIsDisabledBotonModEmpresa(false)
      setIsDisabledInputEmpresa(true)
    } else {
      setIsDisabledBotonModEmpresa(true)
      setIsDisabledInputEmpresa(false)
      if (vUnidadDeNegocioId === 11) {
        setTimeout(() => {
          empresaInputRef.current.focus()
        }, 0);
      }
    }

    if (vArregloVentasIngresosMes.filter((element) => element.Fecha === vFecha && element.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && element.CuentaContableId === parseInt(vCuentaContableId) && element.SubcuentaContableId === vSubcuentaContableId).length > 0) {
      setDisabledBotonGrabar(true)

      if(vFecha < periodoAbiertoPrimerDia){
        setIsDisabledBotonModSanPedro(true)
        setIsDisabledBotonModLimon(true)
        setIsDisabledBotonModSantaMaria(true)
        setIsDisabledBotonModSad(true)
        setIsDisabledBotonModEmpresa(true)
      }
      
      
    } else {
      setDisabledBotonGrabar(false)

      if(vFecha < periodoAbiertoPrimerDia){
        setIsDisabledBotonModSanPedro(true)
        setIsDisabledBotonModLimon(true)
        setIsDisabledBotonModSantaMaria(true)
        setIsDisabledBotonModSad(true)
        setIsDisabledBotonModEmpresa(true)
      }
    }

    


  }


  const getFechaHoy = async () => {
    const url = origin + `/api/fechahoy`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      if (data.error) {
        alert(data.error)
        return data.error
      }
      setFecha(data[0].FechaHoy.substring(0, 10))
      return data[0].FechaHoy.substring(0, 10)
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      return { error: error.message }
    }
  };

  const getPeriodoAbierto = async (vFecha) => {
    let vFechaPeriodo = vFecha
    const url = origin + `/api/periodoabierto`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error)
        return data.error
      }

      if (vFecha > data[0].UltimoDiaMes.substring(0, 10)) {
        setFecha(data[0].UltimoDiaMes.substring(0, 10))
        vFechaPeriodo = data[0].UltimoDiaMes.substring(0, 10)
      }
      if (vFecha < data[0].PrimerDiaMes.substring(0, 10)) {
        setFecha(data[0].PrimerDiaMes.substring(0, 10))
        vFechaPeriodo = data[0].PrimerDiaMes.substring(0, 10)
      }

      setPeriodoAbierto(data[0].Periodo)
      setPeriodoAbiertoPrimerDia(data[0].PrimerDiaMes.substring(0, 10))
      setPeriodoAbiertoUltimoDia(data[0].UltimoDiaMes.substring(0, 10))
      return vFechaPeriodo
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  const getUnidadesDeNegocio = async () => {
    const url =
      origin + `/api/ingresos/unidadesdenegociocatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      //Crea un nuevo arreglo de catálogo con ciertos campos sin duplicados.
      const catalogo = Array.from(
        new Map(data.map(item => [item.UnidadDeNegocioId, {
          UnidadDeNegocioId: item.UnidadDeNegocioId,
          UnidadDeNegocio: item.UnidadDeNegocio
        }])).values()
      );
      if (data.error) {
        alert(data.error)
        return bandera
      }
      setUnidadesDeNegocioCatalogo(catalogo) //Formé un catálogo para este Component
      setUnidadDeNegocioId(catalogo[0].UnidadDeNegocioId) //Valor Inicial al cargar el Component
      return catalogo[0].UnidadDeNegocioId
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };



  const getCuentasContables = async (vUnidadDeNegocioId) => {
    let bandera = false;
    const url =
      origin + `/api/ingresos/cuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      //Crea un nuevo arreglo de catálogo con ciertos campos sin duplicados.
      const catalogo = Array.from(
        new Map(
          data.map(item => [
            `${item.UnidadDeNegocioId}-${item.CuentaContableId}`, // Clave única
            { UnidadDeNegocioId: item.UnidadDeNegocioId, CuentaContableId: item.CuentaContableId, CuentaContable: item.CuentaContable }
          ])
        ).values()
      );

      const catalogoFiltrado = catalogo.filter(item => item.UnidadDeNegocioId === vUnidadDeNegocioId)
      setCuentasContablesCatalogo(catalogo)
      setCuentasContablesCatalogoFiltrado(catalogoFiltrado)

      setCuentaContableId(catalogoFiltrado[0].CuentaContableId)
      bandera = true;
      return catalogoFiltrado[0].CuentaContableId
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  const getSubcuentasContables = async (vCuentaContableId) => {
    let bandera = false;
    const url =
      origin + `/api/ingresos/subcuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      let catalogo = [];
      for (let i = 0; data.length > i; i++) {
        let json = {
          UnidadDeNegocioId: data[i].UnidadDeNegocioId,
          CuentaContableId: data[i].CuentaContableId,
          SubcuentaContableId: data[i].SubcuentaContableId,
          SubcuentaContable: data[i].SubcuentaContable,
        };
        let arregloTemp =
          catalogo.find(
            (element) =>
              data[i].UnidadDeNegocioId === element.UnidadDeNegocioId &&
              data[i].CuentaContableId === element.CuentaContableId &&
              element.SubcuentaContableId === data[i].SubcuentaContableId
          ) || [];
        if (arregloTemp.length === 0) {
          catalogo.push(json);
        }
      }
      setSubcuentasContablesCatalogo(catalogo)
      const catalogoFiltrado = catalogo.filter(item => item.CuentaContableId === vCuentaContableId)
      setSubcuentasContablesCatalogoFiltrado(catalogoFiltrado)
      setSubcuentaContableId(catalogoFiltrado[0].SubcuentaContableId)
      return catalogoFiltrado[0].SubcuentaContableId
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  const handleUnidadesDeNegocio = (e) => {
    const vUnidadDeNegocioId = parseInt(e.target.value)
    setUnidadDeNegocioId(vUnidadDeNegocioId)

    const arreglo_CC_filtrado = cuentasContablesCatalogo.filter(item => item.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId))
    setCuentasContablesCatalogoFiltrado(arreglo_CC_filtrado)
    setCuentaContableId(arreglo_CC_filtrado[0].CuentaContableId)

    const arreglo_SCC_filtrado = subcuentasContablesCatalogo.filter(item => item.UnidadDeNegocioId === parseInt(vUnidadDeNegocioId) && item.CuentaContableId === arreglo_CC_filtrado[0].CuentaContableId)
    setSubcuentasContablesCatalogoFiltrado(arreglo_SCC_filtrado)
    setSubcuentaContableId(arreglo_SCC_filtrado[0].SubcuentaContableId)

    handleActualizaValores(fecha, arregloVentasIngresosMes, vUnidadDeNegocioId, parseInt(arreglo_CC_filtrado[0].CuentaContableId), arreglo_SCC_filtrado[0].SubcuentaContableId)

    if (vUnidadDeNegocioId === 11) { //Si es 11 habilita Campos EMPRESA
      setIsDisabledVentanaEmpresa(false)
    } else {
      setIsDisabledVentanaEmpresa(true)
    }

  }

  const handleCuentasContables = (e) => {
    const vCuentaContableId = e.target.value
    setCuentaContableId(e.target.value)

    const arreglo_SCC_filtrado = subcuentasContablesCatalogo.filter(item => item.UnidadDeNegocioId === parseInt(UnidadDeNegocioId) && item.CuentaContableId === parseInt(vCuentaContableId))
    setSubcuentasContablesCatalogoFiltrado(arreglo_SCC_filtrado)
    setSubcuentaContableId(arreglo_SCC_filtrado[0].SubcuentaContableId)

    handleActualizaValores(fecha, arregloVentasIngresosMes, parseInt(UnidadDeNegocioId), parseInt(vCuentaContableId), arreglo_SCC_filtrado[0].SubcuentaContableId)
  }

  const handleSubcuentasContables = (e) => {
    const vSubcuentaContableId = e.target.value
    setSubcuentaContableId(e.target.value)
    handleActualizaValores(fecha, arregloVentasIngresosMes, parseInt(UnidadDeNegocioId), parseInt(CuentaContableId), vSubcuentaContableId)

  }

  const handleFecha = async (e) => {
    const vFecha = e.target.value;
    setFecha(vFecha)
    const aIngresos = await handleConsultaIngresos(vFecha, "mes")
    handleActualizaValores(vFecha, aIngresos, UnidadDeNegocioId, CuentaContableId, SubcuentaContableId)
  };

  const handleConsultaIngresos = async (vFecha, accesoDB) => {
    const trans = "Ingresos"
    let data = []
    const url =
      origin +
      `/api/ingresos/getIngresosEgresos/${vFecha}/${naturalezaCC}/${accesoDB}/${trans}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

    setArregloVentasIngresosMes(data) //Este se actualiza cuando accesoDB es true
    return data
  };

  const handleGrabar = async () => {
    if (fecha < periodoAbiertoPrimerDia) {
      alert("No se permite modificar un Periodo Cerrado");
      return;
    }

    const totalMovimientos = parseFloat(sanPedroTotal || 0) + parseFloat(limonTotal || 0) + parseFloat(santaMariaTotal || 0) + parseFloat(empresaTotal || 0)
    if (totalMovimientos <= 0) {
      alert("No hay movimiento que registrar");
      return;
    }
    let json = []

    if (isDisabledVentanaEmpresa) {
      json = [
        { SucursalId: 1, UnidadDeNegocioId: UnidadDeNegocioId, CuentaContableId: CuentaContableId, SubcuentaContableId: SubcuentaContableId, Fecha: fecha, Monto: parseFloat(sanPedroTotal) || 0, Comentarios: "", Usuario: User },
        { SucursalId: 2, UnidadDeNegocioId: UnidadDeNegocioId, CuentaContableId: CuentaContableId, SubcuentaContableId: SubcuentaContableId, Fecha: fecha, Monto: parseFloat(limonTotal) || 0, Comentarios: "", Usuario: User },
        { SucursalId: 3, UnidadDeNegocioId: UnidadDeNegocioId, CuentaContableId: CuentaContableId, SubcuentaContableId: SubcuentaContableId, Fecha: fecha, Monto: parseFloat(santaMariaTotal) || 0, Comentarios: "", Usuario: User },
        { SucursalId: 4, UnidadDeNegocioId: UnidadDeNegocioId, CuentaContableId: CuentaContableId, SubcuentaContableId: SubcuentaContableId, Fecha: fecha, Monto: parseFloat(sadTotal) || 0, Comentarios: "", Usuario: User }
      ]
    } else {
      json = [{ SucursalId: 101, UnidadDeNegocioId: UnidadDeNegocioId, CuentaContableId: CuentaContableId, SubcuentaContableId: SubcuentaContableId, Fecha: fecha, Monto: parseFloat(empresaTotal) || 0, Comentarios: "", Usuario: User }]
    }


    const url = `${origin}/api/ingresos/grabaingresos2`;
    try {
      const response = await fetch(url, {
        method: "POST",
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
      const aIngresos = await handleConsultaIngresos(fecha, "mes");
      handleActualizaValores(fecha, aIngresos, UnidadDeNegocioId, CuentaContableId, SubcuentaContableId)


      // #####################################################################
      setStatusDisplay("block")
      setColorShowAlert("lightgreen")
      setMessageAlert("Registro de Ingersos Exitoso ")
      setShowAlert(true);  // Mostrar la alerta
      setTimeout(() => {
        setShowAlert(false);  // Ocultar la alerta después de 1 segundo
        setStatusDisplay("none")
      }, 1000);

      //#########################################################################

    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }



  };

  const handleKeyDownSanPedro = (e) => {
    if (e.key === 'Enter') {
      limonInputRef.current.focus()
    }
  }

  const handleKeyDownLimon = (e) => {
    if (e.key === 'Enter') {
      santaMariaInputRef.current.focus()
    }
  }


  const handleKeyDownSantaMaria = (e) => {
    if (e.key === 'Enter') {
      sadInputRef.current.focus()
    }
  }

  const handleKeyDownSad = (e) => {
    if (e.key === 'Enter') {
      sanPedroInputRef.current.focus()
    }
  }


  const handleSanPedro = (e) => {
    const inputValue = e.target.value;
    const formattedValue = sanitizeNumericInput(inputValue)
    setSanPedroTotal(formattedValue);
  }

  const handleMontoModifica = (e) => {
    const inputValue = e.target.value;
    const formattedValue = sanitizeNumericInput(inputValue)
    setMontoModifica(formattedValue);
  }

  const handleClickMontoModifica = async () => {
    const vMonto = arregloVentasIngresosMes.filter(item => item.SucursalId === parseInt(sucursalIdModifica) && item.FolioId === parseInt(folioIdModifica))[0].Monto || 0
    if (montoModifica < 0 || montoModifica === "") {
      alert("Monto Incorrecto")
      setMontoModifica(vMonto)
      return
    }

    const url = `${origin}/api/actualizaingresosegresos`;
    const json = {
      SucursalId: sucursalIdModifica,
      FolioId: folioIdModifica,
      Monto: montoModifica,
      Comentarios: "",
      Usuario: User,
    };
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
        alert(data.error);
        return;
      }
      alert(data.message);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    const accesoDB = "mes"; // Consulta la Base de Datos
    const aIngresos = await handleConsultaIngresos(fecha, accesoDB);
    handleActualizaValores(fecha, aIngresos, UnidadDeNegocioId, CuentaContableId, SubcuentaContableId)
    setVentanaModifica(false)
    setSucursalIdModifica(0)
    setSucursalNombreModifica("")
    setFolioIdModifica(0)
    setMontoModifica(0)
  }

  const handleClickMontoCancelar = () => {
    setVentanaModifica(false)
    setSucursalIdModifica(0)
    setSucursalNombreModifica("")
    setFolioIdModifica(0)
    setMontoModifica(0)
  }

  const handleLimon = (e) => {
    const inputValue = e.target.value;
    const formattedValue = sanitizeNumericInput(inputValue)
    setLimonTotal(formattedValue);
  }

  const handleSantaMaria = (e) => {
    const inputValue = e.target.value;
    const formattedValue = sanitizeNumericInput(inputValue)
    setSantaMariaTotal(formattedValue);
  }
  const handleSAD = (e) => {
    const inputValue = e.target.value;
    const formattedValue = sanitizeNumericInput(inputValue)
    setSadTotal(formattedValue);
  }

  const handleEmpresa = (e) => {
    const inputValue = e.target.value;
    const formattedValue = sanitizeNumericInput(inputValue)
    setEmpresaTotal(formattedValue);
  }

  const handleRender = () => {
    return (
      <div className="container ingresos-container">

        <div className="item item1">

          {ventanaModifica ?
            <div style={{ position: "fixed", top: "56px", left: "4%", width: "432px", height: "350px", zIndex: "1000", border: "7px lightgreen solid", borderRadius: "10px", background: "orange" }}>
              <div className="container-ventanaModifica">
                <h6 style={{ textAlign: "center" }}>MODIFICA MONTO</h6>
                <div className="child">
                  <label>Sucursal</label>
                  <input type="text" value={sucursalNombreModifica} disabled />
                </div>
                <div className="child">
                  <label>Folio</label>
                  <input type="text" value={folioIdModifica} disabled />
                </div>
                <div className="child">
                  <label>Monto</label>
                  <input style={{ textAlign: "right" }} onChange={handleMontoModifica} value={numberWithCommas(montoModifica)} ref={modificaMontoInputRef} autoFocus />
                </div>
                <br />
                <button className='btn btn-success' onClick={handleClickMontoModifica}>Modificar</button>
                <button className='btn btn-danger' onClick={handleClickMontoCancelar}>Cancelar</button>
              </div>
            </div> : null}

          {showAlert && (
            <div className="my-alert" style={{ backgroundColor: colorShowAlert, display: statusDisplay, border: "5px orange solid", borderRadius: "10px" }}>
              <h3>{messageAlert}</h3>
            </div>
          )}

          <div className="form-row">
            <label>Unidades de Negocio</label>
            <select name="unidadesDeNegocio" id="unidadesDeNegocio" value={UnidadDeNegocioId} onChange={handleUnidadesDeNegocio} style={{ marginLeft: "10px", padding: "5px" }}>
              {unidadesDeNegocioCatalogo.map((element, i) => (<option key={i} value={element.UnidadDeNegocioId}>{element.UnidadDeNegocio}</option>))}
            </select>

          </div>
          <div className="form-row">
            <label>Cuenta Contable</label>
            <select name="cuentasContables" id="cuentasContables" value={CuentaContableId} onChange={handleCuentasContables} style={{ marginLeft: "10px", padding: "5px" }}>
              {cuentasContablesCatalogoFiltrado.map((element, i) => (<option key={i} value={element.CuentaContableId}>{element.CuentaContable}</option>))}
            </select>
          </div>
          <div className="form-row">
            <label>Subcuenta Contable</label>
            <select name="subcuentasContable" id="subcuentasContable" value={SubcuentaContableId} onChange={handleSubcuentasContables} style={{ marginLeft: "10px", padding: "5px" }}>
              {subcuentasContablesCatalogoFiltrado.map((element, i) => (<option key={i} value={element.SubcuentaContableId}>{element.SubcuentaContable}</option>))}
            </select>
          </div>
          <div className="form-row">
            <label>Fecha</label>
            <input id="id_fecha" type="date" value={fecha} onChange={handleFecha} style={{ marginLeft: "10px", padding: "5px" }} />
          </div>


          <div className="form-row-titulos">
            <div className="form-row-titulos-items">
              <label>Monto</label>
            </div>
            <div className="form-row-titulos-items">
              <label>Comentarios</label>
            </div>
          </div>

          {isDisabledVentanaEmpresa ?
            (
              <>
                <div className="form-row2">
                  <label htmlFor='sanPedroId'>San Pedro</label>
                  <input id="sanPedroId" type="numeric" value={numberWithCommas(sanPedroTotal)} onChange={handleSanPedro} onKeyDown={handleKeyDownSanPedro} style={{ textAlign: "right" }} disabled={isDisabledInputSanPedro} ref={sanPedroInputRef} autoComplete='off' autoFocus />
                  <input type="text" disabled />
                  <button disabled={isDisabledBotonModSanPedro} onClick={handleModificaSanPedro}>*</button>
                </div>
                <div className="form-row2">
                  <label htmlFor='limonId'>Limón</label>
                  <input id="limonId" type="text" value={numberWithCommas(limonTotal)} onChange={handleLimon} onKeyDown={handleKeyDownLimon} style={{ textAlign: "right" }} disabled={isDisabledInputLimon} ref={limonInputRef} autoComplete='off' />
                  <input type="text" disabled />
                  <button disabled={isDisabledBotonModLimon} onClick={handleModificaLimon}>*</button>
                </div>
                <div className="form-row2">
                  <label htmlFor='santaMariaId'>Santa María</label>
                  <input id="santaMariaId" type="text" value={numberWithCommas(santaMariaTotal)} onChange={handleSantaMaria} onKeyDown={handleKeyDownSantaMaria} style={{ textAlign: "right" }} disabled={isDisabledInputSantaMaria} ref={santaMariaInputRef} autoComplete='off' />
                  <input type="text" disabled />
                  <button disabled={isDisabledBotonModSantaMaria} onClick={handleModificaSantaMaria}>*</button>
                </div>
                <div className="form-row2">
                  <label htmlFor='sadId'>SAD</label>
                  <input id="sadId" type="text" value={numberWithCommas(sadTotal)} onChange={handleSAD} onKeyDown={handleKeyDownSad} style={{ textAlign: "right" }} disabled={isDisabledInputSAD} ref={sadInputRef} autoComplete='off' />
                  <input type="text" disabled />
                  <button disabled={isDisabledBotonModSad} onClick={handleModificaSad}>*</button>
                </div>
              </>
            )
            : (<div className="form-row2">
              <label htmlFor='empresaId'>Empresa</label>
              <input id="empresaId" type="numeric" value={numberWithCommas(empresaTotal)} onChange={handleEmpresa} style={{ textAlign: "right" }} disabled={isDisabledInputEmpresa} autoFocus ref={empresaInputRef} autoComplete='off' />
              <input type="text" disabled />
              <button disabled={isDisabledBotonModEmpresa} onClick={handleModificaEmpresa}>*</button>
            </div>)
          }
          <br />
          <div className="form-totaldiames">
            <div className="child">
              <label>Total Día</label>
              <input type="text" value={numberWithCommas(totalDia)} style={{ textAlign: "right" }} readOnly />
            </div>
            <div className="child">
              <label>Total Mes</label>
              <input type="text" value={numberWithCommas(totalMes)} style={{ textAlign: "right" }} readOnly />
            </div>

          </div>

          <div className="form-botones">
            <button className="btn btn-danger btn-md" disabled >Cancelar</button>
            <button className="btn btn-success btn-lg" onClick={handleGrabar} disabled={disabledBotonGrabar}>Grabar</button>
          </div>
        </div>

        <div className="item item2">
          <div className="totalDia">
            <span style={{ fontSize: "1.4em" }}><b>Día</b></span> <span className="badge bg-primary px-4 py-1" style={{ textAlign: "right", fontSize: "1.2em", marginBottom: "5px" }}>$ {numberWithCommas(totalDia)}</span>
          </div>
          <div className="ingresosTabla1 "style={{ fontSize: ".7em", width: "373px", height: "131px", overflowY: "scroll", border: "1px solid #ccc" }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "20px" }}>Sucursal</th>
                  <th>Unidad de Negocia</th>
                  <th>Folio</th>
                  <th>Fecha</th>
                  <th>Cuenta Contable</th>
                  <th>Subcuenta Contable</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {arregloVentasIngresosMes.filter((element) => element.Fecha === fecha && element.UnidadDeNegocioId === UnidadDeNegocioId && element.CuentaContableId === parseInt(CuentaContableId) && element.SubcuentaContableId === SubcuentaContableId).map((item, i) => (
                  <tr key={i}>
                    <td>{item.SucursalNombre}</td>
                    <td>{item.UnidadDeNegocioNombre}</td>
                    <td>{item.FolioId}</td>
                    <td>{item.Fecha}</td>
                    <td>{item.CuentaContable}</td>
                    <td>{item.SubcuentaContable}</td>
                    <td style={{ textAlign: "right" }}>{numberWithCommas(item.Monto || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="item item3">
          <div className="totalMes">
            <span style={{ fontSize: "1.4em" }}><b>Mes</b></span> <span className="badge bg-primary px-4 py-1" style={{ textAlign: "right", fontSize: "1.2em", marginBottom: "5px" }}>$ {numberWithCommas(totalMes)}</span>
          </div>

          <div className="divScroll">
            <table>
              <thead>
                <tr>
                  <th>Sucursal</th>
                  <th>Unidad de Negocio</th>
                  <th>Folio</th>
                  <th style={{minWidth:"75px"}}>Fecha</th>
                  <th>Cuenta Contable</th>
                  <th>Subcuenta Contable</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>

                {arregloVentasIngresosMes.filter(element => element.UnidadDeNegocioId === UnidadDeNegocioId).map((item, i) => (
                  <tr key={i}>
                    <td>{item.SucursalNombre}</td>
                    <td>{item.UnidadDeNegocioNombre}</td>
                    <td>{item.FolioId}</td>
                    <td>{item.Fecha}</td>
                    <td>{item.CuentaContable}</td>
                    <td>{item.SubcuentaContable}</td>
                    <td style={{ textAlign: "right" }}>{numberWithCommas(item.Monto || 0)}</td>
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
      {show ? handleRender() : <h1>Loading . . .</h1>}
    </>
  )
}

export default Ingresos
