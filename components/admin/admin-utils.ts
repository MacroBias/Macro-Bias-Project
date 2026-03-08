export const deriveRegime = (score: number) => {
  if (score > 0.5) return "RISK-ON";
  if (score < -0.5) return "RISK-OFF";
  return "NEUTRAL";
};

export const parseNumberInput = (value: string, label: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${label}.`);
  }
  return parsed;
};
