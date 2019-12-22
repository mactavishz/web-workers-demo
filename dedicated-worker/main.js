const worker = new Worker('/worker.js')
const input = document.querySelector('#input')
const digest = document.querySelector('#digest')
input.addEventListener('input', event => {
  const text = event.target.value.trim()
  worker.postMessage({
    action: 'md5',
    value: text
  })
  worker.addEventListener('message', event => {
    const { action, value = '' } = event.data
    if (action === 'md5-result') {
      digest.textContent = value
    }
  })
})