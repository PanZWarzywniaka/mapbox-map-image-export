#!/usr/bin/env node
var electron = require("electron");
const { spawnSync } = require('child_process');
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    const file_name = "renders/lewis_12x15.png"
    const args = [
        "./main.js",
        "-w=12in",
        "-h=15in",
        "-d=288",
        "-b=-74.20684568826417,40.528628319424,-73.70390910359002,41.004764240546365",
        `-t=${process.env.MAPBOX_TOKEN}`,
        `-o=${file_name}`,
        "--debug",
    ];

    const child = spawnSync(electron, args, { stdio: "inherit" });
    console.log("Done exporting")
    res.sendFile(file_name, { root: __dirname });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log("Example app listening on port 3000!");
});
