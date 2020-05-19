//Recibe el request y pobla un nuevo dato
function bodyParser(request){
    //Para no devolver un callback, creamos una nueva promesa, la promesa puede ser satisfactoria o no
    //Por eso como parámetros tiene resolve y reject
    return new Promise((resolve, reject) => {
            //Creamos una variable donde vamos a ir guardando el string que va llegando
        let totalData = '';
        request  //Se atrapa el stream de datos del cliente, que viene por partes, se le llama chunk
            .on('data', chunk => {
                totalData += chunk;

            })
            //Cuando terminan de llegar todos los datos, tratamos de convertir lo recibido en un objeto JSON
            .on('end', () => {
                //Todo el string recibido, se convierte a JSON y se guarda en la propiedad body del request.
                //Esta propiedad body, es inventanda, realmente se le podría poner cualquier nombre.
                request.body = JSON.parse(totalData);
                //Acabamos la promesa en forma existosa
                resolve();
            })
            //En caso de error podemos manejarlo desde acá
            .on('error', err => {
                console.log(err);
                //Acaba la promesa con error
                reject();
            });
    });

}

module.exports = { bodyParser }