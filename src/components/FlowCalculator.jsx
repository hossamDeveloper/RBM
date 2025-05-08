import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import * as math from 'mathjs';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// VETD 630 data
const vetd630Data = [
  {
    rpm: 1000,
    flowRate: 1.75,
    totalPressure: 120,
    outletVelocity: 5.61393,
    brakePower: 0.32307692,
    efficiency: 65
  },
  {
    rpm: 1000,
    flowRate: 2.125,
    totalPressure: 115,
    outletVelocity: 6.81692,
    brakePower: 0.34910714,
    efficiency: 70
  },
  {
    rpm: 1000,
    flowRate: 2.4,
    totalPressure: 90,
    outletVelocity: 9.69911,
    brakePower: 0.3,
    efficiency: 72
  },
  {
    rpm: 1000,
    flowRate: 2.64,
    totalPressure: 70,
    outletVelocity: 8.46902,
    brakePower: 0.264,
    efficiency: 70
  },
  {
    rpm: 1000,
    flowRate: 2.8,
    totalPressure: 50,
    outletVelocity: 8.98229,
    brakePower: 0.22222222,
    efficiency: 63
  },
  {
    rpm: 1200,
    flowRate: 2.1,
    totalPressure: 172.8,
    outletVelocity: 6.14975219,
    brakePower: 0.55827692,
    efficiency: 65
  },
  {
    rpm: 1200,
    flowRate: 2.55,
    totalPressure: 165.6,
    outletVelocity: 7.46754171,
    brakePower: 0.60325714,
    efficiency: 70
  },
  {
    rpm: 1200,
    flowRate: 2.88,
    totalPressure: 129.6,
    outletVelocity: 8.43995844,
    brakePower: 0.51894,
    efficiency: 72
  },
  {
    rpm: 1200,
    flowRate: 3.168,
    totalPressure: 100.8,
    outletVelocity: 9.27734659,
    brakePower: 0.456192,
    efficiency: 70
  },
  {
    rpm: 1200,
    flowRate: 3.36,
    totalPressure: 72,
    outletVelocity: 9.8396047,
    brakePower: 0.384,
    efficiency: 63
  }
];

const FlowCalculator = () => {
  const [qInput, setQInput] = useState('');
  const [pStatic, setPStatic] = useState('');
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState(null);

  const calculateParameters = () => {
    const D = 0.63; // diameter in meters
    const q = parseFloat(qInput);
    const pStaticValue = parseFloat(pStatic);

    // Calculate velocity
    const velocity = (4 * q) / (Math.PI * Math.pow(D, 2));

    // Calculate dynamic pressure
    const pDynamic = 0.5 * 1.2 * Math.pow(velocity, 2);

    // Calculate total pressure
    const pTotal = pStaticValue + pDynamic;

    // Find closest data points for interpolation
    const rpm1000Data = vetd630Data.filter(d => d.rpm === 1000);
    const rpm1200Data = vetd630Data.filter(d => d.rpm === 1200);

    // Find closest points for interpolation
    const findClosestPoints = (data, targetQ) => {
      // Sort data by flow rate
      const sortedData = [...data].sort((a, b) => a.flowRate - b.flowRate);
      
      // Find the two closest points
      let lowerPoint = null;
      let upperPoint = null;
      
      for (let i = 0; i < sortedData.length - 1; i++) {
        if (sortedData[i].flowRate <= targetQ && sortedData[i + 1].flowRate >= targetQ) {
          lowerPoint = sortedData[i];
          upperPoint = sortedData[i + 1];
          break;
        }
      }
      
      // If target is outside the range, use the closest two points
      if (!lowerPoint || !upperPoint) {
        if (targetQ < sortedData[0].flowRate) {
          return [sortedData[0], sortedData[1]];
        } else {
          return [sortedData[sortedData.length - 2], sortedData[sortedData.length - 1]];
        }
      }
      
      return [lowerPoint, upperPoint];
    };

    const closest1000 = findClosestPoints(rpm1000Data, q);
    const closest1200 = findClosestPoints(rpm1200Data, q);

    // Calculate closest RPM based on flow rate
    const calculateClosestRPM = (flowRate) => {
      // Find average flow rate for each RPM
      const avgFlow1000 = rpm1000Data.reduce((sum, point) => sum + point.flowRate, 0) / rpm1000Data.length;
      const avgFlow1200 = rpm1200Data.reduce((sum, point) => sum + point.flowRate, 0) / rpm1200Data.length;
      
      // Calculate which RPM's average flow rate is closer to the input flow rate
      const distanceTo1000 = Math.abs(flowRate - avgFlow1000);
      const distanceTo1200 = Math.abs(flowRate - avgFlow1200);
      
      return distanceTo1000 < distanceTo1200 ? 1000 : 1200;
    };

    const closestRPM = calculateClosestRPM(q);

    // Linear interpolation for efficiency
    const interpolateEfficiency = (points, targetQ) => {
      if (!points[0] || !points[1]) return null;
      
      const [x1, x2] = [points[0].flowRate, points[1].flowRate];
      const [y1, y2] = [points[0].efficiency, points[1].efficiency];
      
      // Ensure we don't divide by zero
      if (x2 === x1) return y1;
      
      // Linear interpolation formula
      const efficiency = y1 + ((targetQ - x1) * (y2 - y1)) / (x2 - x1);
      
      // Ensure efficiency is within valid range (0-100)
      return Math.max(0, Math.min(100, efficiency));
    };

    const efficiency1000 = interpolateEfficiency(closest1000, q);
    const efficiency1200 = interpolateEfficiency(closest1200, q);

    // Weighted average based on RPM
    const rpmWeight = (q - 2.1) / (3.36 - 2.1); // Normalize between RPM 1000 and 1200
    const efficiency = efficiency1000 * (1 - rpmWeight) + efficiency1200 * rpmWeight;

    setResults({
      velocity: velocity.toFixed(2),
      pDynamic: pDynamic.toFixed(2),
      pTotal: pTotal.toFixed(2),
      efficiency: efficiency.toFixed(2),
      rpm: closestRPM
    });

    // Prepare chart data
    const chartPoints = vetd630Data.map(point => ({
      x: point.flowRate,
      y: point.totalPressure
    }));

    setChartData({
      datasets: [
        {
          label: 'Pressure vs Flow Rate',
          data: chartPoints,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Current Point',
          data: [{ x: q, y: pTotal }],
          backgroundColor: 'rgb(255, 99, 132)',
          pointRadius: 8
        }
      ]
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Flow Calculator</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">Flow Rate (m³/sec)</label>
          <input
            type="number"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-2">Static Pressure (Pa)</label>
          <input
            type="number"
            value={pStatic}
            onChange={(e) => setPStatic(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
      </div>

      <button
        onClick={calculateParameters}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Calculate
      </button>

      {results && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Results</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>Velocity: {results.velocity} m/s</div>
            <div>Dynamic Pressure: {results.pDynamic} Pa</div>
            <div>Total Pressure: {results.pTotal} Pa</div>
            <div>Efficiency: {results.efficiency}%</div>
            <div className="col-span-2 font-semibold text-blue-600">Closest RPM: {results.rpm}</div>
          </div>
        </div>
      )}

      {chartData && (
        <div className="h-96">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: 'linear',
                  title: {
                    display: true,
                    text: 'Flow Rate (m³/sec)'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Total Pressure (Pa)'
                  }
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FlowCalculator; 