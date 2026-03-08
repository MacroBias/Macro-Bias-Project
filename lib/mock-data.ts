// Mock data for Macro Bias financial dashboard

export type RegimeType = "RISK-ON" | "NEUTRAL" | "RISK-OFF";

export interface MacroData {
  currentRegime: RegimeType;
  macroBiasScore: number;
  dailyScore: number;
  monthlyScore: number;
  ytdPerformance: {
    sp500: number;
    macroBias: number;
    alpha: number;
  };
  compoundReturns: {
    tenYear: number;
    fiveYear: number;
    twoYear: number;
  };
  maxDrawdown: {
    macroBias: number;
    sp500: number;
  };
}

export const macroData: MacroData = {
  currentRegime: "RISK-ON",
  macroBiasScore: 0.73,
  dailyScore: 0.68,
  monthlyScore: 0.71,
  ytdPerformance: {
    sp500: 15.3,
    macroBias: 27.8,
    alpha: 12.5,
  },
  compoundReturns: {
    tenYear: 18.4,
    fiveYear: 22.1,
    twoYear: 31.2,
  },
  maxDrawdown: {
    macroBias: -18.7,
    sp500: -33.9,
  },
};

export interface Position {
  id: string;
  exposureType: string;
  instrument: string;
  entryPrice: number;
  stopLoss: number;
  positionSize: number;
  unrealizedPnL: number;
}

export const initialPositions: Position[] = [
  {
    id: "1",
    exposureType: "Long 2x",
    instrument: "Amundi Leveraged MSCI USA Daily 2x",
    entryPrice: 142.50,
    stopLoss: 128.25,
    positionSize: 10000,
    unrealizedPnL: 1250.00,
  },
  {
    id: "2",
    exposureType: "Long 3x",
    instrument: "WisdomTree S&P 500 3x Daily Leveraged",
    entryPrice: 85.20,
    stopLoss: 72.42,
    positionSize: 15000,
    unrealizedPnL: 2340.00,
  },
  {
    id: "3",
    exposureType: "Short 2x",
    instrument: "Xtrackers S&P 500 2x Inverse Daily",
    entryPrice: 12.80,
    stopLoss: 14.08,
    positionSize: 5000,
    unrealizedPnL: -320.00,
  },
];

export interface Product {
  id: string;
  name: string;
  isin: string;
  liquidity: string;
  factsheetLink: string;
  leverage: string;
}

export const longProducts: Product[] = [
  { id: "l1", name: "Amundi MSCI USA Daily 2x Lev", isin: "LU1589310359", liquidity: "High", factsheetLink: "#", leverage: "2x" },
  { id: "l2", name: "WisdomTree S&P 500 3x Daily Lev", isin: "IE00B7Y34M31", liquidity: "High", factsheetLink: "#", leverage: "3x" },
  { id: "l3", name: "Xtrackers S&P 500 4x Daily Lev", isin: "IE00BM67HT60", liquidity: "Medium", factsheetLink: "#", leverage: "4x" },
  { id: "l4", name: "Leverage Shares 5x Long S&P 500", isin: "IE00BK5BZY66", liquidity: "Low", factsheetLink: "#", leverage: "5x" },
  { id: "l5", name: "GraniteShares 6x Long S&P 500", isin: "IE00BFNXW833", liquidity: "Too low liquidity", factsheetLink: "#", leverage: "6x" },
];

export const shortProducts: Product[] = [
  { id: "s1", name: "Xtrackers S&P 500 2x Inverse Daily", isin: "LU0411078636", liquidity: "High", factsheetLink: "#", leverage: "2x" },
  { id: "s2", name: "WisdomTree S&P 500 3x Short Daily", isin: "IE00B8K7YY98", liquidity: "Medium", factsheetLink: "#", leverage: "3x" },
  { id: "s3", name: "Leverage Shares -4x Short S&P 500", isin: "IE00BK5C3532", liquidity: "Low", factsheetLink: "#", leverage: "4x" },
  { id: "s4", name: "GraniteShares -5x Short S&P 500", isin: "IE00BN7KG879", liquidity: "Too low liquidity", factsheetLink: "#", leverage: "5x" },
  { id: "s5", name: "GraniteShares -6x Short S&P 500", isin: "IE00BLR6QB00", liquidity: "Too low liquidity", factsheetLink: "#", leverage: "6x" },
];

export interface YearlyPerformance {
  year: number;
  macroBias: number;
  sp500: number;
  alpha: number;
}

export const yearlyPerformance: YearlyPerformance[] = [
  { year: 2009, macroBias: 95.89, sp500: 23.45, alpha: 72.44 },
  { year: 2010, macroBias: 64.54, sp500: 12.78, alpha: 51.76 },
  { year: 2011, macroBias: 95.64, sp500: 0.0, alpha: 95.64 },
  { year: 2012, macroBias: 79.74, sp500: 13.41, alpha: 66.33 },
  { year: 2013, macroBias: 38.39, sp500: 29.6, alpha: 8.79 },
  { year: 2014, macroBias: 36.44, sp500: 11.39, alpha: 25.05 },
  { year: 2015, macroBias: 38.93, sp500: -0.73, alpha: 39.66 },
  { year: 2016, macroBias: 22.89, sp500: 9.54, alpha: 13.35 },
  { year: 2017, macroBias: 63.14, sp500: 19.42, alpha: 43.72 },
  { year: 2018, macroBias: 16.87, sp500: -6.24, alpha: 23.11 },
  { year: 2019, macroBias: 14.53, sp500: 28.88, alpha: -14.35 },
  { year: 2020, macroBias: 169.97, sp500: 16.26, alpha: 153.71 },
  { year: 2021, macroBias: 38.99, sp500: 26.89, alpha: 12.1 },
  { year: 2022, macroBias: 48.86, sp500: -19.44, alpha: 68.3 },
  { year: 2023, macroBias: 16.65, sp500: 24.23, alpha: -7.58 },
  { year: 2024, macroBias: 7.89, sp500: 23.31, alpha: -15.42 },
  { year: 2025, macroBias: 30.98, sp500: 15.13, alpha: 15.85 },
];

export interface EquityCurvePoint {
  year: number;
  macroBias: number;
  sp500: number;
}

const computeAverage = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const computeCagr = (data: YearlyPerformance[], key: "macroBias" | "sp500") => {
  const endingValue = data.reduce(
    (acc, year) => acc * (1 + year[key] / 100),
    1
  );
  const years = data.length;
  return (Math.pow(endingValue, 1 / years) - 1) * 100;
};

const computeRollingPerformance = (years: number) => {
  const window = yearlyPerformance.slice(-years);
  const macroBias = computeCagr(window, "macroBias");
  const sp500 = computeCagr(window, "sp500");

  return {
    macroBias,
    sp500,
    alpha: macroBias - sp500,
  };
};

// Generate equity curve data starting at 100
export const equityCurveData: EquityCurvePoint[] = (() => {
  let macroBiasValue = 100;
  let sp500Value = 100;
  
  return yearlyPerformance.map((year) => {
    const point = {
      year: year.year,
      macroBias: Math.round(macroBiasValue),
      sp500: Math.round(sp500Value),
    };
    macroBiasValue *= (1 + year.macroBias / 100);
    sp500Value *= (1 + year.sp500 / 100);
    return point;
  });
})();

export const rollingPerformance = {
  "1Y": computeRollingPerformance(1),
  "3Y": computeRollingPerformance(3),
  "5Y": computeRollingPerformance(5),
  "10Y": computeRollingPerformance(10),
};

export const performanceMetrics = {
  totalCAGR_macroBias: computeCagr(yearlyPerformance, "macroBias"),
  totalCAGR_sp500: computeCagr(yearlyPerformance, "sp500"),
  averageAnnualAlpha: computeAverage(
    yearlyPerformance.map((year) => year.alpha)
  ),
};

export const regimeExplanations: Record<RegimeType, string> = {
  "RISK-ON": "Current macro conditions favor equity exposure. Liquidity conditions are supportive, volatility is contained, and economic indicators suggest continued growth momentum. Consider maintaining or increasing leveraged long positions according to your risk parameters.",
  "NEUTRAL": "Mixed macro signals suggest a balanced approach. Some indicators favor risk assets while others warrant caution. Consider reducing leverage and maintaining diversified exposure until clearer directional signals emerge.",
  "RISK-OFF": "Macro conditions suggest elevated risk. Liquidity is tightening, volatility is elevated, and economic indicators are deteriorating. Consider defensive positioning and potential short exposure according to your risk management framework.",
};
