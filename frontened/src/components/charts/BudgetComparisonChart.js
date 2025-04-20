import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BudgetComparisonChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Modern compact margins and dimensions
    const margin = { top: 15, right: 15, bottom: 50, left: 45 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 170 - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x0 = d3.scaleBand()
      .range([0, width])
      .padding(0.2)
      .domain(data.map(d => d.category));

    const x1 = d3.scaleBand()
      .range([0, x0.bandwidth()])
      .padding(0.05)
      .domain(['budget', 'actual']);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => Math.max(d.budget, d.actual)) * 1.1]);

    // Add subtle grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(4)
        .tickSize(-width)
        .tickFormat('')
      )
      .style('stroke', 'rgba(255, 255, 255, 0.03)')
      .style('stroke-width', 0.5);

    // Define gradients
    const defs = svg.append('defs');

    // Budget gradient
    const budgetGradient = defs.append('linearGradient')
      .attr('id', 'budgetGradient')
      .attr('gradientTransform', 'rotate(90)');

    budgetGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#2196f3');

    budgetGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(33, 150, 243, 0.7)');

    // Actual gradient
    const actualGradient = defs.append('linearGradient')
      .attr('id', 'actualGradient')
      .attr('gradientTransform', 'rotate(90)');

    actualGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#f44336');

    actualGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(244, 67, 54, 0.7)');

    // Create bar groups
    const barGroups = g.selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', d => `translate(${x0(d.category)},0)`);

    // Add budget bars
    barGroups.append('rect')
      .attr('class', 'budget-bar')
      .attr('x', 0)
      .attr('y', height)
      .attr('width', x1.bandwidth())
      .attr('height', 0)
      .attr('fill', 'url(#budgetGradient)')
      .attr('rx', 2)
      .style('filter', 'drop-shadow(0px 2px 3px rgba(33, 150, 243, 0.2))')
      .transition()
      .duration(800)
      .ease(d3.easeElasticOut)
      .attr('y', d => y(d.budget))
      .attr('height', d => height - y(d.budget));

    // Add actual bars
    barGroups.append('rect')
      .attr('class', 'actual-bar')
      .attr('x', x1.bandwidth() + x1.step() * x1.padding())
      .attr('y', height)
      .attr('width', x1.bandwidth())
      .attr('height', 0)
      .attr('fill', d => d.actual > d.budget ? 'url(#actualGradient)' : '#4CAF50')
      .attr('rx', 2)
      .style('filter', d => d.actual > d.budget 
        ? 'drop-shadow(0px 2px 3px rgba(244, 67, 54, 0.2))'
        : 'drop-shadow(0px 2px 3px rgba(76, 175, 80, 0.2))')
      .transition()
      .duration(800)
      .ease(d3.easeElasticOut)
      .attr('y', d => y(d.actual))
      .attr('height', d => height - y(d.actual));

    // Add x-axis with rotated labels
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .style('fill', 'rgba(255, 255, 255, 0.5)')
      .style('font-size', '9px')
      .style('font-weight', '500')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end')
      .attr('dx', '-0.5em')
      .attr('dy', '0.5em');

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d => `₹${d >= 1000 ? `${d/1000}K` : d}`)
      )
      .selectAll('text')
      .style('fill', 'rgba(255, 255, 255, 0.5)')
      .style('font-size', '9px')
      .style('font-weight', '500');

    // Add legend
    const legend = g.append('g')
      .attr('transform', `translate(${width - 100}, -10)`);

    // Budget legend
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 8)
      .attr('height', 8)
      .attr('fill', 'url(#budgetGradient)')
      .attr('rx', 1);

    legend.append('text')
      .attr('x', 12)
      .attr('y', 7)
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '8px')
      .style('font-weight', '500')
      .text('Budget');

    // Actual legend
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 12)
      .attr('width', 8)
      .attr('height', 8)
      .attr('fill', 'url(#actualGradient)')
      .attr('rx', 1);

    legend.append('text')
      .attr('x', 12)
      .attr('y', 19)
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '8px')
      .style('font-weight', '500')
      .text('Actual');

    // Add hover effects and tooltips
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(18, 18, 18, 0.9) 100%)')
      .style('backdrop-filter', 'blur(8px)')
      .style('padding', '8px 12px')
      .style('border-radius', '8px')
      .style('color', 'white')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)')
      .style('border', '1px solid rgba(255, 255, 255, 0.1)');

    // Add hover effects for both bars
    barGroups.selectAll('rect')
      .on('mouseover', function(event, d) {
        const isActual = d3.select(this).classed('actual-bar');
        const percentage = ((d.actual / d.budget) * 100).toFixed(1);
        const status = d.actual > d.budget ? 'Over Budget' : 'Within Budget';
        const statusColor = d.actual > d.budget ? '#f44336' : '#4CAF50';
        
        d3.select(this)
          .transition()
          .duration(200)
          .style('filter', isActual 
            ? `drop-shadow(0px 4px 6px ${d.actual > d.budget ? 'rgba(244, 67, 54, 0.3)' : 'rgba(76, 175, 80, 0.3)'})`
            : 'drop-shadow(0px 4px 6px rgba(33, 150, 243, 0.3))')
          .attr('opacity', 0.85);
        
        tooltip
          .style('visibility', 'visible')
          .html(`
            <div style="margin-bottom: 4px; color: rgba(255, 255, 255, 0.7);">${d.category}</div>
            <div style="color: #2196f3; margin-bottom: 2px;">Budget: ₹${d.budget.toLocaleString('en-IN')}</div>
            <div style="color: ${d.actual > d.budget ? '#f44336' : '#4CAF50'}">
              Actual: ₹${d.actual.toLocaleString('en-IN')}
            </div>
            <div style="margin-top: 4px; font-size: 10px; color: ${statusColor}">
              ${status} (${percentage}%)
            </div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        const isActual = d3.select(this).classed('actual-bar');
        const d = d3.select(this).datum();
        
        d3.select(this)
          .transition()
          .duration(200)
          .style('filter', isActual 
            ? `drop-shadow(0px 2px 3px ${d.actual > d.budget ? 'rgba(244, 67, 54, 0.2)' : 'rgba(76, 175, 80, 0.2)'})`
            : 'drop-shadow(0px 2px 3px rgba(33, 150, 243, 0.2))')
          .attr('opacity', 1);
        
        tooltip.style('visibility', 'hidden');
      });

  }, [data]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'visible'
      }}
    />
  );
};

export default BudgetComparisonChart; 