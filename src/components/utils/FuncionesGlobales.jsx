export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export const handleGetMethod = async (url,accessToken) => {
    if (!url) {
        return { error: "La url es obligatoria." };
    }
    try{
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const message = `Error ${response.status}: ${response.statusText}`;
            return { error: message}
        }
        const data = await response.json();
        return data;
    } catch (error){
        console.error("Error :", error.message)
        alert(error.message)
        return { error: "No se pudo conectar al servidor. Intente nuevamente" }

    }
}