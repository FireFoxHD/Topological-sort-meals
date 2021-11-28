export let adjacencyList = {}

export function setAdjacencyList(value) {
    adjacencyList = value;
}
  
export function topologicalSort() {
    let s = [];
    let explored = [];
  
    Object.keys(adjacencyList).forEach(node => {
       if (!explored.includes(node)) {
        topologicalSortRecursion(node, explored, s);
       }
    });

    return s;
}
  
function topologicalSortRecursion(node, explored, s) {
    explored.push(node);

    //Consider using for loop to randomise which vertex it chooses
    adjacencyList[node].forEach(node => {
        if (!explored.includes(node)) {
            topologicalSortRecursion(node, explored, s);
        }
    });

    s.unshift(node);
}
  
export let detectCycle = function() {
    const Nodes = Object.keys(adjacencyList);
    const visited = {};
    const recStack = {};
    
    for (let i = 0; i < Nodes.length; i++) {
      const node = Nodes[i]
      if (detectCycleUtil(node, visited , recStack)) 
        return true
    }
    return false
  }
  
export let detectCycleUtil = function(vertex, visited, recStack) {
    if(!visited[vertex]){
      visited[vertex] = true;
      recStack[vertex] = true;
      const nodeNeighbors = adjacencyList[vertex];
      for(let i = 0; i < nodeNeighbors.length; i++){
        const currentNode = nodeNeighbors[i];
        console.log('parent', vertex, 'Child', currentNode);
        if(!visited[currentNode] && detectCycleUtil(currentNode,visited, recStack)){
          return true;
        } else if (recStack[currentNode]){
          return true;
        }
      }
    }
    recStack[vertex] = false;
    return false;
  }
  

