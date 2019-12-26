window.onload = () => {
  const worker = new SharedWorker('./shared-worker.js')
  const status = document.querySelector('#status')
  const message = document.querySelector('#message')
  const result = document.querySelector('#result')
  let id = null
  let messageCount = 1

  worker.port.addEventListener('message', event => {
    const { data } = event
    switch (data.action) {
      case 'id':
        id = data.value
        break
      case 'message':
        message.innerHTML += `<p><strong>No.${messageCount++}: </strong>${data.value}</p>`
        break
      case 'result':
        status.textContent = 'success'
        result.innerHTML = `
          <h2 style="text-align: center;">Github Trending</h2>
          ${renderTrendingList(data.value || [])}
        `
        break
      default:
        break
    }
  })
  
  worker.port.start()

  setTimeout(() => {
    status.textContent = 'pending'
    worker.port.postMessage({
      action: 'start',
      value: id
    })
  }, Math.floor(Math.random() * 10) * 1000)
}

function renderTrendingList (list) {
  return `
  <ul style="list-style: none; padding: 0;">
    ${list.map(item => {
      return `<li style="margin: .5em 0; border: 1px solid #ddd; padding: 0 15px;">
        <div>
          <p>Name: <strong>${item.name}</strong></p>
          <p>Description: ${item.description}</p>
          <p>Repo: <a href="${item.url}">${item.url}</a></p>
        </div>
      </li>`
    }).join('\n')}
  </ul>
  `
}