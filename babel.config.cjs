const debug = require('debug')

const log = debug('zashiki/e2e')

const {
  env: {
    NODE_ENV = 'development'
  }
} = process

log('`zashiki` is awake')

function env () {
  log({ NODE_ENV })

  return (
    NODE_ENV === 'production'
  )
}

// @ts-ignore
module.exports = (api) => {
  if (api) api.cache.using(env)

  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            node: 'current'
          },
          useBuiltIns: 'usage',
          corejs: 3
        }
      ]
    ]
  }
}
