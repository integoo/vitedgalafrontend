
import React, { useEffect } from 'react';

const PuntoDeVenta3NotasP = ({ ventasPendientes, FolioId, setFolioId, onhandleVentasPendientesRecupera }) => {

    useEffect(() => {
    }, []); // Solo se ejecuta cuando `count` cambia (En este caso al cargar y al cambiar el valor a 0)


    const ventasPendientesRecupera = (FolioId) => {
        setFolioId(FolioId)
        onhandleVentasPendientesRecupera(FolioId)
    }

    return (
        <div className="container-notas">

                <div className="cifras-notas">
                    <div>
                        <span style={{ fontSize: "0.8rem" }}>
                            <span>Notas en Proceso</span>{" "}
                            <span className="badge text-bg-success">
                                {ventasPendientes.length}
                            </span>
                        </span>
                    </div>
                    {/* <div>
                        <span style={{ fontSize: "0.8rem" }}>
                            <strong>Nota :</strong>
                        </span>
                        <span className="badge text-bg-success">
                            {FolioId}
                        </span>
                        <br />
                    </div> */}
                </div>


            <div className="notaspendientes">
                {ventasPendientes.map((element, i) => (
                    <div className="botonesPendientes" key={i}>
                        <button id="botonPendiente"
                            onClick={() => {
                                ventasPendientesRecupera(element.FolioId);
                            }}
                        >
                            {element.FolioId}
                        </button>
                        <span>{element.Cliente}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PuntoDeVenta3NotasP;



