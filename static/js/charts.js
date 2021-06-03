function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();
 getBacteriaNames();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()+".".repeat(9-key.length)+":"} ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let samplesFiltered = samplesArray.filter(x=>x.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    let sampleToPlot = samplesFiltered[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = sampleToPlot.otu_ids;
    let otuLabels = sampleToPlot.otu_labels;
    let sampleValues = sampleToPlot.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).map(x => ("OTS "+(x))).reverse();
    var xticks = sampleValues.slice(0,10).reverse();
    var labels = otuLabels.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = {x:xticks,
                y: yticks.map(x=> x+" "),
                type: 'bar',
                orientation: 'h',
                text: labels};

    // 9. Create the layout for the bar chart. 
    var barLayout = { 
            title:{text:"<b>Top 10 Bacteria Cultures Found</b>"}
          };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout );
 
    // Deliverable 2.
          console.log(otuLabels)
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        x:otuIds,
        y:sampleValues,
        text: otuLabels,
        type:"scatter",
        mode: "markers",
        marker:{
          size: sampleValues.map(x=>(x>200?200:x)),
          //color: otuIds,
          color: otuLabels.map(bubbleColor),
          //colorscale: 'Earth',
          opacity: sampleValues.map(x=>0.8)
        }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample color by Phylum",
      xaxis:{title:'OTU ID'},
      margin:{r:100, l:100},
      hovermode:"closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

     // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    // 2. Create a variable that holds the first sample in the metadata array.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // 3. Create a variable that holds the washing frequency.
    var washFreq = (result.wfreq);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
     {
        type: 'indicator',
        value: washFreq,
        mode:"gauge+number",
        title: { text: "Belly Button Washing Frequency <br><b> Scrubs per Week</b>"},
        gauge: {
          axis:{ visible:true,
                tickmode:'linear',
                tick0 :0, dtick:2,
                range: [0,10]},
          bar: { color: 'black'},
          steps:[
            { range: [0,2], color:'red'},
            { range: [2,4], color:'orange'},
            { range: [4,6], color:'yellow'},
            { range: [6,8], color:'lightgreen'},
            { range: [8,10], color:'green'},
          ]
        }
     }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {text: "",
              font: 'bold'
              },
      margin:{l:0,r:0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

// return a color based on the either the 1st of second classification level on the otuLabels
function bubbleColor(sampleLabel){
   let classes = sampleLabel.split(";");
  if (classes.length==1){
    i = 0;
  } else {i = 1};
  switch (classes[i]) {
    case "Bacteria": return "green"
    case "Bacteroidetes": return "lightgreen"
    case "Firmicutes": return "red"
    case  "Bacteria": return "lightred"
    case  "Proteobacteria": return "blue"
    case  "Actinobacteria": return "lightblue"
    case  "Cyanobacteria": return "orange"
    case  "Synergistetes": return "yellow"
    case  "Fusobacteria": return "purple"
    case  "Acidobacteria": return "brown"
    case  "Euryarchaeota": return "Cyan"
    case  "Spirochaetes": return "skyblue"
    case  "SR1": return "Aqua"
    case  "Deinococcus-Thermus": return "Coral"
    case  "Verrucomicrobia": return "HotPink"
    case  "Planctomycetes": return "seagreen"
    default:
      return "grey";
  }
}

// function initColors(){
//   bubbleColors = {"Bacteroidetes": case  "Firmicutes", "Bacteria", "Proteobacteria", "Actinobacteria", "Cyanobacteria", "Synergistetes", "Fusobacteria", "Acidobacteria", "Euryarchaeota", "Spirochaetes", "SR1", "Deinococcus-Thermus", "Verrucomicrobia", "Planctomycetes"]

// temporary function to get the 1st or second name classification across all the samples.  
function getBacteriaNames(){
  d3.json("samples.json").then((data) => {
    let samplesArray = data.samples;
    var types=[];
    samplesArray.map((sample)=>{
      let otuLabels = sample.otu_labels;
      otuLabels.forEach(function(x){
         let classes = x.split(";");
         if (classes.length==1) {
           i=0
         }
         else {i=1}
         if (!types.includes(classes[i])){
           types.push(classes[i])
         }
      });
    });
     console.log(types);
  })
};