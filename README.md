# Belly Button Biodiversity Dashboard

## Overview

### Purpose

## Results

### Deliverable 1: Create a Horizontal Bar Chart

The function ```buildCharts``` was created to take the *Test Subject ID* selected and create a horizontal bar chart of the top 10 samples recorded for the test subject.

```js
function buildCharts(sample) {
  // 2. Use d3.json to load samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let samplesArray = data.samples;
    // 4. Create a variable that filters the samples for desired sample ID.
    let samplesFiltered = samplesArray.filter(x=>x.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    let sampleToPlot = samplesFiltered[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = sampleToPlot.otu_ids;
    let otuLabels = sampleToPlot.otu_labels;
    let sampleValues = sampleToPlot.sample_values;
    // 7. Create the yticks for the bar chart.
    var yticks = otuIds.slice(0,10).map(x => ("OTS "+(x))).reverse();
    var xticks = sampleValues.slice(0,10).reverse();
    var labels = otuLabels.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = {x:xticks,
                y: yticks,
                type: 'bar',
                orientation: 'h',
                text: labels};

    // 9. Create the layout for the bar chart. 
    var barLayout = { title: "Top 10 Bacteria Cultures Found"};

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout );
  });
}
```

### Deliverable 2: Create a Bubble Chart

In this deliverable, I added to the previous code to update a bubble chart

### Deliverable 3

### Deliverable 4

- Imagen to jumbotron
## Summary
