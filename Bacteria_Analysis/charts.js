function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then( (data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

//    console.log(data.samples[0]);
    //const blah = data.samples[0]
    //console.log(blah);
    //blah[sample].push("break");
    //buildCharts(blah);

}) 

}


function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id);    
    PANEL.append("h6").text("Ethnicity: " + result.ethnicity);
    PANEL.append("h6").text("Gender: " + result.gender);
    PANEL.append("h6").text("Age: " + result.age);         
    PANEL.append("h6").text("Location: " + result.location);
    PANEL.append("h6").text("BBTYPE: " + result.bbtype);
    PANEL.append("h6").text("WFREQ: " + result.wfreq);    
   
  });
}

// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    var otus = result.otu_ids
    var otusLables = result.otu_labels
    var sampleValues = result.sample_values

    var slicedotus = otus.slice(0,10);    
    var slicedValues = sampleValues.slice(0,10);
    //var sortedNumDesc = new Map([sampleValues].sort((a, b) => b[0] - a[0]));

    console.log(slicedotus);
    console.log(slicedValues);

    let zipped = slicedotus.map((x, i) => [x, slicedValues[i]].sort((a, b) => b[0] - a[0])).reverse(); 
    console.log(zipped);

    ytick = []
    for (let i = 0; i < zipped.length; i++)
    {
      ytick.push("OTU " + zipped[i][0]);
    }

    xtick = []
    for (let i = 0; i < zipped.length; i++)
    {
      xtick.push(zipped[i][1]);
    }

    console.log(ytick);
    console.log(xtick);

    var trace = {
      x: xtick ,
      //y: ytick,
      type: "bar",
      orientation: "h"      
     };

     var layout = {
      
      title: {
        text:'Top 10 Bacteria Cultures Found',
        y: .82,
        yanchor: "top",
        x: 0.08,
        xanchor: "left"

      },

      yaxis: {
        ticktext: ytick,
        tickvals: [0,1,2,3,4,5,6,7,8, 9,10]
      }
      
      }
  
     Plotly.newPlot("bar", [trace], layout);


    // 1. Create the trace for the bubble chart.
    var trace1 = {
      x: otus ,
      y: sampleValues,
      mode: 'markers',
      text: otusLables,
      marker: {
        size: sampleValues,
        color: otus, 
        colorscale: 'Earth'
      }
    };

    var bubbleData = [trace1];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      //height: 600,
      //width: 600
      
      xaxis: {
        title: {
          text: 'OTU ID',
               }
      }

    };

    // 3. Use Plotly to plot the data with the layout.
    
  Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
  

    
  var metadatas = data.metadata;
  var metaArray = metadatas.filter(sampleObj => sampleObj.id == sample);
  var metaResult = metaArray[0];
  var floatWash = parseFloat(metaResult.wfreq);

  var metaId = metaResult.id
  //var otusLables = result.otu_labels
  //var sampleValues = result.sample_values
  console.log("at bubble");
  console.log(metaResult);
  console.log(floatWash);

  var gaugeData = [
    {
      type: "indicator",
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
      mode: "gauge+number",
      value: floatWash,
      gauge: {
        axis: { range: [null, 10], tickmode:'auto', nticks:6},
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "limegreen" },
          { range: [8, 10], color: "green" },          
        ]
      }

    }];

    Plotly.newPlot('gauge', gaugeData);

});
}

init();
let initobj = 940;
buildCharts(initobj);
buildMetadata(initobj)

