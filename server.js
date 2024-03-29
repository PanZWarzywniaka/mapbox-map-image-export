#!/usr/bin/env node
var electron = require("electron");
const { spawnSync } = require('child_process');
const express = require("express");
var fs = require('fs')

const app = express();

app.get("/", (req, res) => {
    const width = 36//12
    const height = 45//15 
    const dpi = 96//288 
    const file_name = `map_${width}x${height}@${dpi}.png`
    const style = JSON.parse(fs.readFileSync('styles/default_no_labels.json', 'utf8'));
    console.log("Style: ", style)
    const args = [
        `./lib/main.js`,
        style,
        `-w=${width}in`,
        `-h=${height}in`,
        `-d=${dpi}`,
        `-b=-74.20,40.52,-73.70,41.004`,
        `-t=${process.env.MAPBOX_TOKEN}`,
        `-o=${file_name}`,
        `--debug`,
    ];

    const child = spawnSync(electron, args, { stdio: "inherit" });
    console.log("Done exporting")
    res.sendFile(file_name, { root: __dirname });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Example app listening on port 3000!");
});