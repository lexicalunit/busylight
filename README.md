# Busy Light

Uses the [Hue Light](https://developers.meethue.com/) API to set colors
via the command line. This tool is incredibly bare bones and has almost
no error handling at all.

## Usage

### First you must initialize the application

```shell
node . init "App Name" "Device Name"
```

For example something like:

```shell
node . init my-app my-laptop
```

You will then need to press the button on your Hue Bridge to confirm.

### Then you can set light colors

```shell
node . set "Light Name" "Color Name"
```

For example if you have a Hue Light named "desk-lamp" and you want to
set it to the color blue, you could run:

```shell
node . set desk-lamp blue
```
