export type Cell = {
  probability: number
  probabilityToFind: number
  visitations: number
}

export type Vec = {
  x: number
  y: number
}

// https://nodejs.org/docs/latest/api/util.html#background-colors
export type BackgroundColor =
  | 'bgBlack'
  | 'bgBlackBright'
  | 'bgBlue'
  | 'bgBlueBright'
  | 'bgCyan'
  | 'bgCyanBright'
  | 'bgGray'
  | 'bgGreen'
  | 'bgGreenBright'
  | 'bgGrey'
  | 'bgMagenta'
  | 'bgMagentaBright'
  | 'bgRed'
  | 'bgRedBright'
  | 'bgWhite'
  | 'bgWhiteBright'
  | 'bgYellow'
  | 'bgYellowBright'

// https://nodejs.org/docs/latest/api/util.html#foreground-colors
export type ForegroundColor =
  | 'black'
  | 'blackBright'
  | 'blue'
  | 'blueBright'
  | 'cyan'
  | 'cyanBright'
  | 'gray'
  | 'green'
  | 'greenBright'
  | 'grey'
  | 'magenta'
  | 'magentaBright'
  | 'red'
  | 'redBright'
  | 'white'
  | 'whiteBright'
  | 'yellow'
  | 'yellowBright'

// https://nodejs.org/docs/latest/api/util.html#modifiers
export type Modifier =
  | 'blink'
  | 'bold'
  | 'dim'
  | 'doubleunderline'
  | 'framed'
  | 'hidden'
  | 'inverse'
  | 'italic'
  | 'overlined'
  | 'reset'
  | 'strikethrough'
  | 'underline'

export type TextSetting = BackgroundColor | ForegroundColor | Modifier
