# Busy Light

Uses the [Hue Light](https://developers.meethue.com/) API to set colors
via the command line. This tool is incredibly bare bones and has almost
no error handling at all.

## Usage

## Install Dependencies

```shell
yarn
```

### First you must initialize the application

```shell
node . --init "App Name"
```

For example something like:

```shell
node . --init my-app
```

You will then need to press the button on your Hue Bridge to confirm.

This will create a file named `busylight.json` which will contain the
details of the authorized user you just created. You can now set lights.

### Then you can set light colors

```shell
node . -l "Light Name" -c "Color Name"
```

For example if you have a Hue Light named "desk-lamp" and you want to
set it to the color blue, you could run:

```shell
node . -l desk-lamp -c blue
```

For more usage details run `node . --help`.
