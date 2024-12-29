import React, { Component } from "react";

import "./VentasBI.css";
import {RechartsBarChart01, RechartsComposedChart03, RechartsComposedChart04} from "./utils/FuncionesRecharts"
import { numberWithCommas, NumeroAMes} from './utils/FuncionesGlobales'

import PacmanLoader from "react-spinners/PacmanLoader";

class VentasBI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Years: [],
      Year: 0,
      Meses: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
        "Total"
      ],
      ventas: [],
      ventasLastYear: [],
      egresos: [],
      egresosLastYear: [],
      ventasMelate: [],
      ventasMelateLastYear: [],
      pagosMelate: [],
      utilidadPerdida: [],
      utilidadPerdidaLimpiaduriaPorcentaje: [],
      utilidadPerdidaMelate: [],
      utilidadPerdidaMelatePorcentaje: [],
      utilidadPerdidaMelatePorcentajeRecharts: [],
      data: [],
      dataMelate: [],
      dataGastosInversiones: [],
      dataGastosInversionesTotales: [],
      dataGastosInversionesTotalesRecharts: [],
      banderaOrdenamiento: false,
      dataLimpiaduriaMelateRentasOtrosUtilidad: [],
      dataLimpiaduriaMelateRentasOtrosUtilidadRecharts: [],
    };
  }

  async componentDidMount() {
    if ((await this.getConsultaAnios()) === false) return;
  }

  getConsultaAnios = async () => {
    const url = this.props.onProps.origin + `/api/consultaaniosactivos`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.onProps.accessToken}`,
        },
      });

      const data = await response.json();


      this.setState({
        Years: data,
        Year: data[0].Year,
      },async()=>{
            if ((await this.getConsultaVentasPorMes()) === false) return;
            if ((await this.getConsultaEgresosPorMes()) === false) return;
            
            if ((await this.getConsultaVentasMelatePorMes()) === false) return;
            if ((await this.getConsultaPagosMelatePorMes()) === false) return;

            if ((await this.getGastosInversionesPorAnio()) === false) return;

            if ((await this.getLimpiaduriaMelateRentasOtrosUtilidad()) === false) return;

            this.handleUtilidadPerdida();
            this.handleArrayLineChart();
            this.handleArrayLineChartMelate();
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  
  getConsultaVentasPorMes = async () => {
    const Year = this.state.Year;
    let url = this.props.onProps.origin + `/api/consultalimpiaduriaventaspormes/${Year}`;
    let bandera = false;
    try {
      let response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.onProps.accessToken}`,
        },
      });

      const data = await response.json();



      //###################  Ventas del año pasado  ############################
      const LastYear = parseInt(Year) - 1
      url = this.props.onProps.origin + `/api/consultalimpiaduriaventaspormes/${LastYear}`;
      response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${this.props.onProps.accessToken}`,
          },
        });
  
        const dataLastYear = await response.json();
      //########################################################################




      this.setState({
        ventas: data,
        ventasLastYear: dataLastYear,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getConsultaEgresosPorMes = async () => {
    const Year = this.state.Year;
    let url =
      this.props.onProps.origin + `/api/consultalimpiaduriaegresospormes/${Year}`;
    let bandera = false;
    try {
      let response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.onProps.accessToken}`,
        },
      });

      const data = await response.json();


      const LastYear = parseInt(Year) - 1
      url =
      this.props.onProps.origin + `/api/consultalimpiaduriaegresospormes/${LastYear}`;
      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.onProps.accessToken}`,
        },
      });

      const dataLastYear = await response.json();










      this.setState({
        egresos: data,
        egresosLastYear: dataLastYear,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getConsultaVentasMelatePorMes = async () => {
    const Year = this.state.Year;
    let url = this.props.onProps.origin + `/api/consultamelateventaspormes/${Year}`;
    let bandera = false;
    try {
      let response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.onProps.accessToken}`,
        },
      });

      const data = await response.json();



      const LastYear = parseInt(Year) - 1
      url = this.props.onProps.origin + `/api/consultamelateventaspormes/${LastYear}`;
        response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${this.props.onProps.accessToken}`,
          },
        });
  
        const dataLastYear = await response.json();
  



      this.setState({
        ventasMelate: data,
        ventasMelateLastYear: dataLastYear,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getConsultaPagosMelatePorMes = async () => {
    const Year = this.state.Year;
    const url =
      this.props.onProps.origin + `/api/consultamelateegresospormes/${Year}`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.onProps.accessToken}`,
        },
      });

      const data = await response.json();

      //########################## IMPORTANTE  #######################################
      /*
        ESTA VALIDACION LA TUVE QUE PONER PORQUE CUANDO AL INICIO DE AÑO NO SE HA 
        CAPTURADO NINGÚN RETIRO O PAGO DE MELATE, EL QUERY NO ENCUENTA UN TOTAL 
        EN Y NO AGREGA EL MES 13 CON MONTO =0 Y MARCA ERROR AL CORRER LA PANTALLA. 
        ESTA ES UN ARREGLO TEMPORAL, REALMENTE DEBO DE ENCONTRAR COMO AL CORRER UN
        SELECT SUM(), SI NO ENCUENTA UN VALOR, QUE REGRESE UN REGISTRO CON CERO.
      */
      if(data.length === 12){
        data.push({"Mes":13,"Monto":0})
      }

      //###############################################################################

      this.setState({
        pagosMelate: data,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getGastosInversionesPorAnio = async () => {
    const Year = this.state.Year;
    const url =
      this.props.onProps.origin + `/api/gastosinversionesporanio/${Year}`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.onProps.accessToken}`,
        },
      });

      let data = await response.json();


      let TotalEne = 0
      let TotalFeb = 0
      let TotalMar = 0
      let TotalAbr = 0
      let TotalMay = 0
      let TotalJun = 0
      let TotalJul = 0
      let TotalAgo = 0
      let TotalSep = 0
      let TotalOct = 0
      let TotalNov = 0
      let TotalDic = 0
      let TotalTotal = 0
      data.forEach(element =>{
        TotalEne += parseFloat(element.Ene)
        TotalFeb += parseFloat(element.Feb)
        TotalMar += parseFloat(element.Mar)
        TotalAbr += parseFloat(element.Abr)
        TotalMay += parseFloat(element.May)
        TotalJun += parseFloat(element.Jun)
        TotalJul += parseFloat(element.Jul)
        TotalAgo += parseFloat(element.Ago)
        TotalSep += parseFloat(element.Sep)
        TotalOct += parseFloat(element.Oct)
        TotalNov += parseFloat(element.Nov)
        TotalDic += parseFloat(element.Dic)
        TotalTotal += parseFloat(element.Total)
      })

      
      
      const json = {"CuentaContable": "Total",
      "SubcuentaContable": "Total",
      "Ene": TotalEne,
      "Feb": TotalFeb,
      "Mar": TotalMar,
      "Abr": TotalAbr,
      "May": TotalMay,
      "Jun": TotalJun,
      "Jul": TotalJul,
      "Ago": TotalAgo,
      "Sep": TotalSep,
      "Oct": TotalOct,
      "Nov": TotalNov,
      "Dic": TotalDic,
      "Total": TotalTotal,
      "PorcentajeSimple": 100,
    }
    let dataGastosInversionesTotales = []
    dataGastosInversionesTotales.push(json)
    
        for(let i = 0; i < data.length; i++){
          data[i].id = i
          data[i].PorcentajeSimple = Math.abs(parseFloat(data[i].Total)) / Math.abs(parseFloat(TotalTotal)) *100
        }




        //Prapara el arreglo para Recharts
        let dataGastosInversionesTotalesRecharts = []
        dataGastosInversionesTotalesRecharts.push({"name": "Ene", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].Ene).toFixed(0)*-1})
        dataGastosInversionesTotalesRecharts.push({"name": "Feb", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].Feb).toFixed(0)*-1})
        dataGastosInversionesTotalesRecharts.push({"name": "Mar", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].Mar).toFixed(0)*-1})
        dataGastosInversionesTotalesRecharts.push({"name": "Abr", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].Abr).toFixed(0)*-1})
        dataGastosInversionesTotalesRecharts.push({"name": "May", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].May).toFixed(0)*-1})
        dataGastosInversionesTotalesRecharts.push({"name": "Jun", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].Jun).toFixed(0)*-1})
        dataGastosInversionesTotalesRecharts.push({"name": "Jul", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].Jul).toFixed(0)*-1})
        dataGastosInversionesTotalesRecharts.push({"name": "Ago", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].Ago).toFixed(0)*-1})
        dataGastosInversionesTotalesRecharts.push({"name": "Sep", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].Sep).toFixed(0)*-1})
        dataGastosInversionesTotalesRecharts.push({"name": "Oct", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].Oct).toFixed(0)*-1})
        dataGastosInversionesTotalesRecharts.push({"name": "Nov", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].Nov).toFixed(0)*-1})
        dataGastosInversionesTotalesRecharts.push({"name": "Dic", "GastosInversion":parseFloat(dataGastosInversionesTotales[0].Dic).toFixed(0)*-1})







    this.setState({
      dataGastosInversiones: data,
      dataGastosInversionesTotales: dataGastosInversionesTotales,
      dataGastosInversionesTotalesRecharts: dataGastosInversionesTotalesRecharts,
      
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };


  getLimpiaduriaMelateRentasOtrosUtilidad = async () => {
    const year = this.state.Year;
    const url =
      this.props.onProps.origin + `/api/limpiaduria/bi/estadoresultadoslimpiadurianegocios/${year}`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.onProps.accessToken}`,
        },
      });

      let data = await response.json();

      let TotalEne = 0
      let TotalFeb = 0
      let TotalMar = 0
      let TotalAbr = 0
      let TotalMay = 0
      let TotalJun = 0
      let TotalJul = 0
      let TotalAgo = 0
      let TotalSep = 0
      let TotalOct = 0
      let TotalNov = 0
      let TotalDic = 0
      let TotalTotal = 0
      data.forEach(element =>{
        TotalEne += parseFloat(element.Ene)
        TotalFeb += parseFloat(element.Feb)
        TotalMar += parseFloat(element.Mar)
        TotalAbr += parseFloat(element.Abr)
        TotalMay += parseFloat(element.May)
        TotalJun += parseFloat(element.Jun)
        TotalJul += parseFloat(element.Jul)
        TotalAgo += parseFloat(element.Ago)
        TotalSep += parseFloat(element.Sep)
        TotalOct += parseFloat(element.Oct)
        TotalNov += parseFloat(element.Nov)
        TotalDic += parseFloat(element.Dic)
        TotalTotal += parseFloat(element.Total)
      })

      
      
      const json = {
      "Negocio": "ExtTotal",
      "Ene": TotalEne,
      "Feb": TotalFeb,
      "Mar": TotalMar,
      "Abr": TotalAbr,
      "May": TotalMay,
      "Jun": TotalJun,
      "Jul": TotalJul,
      "Ago": TotalAgo,
      "Sep": TotalSep,
      "Oct": TotalOct,
      "Nov": TotalNov,
      "Dic": TotalDic,
      "Total": TotalTotal,
    }
    data.push(json)






    let dataLimpiaduriaMelateRentasOtrosUtilidadRecharts = []
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "Ene", "UtilidadNeta": parseFloat(data[5].Ene.toFixed(0))})
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "Feb", "UtilidadNeta": parseFloat(data[5].Feb.toFixed(0))})
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "Mar", "UtilidadNeta": parseFloat(data[5].Mar.toFixed(0))})
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "Abr", "UtilidadNeta": parseFloat(data[5].Abr.toFixed(0))})
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "May", "UtilidadNeta": parseFloat(data[5].May.toFixed(0))})
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "Jun", "UtilidadNeta": parseFloat(data[5].Jun.toFixed(0))})
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "Jul", "UtilidadNeta": parseFloat(data[5].Jul.toFixed(0))})
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "Ago", "UtilidadNeta": parseFloat(data[5].Ago.toFixed(0))})
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "Sep", "UtilidadNeta": parseFloat(data[5].Sep.toFixed(0))})
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "Oct", "UtilidadNeta": parseFloat(data[5].Oct.toFixed(0))})
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "Nov", "UtilidadNeta": parseFloat(data[5].Nov.toFixed(0))})
    dataLimpiaduriaMelateRentasOtrosUtilidadRecharts.push({"name": "Dic", "UtilidadNeta": parseFloat(data[5].Dic.toFixed(0))})


    this.setState({
      dataLimpiaduriaMelateRentasOtrosUtilidad: data,
      dataLimpiaduriaMelateRentasOtrosUtilidadRecharts: dataLimpiaduriaMelateRentasOtrosUtilidadRecharts,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };



  handleYear = (e) => {
    const Year = e.target.value;
    this.setState(
      {
        Year: Year,
        dataLimpiaduriaMelateRentasOtrosUtilidad:[],
      },
      async () => {
        if ((await this.getConsultaVentasPorMes()) === false) return;
        if ((await this.getConsultaEgresosPorMes()) === false) return;

        if ((await this.getConsultaVentasMelatePorMes()) === false) return;
        if ((await this.getConsultaPagosMelatePorMes()) === false) return;
    
        if ((await this.getGastosInversionesPorAnio()) === false) return;

        if ((await this.getLimpiaduriaMelateRentasOtrosUtilidad()) === false) return;
    
        this.handleUtilidadPerdida();
        this.handleArrayLineChart();
        this.handleArrayLineChartMelate();

      }
    );
  };

  handleUtilidadPerdida = () => {
    //VENTAS
    const ventas = this.state.ventas;
    const egresos = this.state.egresos;

    let resultado = 0;
    let utilidadPerdida = [];
    for (let i = 0; i < ventas.length; i++) {
      resultado = parseFloat(ventas[i].Monto) + parseFloat(egresos[i].Monto);
      utilidadPerdida.push(resultado);
    }

    resultado = 0;
    let utilidadPerdidaLimpiaduriaPorcentaje = [];
    for (let i = 0; i < ventas.length; i++) {
      resultado = (parseFloat(ventas[i].Monto) + parseFloat(egresos[i].Monto)) / parseFloat(ventas[i].Monto);
      if(parseFloat(ventas[i].Monto) === Math.abs(parseFloat(egresos[i].Monto))){
       resultado = 0
      }
      utilidadPerdidaLimpiaduriaPorcentaje.push(resultado);
    }

    //MELATE
    const ventasMelate = this.state.ventasMelate;
    const pagosMelate = this.state.pagosMelate;



    resultado = 0;
    let utilidadPerdidaMelate = [];
    for (let i = 0; i < ventasMelate.length; i++) {
      resultado = parseFloat(ventasMelate[i].Monto) + parseFloat(pagosMelate[i].Monto);
      utilidadPerdidaMelate.push(resultado);
    }

    resultado = 0;
    let utilidadPerdidaMelatePorcentaje = [];
    for (let i = 0; i < ventasMelate.length; i++) {
      resultado = (parseFloat(ventasMelate[i].Monto) + parseFloat(pagosMelate[i].Monto)) /          parseFloat(ventasMelate[i].Monto);
      if(parseFloat(ventasMelate[i].Monto) === Math.abs(parseFloat(pagosMelate[i].Monto))){
       resultado = 0
      }
      utilidadPerdidaMelatePorcentaje.push(resultado);
    }
    //################### PREPARACION DE GRÁFICA DE % UTILIAD DE MELATE #################################
    let utilidadPerdidaMelatePorcentajeRecharts = []
    utilidadPerdidaMelatePorcentaje.forEach((element,i) =>{
      utilidadPerdidaMelatePorcentajeRecharts.push({"name": NumeroAMes(ventasMelate[i].Mes),"%Utilidad":parseFloat((element*100).toFixed(2))})
    })
    //##################################################################################################


    this.setState({
      utilidadPerdida: utilidadPerdida,
      utilidadPerdidaLimpiaduriaPorcentaje: utilidadPerdidaLimpiaduriaPorcentaje,
      utilidadPerdidaMelate: utilidadPerdidaMelate,
      utilidadPerdidaMelatePorcentaje: utilidadPerdidaMelatePorcentaje,
      utilidadPerdidaMelatePorcentajeRecharts: utilidadPerdidaMelatePorcentajeRecharts,
    });
  };

  handleArrayLineChart = () => {
    const ventas = this.state.ventas;
    const ventasLastYear = this.state.ventasLastYear;
    const egresos = this.state.egresos;
    const egresosLastYear = this.state.egresosLastYear;


    //Prepara Arreglo de EGRESOS
    // let arregloEgresos = [];
    // egresos.forEach((element) =>
    //   arregloEgresos.push(parseFloat(element.Monto) * -1)
    // );
    // arregloEgresos = arregloEgresos.filter(
    //   (element,i) => parseFloat(element) !== 0 && i <= 11 //Menor-Igual a 11 para sólo los meses y no el Total
    // );

    //###################################################################################

    let data = []
    data.push({"name":"Ene","Ventas": parseInt(ventas[0].Monto || 0),"Egresos":parseInt(egresos[0].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[0].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[0].Monto ||0)*-1})
    data.push({"name":"Feb","Ventas": parseInt(ventas[1].Monto || 0),"Egresos":parseInt(egresos[1].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[1].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[1].Monto ||0)*-1})
    data.push({"name":"Mar","Ventas": parseInt(ventas[2].Monto || 0),"Egresos":parseInt(egresos[2].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[2].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[2].Monto ||0)*-1})
    data.push({"name":"Abr","Ventas": parseInt(ventas[3].Monto || 0),"Egresos":parseInt(egresos[3].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[3].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[3].Monto ||0)*-1})
    data.push({"name":"May","Ventas": parseInt(ventas[4].Monto || 0),"Egresos":parseInt(egresos[4].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[4].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[4].Monto ||0)*-1})
    data.push({"name":"Jun","Ventas": parseInt(ventas[5].Monto || 0),"Egresos":parseInt(egresos[5].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[5].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[5].Monto ||0)*-1})
    data.push({"name":"Jul","Ventas": parseInt(ventas[6].Monto || 0),"Egresos":parseInt(egresos[6].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[6].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[6].Monto ||0)*-1})
    data.push({"name":"Ago","Ventas": parseInt(ventas[7].Monto || 0),"Egresos":parseInt(egresos[7].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[7].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[7].Monto ||0)*-1})
    data.push({"name":"Sep","Ventas": parseInt(ventas[8].Monto || 0),"Egresos":parseInt(egresos[8].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[8].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[8].Monto ||0)*-1})
    data.push({"name":"Oct","Ventas": parseInt(ventas[9].Monto || 0),"Egresos":parseInt(egresos[9].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[9].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[9].Monto ||0)*-1})
    data.push({"name":"Nov","Ventas": parseInt(ventas[10].Monto || 0),"Egresos":parseInt(egresos[10].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[10].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[10].Monto ||0)*-1})
    data.push({"name":"Dic","Ventas": parseInt(ventas[11].Monto || 0),"Egresos":parseInt(egresos[11].Monto || 0)*-1,"VentasLastYear":parseInt(ventasLastYear[11].Monto ||0),"EgresosLastYear":parseInt(egresosLastYear[11].Monto ||0)*-1})


    this.setState({
      data: data,
    });
  };

  handleArrayLineChartMelate = () => {
    const ventasMelate = this.state.ventasMelate;
    const ventasMelateLastYear = this.state.ventasMelateLastYear;
    const pagosMelate = this.state.pagosMelate;

    // //Prepara Arreglo de Pagos Melate
    // let arregloPagosMelate = [];
    // pagosMelate.forEach((element) =>
    //   arregloPagosMelate.push(parseFloat(element.Monto) * -1)
    // );
    // arregloPagosMelate = arregloPagosMelate.filter(
    //   (element,i) => parseFloat(element) !== 0 && i <= 11 //Menor-Igual a 11 para sólo los meses y no el Total
    // );

    let utilidadMelate = []
    ventasMelate.forEach((element,i) =>{
      utilidadMelate.push({"name": element.name, "Monto": parseInt(element.Monto) + parseInt(pagosMelate[i].Monto)})
    })

    let data = []
    // data.push({"name":"Ene","VentaMelate": parseInt(ventasMelate[0].Monto || 0),"PagosMelate": parseInt(pagosMelate[0].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[0].Monto)})
    // data.push({"name":"Feb","VentaMelate": parseInt(ventasMelate[1].Monto || 0),"PagosMelate": parseInt(pagosMelate[1].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[1].Monto)})
    // data.push({"name":"Mar","VentaMelate": parseInt(ventasMelate[2].Monto || 0),"PagosMelate": parseInt(pagosMelate[2].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[2].Monto)})
    // data.push({"name":"Abr","VentaMelate": parseInt(ventasMelate[3].Monto || 0),"PagosMelate": parseInt(pagosMelate[3].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[3].Monto)})
    // data.push({"name":"May","VentaMelate": parseInt(ventasMelate[4].Monto || 0),"PagosMelate": parseInt(pagosMelate[4].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[4].Monto)})
    // data.push({"name":"Jun","VentaMelate": parseInt(ventasMelate[5].Monto || 0),"PagosMelate": parseInt(pagosMelate[5].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[5].Monto)})
    // data.push({"name":"Jul","VentaMelate": parseInt(ventasMelate[6].Monto || 0),"PagosMelate": parseInt(pagosMelate[6].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[6].Monto)})
    // data.push({"name":"Ago","VentaMelate": parseInt(ventasMelate[7].Monto || 0),"PagosMelate": parseInt(pagosMelate[7].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[7].Monto)})
    // data.push({"name":"Sep","VentaMelate": parseInt(ventasMelate[8].Monto || 0),"PagosMelate": parseInt(pagosMelate[8].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[8].Monto)})
    // data.push({"name":"Oct","VentaMelate": parseInt(ventasMelate[9].Monto || 0),"PagosMelate": parseInt(pagosMelate[9].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[9].Monto)})
    // data.push({"name":"Nov","VentaMelate": parseInt(ventasMelate[10].Monto || 0),"PagosMelate": parseInt(pagosMelate[10].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[10].Monto)})
    // data.push({"name":"Dic","VentaMelate": parseInt(ventasMelate[11].Monto || 0),"PagosMelate": parseInt(pagosMelate[11].Monto || 0)*-1,"UtilidadMelate": parseInt(utilidadMelate[11].Monto)})

    data.push({"name":"Ene","VentaMelate": parseInt(ventasMelate[0].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[0].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[0].Monto || 0)})
    data.push({"name":"Feb","VentaMelate": parseInt(ventasMelate[1].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[1].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[1].Monto || 0)})
    data.push({"name":"Mar","VentaMelate": parseInt(ventasMelate[2].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[2].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[2].Monto || 0)})
    data.push({"name":"Abr","VentaMelate": parseInt(ventasMelate[3].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[3].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[3].Monto || 0)})
    data.push({"name":"May","VentaMelate": parseInt(ventasMelate[4].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[4].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[4].Monto || 0)})
    data.push({"name":"Jun","VentaMelate": parseInt(ventasMelate[5].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[5].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[5].Monto || 0)})
    data.push({"name":"Jul","VentaMelate": parseInt(ventasMelate[6].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[6].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[6].Monto || 0)})
    data.push({"name":"Ago","VentaMelate": parseInt(ventasMelate[7].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[7].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[7].Monto || 0)})
    data.push({"name":"Sep","VentaMelate": parseInt(ventasMelate[8].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[8].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[8].Monto || 0)})
    data.push({"name":"Oct","VentaMelate": parseInt(ventasMelate[9].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[9].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[9].Monto || 0)})
    data.push({"name":"Nov","VentaMelate": parseInt(ventasMelate[10].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[10].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[10].Monto || 0)})
    data.push({"name":"Dic","VentaMelate": parseInt(ventasMelate[11].Monto || 0),"UtilidadMelate": parseInt(utilidadMelate[11].Monto),"VentaMelateLastYear": parseInt(ventasMelateLastYear[11].Monto || 0)})

    this.setState({
      dataMelate: data,
    });
  };

  handleOdenamientoGastosInversiones = (e) =>{
    let banderaOrdenamiento = e.target.checked
    let data = this.state.dataGastosInversiones

    if(banderaOrdenamiento){
      data = data.sort((a,b) => a.Total - b.Total)
    }else{
      data = data.sort((a,b) => a.id - b.id)
    }

    this.setState({
      dataGastosInversiones: data,
      banderaOrdenamiento: !this.state.banderaOrdenamiento,
    })

  }

  handleRender = () => {
    return (
      <div className="container ventasbi-container">
        <select onChange={this.handleYear} value={this.state.Year} id="idYears">
          {this.state.Years.map((element, i) => (
            <option key={i} value={element.Year}>
              {element.Year}
            </option>
          ))}
        </select>

        <h3>Limpiaduría</h3>

        <table style={{ width: "95%" }}>
          <thead>
            <tr>
              <th>Transacción</th>
              {this.state.Meses.map((element, i) => (
                <th key={i}>{element}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}>Ventas</td>
              {this.state.ventas.map((element, i) => (
                <td key={i}>
                  {numberWithCommas(parseFloat(element.Monto).toFixed(0))}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Egresos </td>
              {this.state.egresos.map((element, i) => (
                <td key={i}>
                  {numberWithCommas(
                    (parseFloat(element.Monto) * -1).toFixed(0)
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Utilidad </td>
              {this.state.utilidadPerdida.map((element, i) => (
                element >= 0 ?
                <td key={i}>
                  {numberWithCommas(parseFloat(element).toFixed(0))}
                </td>
                :
                <td key={i} style={{color:"red"}}>
                  {numberWithCommas(parseFloat(element).toFixed(0))}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Utilidad % </td>
              {this.state.utilidadPerdidaLimpiaduriaPorcentaje.map((element, i) => (
                element > 0 ?
                <td key={i}>
                  {"% "+numberWithCommas((parseFloat(element) *100).toFixed(2))}
                </td>
                :
                <td key={i} style={{color:"red"}}>
                  {"% "+numberWithCommas((parseFloat(element) *100).toFixed(2))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <br />
          <RechartsComposedChart04 data={this.state.data} titulo={"Ventas y Egresos Limpiaduría"} color1={"#005599"} color2={"red"} color3={"dodgerblue"} color4={"#ff5349"} />



        <br />
        <h3>Melate</h3>

        <table style={{ width: "95%" }}>
          <thead>
            <tr>
              <th>Transacción</th>
              {this.state.Meses.map((element, i) => (
                <th key={i}>{element}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}>Ventas Melate</td>
              {this.state.ventasMelate.map((element, i) => (
                <td key={i}>
                  {numberWithCommas(parseFloat(element.Monto).toFixed(0))}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Pagos Melate </td>
              {this.state.pagosMelate.map((element, i) => (
                <td key={i}>
                  {numberWithCommas(
                    (parseFloat(element.Monto) * -1).toFixed(0)
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Utilidad Melate </td>
              {this.state.utilidadPerdidaMelate.map((element, i) => (
                element > 0 ?
                <td key={i}>
                  {numberWithCommas(parseFloat(element).toFixed(0))}
                </td>
                :
                <td key={i} style={{color:"red"}}>
                  {numberWithCommas(parseFloat(element).toFixed(0))}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Utilidad % </td>
              {this.state.utilidadPerdidaMelatePorcentaje.map((element, i) => (
                element > 0 ?
                <td key={i}>
                  {"% "+numberWithCommas((parseFloat(element) *100).toFixed(2))}
                </td>
                :
                <td key={i} style={{color:"red"}}>
                  {"% "+numberWithCommas((parseFloat(element) *100).toFixed(2))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <br />
          <RechartsComposedChart03 data={this.state.dataMelate} titulo={"Venta y Utilidad Melate"} color1={"dodgerblue"} color2={"green"} color3={"#005599"} />
          <RechartsBarChart01 data={this.state.utilidadPerdidaMelatePorcentajeRecharts} titulo={"% Utilidad Melate"} color1={"green"} color2={"red"} />

        <br />
        <h3>Egresos (Gastos e Inversión)</h3>
        <span id="idSpanOrdenamientoTotal">
          <label htmlFor="idOrdenamientoTotal">Ordenar Por Total</label>
          <input onChange={this.handleOdenamientoGastosInversiones} type="checkbox" id="idOrdenamientoTotal" checked={this.state.banderaOrdenamiento}/>
        </span>

        <table style={{ width: "95%", marginTop:"-20px" }}>
          <thead>
            <tr>
              <th>Cuenta Contable</th>
              <th>Subcuenta Contable</th>
              {this.state.Meses.map((element, i) => (
                <th key={i}>{element}</th>
                ))}
                <th>% Simple</th>
            </tr>
          </thead>
          <tbody>
              {this.state.dataGastosInversiones.map((element, i) => (
            <tr key={i}>
                <td style={{textAlign:"left"}}>{element.CuentaContable}</td>
                <td style={{textAlign:"left"}}>{element.SubcuentaContable}</td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Ene)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Feb)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Mar)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Abr)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.May)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Jun)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Jul)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Ago)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Sep)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Oct)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Nov)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Dic)).toFixed(0))}
                </td>
                <td >
                  <b>{numberWithCommas(Math.abs(parseFloat(element.Total)).toFixed(0))}</b>
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.PorcentajeSimple)).toFixed(2))+"%"}
                </td>
            </tr>
              ))}
          </tbody>
        </table>



        <table style={{ width: "95%" }}>
          <thead>
            <tr>
              <th>Cuenta Contable</th>
              <th>Subcuenta Contable</th>
              {this.state.Meses.map((element, i) => (
                <th key={i}>{element}</th>
                ))}
                <th>% Simple</th>
            </tr>
          </thead>
          <tbody>
              {this.state.dataGastosInversionesTotales.map((element, i) => (
            <tr key={i}>
                <td style={{textAlign:"left"}}>{element.CuentaContable}</td>
                <td style={{textAlign:"left"}}>{element.SubcuentaContable}</td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Ene)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Feb)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Mar)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Abr)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.May)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Jun)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Jul)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Ago)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Sep)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Oct)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Nov)).toFixed(0))}
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.Dic)).toFixed(0))}
                </td>
                <td >
                  <b>{numberWithCommas(Math.abs(parseFloat(element.Total)).toFixed(0))}</b>
                </td>
                <td >
                  {numberWithCommas(Math.abs(parseFloat(element.PorcentajeSimple)).toFixed(2))+"%"}
                </td>
            </tr>
              ))}
          </tbody>
        </table>
        <br />
        <br />

          <RechartsBarChart01 data={this.state.dataGastosInversionesTotalesRecharts} titulo={"Egresos (Gastos e Inversión)"} color1={"red"} color2={"red"}/>




        <h3>Resultados Limpiaduría, Melate, Rentas y Otros Ingresos (Utilidad)</h3>

        <table style={{ width: "95%" }}>
          <thead>
            <tr>
              <th>Transacción</th>
              {this.state.Meses.map((element, i) => (
                <th key={i}>{element}</th>
                ))}
            </tr>
          </thead>
          <tbody>
                {this.state.dataLimpiaduriaMelateRentasOtrosUtilidad.map((element,i) =>(
                <tr key={i}>
                  <td>{element.Negocio}</td>
                  <td>{numberWithCommas(parseFloat(element.Ene).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.Feb).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.Mar).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.Abr).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.May).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.Jun).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.Jul).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.Ago).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.Sep).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.Oct).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.Nov).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.Dic).toFixed(0))}</td>
                  <td>{numberWithCommas(parseFloat(element.Total).toFixed(0))}</td>
                </tr>
                ))}
          </tbody>
        </table>
        <br /> 
          <RechartsBarChart01 data={this.state.dataLimpiaduriaMelateRentasOtrosUtilidadRecharts} titulo={"Utilidad Neta Limpiaduría, Melate, Rentas y Otros Ingresos"} color1={"green"} />


      </div>
    );
  };

  render() {
      const override ={
        display: "block",
        margin: "0 auto",
        position: "relative",
        top: "155px",
        borderColor: "red",
      }
    return (
      this.state.dataLimpiaduriaMelateRentasOtrosUtilidad.length > 0  ? 
      <this.handleRender />
    // : <h4 style={{margin:"10px 25px "}}>Loading . . .</h4>
    : <PacmanLoader color="#36d7b7" loading={true} cssOverride={override} size={70} />
    )
  }
}
export default VentasBI;
