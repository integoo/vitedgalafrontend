import React, { useState } from 'react'

import { numberWithCommas } from '../utils/FuncionesGlobales'
const PuntoDeVenta2Main = ({ detalles, onhandleEliminar, showAlert, colorShowAlert, messageAlert, FolioId }) => {


    const handleEliminar = (i) => {
        onhandleEliminar(i)
    }

    return (
        <div className='contenedor2'>

            {showAlert && (
                <div className="my-alert" style={{ backgroundColor: colorShowAlert }}>
                    {messageAlert}
                </div>
            )}

            <div className="enca-cifras-totales">

                <div className="detalles-cifras-totales area-cifras-totales">
                    Main
                </div>

                <div className="detalles-cifras-totales subencabe-cifras-totales">


                    <div className="cifras-totales">
                        Nota
                        <div className="badge text-bg-success ms-2">
                            {FolioId}
                        </div>
                    </div>
                    <div className="cifras-totales">
                        Registros
                        <div className="badge text-bg-success ms-2">
                            {detalles.length}
                        </div>
                    </div>
                    <div className="cifras-totales">
                        Unidades
                        <div className="badge text-bg-success ms-2">
                            {detalles.reduce((acumulador, item) => acumulador + item.Unidades, 0)}
                        </div>
                    </div>

                </div>
            </div>

            <div className="scrollable">


                <table className="my-table">
                    <thead>
                        <tr>
                        </tr>
                    </thead>
                    <tbody>

                        {detalles
                            .sort((a, b) => {
                                return a.CodigoId - b.CodigoId;
                            })
                            .map((element, i) => (
                                <tr key={i}>
                                    <>
                                        <td>
                                            <small>{element.Descripcion}</small>{" "}
                                            <br />
                                            <strong style={{ fontSize: "1.2rem" }}>{element.Unidades}</strong>{" X "}
                                            <strong>$ {element.PrecioVentaConImpuesto}</strong>{" = "}
                                            <strong>$ {numberWithCommas((element.Unidades * element.PrecioVentaConImpuesto).toFixed(2))}</strong>
                                        </td>
                                        <td>
                                            <button
                                                onClick={(e) => {
                                                    if (
                                                        window.confirm(
                                                            "Está seguro de borrar este artículo?"
                                                        )
                                                    )
                                                        handleEliminar(i);
                                                }}
                                                id={element.SerialId}
                                                className="btn btn-danger btn-sm ms-1"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PuntoDeVenta2Main
