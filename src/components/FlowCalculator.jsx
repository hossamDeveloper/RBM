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

  // دالة البحث عن أقرب نقطتين من أي RPM
  const findClosestPoints = (targetQ, targetTotalPressure) => {
    console.log('Finding closest points for:', {
      targetFlowRate: targetQ,
      targetTotalPressure: targetTotalPressure
    });

    // تصنيف النقاط حسب RPM
    const rpm1000Points = vetd630Data.filter(point => point.rpm === 1000);
    const rpm1200Points = vetd630Data.filter(point => point.rpm === 1200);

    // البحث عن النقاط الأقرب في كل RPM
    let lower1000 = null;
    let higher1000 = null;
    let lower1200 = null;
    let higher1200 = null;

    // البحث في RPM 1000
    for (const point of rpm1000Points) {
      if (point.flowRate <= targetQ) {
        lower1000 = point;
      } else {
        higher1000 = point;
        break;
      }
    }

    // البحث في RPM 1200
    for (const point of rpm1200Points) {
      if (point.flowRate <= targetQ) {
        lower1200 = point;
      } else {
        higher1200 = point;
        break;
      }
    }

    // إذا لم نجد نقطة أعلى، نستخدم أقصى قيمة
    if (!higher1000) higher1000 = rpm1000Points[rpm1000Points.length - 1];
    if (!higher1200) higher1200 = rpm1200Points[rpm1200Points.length - 1];

    console.log('Initial points found:', {
      rpm1000: { lower: lower1000, higher: higher1000 },
      rpm1200: { lower: lower1200, higher: higher1200 }
    });

    // اختيار النقاط بناءً على الضغط الكلي
    let finalLower = null;
    let finalHigher = null;

    // البحث عن النقاط الأقرب لمعدل التدفق المستهدف
    const allPoints = [...rpm1000Points, ...rpm1200Points];
    let validPointPairs = [];

    // البحث عن أزواج النقاط التي تحقق الشروط
    for (let i = 0; i < allPoints.length; i++) {
      for (let j = i + 1; j < allPoints.length; j++) {
        const point1 = allPoints[i];
        const point2 = allPoints[j];
        
        // التحقق من أن معدل التدفق المستهدف يقع بين النقطتين
        const minFlowRate = Math.min(point1.flowRate, point2.flowRate);
        const maxFlowRate = Math.max(point1.flowRate, point2.flowRate);
        const isFlowRateInRange = targetQ >= minFlowRate && targetQ <= maxFlowRate;

        // التحقق من أن الضغط الكلي المستهدف يقع بين النقطتين
        const minPressure = Math.min(point1.totalPressure, point2.totalPressure);
        const maxPressure = Math.max(point1.totalPressure, point2.totalPressure);
        const isPressureInRange = targetTotalPressure >= minPressure && targetTotalPressure <= maxPressure;

        if (isFlowRateInRange && isPressureInRange) {
          // حساب مجموع الفروق في معدل التدفق
          const flowRateDiff = Math.abs(point1.flowRate - targetQ) + Math.abs(point2.flowRate - targetQ);
          validPointPairs.push({
            points: [point1, point2],
            flowRateDiff
          });
        }
      }
    }

    console.log('Valid point pairs:', validPointPairs);

    if (validPointPairs.length > 0) {
      // اختيار الزوج الذي له أقل فرق في معدل التدفق
      validPointPairs.sort((a, b) => a.flowRateDiff - b.flowRateDiff);
      const selectedPair = validPointPairs[0].points;

      // ترتيب النقاط بحيث تكون النقطة الأولى هي الأقل ضغطاً
      finalLower = selectedPair[0].totalPressure < selectedPair[1].totalPressure ? selectedPair[0] : selectedPair[1];
      finalHigher = selectedPair[0].totalPressure < selectedPair[1].totalPressure ? selectedPair[1] : selectedPair[0];
    } else {
      // إذا لم نجد نقاط في النطاق، نختار النقاط الأقرب
      const pointsSortedByFlowRate = allPoints.sort((a, b) => 
        Math.abs(a.flowRate - targetQ) - Math.abs(b.flowRate - targetQ)
      );
      finalLower = pointsSortedByFlowRate[0];
      finalHigher = pointsSortedByFlowRate[1];
    }

    console.log('Selected final points:', {
      lower: finalLower,
      higher: finalHigher,
      lowerPressure: finalLower?.totalPressure,
      higherPressure: finalHigher?.totalPressure,
      lowerFlowRate: finalLower?.flowRate,
      higherFlowRate: finalHigher?.flowRate
    });

    return [finalLower, finalHigher];
  };

  // الاستيفاء الخطي بين نقطتين
  const interpolate = (x, x1, y1, x2, y2) => {
    if (x1 === x2) return y1;
    // الصيغة: y = y1 + ((x - x1) * (y2 - y1)) / (x2 - x1)
    const result = y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
    console.log('Linear Interpolation:', {
      target: x,
      point1: { x: x1, y: y1 },
      point2: { x: x2, y: y2 },
      result: result
    });
    return result;
  };

  const calculateParameters = () => {
    const D = 0.63;
    const q = parseFloat(qInput);
    const pStaticValue = parseFloat(pStatic);

    console.log('Input Values:', {
      diameter: D,
      flowRate: q,
      staticPressure: pStaticValue
    });

    // الحسابات الأساسية
    const velocity = (4 * q) / (Math.PI * Math.pow(D, 2));
    const pDynamic = 0.5 * 1.2 * Math.pow(velocity, 2);
    const pTotal = pStaticValue + pDynamic;

    console.log('Calculated Values:', {
      velocity: velocity.toFixed(2),
      dynamicPressure: pDynamic.toFixed(2),
      totalPressure: pTotal.toFixed(2)
    });

    // البحث عن أقرب نقطتين مع مراعاة الضغط الكلي
    const [lowerPoint, higherPoint] = findClosestPoints(q, pTotal);
    
    console.log('Closest Points:', {
      lowerPoint,
      higherPoint
    });

    let efficiency = null;
    let rpm = null;

    if (lowerPoint && higherPoint) {
      // استيفاء الكفاءة
      efficiency = interpolate(
        q,
        lowerPoint.flowRate,
        lowerPoint.efficiency,
        higherPoint.flowRate,
        higherPoint.efficiency
      );

      // حساب Brake Power باستخدام المعادلة الصحيحة
      const efficiencyDecimal = efficiency / 100; // تحويل الكفاءة من نسبة مئوية إلى عدد عشري
      const brakePower = (q * pTotal) / (efficiencyDecimal * 1000);

      console.log('Brake Power Calculation:', {
        flowRate: q,
        totalPressure: pTotal,
        efficiency: efficiency,
        efficiencyDecimal: efficiencyDecimal,
        calculation: `(${q} × ${pTotal}) / (${efficiencyDecimal} × 1000)`,
        brakePower: brakePower.toFixed(4)
      });

      // التحقق من تساوي RPM للنقطتين
      if (lowerPoint.rpm === higherPoint.rpm) {
        console.log('Both points have the same RPM:', lowerPoint.rpm);
        rpm = lowerPoint.rpm;
      } else {
        // البحث عن النقاط المقابلة في RPM الأخرى
        const otherRpmPoints = vetd630Data.filter(point => 
          point.rpm !== lowerPoint.rpm && 
          Math.abs(point.flowRate - q) <= 0.5
        );

        console.log('Other RPM points:', otherRpmPoints);

        if (otherRpmPoints.length > 0) {
          const closestOtherPoint = otherRpmPoints.reduce((closest, current) => {
            const currentDiff = Math.abs(current.flowRate - q);
            const closestDiff = Math.abs(closest.flowRate - q);
            return currentDiff < closestDiff ? current : closest;
          });

          console.log('Selected points for RPM calculation:', {
            point1: {
              flowRate: lowerPoint.flowRate,
              rpm: lowerPoint.rpm,
              totalPressure: lowerPoint.totalPressure
            },
            point2: {
              flowRate: closestOtherPoint.flowRate,
              rpm: closestOtherPoint.rpm,
              totalPressure: closestOtherPoint.totalPressure
            }
          });

          rpm = interpolate(
            pTotal,
            lowerPoint.totalPressure,
            lowerPoint.rpm,
            closestOtherPoint.totalPressure,
            closestOtherPoint.rpm
          );
        } else {
          rpm = lowerPoint.rpm;
        }
      }

      console.log('Interpolated Values:', {
        efficiency: efficiency.toFixed(2),
        rpm: rpm.toFixed(0),
        brakePower: brakePower.toFixed(4)
      });

      setResults({
        velocity: velocity.toFixed(2),
        pDynamic: pDynamic.toFixed(2),
        pTotal: pTotal.toFixed(2),
        efficiency: efficiency.toFixed(2),
        rpm: rpm.toFixed(0),
        brakePower: brakePower.toFixed(4)
      });

      // إعداد بيانات الرسم البياني
      const chartPoints = vetd630Data.map(point => ({
        x: point.flowRate,
        y: point.totalPressure
      }));

      // إعداد بيانات الرسم البياني للضغط
      const rpm1000PressurePoints = vetd630Data
        .filter(point => point.rpm === 1000)
        .map(point => ({
          x: point.flowRate,
          y: point.totalPressure
        }));

      const rpm1200PressurePoints = vetd630Data
        .filter(point => point.rpm === 1200)
        .map(point => ({
          x: point.flowRate,
          y: point.totalPressure
        }));

      const pressureChartData = {
        datasets: [
          {
            label: 'RPM 1000',
            data: rpm1000PressurePoints,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'RPM 1200',
            data: rpm1200PressurePoints,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
          },
          {
            label: 'Current Point',
            data: [{ x: q, y: pTotal }],
            backgroundColor: 'rgb(255, 99, 132)',
            pointRadius: 8
          }
        ]
      };

      // إعداد بيانات الرسم البياني للـ Brake Power
      const rpm1000BrakePowerPoints = vetd630Data
        .filter(point => point.rpm === 1000)
        .map(point => ({
          x: point.flowRate,
          y: point.brakePower
        }));

      const rpm1200BrakePowerPoints = vetd630Data
        .filter(point => point.rpm === 1200)
        .map(point => ({
          x: point.flowRate,
          y: point.brakePower
        }));

      const brakePowerChartData = {
        datasets: [
          {
            label: 'RPM 1000',
            data: rpm1000BrakePowerPoints,
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1
          },
          {
            label: 'RPM 1200',
            data: rpm1200BrakePowerPoints,
            borderColor: 'rgb(201, 203, 207)',
            tension: 0.1
          },
          {
            label: 'Current Point',
            data: [{ x: q, y: brakePower }],
            backgroundColor: 'rgb(255, 99, 132)',
            pointRadius: 8
          }
        ]
      };

      // إعداد بيانات الرسم البياني للكفاءة
      const rpm1000EfficiencyPoints = vetd630Data
        .filter(point => point.rpm === 1000)
        .map(point => ({
          x: point.flowRate,
          y: point.efficiency
        }));

      const rpm1200EfficiencyPoints = vetd630Data
        .filter(point => point.rpm === 1200)
        .map(point => ({
          x: point.flowRate,
          y: point.efficiency
        }));

      const efficiencyChartData = {
        datasets: [
          {
            label: 'RPM 1000',
            data: rpm1000EfficiencyPoints,
            borderColor: 'rgb(255, 159, 64)',
            tension: 0.1
          },
          {
            label: 'RPM 1200',
            data: rpm1200EfficiencyPoints,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          },
          {
            label: 'Current Point',
            data: [{ x: q, y: efficiency }],
            backgroundColor: 'rgb(75, 192, 192)',
            pointRadius: 8
          }
        ]
      };

      setChartData({
        pressure: pressureChartData,
        brakePower: brakePowerChartData,
        efficiency: efficiencyChartData
      });
    }
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
            <div>Brake Power: {results.brakePower} kW</div>
            <div className="col-span-2 font-semibold text-blue-600">Calculated RPM: {results.rpm}</div>
          </div>
        </div>
      )}

      {chartData && (
        <div className="space-y-8">
          <div className="h-96">
            <h3 className="text-lg font-semibold mb-2">Pressure vs Flow Rate</h3>
            <Line
              data={chartData.pressure}
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

          <div className="h-96">
            <h3 className="text-lg font-semibold mb-2">Brake Power vs Flow Rate</h3>
            <Line
              data={chartData.brakePower}
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
                      text: 'Brake Power (kW)'
                    }
                  }
                }
              }}
            />
          </div>

          <div className="h-96">
            <h3 className="text-lg font-semibold mb-2">Efficiency vs Flow Rate</h3>
            <Line
              data={chartData.efficiency}
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
                      text: 'Efficiency (%)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );

};

export default FlowCalculator; 