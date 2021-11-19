type UnitsType = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export default (d1: Date, d2: Date = new Date()) => {
  const elapsed = d1.getTime() - d2.getTime();

  for (const u in units) {
    if (Math.abs(elapsed) > units[u as UnitsType] || u == 'second') {
      return rtf.format(
        Math.round(elapsed / units[u as UnitsType]),
        u as UnitsType
      );
    }
  }
};
