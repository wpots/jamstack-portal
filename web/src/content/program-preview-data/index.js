import doubleImpact from './double-impact.json';

const programPreviewData = {
  [doubleImpact.concertId]: doubleImpact,
};

export function getProgramPreviewData(concertId) {
  if (!concertId) {
    return null;
  }

  return programPreviewData[concertId] || null;
}
