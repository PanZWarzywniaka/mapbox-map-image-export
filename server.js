#!/usr/bin/env node
var electron = require("electron");
const { spawnSync } = require('child_process');
const express = require("express");
var fs = require('fs')
const bodyParser = require('body-parser');

const RENDERS_DIR = 'renders'

const app = express();
app.use(express.static(RENDERS_DIR));
app.use(bodyParser.json());

function renderMapSync(width, height, dpi, bbox) {

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
        `--debug`,
    ];
    const child = spawnSync(electron, args, { stdio: "inherit" });
    console.log("Done exporting")
    return file_name
}

app.get("/", (req, res) => {
    const width = 12
    const height = 15 
    const dpi = 96 //288 
    const bbox = '-74.20,40.52,-73.70,41.004'

    const file_name = renderMapSync(width, height, dpi, bbox)
    res.sendFile(`${RENDERS_DIR}/${file_name}`, { root: __dirname });
});

app.post('/', (req, res) => {
    // Extract parameters from the request body
    const { width, height, dpi, bbox } = req.body;

    // TODO better validation
    if (!width || !height || !dpi || !bbox) {
        return res.status(400).send('Missing required parameters: width, height, dpi, bbox');
    }

    const file_name = renderMapSync(width, height, dpi, bbox)
    res.send(file_name)
});


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Example app listening on port 3000!");
});
