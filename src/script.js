let padding = 15
let start_x = padding
let svg_width = document.querySelector('#chart').viewBox.baseVal.width

function loadData() {
  fetch(`https://codingstartup.com/assets/svg-chart/appl.php`)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log(`api data`, data)
      drawChart(data)
    })
    .catch((err) => {
      console.log(err)
    })
}

setTimeout(() => {
  loadData()
}, 1000)

function drawChart(api_data) {
  let name = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  name.setAttribute('text-anchor', 'middle')
  name.setAttribute('alignment-baseline', 'middle')
  name.setAttribute('x', svg_width / 2)
  name.setAttribute('y', 6)
  name.classList.add('name')
  name.appendChild(document.createTextNode(api_data['stock_name']))
  document.querySelector('#chart').appendChild(name)
  
  let stock_data = api_data['data']
  let path_data = []
  
  for (let i in stock_data) {
    path_data.push(`${start_x}, ${stock_data[i]['normalized']}`)
    
    let caption = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    caption.setAttribute('text-anchor', 'middle')
    caption.setAttribute('alignment-baseline', 'middle')
    caption.setAttribute('x', start_x)
    caption.setAttribute('y', 96)
    caption.classList.add('caption')
    caption.appendChild(document.createTextNode(stock_data[i]['date']))
    document.querySelector('#chart').appendChild(caption)
    
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', start_x)
    circle.setAttribute('cy', stock_data[i]['normalized'])
    circle.setAttribute('r', 3)
    circle.setAttribute('stroke', '#9F3AF0')
    circle.setAttribute('stroke-width', 2)
    circle.setAttribute('fill', 'white')
    circle.setAttribute('transform-origin', `${start_x} ${stock_data[i]['normalized']}`)
    circle.style.setProperty('--delay', `${(3 * parseInt(i) / stock_data.length)}s`)
    circle.classList.add('point')
    document.querySelector('#path-container').appendChild(circle)
    
    let value = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    value.setAttribute('text-anchor', 'middle')
    value.setAttribute('alignment-baseline', 'middle')
    value.setAttribute('x', start_x)
    value.setAttribute('y', stock_data[i]['normalized'])
    value.setAttribute('transform', `translate(0, ${stock_data[i]['normalized'] * 2 - 8}) scale(1, -1)`)
    value.style.setProperty('--delay', `${(3 * parseInt(i) / stock_data.length)}s`)
    value.classList.add('values')
    value.appendChild(document.createTextNode(stock_data[i]['index']))
    document.querySelector('#path-container').appendChild(value)
    
    start_x += (svg_width - padding * 2) / (stock_data.length - 1)
  }
  
  let line = document.querySelector('#line')
  line.setAttribute('d', `M${path_data.join(' ')}`)
  let strokeLength = Math.ceil(line.getTotalLength())
  document.querySelector('#chart').style.setProperty('--stroke-length', strokeLength)
  
  document.querySelector('#chart').classList.add('animate')
}