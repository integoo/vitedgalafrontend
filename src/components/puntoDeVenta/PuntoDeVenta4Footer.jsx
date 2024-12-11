import React, { useEffect } from 'react';

import { numberWithCommas } from '../utils/FuncionesGlobales'

const PuntoDeVentaFooter = ({ onTotalTicket, onhandleRegistrarVenta, onhandleRegistrarVentaPendientes, onhandleCancelar, onhandleCodBarFocus }) => {
    const totalTicket = onTotalTicket

    useEffect(() => {
    }, []);


    const handleRegistrarVentas = () => {
        onhandleRegistrarVenta()
    }

    const handleRegistrarVentasPendientes = () => {
        onhandleRegistrarVentaPendientes()
    }

    const handleCancelar = () => {
        onhandleCancelar()
    }

    return (
        <div className="container2">
            <div className="child child1">
                <div className="botones">
                    <div>
                        <span>Gran Total </span>
                        <span className="badge bg-primary">$ {numberWithCommas(totalTicket.toFixed(2))}</span>
                    </div>
                    <button
                        onClick={handleCancelar}
                        // className="btn btn-danger btn-sm"
                        className="btn btn-danger btn-sm btn-letra"
                        id="btn-cancelarventa"
                    >
                        CANCELAR TICKET
                    </button>

                </div>
            </div>
            <div className="child child2">
                <div className="botones">

                    <button
                        onClick={handleRegistrarVentas}
                        className="btn btn-success btn-sm btn-letra"
                        id="btn-registrarventa"
                    >
                        REGISTRAR VENTA
                    </button>
                    <button
                        onClick={handleRegistrarVentasPendientes}
                        className="btn btn-warning btn-sm btn-letra"
                        id="btn-nota"
                    >
                        {/* REGISTRAR NOTA */}
                        VENTA (ON HOLD)
                    </button>

                </div>
            </div>
        </div>
    );
};

export default PuntoDeVentaFooter;




