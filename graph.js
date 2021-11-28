//https://codepen.io/htmllabru/pen/JjjomZe?editors=0010
//https://js.cytoscape.org/#getting-started/initialisation

export let graph = cytoscape({
    container: document.getElementById("graph"),
    elements:[],

    style: cytoscape.stylesheet()
    .selector('edge')
        .css({
            'width': 3,
            'curve-style': 'straight',
            'line-color': '#264653',
            'target-arrow-color': '#264653',
            'target-arrow-shape': 'triangle',
            'arrow-scale':'1.25',
            'label': 'data(label)',
            'font-size': '14px',
            'color': '#777'
        })
        .selector('node')
        .css({
            'label': 'data(id)',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'color': '#264653',
            'background-color': '#2a9d8f'
        })
        .selector(':selected')
        .css({
            'background-color': 'white',
            'line-color': 'white',
            'target-arrow-color': 'white',
            'source-arrow-color': 'white',
            'text-outline-color': 'white'
        }),
})

export function addNode(node){
    let randX = () => Math.floor(Math.random() * (700 - 400 + 1) + 400);
    let randY = () => Math.floor(Math.random() * (300 - 50 + 1) + 50);
    graph.add([ { group: 'nodes',data: { id: node, label:  node},  position: { x: randX(), y: randY() }}]);
    graph.pan({ x: randX(), y: randY() });
    graph.fit();
} 

export function addEdge(sourceID,targetID){
    let edgeID = `E-${sourceID}${targetID}`;
    return graph.add([{group: 'edges', data: { id: edgeID, source: sourceID, target: targetID}}]);
} 

export function removeNode(id){
    let nodeToRemove = graph.getElementById(id);
    graph.remove(nodeToRemove);
}


export function resetView(){
    graph.reset();
    graph.fit();
}

export function download(){
    graph.fit();
    return graph.png({'output': 'blob'})
}

