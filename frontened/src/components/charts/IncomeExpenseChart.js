import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const IncomeExpenseChart = ({ data }) => {
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

    // Create scales with better padding
    const x0 = d3.scaleBand()
      .range([0, width])
      .padding(0.4) // Increased outer padding for better spacing
      .domain(data.map(d => d.date));

    const x1 = d3.scaleBand()
      .range([0, x0.bandwidth()])
      .padding(0.15) // Increased inner padding between bars
      .domain(['income', 'expense']);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => Math.max(d.income, d.expense)) * 1.1]);

    // Add subtle grid lines with modern styling
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .ticks(4)
        .tickSize(-width)
        .tickFormat('')
      )
      .style('stroke', 'rgba(255, 255, 255, 0.03)')
      .style('stroke-width', 0.5);

    // Define gradients for bars
    const defs = svg.append('defs');

    // Income gradient
    const incomeGradient = defs.append('linearGradient')
      .attr('id', 'incomeGradient')
      .attr('gradientTransform', 'rotate(90)');

    incomeGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4CAF50');

    incomeGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(76, 175, 80, 0.7)');

    // Expense gradient
    const expenseGradient = defs.append('linearGradient')
      .attr('id', 'expenseGradient')
      .attr('gradientTransform', 'rotate(90)');

    expenseGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#f44336');

    expenseGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(244, 67, 54, 0.7)');

    // Add bars with improved animation and styling
    const dateGroups = g.selectAll('.date-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'date-group')
      .attr('transform', d => `translate(${x0(d.date)},0)`);

    // Add income bars with modern styling
    dateGroups.append('rect')
      .attr('class', 'income-bar')
      .attr('x', x1('income'))
      .attr('y', height)
      .attr('width', x1.bandwidth())
      .attr('height', 0)
      .attr('fill', 'url(#incomeGradient)')
      .attr('rx', 2)
      .style('filter', 'drop-shadow(0px 2px 3px rgba(76, 175, 80, 0.2))')
      .transition()
      .duration(800)
      .ease(d3.easeElasticOut)
      .attr('y', d => y(d.income))
      .attr('height', d => height - y(d.income));

    // Add expense bars with modern styling
    dateGroups.append('rect')
      .attr('class', 'expense-bar')
      .attr('x', x1('expense'))
      .attr('y', height)
      .attr('width', x1.bandwidth())
      .attr('height', 0)
      .attr('fill', 'url(#expenseGradient)')
      .attr('rx', 2)
      .style('filter', 'drop-shadow(0px 2px 3px rgba(244, 67, 54, 0.2))')
      .transition()
      .duration(800)
      .ease(d3.easeElasticOut)
      .attr('y', d => y(d.expense))
      .attr('height', d => height - y(d.expense));

    // Add x-axis with improved styling
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

    // Add y-axis with improved styling
    g.append('g')
      .call(d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d => `₹${d >= 1000 ? `${d/1000}K` : d}`)
      )
      .selectAll('text')
      .style('fill', 'rgba(255, 255, 255, 0.5)')
      .style('font-size', '9px')
      .style('font-weight', '500');

    // Add modern legend
    const legend = g.append('g')
      .attr('transform', `translate(${width - 80}, -10)`);

    // Income legend
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 8)
      .attr('height', 8)
      .attr('fill', 'url(#incomeGradient)')
      .attr('rx', 1);

    legend.append('text')
      .attr('x', 12)
      .attr('y', 7)
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '8px')
      .style('font-weight', '500')
      .text('Income');

    // Expense legend
    legend.append('rect')
      .attr('x', 0)
      .attr('y', 12)
      .attr('width', 8)
      .attr('height', 8)
      .attr('fill', 'url(#expenseGradient)')
      .attr('rx', 1);

    legend.append('text')
      .attr('x', 12)
      .attr('y', 19)
      .style('fill', 'rgba(255, 255, 255, 0.7)')
      .style('font-size', '8px')
      .style('font-weight', '500')
      .text('Expense');

    // Create modern tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(18, 18, 18, 0.9) 100%)')
      .style('backdrop-filter', 'blur(8px)')
      .style('padding', '8px 12px')
      .style('border-radius', '8px')
      .style('color', 'white')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)')
      .style('border', '1px solid rgba(255, 255, 255, 0.1)');

    // Add hover effects with modern interactions
    g.selectAll('.income-bar, .expense-bar')
      .on('mouseover', function(event, d) {
        const isIncome = d3.select(this).classed('income-bar');
        
        // Enhanced hover effect
        d3.select(this)
          .transition()
          .duration(200)
          .style('filter', `drop-shadow(0px 4px 6px ${isIncome ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'})`)
          .attr('opacity', 0.85);
        
        tooltip
          .style('opacity', 1)
          .html(`
            <div style="margin-bottom: 4px; color: rgba(255, 255, 255, 0.7);">${d.date}</div>
            <div style="color: ${isIncome ? '#4CAF50' : '#f44336'}; font-weight: 600;">
              ${isIncome ? 'Income' : 'Expense'}: ₹${(isIncome ? d.income : d.expense).toLocaleString('en-IN')}
            </div>
          `)
          .style('left', (event.pageX + 5) + 'px')
          .style('top', (event.pageY - 20) + 'px');
      })
      .on('mouseout', function() {
        const isIncome = d3.select(this).classed('income-bar');
        
        d3.select(this)
          .transition()
          .duration(200)
          .style('filter', `drop-shadow(0px 2px 3px ${isIncome ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'})`)
          .attr('opacity', 1);
        
        tooltip.style('opacity', 0);
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

export default IncomeExpenseChart; 