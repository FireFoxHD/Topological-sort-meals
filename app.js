// https://github.com/FireFoxHD/Topological-sort-meals/
// Analysis of Algorithms Group Project
// Khamali Powell - 1901908
// Javian Burke

import * as graph from './graph.js';
import * as sort from './topologicalSort.js';


let mealInput = document.getElementById("new-meal"); 
let durationInput = document.getElementById("new-mealDuration"); 
let sourceNode = document.getElementById("sourceNode");
let targetNode = document.getElementById("targetNode");
let addMealButton = document.getElementById("addMealbtn");
let addConnectionButton = document.getElementById("addConnectionbtn");
let closeButton = document.getElementById("close-alert");
let sortButton = document.getElementById("sortList");
let deleteButton = document.getElementsByClassName("delete");
let downloadBtn = document.getElementById("download-graph");
let mealList = document.getElementById("mealList");
let toggleView = document.getElementById("change-view");
let listView = document.getElementById("list-view");
let graphView = document.getElementById("graph-view");
let sortView = document.getElementById("sort-view");
let viewLabel = document.getElementById("viewLabel");
let alert = document.getElementById("alert");
let resetBtn = document.getElementById("recenterView");
let mealArr = []; 
let adjacencyList = {}; //dictionary
let stack = [];
let visibleView = Math.floor(Math.random() * 2) == 0;
let lastViewflag=0;

sortButton.disabled = true;
downloadBtn.disabled = true;

//New task list item
let createMealElement = (mealName, duration) => {
  
  let listItem = document.createElement("li");
  let detailsDiv = document.createElement("div");
  let actionsDiv = document.createElement("div");

  let durationDiv = document.createElement("div");
  let mealDiv = document.createElement("div");

  let deleteButton = document.createElement("button");

  mealDiv.innerText = mealName;
  durationDiv.innerText = `${duration} mins`;

  //add to graph
  let meal = {
    name: mealName,
    durationInMin: duration
  }

  addNode(meal);

  mealDiv.className = "mealNameDiv";
  durationDiv.className = "durationDiv";
  listItem.className = "listItem"

  detailsDiv.className = "details"
  actionsDiv.className = "actions"

  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
 
  detailsDiv.appendChild(mealDiv)
  detailsDiv.appendChild(durationDiv)
  detailsDiv.appendChild(durationDiv)
  detailsDiv.appendChild(durationDiv)
 
  actionsDiv.appendChild(deleteButton); 

  listItem.appendChild(detailsDiv);
  listItem.appendChild(actionsDiv);
  return listItem;
};

addMealButton.addEventListener("click", (event) => {
  event.preventDefault();
  
  if (mealInput.value && !isNaN(durationInput.value) && durationInput.value && !mealArr.some(item => item.name == mealInput.value)){
    console.log("Adding Meal...");
    let listItem = createMealElement(mealInput.value, durationInput.value);
    mealList.appendChild(listItem);
    addDeleteListener(deleteButton);
    mealInput.value = "";
    durationInput.value = "";

    if(mealArr.length >= 1){
      sortButton.disabled = false;
      downloadBtn.disabled = false;
    }else{
      sortButton.disabled = true;
      downloadBtn.disabled = true;
    }
    sortList();
    notification("Dish Added", "success")
  } 
});

addConnectionButton.addEventListener("click", (event) => {
  event.preventDefault();
  
  if (targetNode.value && sourceNode.value){
    if(mealArr.some(item => item.name == sourceNode.value) && mealArr.some(item => item.name == targetNode.value)){
      if(addEdge(sourceNode.value,targetNode.value)){
         notification("Connection Added", "success")
      }
      sortList();
    }else{
      console.log("no node in graph matches source or target ");
      notification("Connection Failed", "error")
    }
    sourceNode.value = "";
    targetNode.value = "";
  }
  
  
});

let addDeleteListener = (deleteButtons)=>{
  Array.from(deleteButtons).forEach( element => {
    element.addEventListener("click", () => {
      let listItem = element.parentNode.parentNode;
      let id =  Array.from(Array.from(listItem.children)[0].children)[0].textContent;   
      console.log("DELETING NODE: ",id)
      graph.removeNode(id);
      for (let i = 0; i < mealArr.length; i++) {
        if (mealArr[i].name === id) {
          mealArr.splice(i, 1);
          i--;
        }
      }

      delete adjacencyList[id];

      for (const [key, value] of Object.entries(adjacencyList)) {
        for (let i = 0; i < value.length; i++) {
          if (value[i] === id){
            value.splice(i, 1);
            i--;
          }
        }
      }

      if(mealArr.length >= 1){
        sortButton.disabled = false;
        downloadBtn.disabled = false;
      }else{
        sortButton.disabled = true;
        downloadBtn.disabled = true;
      }
      
      sortList();
      mealList.removeChild(listItem);
      notification("Node Deleted", "success");
    })
  })
}

downloadBtn.addEventListener("click", (event)=>{

  if(mealArr.length >= 1){
    downloadBtn.disabled = false;
  }else{
    downloadBtn.disabled = true;
    return;
  }

  let blob = graph.download();
  if(blob){
    let type = "image/png";
    let a = document.createElement("a");
    let file = new Blob([blob], {
        type: type
    });
    a.href = URL.createObjectURL(file);
    a.download = "graph.png";
    a.click();
  }else{
    notification("Error Downloading Image", "error");
  }
 
});

resetBtn.addEventListener("click", (event)=>{
  graph.resetView();
})

toggleView.addEventListener("click", (event)=>{
  event.preventDefault();

  if(visibleView == 1){
     visibleView = 0
     updateView();
  }else if(visibleView == 0){
     visibleView = 1
     updateView();
  }

});

let addNode = (meal)=>{
    mealArr.push(meal)
    adjacencyList[meal.name]=[]
    graph.addNode(meal.name); 
}

let addEdge = (source,target)=>{
    console.log("Adding Connection...");
    console.log(`${source} -----> ${target}`);
    adjacencyList[source].push(target);
    return graph.addEdge(source,target);
}

sortButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (!sortList()){
    notification("List Sorted", "success");
  }
  lastViewflag = +visibleView;
  console.log(+lastViewflag);
  visibleView = 3;
  updateView();
  
});

function sortList(){
  let sortView = document.getElementById("sort-view");
  sortView.innerHTML="";
  sort.setAdjacencyList(adjacencyList);
  if (sort.detectCycle()){
    notification("Cycle Detected", "Error");
    return true;
  }
  stack = sort.topologicalSort();
  let len = stack.length

  for(let i=0; i < len; i++){
    let item = stack.shift();
    let itemDiv = document.createElement("div");
    itemDiv.textContent = item;
    itemDiv.className = "sortedItem";
    sortView.appendChild(itemDiv);
  }
}

function updateView(){
  if(visibleView == 1){
    viewLabel.textContent = "Graph View";
    toggleView.textContent = "List View";
    graphView.classList.remove("hide");
    graphView.classList.add("show");
    sortView.classList.add("hide");
    listView.classList.add("hide");
  }else if(visibleView==0){
    viewLabel.textContent = "List View"
    toggleView.textContent = "Graph View"
    graphView.classList.add("hide");
    graphView.classList.remove("show");
    sortView.classList.add("hide");
    listView.classList.remove("hide");
  }else{
    viewLabel.textContent = "Sorted List"
    sortView.classList.remove("hide");
    graphView.classList.remove("show");
    graphView.classList.add("hide");
    listView.classList.add("hide");
    visibleView = lastViewflag;
  }
}

updateView();

closeButton.addEventListener("click", (event)=>{
  event.preventDefault();
  alert.classList.add("hide");
  alert.classList.remove("show");
  //alert.classList.remove("showAlert");
});

function notification(msg, type){

  let msgbox = document.getElementById("notif-msg");
  let icon = document.getElementById("notif-icon");
  msgbox.textContent = msg;

  if(type.toLowerCase() == "success"){
    icon.classList.add("fa-check-circle");
    icon.classList.remove("fa-times-circle");
    alert.classList.add("success");
    alert.classList.remove("error");

    closeButton.classList.add("success");
    closeButton.classList.remove("error");

    msgbox.classList.add("success");
    msgbox.classList.remove("error");
    
  }else if(type.toLowerCase() == "error"){
    icon.classList.add("fa-times-circle");
    icon.classList.remove("fa-check-circle");
    alert.classList.remove("success");
    alert.classList.add("error");

    closeButton.classList.remove("success");
    closeButton.classList.add("error");

    msgbox.classList.remove("success");
    msgbox.classList.add("error");
  }else{
    console.log("invalid type of notification")
    return;
  }

  
  alert.classList.add("show");
  alert.classList.remove("hide");

  setTimeout(()=>{
    //alert.classList.remove("showAlert");
    alert.classList.remove("show");
    alert.classList.add("hide");
  },1000)
}