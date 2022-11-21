const { discovery, v3 } = require('node-hue-api')
const commander = require('commander')
const convert = require('color-convert')
const fs = require('fs')
const os = require("os")
const path = require('path')

const { program, Option } = commander
const api = v3.api

const settingsFromFile = () => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, 'busylight.json'))
    return JSON.parse(data)
  } catch (err) {
    console.error(err)
  }
}

const stateFromOptions = ({color, brightness}) => {
  if (color === "off") return { on: false }
  const xyz = convert.keyword.xyz(color)
  const sum = xyz[0] + xyz[1] + xyz[2]
  const xy = [xyz[0] / sum, xyz[1] / sum]
  const state = { on: true, bri: brightness, hue: 255, sat: 254, ct: 500, xy: xy }
  return state
}

const init = async (options) => {
  try {
    const results = await discovery.mdnsSearch()
    const host = results[0].ipaddress
    const local = await api.createLocal(host).connect()
    const user = await local.users.createUser(options.init, os.hostname())
    fs.writeFileSync('busylight.json', JSON.stringify(user))
  } catch (err) {
    console.error(err)
  }
}

const main = async (options) => {
  try {
    const settings = settingsFromFile()
    const results = await discovery.mdnsSearch()
    const host = results[0].ipaddress
    const secure = await api.createLocal(host).connect(settings.username)
    if (options.list) {
      const lights = await secure.lights.getAll()
      for (const light of lights) {
        console.log(light.data.name)
      }
      return
    }
    const light = (await secure.lights.getLightByName(options.light))[0]
    const state = stateFromOptions(options)
    await secure.lights.setLightState(light.id, state)
  } catch (err) {
    console.log(err)
    throw err
  }
}

const parseBrightness = (value, _) => {
  const number = parseInt(value, 10)
  if (isNaN(number))
    throw new commander.InvalidArgumentError('Not a number')
  if (number <= 0 || number >= 255)
    throw new commander.InvalidArgumentError('Brightness must be [1, 255)')
  return number
}

program
  .addOption(
    new Option('--init <app-name>', description="Create a new busylight app")
  )
  .addOption(
    new Option('-c, --color <css-color-name>', description="Set device color")
    .default('white')
  )
  .addOption(
    new Option('-b, --brightness <integer>', description="Set device brightness")
      .default(100)
      .argParser(parseBrightness)
  )
  .addOption(
    new Option('-l, --light <name>', description="Select a device")
  )
  .addOption(
    new Option('--list', description="List all local device names")
  )
program.parse()
const options = program.opts()

if (options.init) {
  init(options)
} else {
  // three attempts before giving up
  fn = main.bind(undefined, options)
  fn()
    .catch(() => fn())
    .catch(() => fn())
    .catch(() => fn())
}
