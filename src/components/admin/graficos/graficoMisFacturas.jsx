import React, { useEffect, useRef } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs } from "firebase/firestore";
import * as d3 from 'd3';

const GraficoMisFacturasD3 = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'misFacturas'));
      const data = [];
      querySnapshot.forEach((doc) => {
        const { total, fecha } = doc.data();
        const [day, month, year] = fecha.split('-').map(Number);
        const fechaDate = new Date(year, month - 1, day); 
        data.push({ total: parseFloat(total), fecha: fechaDate });
      });

      // Crear el gráfico con D3.js
      const margin = { top: 20, right: 30, bottom: 50, left: 60 };
      const width = 500 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.fecha))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total)])
        .range([height, 0]);

      const xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%d-%m-%Y"));

      const yAxis = d3.axisLeft(y);

      const svg = d3.select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-65)");

      svg.append('g')
        .call(yAxis);

      svg.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => x(d.fecha))
        .attr('cy', d => y(d.total))
        .attr('r', 5)
        .style('fill', 'steelblue');

      // Línea de tendencia
      const valueline = d3.line()
        .x(d => x(d.fecha))
        .y(d => y(d.total));

      svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline)
        .style('stroke', 'steelblue')
        .style('fill', 'none')
        .style('stroke-width', '2px');
    };

    fetchData();
  }, []);

  return (
    <>
      <h2>Grafico Total Facturas</h2>
      <svg ref={svgRef}></svg>
    </>
  );
};

export default GraficoMisFacturasD3;

