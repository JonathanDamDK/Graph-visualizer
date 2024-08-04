fetch('http://localhost:3000/test.json').then((response) => {
  console.log(response); response.json().then((data) => {
    console.log(data.nodes);
    if (data.edges && data.edges.length > 0) {
      combined = data.nodes.concat(data.edges)
   }else{
     combined = data.nodes
   }
    console.log(combined.length)
    var cy = cytoscape({
      container: document.getElementById('cy'), // container to render in
      elements: combined,

      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(labels)'
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      }

    });
    let prevTarget = ""
    cy.on('tap', (evt) => {
      console.log(evt.target.data())
      let targetDiv = document.getElementById("maintableDiv")
      let targetHeader = document.getElementById("maintableHeader")
      let targetTableBody = document.getElementById("tableBody")
      targetTableBody.innerText = ""
      if (evt.target.id === undefined || !(evt.target.id().charAt(0) === 'n' || evt.target.id().charAt(0) == 'e')) {
        return
      }
      if (targetDiv.style.display == "block") {
        if (prevTarget === evt.target.id()) {
          targetDiv.style.display = "none";
          prevTarget = evt.target.id()
          return;
        }
      } else {
        targetDiv.style.display = "block";
      }
      prevTarget = evt.target.id()
      targetHeader.innerText = evt.target.data().id
      targetTableBody.innerText = ""
      let labelElem = document.createElement("tr")
      let innerElem = document.createElement("td")
      innerElem.innerText = "labels"
      labelElem.appendChild(innerElem)
      console.log(evt.target.data())
      let data = evt.target.data()
      let labelString = ""
      let isFirst = true
      for (let elem of data.labels) {
        if (!isFirst) {
          labelString += ","
        }
        labelString += elem
        isFirst = false
      }
      let innerElem1 = document.createElement("td")
      innerElem1.innerText = labelString
      labelElem.appendChild(innerElem1)
      targetTableBody.appendChild(labelElem)
      for (const [key, value] of Object.entries(data.properties)) {
        console.log(key + " : " + value)
        let row = document.createElement("tr")
        let keyElem = document.createElement("td")
        keyElem.innerText = key
        row.appendChild(keyElem)
        let valueelem = document.createElement("td")
        valueelem.innerText = value
        row.setAttribute("scope", "row")
        row.appendChild(valueelem)
        targetTableBody.appendChild(row)
      }

    })
  })
})


