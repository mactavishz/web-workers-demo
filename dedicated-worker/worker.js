importScripts(
  'https://cdn.jsdelivr.net/npm/blueimp-md5@2.12.0/js/md5.min.js',
  'https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js'
)

self.addEventListener('message', _.debounce(event => {
  const { action, value = '' } = event.data
  if (action === 'md5') {
    self.postMessage({
      action: 'md5-result',
      value: value.length > 0 ? md5(value) : 'No digest for empty string'
    })
  }
}, 100))