/* global D3 */

function table() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let ourBrush = null,
      selectableElements = d3.select(null),
      dispatcher;

  // Create the chart by adding an svg to the div with the id 
  // specified by the selector using the given data
  function chart(selector, data) {
      let table = d3.select(selector)
          .append("table");

      // Here, we grab the labels of the first item in the dataset
      //  and store them as the headers of the table.
      let tableHeaders = Object.keys(data[0]);

      // You should append these headers to the <table> element as <th> objects inside
      // a <th>
      // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table

      // YOUR CODE HERE
      let tr = table.append('thead').append('tr')
      tr.selectAll('th').data(tableHeaders).enter().append('th').text((d) => d)

      // Then, you add a row for each row of the data.  Within each row, you
      // add a cell for each piece of data in the row.
      // HINTS: For each piece of data, you should add a table row.
      // Then, for each table row, you add a table cell.  You can do this with
      // two different calls to enter() and data(), or with two different loops.

      // YOUR CODE HERE
      let rows = table.append('tbody')
          .selectAll('tr')
          .data(data)
          .enter()
          .append('tr');

      rows.selectAll('td')
          .data(d => Object.values(d))
          .enter()
          .append('td')
          .text(d => d);

      // Then, add code to allow for brushing.  Note, this is handled differently
      // than the line chart and scatter plot because we are not using an SVG.
      // Look at the readme of the assignment for hints.
      // Note: you'll also have to implement linking in the updateSelection function
      // at the bottom of this function.
      // Remember that you have to dispatch that an object was highlighted.  Look
      // in linechart.js and scatterplot.js to see how to interact with the dispatcher.

      // HINT for brushing on the table: keep track of whether the mouse is down or up, 
      // and when the mouse is down, keep track of any rows that have been mouseover'd

      // YOUR CODE HERE
      // Brushing functionality


      // Track mouse events for brushing
      rows.on("mousedown", function(event, d) {
          // Start selection and toggle "selected" class on rows
          d3.select(this).classed("selected", !d3.select(this).classed("selected"));
          dispatchSelection();
      });

      // Function to dispatch selection events
      function dispatchSelection() {
          const selectedData = table.selectAll(".selected").data();
          let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
          dispatcher.call(dispatchString, this, selectedData);
      }

      // Brush feature for table (tracks mousedown for row selection)
      let isMouseDown = false;
      table.on("mousedown", () => isMouseDown = true)
          .on("mouseup", () => isMouseDown = false);

      rows.on("mouseover", function() {
          if (isMouseDown) {
              d3.select(this).classed("selected", !d3.select(this).classed("selected"));
              dispatchSelection();
          }
      });

      // Reset mouse state when mouse is released outside the table
      d3.select("body").on("mouseup", function() {
          isMouseDown = false;
      });


      return chart;
  }

  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function(_) {
      if (!arguments.length) return dispatcher;
      dispatcher = _;
      return chart;
  };

  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function(selectedData) {
      if (!arguments.length) return;

      // Select an element if its datum was selected
      d3.selectAll('tr').classed("selected", d => {
          return selectedData.includes(d)
      });
  };

  return chart;
}