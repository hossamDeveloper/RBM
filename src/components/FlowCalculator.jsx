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
  { rpm: 900, flowRate: 1.27575, totalPressure: 97.2, outletVelocity: 0.190774, brakePower: 0.190773692, efficiency: 65 },
  { rpm: 900, flowRate: 1.549125, totalPressure: 93.15, outletVelocity: 0.206144, brakePower: 0.206144277, efficiency: 70 },
  { rpm: 900, flowRate: 1.7496, totalPressure: 72.9, outletVelocity: 0.177147, brakePower: 0.177147, efficiency: 72 },
  { rpm: 900, flowRate: 1.92456, totalPressure: 56.7, outletVelocity: 0.155889, brakePower: 0.15588936, efficiency: 70 },
  { rpm: 900, flowRate: 2.0412, totalPressure: 40.5, outletVelocity: 0.13122, brakePower: 0.13122, efficiency: 63 },

  { rpm: 1000, flowRate: 1.75, totalPressure: 120, outletVelocity: 5.61393, brakePower: 0.323077, efficiency: 65 },
  { rpm: 1000, flowRate: 2.125, totalPressure: 115, outletVelocity: 6.81692, brakePower: 0.349107, efficiency: 70 },
  { rpm: 1000, flowRate: 2.4, totalPressure: 90, outletVelocity: 7.69911, brakePower: 0.3, efficiency: 72 },
  { rpm: 1000, flowRate: 2.64, totalPressure: 70, outletVelocity: 8.46902, brakePower: 0.264, efficiency: 70 },
  { rpm: 1000, flowRate: 2.8, totalPressure: 50, outletVelocity: 8.98229, brakePower: 0.222222, efficiency: 63 },

  { rpm: 1200, flowRate: 2.1, totalPressure: 172.8, outletVelocity: 6.14975, brakePower: 0.558277, efficiency: 65 },
  { rpm: 1200, flowRate: 2.55, totalPressure: 165.6, outletVelocity: 7.46756, brakePower: 0.603257, efficiency: 70 },
  { rpm: 1200, flowRate: 2.88, totalPressure: 129.6, outletVelocity: 8.43395, brakePower: 0.5184, efficiency: 72 },
  { rpm: 1200, flowRate: 3.168, totalPressure: 100.8, outletVelocity: 9.27735, brakePower: 0.456192, efficiency: 70 },
  { rpm: 1200, flowRate: 3.36, totalPressure: 72, outletVelocity: 9.83961, brakePower: 0.384, efficiency: 63 },

  { rpm: 1400, flowRate: 2.45, totalPressure: 235.2, outletVelocity: 6.64249, brakePower: 0.886523, efficiency: 65 },
  { rpm: 1400, flowRate: 2.975, totalPressure: 225.6, outletVelocity: 8.0704, brakePower: 0.957036, efficiency: 70 },
  { rpm: 1400, flowRate: 3.36, totalPressure: 176.4, outletVelocity: 9.109709804, brakePower: 0.8232, efficiency: 72 },
  { rpm: 1400, flowRate: 3.696, totalPressure: 137.2, outletVelocity: 10.0206796, brakePower: 0.724416, efficiency: 70 },
  { rpm: 1400, flowRate: 3.92, totalPressure: 98, outletVelocity: 10.62798885, brakePower: 0.609777778, efficiency: 63 },

  { rpm: 1600, flowRate: 2.8, totalPressure: 307.2, outletVelocity: 7.10112217, brakePower: 1.323323077, efficiency: 65 },
  { rpm: 1600, flowRate: 3.4, totalPressure: 294.4, outletVelocity: 8.622797531, brakePower: 1.429942857, efficiency: 70 },
  { rpm: 1600, flowRate: 3.84, totalPressure: 230.4, outletVelocity: 9.738689422, brakePower: 1.2288, efficiency: 72 },
  { rpm: 1600, flowRate: 4.224, totalPressure: 179.2, outletVelocity: 10.7125571, brakePower: 1.081344, efficiency: 70 },
  { rpm: 1600, flowRate: 4.48, totalPressure: 128, outletVelocity: 11.361798, brakePower: 0.910222222, efficiency: 63 },

  { rpm: 1800, flowRate: 3.15, totalPressure: 388.8, outletVelocity: 7.531877461, brakePower: 1.884184615, efficiency: 65 },
  { rpm: 1800, flowRate: 3.825, totalPressure: 372.6, outletVelocity: 9.14585791, brakePower: 2.035992857, efficiency: 70 },
  { rpm: 1800, flowRate: 4.32, totalPressure: 291.6, outletVelocity: 10.32944, brakePower: 1.7496, efficiency: 72 },
  { rpm: 1800, flowRate: 4.752, totalPressure: 226.8, outletVelocity: 11.36238265, brakePower: 1.539648, efficiency: 70 },
  { rpm: 1800, flowRate: 5.04, totalPressure: 162, outletVelocity: 12.05100662, brakePower: 1.296, efficiency: 63 },

  { rpm: 2000, flowRate: 3.5, totalPressure: 480, outletVelocity: 7.939295944, brakePower: 2.584615385, efficiency: 65 },
  { rpm: 2000, flowRate: 4.25, totalPressure: 460, outletVelocity: 9.640580718, brakePower: 2.792857143, efficiency: 70 },
  { rpm: 2000, flowRate: 4.8, totalPressure: 360, outletVelocity: 10.88818578, brakePower: 2.4, efficiency: 72 },
  { rpm: 2000, flowRate: 5.28, totalPressure: 280, outletVelocity: 11.97700294, brakePower: 2.112, efficiency: 70 },
  { rpm: 2000, flowRate: 5.6, totalPressure: 200, outletVelocity: 12.70287634, brakePower: 1.777777778, efficiency: 63 },

  { rpm: 2200, flowRate: 3.85, totalPressure: 580.8, outletVelocity: 8.326803835, brakePower: 3.440123077, efficiency: 65 },
  { rpm: 2200, flowRate: 4.675, totalPressure: 556.6, outletVelocity: 10.11112636, brakePower: 3.717292857, efficiency: 70 },
  { rpm: 2200, flowRate: 5.28, totalPressure: 435.6, outletVelocity: 11.41962559, brakePower: 3.1944, efficiency: 72 },
  { rpm: 2200, flowRate: 5.808, totalPressure: 338.8, outletVelocity: 12.56158666, brakePower: 2.811072, efficiency: 70 },
  { rpm: 2200, flowRate: 6.16, totalPressure: 242, outletVelocity: 13.3228891, brakePower: 2.366222222, efficiency: 63 },

  { rpm: 2400, flowRate: 4.2, totalPressure: 691.2, outletVelocity: 8.697062959, brakePower: 4.466215385, efficiency: 65 },
  { rpm: 2400, flowRate: 5.1, totalPressure: 662.4, outletVelocity: 10.56072705, brakePower: 4.826057143, efficiency: 70 },
  { rpm: 2400, flowRate: 5.76, totalPressure: 518.4, outletVelocity: 11.92740992, brakePower: 4.1472, efficiency: 72 },
  { rpm: 2400, flowRate: 6.336, totalPressure: 403.2, outletVelocity: 13.12014937, brakePower: 3.649536, efficiency: 70 },
  { rpm: 2400, flowRate: 6.72, totalPressure: 288, outletVelocity: 13.91530383, brakePower: 3.072, efficiency: 63 },

  { rpm: 2850, flowRate: 4.625, totalPressure: 820, outletVelocity: 9.477404636, brakePower: 5.834615385, efficiency: 65 },
  { rpm: 2850, flowRate: 5.5, totalPressure: 725, outletVelocity: 11.5082855, brakePower: 5.696428571, efficiency: 70 },
  { rpm: 2850, flowRate: 6.25, totalPressure: 600, outletVelocity: 12.99759363, brakePower: 5.208333333, efficiency: 72 },
  { rpm: 2850, flowRate: 6.82, totalPressure: 470, outletVelocity: 14.2973513, brakePower: 4.579142857, efficiency: 70 },
  { rpm: 2850, flowRate: 7.3, totalPressure: 340, outletVelocity: 15.16385079, brakePower: 3.93968254, efficiency: 63 }
];

const FlowCalculator = () => {
  const [qInput, setQInput] = useState('');
  const [pStatic, setPStatic] = useState('');
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [staticPressureRange, setStaticPressureRange] = useState(null);
  const [isPressureValid, setIsPressureValid] = useState(true);

  // Calculate T value based on flow rate
  const calculateT = (flowRate) => {
    return 34.737 * Math.pow(flowRate, 2) + 24.728 * flowRate - 32.024;
  };

  // Calculate valid static pressure range
  const calculateStaticPressureRange = (flowRate, totalPressure) => {
    const T = calculateT(flowRate);
    const dynamicPressure = 0.5 * 1.2 * Math.pow((4 * flowRate) / (Math.PI * Math.pow(0.63, 2)), 2);
    const maxStaticPressure = T - dynamicPressure;
    return {
      min: 0, // Static pressure cannot be negative
      max: maxStaticPressure,
    };
  };

  const findClosestPoints = (targetQ, targetTotalPressure) => {
    console.log('Finding closest points for:', {
      targetFlowRate: targetQ,
      targetTotalPressure: targetTotalPressure
    });

    // تصنيف النقاط حسب RPM
    const rpmPoints = {
      900: vetd630Data.filter(point => point.rpm === 900),
      1000: vetd630Data.filter(point => point.rpm === 1000),
      1200: vetd630Data.filter(point => point.rpm === 1200),
      1400: vetd630Data.filter(point => point.rpm === 1400),
      1600: vetd630Data.filter(point => point.rpm === 1600),
      1800: vetd630Data.filter(point => point.rpm === 1800),
      2000: vetd630Data.filter(point => point.rpm === 2000),
      2200: vetd630Data.filter(point => point.rpm === 2200),
      2400: vetd630Data.filter(point => point.rpm === 2400),
      2850: vetd630Data.filter(point => point.rpm === 2850)
    };

    // جمع جميع النقاط المتاحة
    const allAvailablePoints = Object.values(rpmPoints)
      .flat()
      .filter(point => point.flowRate > 0 && point.totalPressure > 0);

    // البحث عن جميع أزواج النقاط الممكنة
    let validPointPairs = [];
    for (let i = 0; i < allAvailablePoints.length; i++) {
      for (let j = i + 1; j < allAvailablePoints.length; j++) {
        const point1 = allAvailablePoints[i];
        const point2 = allAvailablePoints[j];
        
        // التحقق من أن معدل التدفق المستهدف يقع بين النقطتين
        const minFlowRate = Math.min(point1.flowRate, point2.flowRate);
        const maxFlowRate = Math.max(point1.flowRate, point2.flowRate);
        const isFlowRateInRange = targetQ >= minFlowRate && targetQ <= maxFlowRate;

        // التحقق من أن الضغط الكلي المستهدف يقع بين النقطتين
        const minPressure = Math.min(point1.totalPressure, point2.totalPressure);
        const maxPressure = Math.max(point1.totalPressure, point2.totalPressure);
        const isPressureInRange = targetTotalPressure >= minPressure && targetTotalPressure <= maxPressure;

        if (isFlowRateInRange && isPressureInRange) {
          // حساب نسبة الخطأ في معدل التدفق
          const flowError1 = Math.abs((targetQ - point1.flowRate) / targetQ * 100);
          const flowError2 = Math.abs((targetQ - point2.flowRate) / targetQ * 100);
          const maxFlowError = Math.max(flowError1, flowError2);

          // حساب نسبة الخطأ في الضغط الكلي
          const pressureError1 = Math.abs((targetTotalPressure - point1.totalPressure) / targetTotalPressure * 100);
          const pressureError2 = Math.abs((targetTotalPressure - point2.totalPressure) / targetTotalPressure * 100);
          const maxPressureError = Math.max(pressureError1, pressureError2);

          // مجموع نسبة الخطأ الكلي
          const totalError = maxFlowError + maxPressureError;
          
          validPointPairs.push({
            points: [point1, point2],
            totalError,
            flowError: maxFlowError,
            pressureError: maxPressureError,
            flowError1,
            flowError2,
            pressureError1,
            pressureError2
          });
        }
      }
    }

    console.log('Valid point pairs:', validPointPairs);

    if (validPointPairs.length > 0) {
      // اختيار الزوج الذي له أقل نسبة خطأ
      validPointPairs.sort((a, b) => a.totalError - b.totalError);
      const selectedPair = validPointPairs[0].points;

      // ترتيب النقاط بحيث تكون النقطة الأولى هي الأقل ضغطاً
      const finalLower = selectedPair[0].totalPressure < selectedPair[1].totalPressure ? selectedPair[0] : selectedPair[1];
      const finalHigher = selectedPair[0].totalPressure < selectedPair[1].totalPressure ? selectedPair[1] : selectedPair[0];

      console.log('Selected final points:', {
        lower: finalLower,
        higher: finalHigher,
        lowerPressure: finalLower?.totalPressure,
        higherPressure: finalHigher?.totalPressure,
        lowerFlowRate: finalLower?.flowRate,
        higherFlowRate: finalHigher?.flowRate,
        flowError: validPointPairs[0].flowError,
        pressureError: validPointPairs[0].pressureError,
        totalError: validPointPairs[0].totalError,
        flowError1: validPointPairs[0].flowError1,
        flowError2: validPointPairs[0].flowError2,
        pressureError1: validPointPairs[0].pressureError1,
        pressureError2: validPointPairs[0].pressureError2
      });

      return [finalLower, finalHigher];
    }

    // إذا لم نجد نقاط في النطاق، نختار النقاط الأقرب بناءً على نسبة الخطأ
    const pointsSortedByError = allAvailablePoints.sort((a, b) => {
      const flowErrorA = Math.abs((targetQ - a.flowRate) / targetQ * 100);
      const flowErrorB = Math.abs((targetQ - b.flowRate) / targetQ * 100);
      const pressureErrorA = Math.abs((targetTotalPressure - a.totalPressure) / targetTotalPressure * 100);
      const pressureErrorB = Math.abs((targetTotalPressure - b.totalPressure) / targetTotalPressure * 100);
      return (flowErrorA + pressureErrorA) - (flowErrorB + pressureErrorB);
    });

    return [pointsSortedByError[0], pointsSortedByError[1]];
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

    if (isNaN(q) || isNaN(pStaticValue)) {
      return;
    }

    // Check for negative static pressure
    if (pStaticValue < 0) {
      setIsPressureValid(false);
      setStaticPressureRange({
        min: 0,
        max: calculateT(q),
        T: calculateT(q),
        dynamicPressure: 0.5 * 1.2 * Math.pow((4 * q) / (Math.PI * Math.pow(D, 2)), 2)
      });
      return;
    }

    console.log('Input Values:', {
      diameter: D,
      flowRate: q,
      staticPressure: pStaticValue
    });

    // Calculate T and validate pressure
    const T = calculateT(q);
    const dynamicPressure = 0.5 * 1.2 * Math.pow((4 * q) / (Math.PI * Math.pow(D, 2)), 2);
    const totalPressure = pStaticValue + dynamicPressure;
    const isValid = totalPressure <= T;

    setIsPressureValid(isValid);
    
    if (!isValid) {
      const range = calculateStaticPressureRange(q, totalPressure);
      setStaticPressureRange(range);
      return;
    }

    setStaticPressureRange(null);

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
    
    if (!lowerPoint || !higherPoint) {
      console.error('Could not find valid points for interpolation');
      return;
    }
    
    console.log('Closest Points:', {
      lowerPoint,
      higherPoint
    });

    let efficiency = null;
    let rpm = null;

      // استيفاء الكفاءة
      efficiency = interpolate(
        q,
        lowerPoint.flowRate,
        lowerPoint.efficiency,
        higherPoint.flowRate,
        higherPoint.efficiency
      );

      // حساب Brake Power باستخدام المعادلة الصحيحة
    const efficiencyDecimal = efficiency / 100;
      const brakePower = (q * pTotal) / (efficiencyDecimal * 1000);

    // حساب RPM باستخدام الاستيفاء
    if (lowerPoint.rpm === higherPoint.rpm) {
      rpm = lowerPoint.rpm;
    } else {
      // حساب نسبة المسافة بين النقطتين
      const flowRateRatio = (q - lowerPoint.flowRate) / (higherPoint.flowRate - lowerPoint.flowRate);
      const pressureRatio = (pTotal - lowerPoint.totalPressure) / (higherPoint.totalPressure - lowerPoint.totalPressure);
      
      // استخدام المتوسط المرجح للنسبتين لحساب RPM
      const averageRatio = (flowRateRatio + pressureRatio) / 2;
      rpm = lowerPoint.rpm + (higherPoint.rpm - lowerPoint.rpm) * averageRatio;

      console.log('RPM Interpolation:', {
        lowerPoint: {
          rpm: lowerPoint.rpm,
          flowRate: lowerPoint.flowRate,
          totalPressure: lowerPoint.totalPressure
        },
        higherPoint: {
          rpm: higherPoint.rpm,
          flowRate: higherPoint.flowRate,
          totalPressure: higherPoint.totalPressure
        },
        target: {
          flowRate: q,
          totalPressure: pTotal
        },
        flowRateRatio,
        pressureRatio,
        averageRatio,
        calculatedRPM: rpm
      });
    }

      setResults({
        velocity: velocity.toFixed(2),
        pDynamic: pDynamic.toFixed(2),
        pTotal: pTotal.toFixed(2),
        efficiency: efficiency.toFixed(2),
        rpm: rpm.toFixed(0),
      brakePower: brakePower.toFixed(4),
      T: T.toFixed(2)
      });


      // إعداد بيانات الرسم البياني للضغط
      const pressureChartData = {
        datasets: [
        {
          label: 'RPM 900',
          data: vetd630Data.filter(point => point.rpm === 900).map(point => ({
            x: point.flowRate,
            y: point.totalPressure
          })),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
          {
            label: 'RPM 1000',
          data: vetd630Data.filter(point => point.rpm === 1000).map(point => ({
            x: point.flowRate,
            y: point.totalPressure
          })),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'RPM 1200',
          data: vetd630Data.filter(point => point.rpm === 1200).map(point => ({
            x: point.flowRate,
            y: point.totalPressure
          })),
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        },
        {
          label: 'RPM 1400',
          data: vetd630Data.filter(point => point.rpm === 1400).map(point => ({
            x: point.flowRate,
            y: point.totalPressure
          })),
          borderColor: 'rgb(153, 102, 255)',
          tension: 0.1
        },
        {
          label: 'RPM 1600',
          data: vetd630Data.filter(point => point.rpm === 1600).map(point => ({
            x: point.flowRate,
            y: point.totalPressure
          })),
          borderColor: 'rgb(255, 159, 64)',
          tension: 0.1
        },
        {
          label: 'RPM 1800',
          data: vetd630Data.filter(point => point.rpm === 1800).map(point => ({
            x: point.flowRate,
            y: point.totalPressure
          })),
          borderColor: 'rgb(201, 203, 207)',
          tension: 0.1
        },
        {
          label: 'RPM 2000',
          data: vetd630Data.filter(point => point.rpm === 2000).map(point => ({
            x: point.flowRate,
            y: point.totalPressure
          })),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
        {
          label: 'RPM 2200',
          data: vetd630Data.filter(point => point.rpm === 2200).map(point => ({
            x: point.flowRate,
            y: point.totalPressure
          })),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'RPM 2400',
          data: vetd630Data.filter(point => point.rpm === 2400).map(point => ({
            x: point.flowRate,
            y: point.totalPressure
          })),
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
          },
        {
          label: 'RPM 2850',
          data: vetd630Data.filter(point => point.rpm === 2850).map(point => ({
            x: point.flowRate,
            y: point.totalPressure
          })),
          borderColor: 'rgb(153, 102, 255)',
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
      const brakePowerChartData = {
        datasets: [
        {
          label: 'RPM 900',
          data: vetd630Data.filter(point => point.rpm === 900).map(point => ({
            x: point.flowRate,
            y: point.brakePower
          })),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
          {
            label: 'RPM 1000',
          data: vetd630Data.filter(point => point.rpm === 1000).map(point => ({
            x: point.flowRate,
            y: point.brakePower
          })),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'RPM 1200',
          data: vetd630Data.filter(point => point.rpm === 1200).map(point => ({
            x: point.flowRate,
            y: point.brakePower
          })),
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        },
        {
          label: 'RPM 1400',
          data: vetd630Data.filter(point => point.rpm === 1400).map(point => ({
            x: point.flowRate,
            y: point.brakePower
          })),
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1
          },
          {
          label: 'RPM 1600',
          data: vetd630Data.filter(point => point.rpm === 1600).map(point => ({
            x: point.flowRate,
            y: point.brakePower
          })),
          borderColor: 'rgb(255, 159, 64)',
          tension: 0.1
        },
        {
          label: 'RPM 1800',
          data: vetd630Data.filter(point => point.rpm === 1800).map(point => ({
            x: point.flowRate,
            y: point.brakePower
          })),
            borderColor: 'rgb(201, 203, 207)',
            tension: 0.1
          },
        {
          label: 'RPM 2000',
          data: vetd630Data.filter(point => point.rpm === 2000).map(point => ({
            x: point.flowRate,
            y: point.brakePower
          })),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
        {
          label: 'RPM 2200',
          data: vetd630Data.filter(point => point.rpm === 2200).map(point => ({
            x: point.flowRate,
            y: point.brakePower
          })),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'RPM 2400',
          data: vetd630Data.filter(point => point.rpm === 2400).map(point => ({
            x: point.flowRate,
            y: point.brakePower
          })),
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        },
        {
          label: 'RPM 2850',
          data: vetd630Data.filter(point => point.rpm === 2850).map(point => ({
            x: point.flowRate,
            y: point.brakePower
          })),
          borderColor: 'rgb(153, 102, 255)',
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
      const efficiencyChartData = {
        datasets: [
        {
          label: 'RPM 900',
          data: vetd630Data.filter(point => point.rpm === 900).map(point => ({
            x: point.flowRate,
            y: point.efficiency
          })),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        },
          {
            label: 'RPM 1000',
          data: vetd630Data.filter(point => point.rpm === 1000).map(point => ({
            x: point.flowRate,
            y: point.efficiency
          })),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'RPM 1200',
          data: vetd630Data.filter(point => point.rpm === 1200).map(point => ({
            x: point.flowRate,
            y: point.efficiency
          })),
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        },
        {
          label: 'RPM 1400',
          data: vetd630Data.filter(point => point.rpm === 1400).map(point => ({
            x: point.flowRate,
            y: point.efficiency
          })),
          borderColor: 'rgb(153, 102, 255)',
          tension: 0.1
        },
        {
          label: 'RPM 1600',
          data: vetd630Data.filter(point => point.rpm === 1600).map(point => ({
            x: point.flowRate,
            y: point.efficiency
          })),
            borderColor: 'rgb(255, 159, 64)',
            tension: 0.1
          },
          {
          label: 'RPM 1800',
          data: vetd630Data.filter(point => point.rpm === 1800).map(point => ({
            x: point.flowRate,
            y: point.efficiency
          })),
          borderColor: 'rgb(201, 203, 207)',
          tension: 0.1
        },
        {
          label: 'RPM 2000',
          data: vetd630Data.filter(point => point.rpm === 2000).map(point => ({
            x: point.flowRate,
            y: point.efficiency
          })),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          },
        {
          label: 'RPM 2200',
          data: vetd630Data.filter(point => point.rpm === 2200).map(point => ({
            x: point.flowRate,
            y: point.efficiency
          })),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'RPM 2400',
          data: vetd630Data.filter(point => point.rpm === 2400).map(point => ({
            x: point.flowRate,
            y: point.efficiency
          })),
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        },
        {
          label: 'RPM 2850',
          data: vetd630Data.filter(point => point.rpm === 2850).map(point => ({
            x: point.flowRate,
            y: point.efficiency
          })),
          borderColor: 'rgb(153, 102, 255)',
            tension: 0.1
          },
          {
            label: 'Current Point',
            data: [{ x: q, y: efficiency }],
          backgroundColor: 'rgb(255, 99, 132)',
            pointRadius: 8
          }
        ]
      };

      setChartData({
        pressure: pressureChartData,
        brakePower: brakePowerChartData,
        efficiency: efficiencyChartData
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
            min="0"
            value={pStatic}
            onChange={(e) => setPStatic(e.target.value)}
            className={`border p-2 w-full ${!isPressureValid ? 'border-red-500' : ''}`}
          />
          {!isPressureValid && staticPressureRange && (
            <div className="text-red-500 mt-2">
              <p>Static pressure is invalid. Valid range:</p>
              <p>Minimum: {staticPressureRange.min.toFixed(2)} Pa</p>
              <p>Maximum: {staticPressureRange.max.toFixed(2)} Pa</p>
              
            </div>
          )}
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
            <div className="col-span-2 font-semibold "> RPM: {results.rpm}</div>
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