import React, { useState } from 'react'

export default function MenuRobot() {
  const [srcrobot, setSrcrobot] = useState("https://robohash.org/user/" + Math.round(Math.random() * 100)) //** ACCEDE A LA IMAGEN ALEATORIA DEL USUARIO (ROBOT)

  return (
    <div>
      <div style={{ width: "60px" }}>
        <img
          src={srcrobot}
          alt="Robohash"
          width={40}
          height={40}
          style={{
            background: "rgb(244,240,236)",
            borderRadius: "50%",
            border: "4px solid red",
            borderColor: "red yellow green orange",
          }}
        />
        <div>
        </div>
      </div>
    </div>
  )
}
