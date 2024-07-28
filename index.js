
const express = require('express');

const fs = require('fs');

const path = require('path');

const cors = require('cors');


const app = express();
app.use(cors());

app.use(express.json());

//Function to get the JSON dinamically
const getData = (archive) => {
    const archivePath = path.join(__dirname, 'resources', `${archive}.json`);

    if (fs.existsSync(archivePath)) {
        return JSON.parse(fs.readFileSync(archivePath, 'utf8'));
    } else {
        // Maneja el caso en el que el archivo no existe
        return { error: "File not found" };
    }
};

//Function to get all data from all JSON files
const getAllData = () => {
    const directoryPath = path.join(__dirname, 'resources'); //read all files from resources dir
    let allData = [];

    fs.readdirSync(directoryPath).forEach(file => {
        //if the file is a .json file
        if (path.extname(file) === '.json') {

            //parse it into an array
            const filePath = path.join(directoryPath, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            allData = allData.concat(data);
        }
    });

    return allData;
};


//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------


//Get all the chars from the diferent JSON dinamically
app.get('/:archive/all', (req, res) => {
    //Get the JSON using the archive value
    const archive = req.params.archive;

    const data = getData(archive);
    res.json(data);
});


//Search by archive and ID
app.get('/:archive/id/:id', (req, res) => {
    const archive = req.params.archive;
    const data = getData(archive);
    const character = data.find(c => c.id === parseInt(req.params.id));

    if (!character) return res.status(404).send('Not found');
    res.send(character);
});

//Search by archive and name
app.get('/:archive/name/:name', (req, res) => {
    const archive = req.params.archive;
    const data = getData(archive);

    const character = data.find(c => c.name.toLowerCase() === req.params.name.toLowerCase());

    if (!character) return res.status(404).send('Not found');
    res.send(character);
});

app.get('/search/:name', (req, res) => {
    //get the name to search from URL
    const name = req.params.name.toLowerCase();
    //Get all the objects from all the JSONs using the function, receiving them as an array
    const allData = getAllData();

    //find into the array using the name param
    const character = allData.find(c => c.name.toLowerCase() === name);

    //if exits return it, if not return an error
    if (character) {
        res.json(character);
    } else {
        res.status(404).json({ error: "Not found" });
    }
})

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));