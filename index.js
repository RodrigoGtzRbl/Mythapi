//Usaremos express
const express = require('express');
//FileSystem para poder acceder a los archivos del servidor
const fs = require('fs');
//Path para poder usar una ruta de búsqueda
const path = require('path');

//Creamos la aplicación de express
const app = express();

app.use(express.json());

//Establecemos la ruta del archivo que se va a usar
const charactersPath = path.join(__dirname, './resources/characters.json');

//Obtención del archivo JSON
const getData = () => {
    return JSON.parse(fs.readFileSync(charactersPath, 'utf8'));
};

//Si se usa la ruta / de acceso, nos redirigirá a la ruta /mythapi
app.get('/', (req, res) => {
    res.redirect('/mythapi');
});
//Esta ruta nos devuelve el index.html, donde están las instrucciones de uso
app.get('/mythapi', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

//Obtención de todos los personajes, donde req es la variable dinámica introducida por HTTP y res es la respuesta que se devuelve
app.get('/mythapi/all', (req, res) => {
    //Obtención del archivo JSON
    const data = getData();
    //Envío
    res.json(data);
});

//Buscar un personaje por id
app.get('/mythapi/id/:id', (req, res) => {
    //Obtenemos el JSON completo
    const data = getData();
    //Buscamos en el array donde en cada personaje (c) se va a usar su id y va a ser comparada por el parámetro de id de la ruta
    const character = data.find(c => c.id === parseInt(req.params.id));

    //Si no se encontrase un personaje, se manda una respuesta con status de error 404 y el mensaje de que no se ha encontrado dicho personaje
    if (!character) return res.status(404).send('Personaje no encontrado');
    //En caso de que si se encontrase, se envía el personaje en la respuesta
    else res.send(character);
});

//Buscar un personaje por nombre
app.get('/mythapi/nombre/:nombre', (req, res) => {
    const data = getData();
    const character = data.find(c => c.nombre.toLowerCase() === req.params.nombre.toLowerCase());

    if (!character) return res.status(404).send('Personaje no encontrado');
    res.send(character);
});





const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));