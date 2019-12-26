const connectedClients = new Set()
let id = 1

let taskStated = false
const endPoint = 'https://github-trending-api.now.sh/repositories?language=javascript&since=weekly'

function runTask () {
  if (taskStated) return
  taskStated = true
  setTimeout(async () => {
    const response = await fetch(endPoint, { mode: 'cors' })
    const data = await response.json()
    sendMessageToAllClients({
      action: 'result',
      value: data
    })
  }, 5000)
}

function sendMessageToAllClients (payload, currentClientId) {
  connectedClients.forEach(({ id, client }) => {
    if (currentClientId && currentClientId == id) return 
    client.postMessage(payload)
  })
}

function setupClient (clientPort) {
  clientPort.onmessage = event => {
    const { action, value } = event.data
    if (action === 'start') {
      let sendValue = `client No.${value} start fetch task at <strong style="color: blue">${(new Date).toUTCString()}</strong>`
      if (taskStated) {
        sendValue += ', task alreay started'
      }
      sendMessageToAllClients({
        action: 'message',
        value: sendValue
      }, value)
      runTask()
    }
  }
}

self.addEventListener('connect', event => {
  const newClient = event.source
  connectedClients.add({
    client: newClient,
    id: id
  })
  setupClient(newClient)
  newClient.postMessage({
    action: 'message',
    value: `You are client No.${id}`
  })
  newClient.postMessage({
    action: 'id',
    value: id
  })
  sendMessageToAllClients({
    action: 'message',
    value: `clients No.${id} connected`
  }, id)
  id++
})