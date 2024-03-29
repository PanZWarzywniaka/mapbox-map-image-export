var remote = require('electron').remote
var fs = require('fs')
var path = require('path')
var pump = require('pump')
var log = require('single-line-log').stderr

var exportMap = require('./map_mosaic_stream.js')

window.console = remote.require('./main').console
var argv = remote.require('./main').argv
console.log("Arguments are: ",argv)

// var style = argv._[0]
var style = "mapbox://styles/panzwarzywniaka/cltuc2ilu008901qwh0qvh2vc"
// var style = JSON.parse(fs.readFileSync('styles/default_no_labels.json', 'utf8'));
console.log("Style: ", style)

var format = {}
var width = 40
var last = 0

//find absolute path
function abs (file) {
  return path.isAbsolute(file) ? file : path.resolve(process.cwd(), file)
}

var writeStream = argv.output ? fs.createWriteStream(abs(argv.output)) : process.stdout

var mapDiv = document.createElement('div')
document.body.appendChild(mapDiv)

var mapStream = exportMap(style, mapDiv, argv)
  .on('progress', function (percent, total) {

    if ((percent - last) * width < 1) return
    //print proggress
    var completeStr = Array(Math.floor(percent * width)).join('=')
    var incompleteStr = Array(Math.ceil((1 - percent) * width)).join(' ')
    var str = 'exporting [' + completeStr + '>' + incompleteStr + '] ' + Math.round(percent * 100) + '%'
    last = percent
    log(str)
  })
  .on('format', function (f) {
    console.log("Format recieved from encoder:", f)
    format = f
  })

//print at the end
function done (err) {
  log.clear()
  log('')
  if (err) {
    process.stderr.write(err.stack + '\n', () => process.exit(1))
  }
  if (argv.output) {
    console.error('Saved %dpx x %dpx map to %s', format.width, format.height, argv.output)
  }
  window.close()
}
// map stream -> save to file -> print done message
//png encoder -> file
pump(mapStream, writeStream, done)