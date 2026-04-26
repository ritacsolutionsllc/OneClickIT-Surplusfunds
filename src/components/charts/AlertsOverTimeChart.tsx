'use client';

import { useMemo } from 'react';
import { VChart } from '@visactor/react-vchart';

export function AlertsOverTimeChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const spec = useMemo(() => ({
    type: 'area',
    data: [{ id: 'alerts', values: data }],
    xField: 'date',
    yField: 'count',
    title: { visible: true, text: 'Alerts Over Time' },
    tooltip: { visible: true },
  }), [data]);

  return <VChart spec={spec} style={{ height: 300 }} />;
}
