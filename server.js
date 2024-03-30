#!/usr/bin/env node
var electron = require("electron");
const { spawnSync } = require('child_process');
const express = require("express");
var fs = require('fs')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

function renderMapSync(width, height, dpi) {

    const file_name = `map_${width}x${height}@${dpi}.png`
    const args = [
        `./lib/main.js`,
        // style,
        `-w=${width}in`,
        `-h=${height}in`,
        `-d=${dpi}`,
        `-b=-74.20,40.52,-73.70,41.004`,
        `-t=${process.env.MAPBOX_TOKEN}`,
        `-o=${file_name}`,
        // `--debug`,
    ];
    const child = spawnSync(electron, args, { stdio: "inherit" });
    console.log("Done exporting")
    return file_name
}

app.get("/", (req, res) => {
    const width = 36//12
    const height = 45//15 
    const dpi = 96//288 

    const file_name = renderMapSync(width, height, dpi)
    res.sendFile(file_name, { root: __dirname });
});

app.post('/map', (req, res) => {
    // Extract parameters from the request body
    const { width, height, dpi } = req.body;

    // Check if all parameters are present
    if (!width || !height || !dpi) {
        return res.status(400).send('Missing required parameters: width, height, dpi');
    }

    const file_name = renderMapSync(width, height, dpi)
    res.sendFile(file_name, { root: __dirname });
});


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Example app listening on port 3000!");
});
