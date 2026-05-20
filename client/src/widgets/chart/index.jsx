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

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs shadow">
      <span className="font-medium">{row.name}</span>: {row.value}
    </div>
  );
}

function generateChartData(seed) {
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

function ChartEditor({ element, onEdit }) {
  const [seed, setSeed] = useState(element.seed ?? 'chart-default');

  useLayoutEffect(() => {
    setSeed(element.seed ?? 'chart-default');
  }, [element.seed]);
  const chartWrapRef = useRef(null);
  const [chartSize, setChartSize] = useState({ width: 320, height: 160 });
  const data = useMemo(() => generateChartData(seed), [seed]);
  const type = element.chartType ?? 'bar';

  const geom = element.geometry?.base ?? {};
  const boxW = geom.w ?? 360;
  const boxH = geom.h ?? 220;

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
  }, [boxW, boxH]);

  const chartEl =
    type === 'line' ? (
      <LineChart data={data} width={chartSize.width} height={chartSize.height}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<ChartTooltip />} />
        <Line type="monotone" dataKey="value" stroke="#6c8eff" strokeWidth={2} />
      </LineChart>
    ) : (
      <BarChart data={data} width={chartSize.width} height={chartSize.height}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="value" fill="#6c8eff" />
      </BarChart>
    );

  return (
    <div className="flex h-full w-full flex-col bg-white p-2" style={{ minHeight: boxH }}>
      <div className="mb-1 flex shrink-0 gap-1" onMouseDown={(e) => e.stopPropagation()}>
        {['bar', 'line'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onEdit?.({ chartType: t })}
            className={
              type === t
                ? 'rounded bg-[var(--color-accent)] px-2 py-0.5 text-[10px] capitalize text-white'
                : 'rounded bg-black/5 px-2 py-0.5 text-[10px] capitalize'
            }
          >
            {t}
          </button>
        ))}
        <button
          type="button"
          className="ml-auto rounded bg-black/5 px-2 py-0.5 text-[10px] hover:bg-black/10"
          onClick={() => {
            const next = `chart-${Date.now()}`;
            setSeed(next);
            onEdit?.({ seed: next });
          }}
        >
          New data
        </button>
      </div>
      <div ref={chartWrapRef} className="min-h-[120px] w-full flex-1">
        {chartSize.width > 0 && chartSize.height > 0 ? chartEl : null}
      </div>
    </div>
  );
}

export const chartWidget = {
  kind: 'chart',
  label: 'Chart',
  icon: BarChart3,
  category: 'basic',
  defaultProps: () => ({
    chartType: 'bar',
    seed: 'chart-default',
  }),
  defaultGeometry: () => ({ base: { x: 24, y: 120, w: 360, h: 220 } }),
  schema: {
    chartType: {
      kind: 'select',
      label: 'Chart type',
      options: [
        { value: 'bar', label: 'Bar' },
        { value: 'line', label: 'Line' },
      ],
    },
  },
  Editor: ChartEditor,
};
