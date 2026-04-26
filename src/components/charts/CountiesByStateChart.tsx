'use client';

import { useMemo } from 'react';
import { VChart } from '@visactor/react-vchart';

export function CountiesByStateChart({
  data,
}: {
  data: { state: string; counties: number }[];
}) {
  const spec = useMemo(() => ({
    type: 'bar',
    data: [{ id: 'counties', values: data }],
    xField: 'state',
    yField: 'counties',
    title: { visible: true, text: 'Counties by State' },
    tooltip: { visible: true },
    crosshair: { xField: { visible: true } },
  }), [data]);

  return <VChart spec={spec} style={{ height: 300 }} />;
}
