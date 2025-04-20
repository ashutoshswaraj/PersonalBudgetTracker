import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MonthlyTrendChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Improved margins and dimensions
    const margin = { top: 40, right: 40, bottom: 60, left: 80 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales with better padding
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.3)
      .domain(data.map(d => d.date));

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => Math.max(d.income, d.expense)) * 1.2]);

    // Add gradient definitions with improved colors
    const defs = svg.append('defs');
    
    // Income gradient with softer colors
    const incomeGradient = defs.append('linearGradient')
      .attr('id', 'income-line-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    
    incomeGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#66BB6A')
      .attr('stop-opacity', 0.9);
    
    incomeGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#43A047')
      .attr('stop-opacity', 0.9);

    // Expense gradient with softer colors
    const expenseGradient = defs.append('linearGradient')
      .attr('id', 'expense-line-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    
    expenseGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#EF5350')
      .attr('stop-opacity', 0.9);
    
    expenseGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#E53935')
      .attr('stop-opacity', 0.9);

    // Add subtle grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat('')
      )
      .style('stroke', 'rgba(255, 255, 255, 0.05)')
      .style('stroke-dasharray', '2,2')
      .style('stroke-width', 1);

    // Create line generators with improved styling
    const incomeLine = d3.line()
      .x(d => x(d.date) + x.bandwidth() / 2)
      .y(d => y(d.income))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const expenseLine = d3.line()
      .x(d => x(d.date) + x.bandwidth() / 2)
      .y(d => y(d.expense))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Add area generators with improved styling
    const incomeArea = d3.area()
      .x(d => x(d.date) + x.bandwidth() / 2)
      .y0(height)
      .y1(d => y(d.income))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const expenseArea = d3.area()
      .x(d => x(d.date) + x.bandwidth() / 2)
      .y0(height)
      .y1(d => y(d.expense))
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Add areas with improved animation and styling
    const incomeAreaGradient = defs.append('linearGradient')
      .attr('id', 'income-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    incomeAreaGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#66BB6A')
      .attr('stop-opacity', 0.2);
    
    incomeAreaGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#43A047')
      .attr('stop-opacity', 0);

    const expenseAreaGradient = defs.append('linearGradient')
      .attr('id', 'expense-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    expenseAreaGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#EF5350')
      .attr('stop-opacity', 0.2);
    
    expenseAreaGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#E53935')
      .attr('stop-opacity', 0);

    // Add areas
    g.append('path')
      .datum(data)
      .attr('class', 'income-area')
      .attr('fill', 'url(#income-area-gradient)')
      .attr('d', incomeArea)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1);

    g.append('path')
      .datum(data)
      .attr('class', 'expense-area')
      .attr('fill', 'url(#expense-area-gradient)')
      .attr('d', expenseArea)
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1);

    // Add lines with improved animation and styling
    g.append('path')
      .datum(data)
      .attr('class', 'income-line')
      .attr('fill', 'none')
      .attr('stroke', 'url(#income-line-gradient)')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', incomeLine)
      .attr('filter', 'drop-shadow(0 0 6px rgba(76, 175, 80, 0.3))')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(
          d.map(d => ({ date: d.date, income: 0 })),
          d
        );
        return t => incomeLine(interpolate(t));
      });

    g.append('path')
      .datum(data)
      .attr('class', 'expense-line')
      .attr('fill', 'none')
      .attr('stroke', 'url(#expense-line-gradient)')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', expenseLine)
      .attr('filter', 'drop-shadow(0 0 6px rgba(244, 67, 54, 0.3))')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate(
          d.map(d => ({ date: d.date, expense: 0 })),
          d
        );
        return t => expenseLine(interpolate(t));
      });

    // Add data points with improved styling
    const addPoints = (data, className, color) => {
      g.selectAll(`.${className}`)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', className)
        .attr('cx', d => x(d.date) + x.bandwidth() / 2)
        .attr('cy', d => y(className === 'income-point' ? d.income : d.expense))
        .attr('r', 0)
        .attr('fill', color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .attr('filter', `drop-shadow(0 0 4px ${color})`)
        .transition()
        .duration(800)
        .ease(d3.easeElasticOut)
        .attr('r', 6);
    };

    addPoints(data, 'income-point', 'url(#income-line-gradient)');
    addPoints(data, 'expense-point', 'url(#expense-line-gradient)');

    // Add x-axis with improved styling
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('fill', 'rgba(255, 255, 255, 0.6)')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em');

    // Add y-axis with improved styling
    g.append('g')
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => `$${d.toLocaleString()}`)
      )
      .selectAll('text')
      .style('fill', 'rgba(255, 255, 255, 0.6)')
      .style('font-size', '11px')
      .style('font-weight', '500');

    // Add axis labels with improved styling
    g.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('fill', 'rgba(255, 255, 255, 0.6)')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .text('Date');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -(height / 2))
      .style('text-anchor', 'middle')
      .style('fill', 'rgba(255, 255, 255, 0.6)')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .text('Amount ($)');

    // Add legend with improved styling
    const legend = g.append('g')
      .attr('transform', `translate(${width - 120}, 0)`);

    legend.append('line')
      .attr('x1', 0)
      .attr('y1', 8)
      .attr('x2', 16)
      .attr('y2', 8)
      .attr('stroke', 'url(#income-line-gradient)')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('filter', 'drop-shadow(0 0 4px rgba(76, 175, 80, 0.3))');

    legend.append('text')
      .attr('x', 25)
      .attr('y', 12)
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .text('Income');

    legend.append('line')
      .attr('x1', 0)
      .attr('y1', 33)
      .attr('x2', 16)
      .attr('y2', 33)
      .attr('stroke', 'url(#expense-line-gradient)')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('filter', 'drop-shadow(0 0 4px rgba(244, 67, 54, 0.3))');

    legend.append('text')
      .attr('x', 25)
      .attr('y', 37)
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .text('Expense');

    // Create tooltip with improved styling
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.9)')
      .style('padding', '10px 14px')
      .style('border-radius', '8px')
      .style('color', 'white')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.3)')
      .style('backdrop-filter', 'blur(4px)')
      .style('border', '1px solid rgba(255, 255, 255, 0.1)');

    // Add hover effects with improved animation
    g.selectAll('.income-point, .expense-point')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8)
          .attr('filter', 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))');
        
        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: bold; margin-bottom: 4px; font-size: 13px;">${d.date}</div>
            <div style="color: #66BB6A; font-size: 12px;">Income: $${d.income.toLocaleString()}</div>
            <div style="color: #EF5350; font-size: 12px;">Expense: $${d.expense.toLocaleString()}</div>
            <div style="margin-top: 4px; color: ${d.income - d.expense >= 0 ? '#66BB6A' : '#EF5350'}; font-size: 12px;">
              Net: $${(d.income - d.expense).toLocaleString()}
            </div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6)
          .attr('filter', d => 
            d3.select(this).classed('income-point') 
              ? 'drop-shadow(0 0 4px rgba(76, 175, 80, 0.3))'
              : 'drop-shadow(0 0 4px rgba(244, 67, 54, 0.3))'
          );
        
        tooltip.style('opacity', 0);
      });

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

export default MonthlyTrendChart; 