const { discovery, v3 } = require('node-hue-api')
const api = v3.api
const convert = require('color-convert')
const fs = require('fs')
const path = require('path')

function settingsFromFile() {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, 'busylight.json'))
    return JSON.parse(data)
  } catch (err) {
    console.error(err)
  }
}

function optionsFromCommand(command) {
  const arg1 = process.argv[process.argv.length - 2]
  const arg2 = process.argv[process.argv.length - 1]
  if (command === 'init') return { 'app': arg1, 'device': arg2 }
  if (command === 'set') return { 'light': arg1, 'color': arg2 }
}

function stateFromColor(color) {
  if (color === "off") return { on: false }
  const xyz = convert.keyword.xyz(color)
  const sum = xyz[0] + xyz[1] + xyz[2]
  const xy = [xyz[0] / sum, xyz[1] / sum]
  const state = { on: true, bri: 60, hue: 255, sat: 254, ct: 500, xy: xy }
  return state
}

async function init() {
  try {
    const local = await api.createLocal(host).connect()
    const user = await local.users.createUser(options.app, options.device)
    fs.writeFileSync('busylight.json', JSON.stringify(user))
  } catch (err) {
    console.error(err)
  }
}

async function main() {
  try {
    const settings = settingsFromFile()
    const results = await discovery.nupnpSearch()
    const host = results[0].ipaddress
    const secure = await api.createLocal(host).connect(settings.username)
    const light = (await secure.lights.getLightByName(options.light))[0]
    const color = stateFromColor(options.color)
    await secure.lights.setLightState(light.id, color)
  } catch (err) {
    console.log(err)
  }
}

const command = process.argv[process.argv.length - 3]
const options = optionsFromCommand(command)

// initial setup: [args...] init app device
// change color: [args...] set light color
main()
