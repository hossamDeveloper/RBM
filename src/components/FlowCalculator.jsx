import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import * as math from 'mathjs';
import logo from '../assets/logo.png';

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
  const [isPStaticValid, setIsPStaticValid] = useState(true);
  const [isQInputValid, setIsQInputValid] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [fanType, setFanType] = useState('axial');
  const [axialConfig, setAxialConfig] = useState('inline');
  const [centrifugalInlet, setCentrifugalInlet] = useState('single');

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

  const handleQInputChange = (e) => {
    const value = e.target.value;
    setQInput(value);
    
    if (value === '') {
      setIsQInputValid(true);
      return;
    }

    const q = parseFloat(value);
    setIsQInputValid(q > 0 && q <= 10);

    // Revalidate static pressure if it exists
    if (pStatic) {
      const pStaticValue = parseFloat(pStatic);
      const T = calculateT(q);
      const dynamicPressure = 0.5 * 1.2 * Math.pow((4 * q) / (Math.PI * Math.pow(0.63, 2)), 2);
      const maxStaticPressure = T - dynamicPressure;

      const isValid = pStaticValue >= 0 && pStaticValue <= maxStaticPressure;
      setIsPStaticValid(isValid);

      if (!isValid) {
        setStaticPressureRange({
          min: 0,
          max: maxStaticPressure.toFixed(2),
          T: T.toFixed(2),
          dynamicPressure: dynamicPressure.toFixed(2)
        });
      } else {
        setStaticPressureRange(null);
      }
    }
  };

  const handlePStaticChange = (e) => {
    const value = e.target.value;
    setPStatic(value);
    
    if (value === '') {
      setIsPStaticValid(true);
      setStaticPressureRange(null);
      return;
    }

    const pStaticValue = parseFloat(value);
    const q = parseFloat(qInput);

    if (isNaN(q) || q <= 0) {
      setIsPStaticValid(true);
      setStaticPressureRange(null);
      return;
    }

    const T = calculateT(q);
    const dynamicPressure = 0.5 * 1.2 * Math.pow((4 * q) / (Math.PI * Math.pow(0.63, 2)), 2);
    const maxStaticPressure = T - dynamicPressure;

    const isValid = pStaticValue >= 0 && pStaticValue <= maxStaticPressure;
    setIsPStaticValid(isValid);

    if (!isValid) {
      setStaticPressureRange({
        min: 0,
        max: maxStaticPressure.toFixed(2),
        T: T.toFixed(2),
        dynamicPressure: dynamicPressure.toFixed(2)
      });
    } else {
      setStaticPressureRange(null);
    }
  };

  const validateInputs = () => {
    if (!qInput || !pStatic) {
      setValidationError('Please fill in all fields');
      return false;
    }

    const q = parseFloat(qInput);
    if (isNaN(q) || q <= 0 || q > 10) {
      setValidationError('Flow rate must be between 0 and 10 m³/sec');
      return false;
    }

    const pStaticValue = parseFloat(pStatic);
    const T = calculateT(q);
    const dynamicPressure = 0.5 * 1.2 * Math.pow((4 * q) / (Math.PI * Math.pow(0.63, 2)), 2);
    const maxStaticPressure = T - dynamicPressure;

    if (pStaticValue < 0 || pStaticValue > maxStaticPressure) {
      setValidationError(`Static pressure must be between 0 and ${maxStaticPressure.toFixed(2)} Pa for the given flow rate`);
      setStaticPressureRange({
        min: 0,
        max: maxStaticPressure.toFixed(2),
        T: T.toFixed(2),
        dynamicPressure: dynamicPressure.toFixed(2)
      });
      return false;
    }

    setValidationError('');
    return true;
  };

  const calculateParameters = () => {
    if (!validateInputs()) {
      return;
    }
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
        T: T.toFixed(2),
        lpa: (70 + 50 * Math.log10(rpm/1000)).toFixed(2)
      });

    // تحديد الـ RPMs المحيطة بالناتج
    let usedRpms = [];
    const rpmValue = Number(rpm);
    const uniqueRpms = [...new Set(vetd630Data.map(point => point.rpm))].sort((a, b) => a - b);
    if (uniqueRpms.includes(rpmValue)) {
      usedRpms = [rpmValue];
    } else {
      // إيجاد الـ RPMs الأقرب من الأعلى والأسفل
      let lower = uniqueRpms[0], higher = uniqueRpms[uniqueRpms.length - 1];
      for (let i = 0; i < uniqueRpms.length - 1; i++) {
        if (rpmValue > uniqueRpms[i] && rpmValue < uniqueRpms[i + 1]) {
          lower = uniqueRpms[i];
          higher = uniqueRpms[i + 1];
          break;
        }
      }
      usedRpms = [lower, higher];
    }
    // نقاط الداتا المستخدمة للرسم
    const usedPoints = vetd630Data.filter(point => usedRpms.includes(point.rpm));

    // Log the used RPMs and their points for interpolation
    console.log('Interpolation Data:', {
      calculatedRPM: rpm,
      usedRpms,
      usedPoints: usedPoints.map(point => ({
        rpm: point.rpm,
        flowRate: point.flowRate,
        totalPressure: point.totalPressure,
        brakePower: point.brakePower,
        efficiency: point.efficiency
      }))
    });

    // إعداد بيانات الرسم البياني بناءً على نقاط الاستيفاء الزوجي
    let interpolationChartPoints = [];
    if (usedRpms.length === 2) {
      const points1 = vetd630Data.filter(point => point.rpm === usedRpms[0]);
      const points2 = vetd630Data.filter(point => point.rpm === usedRpms[1]);
      const minLen = Math.min(points1.length, points2.length);
      for (let i = 0; i < minLen; i++) {
        const p1 = points1[i];
        const p2 = points2[i];
        const ratio = (rpmValue - p1.rpm) / (p2.rpm - p1.rpm);
        const interpFlowRate = p1.flowRate + ((rpmValue - p1.rpm) * (p2.flowRate - p1.flowRate)) / (p2.rpm - p1.rpm);
        const interp = {
          flowRate: interpFlowRate,
          totalPressure: p1.totalPressure + ((rpmValue - p1.rpm) * (p2.totalPressure - p1.totalPressure)) / (p2.rpm - p1.rpm),
          brakePower: p1.brakePower + ((rpmValue - p1.rpm) * (p2.brakePower - p1.brakePower)) / (p2.rpm - p1.rpm),
          efficiency: p1.efficiency + ((rpmValue - p1.rpm) * (p2.efficiency - p1.efficiency)) / (p2.rpm - p1.rpm),
          rpm: rpmValue,
          from: { rpm1: p1.rpm, rpm2: p2.rpm }
        };
        interpolationChartPoints.push({
          flowRate: interpFlowRate,
          totalPressure: p1.totalPressure + ((rpmValue - p1.rpm) * (p2.totalPressure - p1.totalPressure)) / (p2.rpm - p1.rpm),
          brakePower: p1.brakePower + ((rpmValue - p1.rpm) * (p2.brakePower - p1.brakePower)) / (p2.rpm - p1.rpm),
          efficiency: p1.efficiency + ((rpmValue - p1.rpm) * (p2.efficiency - p1.efficiency)) / (p2.rpm - p1.rpm),
        });
      }
    } else {
      // إذا كان هناك RPM واحد فقط
      interpolationChartPoints = usedPoints.map(point => ({
        flowRate: point.flowRate,
        totalPressure: point.totalPressure,
        brakePower: point.brakePower,
        efficiency: point.efficiency
      }));
    }

      // إعداد بيانات الرسم البياني للضغط
      const pressureChartData = {
        labels: interpolationChartPoints.map(point => point.flowRate.toFixed(1)),
        datasets: [
          {
            label: 'Interpolated Points',
            data: interpolationChartPoints.map(point => point.totalPressure),
            borderColor: '#72E5F2',
            backgroundColor: '#2175BF',
            tension: 0.4,
          },
          {
            label: 'Current Point',
            data: [{ x: q, y: pTotal }],
            borderColor: '#F21905',
            backgroundColor: '#F21905',
            pointRadius: 8,
            pointHoverRadius: 12,
            pointStyle: 'circle',
            pointBorderWidth: 2,
            pointBorderColor: '#fff',
            showLine: false,
          }
        ]
      };

      // إعداد بيانات الرسم البياني للـ Brake Power
      const brakePowerChartData = {
        labels: interpolationChartPoints.map(point => point.flowRate.toFixed(1)),
        datasets: [
          {
            label: 'Interpolated Points',
            data: interpolationChartPoints.map(point => point.brakePower),
            borderColor: '#72E5F2',
            backgroundColor: '#2175BF',
            tension: 0.4,
          },
          {
            label: 'Current Point',
            data: [{ x: q, y: brakePower }],
            borderColor: '#F21905',
            backgroundColor: '#F21905',
            pointRadius: 8,
            pointHoverRadius: 12,
            pointStyle: 'circle',
            pointBorderWidth: 2,
            pointBorderColor: '#fff',
            showLine: false,
          }
        ]
      };

      // إعداد بيانات الرسم البياني للكفاءة
      const efficiencyChartData = {
        labels: interpolationChartPoints.map(point => point.flowRate.toFixed(1)),
        datasets: [
          {
            label: 'Interpolated Points',
            data: interpolationChartPoints.map(point => point.efficiency),
            borderColor: '#72E5F2',
            backgroundColor: '#2175BF',
            tension: 0.4,
          },
          {
            label: 'Current Point',
            data: [{ x: q, y: efficiency }],
            borderColor: 'rgb(255, 99, 132)',
            pointRadius: 10,
            showLine: false,
          }
        ]
      };

      setChartData({
        pressure: pressureChartData,
        brakePower: brakePowerChartData,
        efficiency: efficiencyChartData
    });

    // Interpolate between each pair of points from the two RPM groups
    if (usedRpms.length === 2) {
      const points1 = vetd630Data.filter(point => point.rpm === usedRpms[0]);
      const points2 = vetd630Data.filter(point => point.rpm === usedRpms[1]);
      const minLen = Math.min(points1.length, points2.length);
      const interpolatedPairs = [];
      for (let i = 0; i < minLen; i++) {
        const p1 = points1[i];
        const p2 = points2[i];
        const ratio = (rpmValue - p1.rpm) / (p2.rpm - p1.rpm);
        const interpFlowRate = p1.flowRate + ((rpmValue - p1.rpm) * (p2.flowRate - p1.flowRate)) / (p2.rpm - p1.rpm);
        const interp = {
          flowRate: interpFlowRate,
          totalPressure: p1.totalPressure + ((rpmValue - p1.rpm) * (p2.totalPressure - p1.totalPressure)) / (p2.rpm - p1.rpm),
          brakePower: p1.brakePower + ((rpmValue - p1.rpm) * (p2.brakePower - p1.brakePower)) / (p2.rpm - p1.rpm),
          efficiency: p1.efficiency + ((rpmValue - p1.rpm) * (p2.efficiency - p1.efficiency)) / (p2.rpm - p1.rpm),
          rpm: rpmValue,
          from: { rpm1: p1.rpm, rpm2: p2.rpm }
        };
        interpolatedPairs.push({
          point1: p1,
          point2: p2,
          interpolated: interp
        });
      }
      console.log('Pairwise Interpolation Results:', {
        calculatedRPM: rpmValue,
        usedRpms,
        pairs: interpolatedPairs
      });
    }
  };

  const calculateFlow = () => {
    // Implementation of calculateFlow function
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center mb-6"
        >
          <img src={logo} alt="Logo" className="w-48 h-[80px] md:w-64 md:h-[100px] object-contain" />
        </motion.div>
        <p className="text-white/80">Calculate flow rates and pressures for your system</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-[#72E5F2] text-sm font-semibold mb-2">
              Flow Rate (m³/sec)
            </label>
            <input
              type="number"
              value={qInput}
              onChange={handleQInputChange}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                isQInputValid ? 'border-white/10' : 'border-[#F21905]'
              } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#2175BF] focus:border-transparent transition-all`}
              placeholder="Enter flow rate"
              step="0.01"
              min="0"
              max="10"
            />
            {!isQInputValid && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 bg-[#F21905]/10 border border-[#F21905] rounded-xl p-3"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#F21905]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[#F21905] text-sm font-medium">
                    Flow rate must be between 0 and 10 m³/sec
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <label className="block text-[#72E5F2] text-sm font-semibold mb-2">
              Static Pressure (Pa)
            </label>
            <input
              type="number"
              value={pStatic}
              onChange={handlePStaticChange}
              className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
                isPStaticValid ? 'border-white/10' : 'border-[#F21905]'
              } text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#2175BF] focus:border-transparent transition-all`}
              placeholder="Enter static pressure"
              step="1"
              min="0"
            />
            {!isPStaticValid && staticPressureRange && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 space-y-2 bg-[#F21905]/10 border border-[#F21905] rounded-xl p-3"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#F21905]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[#F21905] text-sm font-medium">
                    Static pressure is out of range
                  </p>
                </div>
                <div className="pl-7 space-y-1">
                  <p className="text-[#F21905] text-sm">
                    Maximum allowed value: {staticPressureRange.max} Pa
                  </p>
                  <div className="text-[#72E5F2] text-xs space-y-1">
                    <p>Total Pressure (T): {staticPressureRange.T} Pa</p>
                    <p>Dynamic Pressure: {staticPressureRange.dynamicPressure} Pa</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <label className="block text-[#72E5F2] text-sm font-semibold mb-2">
              Select Fan Type
            </label>
            <select
              value={fanType}
              onChange={(e) => setFanType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#2175BF] focus:border-transparent transition-all"
            >
              <option value="axial" className="bg-[#1a1a1a]">Axial</option>
              <option value="centrifugal" className="bg-[#1a1a1a]">Centrifugal</option>
            </select>
          </div>

          {fanType === 'axial' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[#72E5F2] text-sm font-semibold mb-2">
                  Configuration
                </label>
                <select
                  value={axialConfig}
                  onChange={(e) => setAxialConfig(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#2175BF] focus:border-transparent transition-all"
                >
                  <option value="inline" className="bg-[#1a1a1a]">Inline/Wall-mounted</option>
                  <option value="rooftop" className="bg-[#1a1a1a]">Rooftop/Box Inline</option>
                  <option value="jet" className="bg-[#1a1a1a]">Jet Fan/Fire Rated</option>
                </select>
              </div>
            </motion.div>
          )}

          {fanType === 'centrifugal' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-[#72E5F2] text-sm font-semibold mb-2">
                  Inlet Type
                </label>
                <select
                  value={centrifugalInlet}
                  onChange={(e) => setCentrifugalInlet(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#2175BF] focus:border-transparent transition-all"
                >
                  <option value="single" className="bg-[#1a1a1a]">Single Inlet</option>
                  <option value="double" className="bg-[#1a1a1a]">Double Inlet</option>
                </select>
              </div>
            </motion.div>
          )}

          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#F21905]/10 border border-[#F21905] rounded-xl p-3"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-[#F21905]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[#F21905] text-sm font-medium">
                  {validationError}
                </p>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={calculateParameters}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold bg-[#2175BF] hover:bg-[#72E5F2] transition-colors duration-200 shadow-lg"
          >
            Calculate
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/5 rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-semibold text-[#72E5F2] mb-4">Results</h2>
              <div className="space-y-4">
                {[
                  { label: 'Velocity', value: `${results.velocity} m/s` },
                  { label: 'Dynamic Pressure', value: `${results.pDynamic} Pa` },
                  { label: 'Total Pressure', value: `${results.pTotal} Pa` },
                  { label: 'Efficiency', value: `${results.efficiency}%` },
                  { label: 'Brake Power', value: `${results.brakePower} kW` },
                  { label: 'RPM', value: results.rpm },
                  { label: 'Sound Pressure Level', value: `${results.lpa} dB` }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.4 + (index * 0.1),
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <p className="text-white/80">{item.label}:</p>
                    <motion.p 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: 0.5 + (index * 0.1),
                        type: "spring",
                        stiffness: 200
                      }}
                      className="text-2xl font-bold text-white"
                    >
                      {item.value}
                    </motion.p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-8"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-[#72E5F2] mb-4">Pressure vs Flow Rate</h3>
            <div className="h-96">
              <Line data={chartData.pressure} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    type: 'linear',
                    title: {
                      display: true,
                      text: 'Flow Rate (m³/sec)',
                      color: '#72E5F2'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: '#72E5F2'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Total Pressure (Pa)',
                      color: '#72E5F2'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: '#72E5F2'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#72E5F2'
                    }
                  }
                }
              }} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-[#72E5F2] mb-4">Brake Power vs Flow Rate</h3>
            <div className="h-96">
              <Line data={chartData.brakePower} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    type: 'linear',
                    title: {
                      display: true,
                      text: 'Flow Rate (m³/sec)',
                      color: '#72E5F2'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: '#72E5F2'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Brake Power (kW)',
                      color: '#72E5F2'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: '#72E5F2'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#72E5F2'
                    }
                  }
                }
              }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FlowCalculator; 