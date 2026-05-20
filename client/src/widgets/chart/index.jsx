import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

export function generateChartData(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return MONTHS.map((name, i) => ({
    name,
    value: 200 + Math.abs((hash + i * 97) % 700),
  }));
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900 shadow">
      <span className="font-semibold">{row.name}</span>: {row.value}
    </div>
  );
}

function ChartEditor({ element }) {
  const chartWrapRef = useRef(null);
  const [chartSize, setChartSize] = useState({ width: 320, height: 180 });

  const data = useMemo(() => {
    if (element.chartData?.length) return element.chartData;
    return generateChartData(element.seed ?? 'chart-default');
  }, [element.chartData, element.seed]);

  const type = element.chartType ?? 'bar';
  const boxH = element.geometry?.base?.h ?? 220;

  useLayoutEffect(() => {
    const el = chartWrapRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setChartSize({ width: Math.floor(width), height: Math.floor(height) });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [boxH, element.geometry?.base?.w]);

  if (chartSize.width <= 0 || chartSize.height <= 0) {
    return (
      <div ref={chartWrapRef} className="h-full w-full min-h-[160px] bg-white" style={{ minHeight: boxH }} />
    );
  }

  const chartProps = { data, width: chartSize.width, height: chartSize.height };

  return (
    <div
      ref={chartWrapRef}
      className="h-full w-full bg-white p-2"
      style={{ minHeight: boxH }}
    >
      {type === 'line' ? (
        <LineChart {...chartProps}>
          <CartesianGrid stroke="#e5e5e5" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: '#444', fontSize: 11 }} />
          <YAxis tick={{ fill: '#444', fontSize: 11 }} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="monotone" dataKey="value" stroke="#4f6ef7" strokeWidth={2} dot={{ fill: '#4f6ef7' }} />
        </LineChart>
      ) : (
        <BarChart {...chartProps}>
          <CartesianGrid stroke="#e5e5e5" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: '#444', fontSize: 11 }} />
          <YAxis tick={{ fill: '#444', fontSize: 11 }} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="value" fill="#4f6ef7" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </div>
  );
}

export const chartWidget = {
  kind: 'chart',
  label: 'Chart',
  icon: BarChart3,
  category: 'basic',
  defaultProps: () => {
    const seed = 'chart-default';
    return {
      chartType: 'bar',
      seed,
      chartData: generateChartData(seed),
    };
  },
  defaultGeometry: () => ({ base: { x: 24, y: 120, w: 360, h: 220 } }),
  schema: {
    chartType: {
      kind: 'select',
      label: 'Chart type',
      options: [
        { value: 'bar', label: 'Bar chart' },
        { value: 'line', label: 'Line chart' },
      ],
    },
    chartData: {
      kind: 'chartData',
      label: 'Values (Jan–May)',
    },
    newData: {
      kind: 'action',
      label: 'Random data',
      buttonLabel: 'New data',
    },
  },
  Editor: ChartEditor,
};
