import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const WeeklyChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.day))
      .range([0, width])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.amount)])
      .range([height, 0]);

    // Add bars
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.day))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("rx", 4) // Rounded corners
      .attr("fill", "#4CAF50")
      .attr("opacity", 0.8)
      .transition()
      .duration(1000)
      .attr("y", d => y(d.amount))
      .attr("height", d => height - y(d.amount));

    // Add hover effects
    svg.selectAll("rect")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1)
          .attr("fill", "#81C784");

        // Add tooltip
        svg.append("text")
          .attr("class", "tooltip")
          .attr("x", x(d.day) + x.bandwidth() / 2)
          .attr("y", y(d.amount) - 10)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .text(`$${d.amount}`);
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 0.8)
          .attr("fill", "#4CAF50");

        svg.selectAll(".tooltip").remove();
      });

    // Add x-axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", "rgba(255, 255, 255, 0.5)")
      .style("font-size", "12px");

    // Style axis
    svg.selectAll("path")
      .attr("stroke", "rgba(255, 255, 255, 0.1)");
    
    svg.selectAll("line")
      .attr("stroke", "rgba(255, 255, 255, 0.1)");

    // Add subtle grid lines
    svg.selectAll("grid-line")
      .data(y.ticks(5))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", d => y(d))
      .attr("y2", d => y(d))
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-dasharray", "4,4");

  }, [data]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg 
        ref={svgRef}
        style={{ 
          width: '100%', 
          height: '100%',
          overflow: 'visible'
        }}
      />
    </div>
  );
};

export default WeeklyChart; 