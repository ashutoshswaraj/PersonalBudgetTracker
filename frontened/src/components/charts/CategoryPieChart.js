import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CategoryPieChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 320;
    const radius = Math.min(width, height) / 2 - 40;

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create color scale with better colors
    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.category))
      .range([
        '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', 
        '#FF5722', '#00BCD4', '#E91E63', '#8BC34A',
        '#3F51B5', '#FF9800', '#009688', '#673AB7'
      ]);

    // Create pie chart
    const pie = d3.pie()
      .value(d => d.amount)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Add gradient definitions
    const defs = svg.append('defs');
    
    data.forEach((d, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${i}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color(d.category))
        .attr('stop-opacity', 0.8);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.color(color(d.category)).darker(0.5))
        .attr('stop-opacity', 0.8);
    });

    // Add slices with animation
    const slices = g.selectAll('.slice')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'slice');

    slices.append('path')
      .attr('d', d => {
        const startAngle = d.startAngle;
        const endAngle = d.startAngle;
        return arc({ ...d, startAngle, endAngle });
      })
      .attr('fill', (d, i) => `url(#gradient-${i})`)
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .style('stroke-width', '1px')
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(d.startAngle, d.endAngle);
        return function(t) {
          d.endAngle = interpolate(t);
          return arc(d);
        };
      });

    // Add hover effects
    slices.on('mouseover', function(event, d) {
      d3.select(this)
        .select('path')
        .transition()
        .duration(200)
        .attr('transform', 'scale(1.05)')
        .attr('filter', 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))');
      
      // Show tooltip
      tooltip
        .style('opacity', 1)
        .html(`
          <div style="font-weight: bold; margin-bottom: 4px;">${d.data.category}</div>
          <div>Amount: $${d.data.amount.toLocaleString()}</div>
          <div>Percentage: ${((d.data.amount / d3.sum(data, d => d.amount)) * 100).toFixed(1)}%</div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', function() {
      d3.select(this)
        .select('path')
        .transition()
        .duration(200)
        .attr('transform', 'scale(1)')
        .attr('filter', 'none');
      
      // Hide tooltip
      tooltip.style('opacity', 0);
    });

    // Add labels with animation
    const label = g.selectAll('.label')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'label');

    label.append('text')
      .attr('dy', '.35em')
      .text(d => {
        const percentage = ((d.data.amount / d3.sum(data, d => d.amount)) * 100).toFixed(1);
        return percentage > 5 ? `${percentage}%` : '';
      })
      .style('fill', 'white')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .attr('transform', d => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
      .transition()
      .duration(1000)
      .style('opacity', 1);

    // Add legend with improved styling
    const legend = g.selectAll('.legend')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(${radius + 20},${i * 20 - radius + 10})`);

    legend.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', (d, i) => `url(#gradient-${i})`)
      .attr('rx', 2)
      .attr('filter', 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.2))');

    legend.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .text(d => d.category);

    // Helper function to calculate mid angle
    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    // Create tooltip with improved styling
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.85)')
      .style('padding', '12px 16px')
      .style('border-radius', '6px')
      .style('color', 'white')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.2)')
      .style('backdrop-filter', 'blur(4px)');

  }, [data]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid meet"
    />
  );
};

export default CategoryPieChart; 