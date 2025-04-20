import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Modern compact margins and dimensions
    const margin = { top: 15, right: 15, bottom: 30, left: 45 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 170 - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scalePoint()
      .range([0, width])
      .padding(0.2)
      .domain(data.map(d => d.date));

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => Math.max(d.income, d.expense)) * 1.1]);

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

    // Define gradients for the area under the lines
    const defs = svg.append('defs');

    // Income gradient
    const incomeGradient = defs.append('linearGradient')
      .attr('id', 'incomeGradient')
      .attr('gradientTransform', 'rotate(90)');

    incomeGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(76, 175, 80, 0.2)');

    incomeGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(76, 175, 80, 0)');

    // Expense gradient
    const expenseGradient = defs.append('linearGradient')
      .attr('id', 'expenseGradient')
      .attr('gradientTransform', 'rotate(90)');

    expenseGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(244, 67, 54, 0.2)');

    expenseGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(244, 67, 54, 0)');

    // Create line generators
    const incomeLine = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.income))
      .curve(d3.curveMonotoneX);

    const expenseLine = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.expense))
      .curve(d3.curveMonotoneX);

    // Create area generators for the gradient fill
    const incomeArea = d3.area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.income))
      .curve(d3.curveMonotoneX);

    const expenseArea = d3.area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.expense))
      .curve(d3.curveMonotoneX);

    // Add the areas under the lines
    g.append('path')
      .datum(data)
      .attr('class', 'income-area')
      .attr('d', incomeArea)
      .attr('fill', 'url(#incomeGradient)')
      .attr('opacity', 0);

    g.append('path')
      .datum(data)
      .attr('class', 'expense-area')
      .attr('d', expenseArea)
      .attr('fill', 'url(#expenseGradient)')
      .attr('opacity', 0);

    // Add the lines
    g.append('path')
      .datum(data)
      .attr('class', 'income-line')
      .attr('fill', 'none')
      .attr('stroke', '#4CAF50')
      .attr('stroke-width', 2)
      .attr('d', incomeLine)
      .style('filter', 'drop-shadow(0px 2px 3px rgba(76, 175, 80, 0.2))');

    g.append('path')
      .datum(data)
      .attr('class', 'expense-line')
      .attr('fill', 'none')
      .attr('stroke', '#f44336')
      .attr('stroke-width', 2)
      .attr('d', expenseLine)
      .style('filter', 'drop-shadow(0px 2px 3px rgba(244, 67, 54, 0.2))');

    // Add dots for each data point
    g.selectAll('.income-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'income-dot')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.income))
      .attr('r', 3)
      .attr('fill', '#4CAF50')
      .style('filter', 'drop-shadow(0px 2px 3px rgba(76, 175, 80, 0.2))');

    g.selectAll('.expense-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'expense-dot')
      .attr('cx', d => x(d.date))
      .attr('cy', d => y(d.expense))
      .attr('r', 3)
      .attr('fill', '#f44336')
      .style('filter', 'drop-shadow(0px 2px 3px rgba(244, 67, 54, 0.2))');

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('fill', 'rgba(255, 255, 255, 0.5)')
      .style('font-size', '9px')
      .style('font-weight', '500');

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

    // Income legend
    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 15)
      .attr('y1', 4)
      .attr('y2', 4)
      .attr('stroke', '#4CAF50')
      .attr('stroke-width', 2);

    legend.append('text')
      .attr('x', 20)
      .attr('y', 7)
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '8px')
      .style('font-weight', '500')
      .text('Income');

    // Expense legend
    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 15)
      .attr('y1', 16)
      .attr('y2', 16)
      .attr('stroke', '#f44336')
      .attr('stroke-width', 2);

    legend.append('text')
      .attr('x', 20)
      .attr('y', 19)
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '8px')
      .style('font-weight', '500')
      .text('Expense');

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

    // Add hover effects for both lines
    const handleMouseOver = (event, d) => {
      tooltip
        .style('visibility', 'visible')
        .html(`
          <div style="margin-bottom: 4px; color: rgba(255, 255, 255, 0.7);">${d.date}</div>
          <div style="color: #4CAF50; margin-bottom: 2px;">Income: ₹${d.income.toLocaleString('en-IN')}</div>
          <div style="color: #f44336;">Expense: ₹${d.expense.toLocaleString('en-IN')}</div>
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');

      // Highlight the dots
      g.selectAll('.income-dot')
        .filter(point => point === d)
        .attr('r', 5)
        .style('filter', 'drop-shadow(0px 4px 6px rgba(76, 175, 80, 0.3))');

      g.selectAll('.expense-dot')
        .filter(point => point === d)
        .attr('r', 5)
        .style('filter', 'drop-shadow(0px 4px 6px rgba(244, 67, 54, 0.3))');

      // Show the gradient areas with animation
      g.select('.income-area')
        .transition()
        .duration(200)
        .attr('opacity', 1);

      g.select('.expense-area')
        .transition()
        .duration(200)
        .attr('opacity', 1);
    };

    const handleMouseOut = () => {
      tooltip.style('visibility', 'hidden');

      // Reset dot sizes
      g.selectAll('.income-dot')
        .attr('r', 3)
        .style('filter', 'drop-shadow(0px 2px 3px rgba(76, 175, 80, 0.2))');

      g.selectAll('.expense-dot')
        .attr('r', 3)
        .style('filter', 'drop-shadow(0px 2px 3px rgba(244, 67, 54, 0.2))');

      // Hide the gradient areas with animation
      g.select('.income-area')
        .transition()
        .duration(200)
        .attr('opacity', 0);

      g.select('.expense-area')
        .transition()
        .duration(200)
        .attr('opacity', 0);
    };

    // Add invisible overlay rectangles for better hover detection
    data.forEach((d) => {
      const x0 = x(d.date) - (x.step() * x.padding()) / 2;
      const x1 = x(d.date) + (x.step() * x.padding()) / 2;

      g.append('rect')
        .attr('x', x0)
        .attr('y', 0)
        .attr('width', x1 - x0)
        .attr('height', height)
        .attr('fill', 'transparent')
        .on('mouseover', (event) => handleMouseOver(event, d))
        .on('mouseout', handleMouseOut);
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

export default LineChart; 