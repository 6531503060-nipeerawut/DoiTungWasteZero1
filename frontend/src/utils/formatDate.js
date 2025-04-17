import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(buddhistEra);

export function formatDateForDisplay(date, mode) {
    const d = dayjs(date);
    if (mode === 'day') return d.format('DD/MM/BBBB');
    if (mode === 'month') return d.format('MM/BBBB');
    if (mode === 'year') return `${d.year() + 543}`;
    return date;
}

export function formatDateForAPI(date, mode) {
    const d = dayjs(date);
    if (mode === 'day') return d.format('YYYY-MM-DD');
    if (mode === 'month') return d.format('YYYY-MM');
    if (mode === 'year') return d.format('YYYY');
    return date;
}