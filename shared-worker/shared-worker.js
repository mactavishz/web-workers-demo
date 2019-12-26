const connectedClients = new Set()
let id = 1

let taskStated = false
const endPoint = 'https://github-trending-api.now.sh/repositories?since=weekly'

function runTask () {
  if (taskStated) return
  taskStated = true
  // simulate network delay
  setTimeout(async () => {
    const response = await fetch(endPoint, { mode: 'cors' })
    const data = await response.json()
    sendMessageToClients({
      action: 'result',
      value: data
    })
  }, 5000)
}

function sendMessageToClients (payload, currentClientId = null) {
  connectedClients.forEach(({ id, client }) => {
    if (currentClientId && currentClientId == id) return 
    client.postMessage(payload)
  })
}

// add listener to newly added client
function setupClient (clientPort) {
  clientPort.onmessage = event => {
    const { action, value } = event.data
    if (action === 'start') {
      let sendValue = `client No.${value} start fetch task at <strong style="color: blue">${(new Date).toUTCString()}</strong>`
      if (taskStated) {
        sendValue += ', task already started'
      }
      sendMessageToClients({
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
  // send id to current connect client
  newClient.postMessage({
    action: 'id',
    value: id
  })
  newClient.postMessage({
    action: 'message',
    value: `You are client No.${id}`
  })
  // notify all other connected clients
  sendMessageToClients({
    action: 'message',
    value: `clients No.${id} connected`
  }, id)
  id++
})