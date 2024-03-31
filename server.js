#!/usr/bin/env node
var electron = require("electron");
const { spawnSync, spawn } = require('child_process');
const express = require("express");
var fs = require('fs')
const bodyParser = require('body-parser');

const RENDERS_DIR = 'renders'

const app = express();
app.use(express.static(RENDERS_DIR));
app.use(bodyParser.json());

function renderMap(sync, width, height, dpi, bbox) {

    const file_name = `map_${width}x${height}@${dpi}_${bbox}.png`
    const args = [
        `./lib/main.js`,
        // style,
        `-w=${width}in`,
        `-h=${height}in`,
        `-d=${dpi}`,
        `-b=${bbox}`,
        `-t=${process.env.MAPBOX_TOKEN}`,
        `-o=${RENDERS_DIR}/${file_name}`,
    ];

    if (sync) {
        console.log("Rendering syncronously");
        const child = spawnSync(electron, args, { stdio: "inherit" });
    } else {
        
        const child = spawn(electron, args, { stdio: "inherit" });
        console.log("Start exporting to: ", file_name)
    
        child.on('close', (code) => {
            if (code === 0) {
              console.log("Rendering exited successfully");
            } else {
              console.error(`Electron process failed with exit code ${code}`);
            }
          });
    }
    
    return file_name
}

app.get("/", (req, res) => {
    const width = 12
    const height = 15
    const dpi = 96 //288 
    const bbox = '-74.20,40.52,-73.70,41.004'

    const file_name = renderMap(true, width, height, dpi, bbox)
    res.sendFile(`${RENDERS_DIR}/${file_name}`, { root: __dirname });
});

app.post('/', (req, res) => {
    // Extract parameters from the request body
    const { width, height, dpi, bbox } = req.body;

    // TODO better validation
    if (!width || !height || !dpi || !bbox) {
        return res.status(400).send('Missing required parameters: width, height, dpi, bbox');
    }

    const file_name = renderMap(true, width, height, dpi, bbox)
    res.send(file_name)
});


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Example app listening on port 3000!");
});
