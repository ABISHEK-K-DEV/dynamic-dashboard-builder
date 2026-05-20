import { TextField } from './fields/TextField';
import { NumberField } from './fields/NumberField';
import { ColorField } from './fields/ColorField';
import { BackgroundField } from './fields/BackgroundField';
import { SelectField } from './fields/SelectField';
import { BooleanField } from './fields/BooleanField';
import { AssetField } from './fields/AssetField';
import { FontField } from './fields/FontField';
import { ChartDataField } from './fields/ChartDataField';
import { ActionField } from './fields/ActionField';
export function SchemaForm({ schema, values, onChange }) {
  return (
    <div className="space-y-3">
      {Object.entries(schema).map(([key, field]) => (
        <Field key={key} fieldKey={key} field={field} value={values[key]} onChange={onChange} />
      ))}
    </div>
  );
}
function Field({ fieldKey, field, value, onChange }) {
  switch (field.kind) {
    case 'text':
      return (
        <TextField
          label={field.label}
          value={value ?? ''}
          multiline={field.multiline}
          onChange={(v) => onChange(fieldKey, v)}
        />
      );
    case 'number':
      return (
        <NumberField
          label={field.label}
          value={value ?? 0}
          min={field.min}
          max={field.max}
          step={field.step}
          unit={field.unit}
          onChange={(v) => onChange(fieldKey, v)}
        />
      );
    case 'color':
      return (
        <ColorField label={field.label} value={value} onChange={(v) => onChange(fieldKey, v)} />
      );
    case 'background':
      return (
        <BackgroundField
          label={field.label}
          value={value}
          onChange={(v) => onChange(fieldKey, v)}
        />
      );
    case 'select':
      return (
        <SelectField
          label={field.label}
          value={value ?? field.options[0]?.value ?? ''}
          options={field.options}
          onChange={(v) => onChange(fieldKey, v)}
        />
      );
    case 'boolean':
      return (
        <BooleanField label={field.label} value={!!value} onChange={(v) => onChange(fieldKey, v)} />
      );
    case 'asset':
      return (
        <AssetField
          label={field.label}
          accept={field.accept}
          value={value ?? null}
          onChange={(v) => onChange(fieldKey, v)}
        />
      );
    case 'font':
      return (
        <FontField
          label={field.label}
          value={value ?? 'system-ui, sans-serif'}
          onChange={(v) => onChange(fieldKey, v)}
        />
      );
    case 'chartData':
      return (
        <ChartDataField
          label={field.label}
          value={value}
          onChange={(v) => onChange(fieldKey, v)}
        />
      );
    case 'action':
      return (
        <ActionField
          label={field.label}
          buttonLabel={field.buttonLabel ?? 'Apply'}
          onClick={() => onChange(fieldKey, true)}
        />
      );
    case 'group': {
      const children = field.children;
      const groupValue = value ?? {};
      return (
        <fieldset className="space-y-2 rounded border border-[var(--color-panel-border)] p-2">
          <legend className="px-1 text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
            {field.label}
          </legend>
          {Object.entries(children).map(([childKey, childField]) => (
            <Field
              fieldKey={`${fieldKey}.${childKey}`}
              field={childField}
              value={groupValue[childKey]}
              onChange={(_k, v) => {
                onChange(fieldKey, {
                  ...groupValue,
                  [childKey]: v,
                });
              }}
            />
          ))}
        </fieldset>
      );
    }
    case 'list':
      return <ListField fieldKey={fieldKey} field={field} value={value} onChange={onChange} />;
  }
}
function ListField({ fieldKey, field, value, onChange }) {
  const items = value ?? [];
  return (
    <div className="space-y-2 rounded border border-[var(--color-panel-border)] p-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-panel-muted)]">
          {field.label}
        </span>
        <button
          type="button"
          onClick={() => {
            const newItem = field.item.kind === 'group' ? {} : '';
            onChange(fieldKey, [...items, newItem]);
          }}
          className="rounded bg-white/5 px-2 py-0.5 text-[10px] hover:bg-white/10"
        >
          + Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div className="rounded border border-[var(--color-panel-border)] p-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] text-[var(--color-panel-muted)]">#{i + 1}</span>
              <button
                type="button"
                onClick={() =>
                  onChange(
                    fieldKey,
                    items.filter((_, idx) => idx !== i),
                  )
                }
                className="text-[10px] text-[var(--color-danger)]"
              >
                Remove
              </button>
            </div>
            <Field
              fieldKey={`${fieldKey}.${i}`}
              field={field.item}
              value={item}
              onChange={(_k, v) => {
                const next = items.slice();
                next[i] = v;
                onChange(fieldKey, next);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
