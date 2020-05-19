const http = require('http');
const { bodyParser } = require('./lib/bodyParser');

//Creamos un objeto DB para usarlo como base de datos en memoria
let database = [];

//Creamos un handler como funcion
function getTaskHandler(req, res){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(database));
    res.end();
}

//Creamos el handler para la creación de tareas
async function createTaskHandler(req, res){
    try{
        //Antes de enviar la respuesta, usamos nuestro bodyParser para poblar el body
        //Podemos usar un .then para manejar la promesa, o un await en la funcion body parser
        //pero debemos hacer que createTaskHandler sea async
        await bodyParser(req);
        database.push(req.body);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(database));
        res.end();
    }catch(error){
        //En caso de recibir data con formato erroneo, manejamos el error con un try catch
        //Enviando una respuesta al cliente
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write("Invalid data");
        res.end();
    }
}

//Creamos el handler para actualizar las tareas
async function updateTaskHandler(req, res){
    try{
        const { url } = req;
        //Separamos los valores de la url
        let idQuery = url.split("?")[1];
        let idKey = idQuery.split("=")[0];
        let idValue = idQuery.split("=")[1];
    
        if(idKey === "id"){
            await bodyParser(req);
            //estamos 1 al id enviado, 
            database[idValue - 1] = req.body;
    
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(database));
            res.end();   
        }else{
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write("Invalid request query");
            res.end();
        }
    }catch(error){
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write("Invalid Body Data provided", error.message);
        res.end();
    }
}

async function deleteTaskHandler(req, res){
    try {
        const { url } = req;
        //Separamos los valores de la url
        let idQuery = url.split("?")[1];
        let idKey = idQuery.split("=")[0];
        let idValue = idQuery.split("=")[1];

        if(idKey === "id"){
            database.splice(idValue - 1, 1);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write("Delete Successfully");
            res.end();
        }else{
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.write("Invalid Query");
            res.end();
        }
    }catch(error){
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write("Invalid Body Data provided", error.message);
        res.end();
    }
}

//Creamos un handler del servidor y lo guardamos en una constante, asi nos devuelve un objeto
const server = http.createServer((req, res) => {
    //Usamos destructuring para sacar del request solo lo que necesitamos
    const { url, method } = req;
    console.log(`URL: ${url} - Method: ${method}`);

    switch(method) {
        case "GET":
            if(url === "/"){
                //Le escribimos la cabecera al cliente, le decimos que le devolvemos un texto plano
                res.writeHead(200, {'Content-Type': 'application/json'});
                //Damos una respuesta a la petición
                res.write(JSON.stringify({message: 'Hello World'}));
                res.end();
            }
            if(url === "/tasks"){
                getTaskHandler(req, res);
            }
            break;
        case "POST":
            if(url === "/task"){
                createTaskHandler(req, res);
            }
            break;
        case "PUT":
            updateTaskHandler(req, res);
            break;
        case "DELETE":
            deleteTaskHandler(req, res);
            break;
        default:
            res.writeHead(200, {'Content-Type': 'text/plain'});
            //Damos una respuesta a la petición
            res.write("404 NOT FOUND");
            res.end();
    }
});

//Hacemos que el servidor escuche en un puerto específico
server.listen(3000);
console.log('Server running on port:', 3000);