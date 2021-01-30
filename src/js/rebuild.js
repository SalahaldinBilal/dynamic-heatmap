//Create the event type enums, taken from rrweb.js
const IncrementalSource = {}, MouseInteractions = {};
(function (IncrementalSource) {
    IncrementalSource[IncrementalSource["Mutation"] = 0] = "Mutation";
    IncrementalSource[IncrementalSource["MouseMove"] = 1] = "MouseMove";
    IncrementalSource[IncrementalSource["MouseInteraction"] = 2] = "MouseInteraction";
    IncrementalSource[IncrementalSource["Scroll"] = 3] = "Scroll";
    IncrementalSource[IncrementalSource["ViewportResize"] = 4] = "ViewportResize";
    IncrementalSource[IncrementalSource["Input"] = 5] = "Input";
    IncrementalSource[IncrementalSource["TouchMove"] = 6] = "TouchMove";
    IncrementalSource[IncrementalSource["MediaInteraction"] = 7] = "MediaInteraction";
    IncrementalSource[IncrementalSource["StyleSheetRule"] = 8] = "StyleSheetRule";
    IncrementalSource[IncrementalSource["CanvasMutation"] = 9] = "CanvasMutation";
    IncrementalSource[IncrementalSource["Font"] = 10] = "Font";
    IncrementalSource[IncrementalSource["Log"] = 11] = "Log";
})(IncrementalSource);
(function (MouseInteractions) {
    MouseInteractions[MouseInteractions["MouseUp"] = 0] = "MouseUp";
    MouseInteractions[MouseInteractions["MouseDown"] = 1] = "MouseDown";
    MouseInteractions[MouseInteractions["Click"] = 2] = "Click";
    MouseInteractions[MouseInteractions["ContextMenu"] = 3] = "ContextMenu";
    MouseInteractions[MouseInteractions["DblClick"] = 4] = "DblClick";
    MouseInteractions[MouseInteractions["Focus"] = 5] = "Focus";
    MouseInteractions[MouseInteractions["Blur"] = 6] = "Blur";
    MouseInteractions[MouseInteractions["TouchStart"] = 7] = "TouchStart";
    MouseInteractions[MouseInteractions["TouchMove_Departed"] = 8] = "TouchMove_Departed";
    MouseInteractions[MouseInteractions["TouchEnd"] = 9] = "TouchEnd";
})(MouseInteractions);
Object.freeze(IncrementalSource, MouseInteractions);

//parses events of certian type and returns how many times the event happend to each element.
function parseEvents(events){
    var parsedEvents = {};
    for(var key in events){
        if(parsedEvents[events[key].data.id] === undefined) parsedEvents[events[key].data.id] = {repeated:1}
        else parsedEvents[events[key].data.id].repeated++;
    }
    return parsedEvents;
}

//filters data for a specfic type
function filterData(events, source, type){
    return events.filter(e => e.data.source == source && e.data.type == type)
}

//filtring data for mouse clicks
function filterMouseClicks(events){
    return filterData(events, IncrementalSource.MouseInteraction, MouseInteractions.Click);
}

//parse the given events
function praseData(events, iframeWrapper){
    const iframe = document.createElement("iframe");
    iframeWrapper.append(iframe);
    iframe.width  = events[2].data.width;
    iframe.height = events[2].data.height;
    let documentHolder = rrwebSnapshot.rebuild(events[3].data.node, {doc:iframe.contentDocument});
    let parsedData = { map: documentHolder[1], eventData:{
      click : parseEvents(filterMouseClicks(events)),
      //can add more events in the future 
    }}
    return parsedData;
}

var parsedData;
//fetching the events and parsing them 
fetch('/src/exampleEvents.json')
  .then(response => response.json())
  .then(data => parsedData = praseData(data, document.getElementById("wrapper")));