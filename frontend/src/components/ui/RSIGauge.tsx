import { getRsiZone } from "../../utils/formatters";

interface RSIGaugeProps {
  value: number;
}

function RSIGauge({ value }: RSIGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const rotation = -135 + (clamped / 100) * 180;
  const zone = getRsiZone(clamped);

  return (
    <div className="rsi-gauge">
      <div className="rsi-gauge__arc">
        <div className="rsi-gauge__track" />
        <div
          className="rsi-gauge__fill"
          style={{
            transform: `rotate(${rotation}deg)`,
            ["--gauge-color" as string]: zone.color,
          }}
        />
        <span className="rsi-gauge__value" style={{ color: zone.color }}>
          {clamped.toFixed(1)}
        </span>
      </div>
      <span className="rsi-gauge__label" style={{ color: zone.color }}>
        {zone.label}
      </span>
      <div className="rsi-gauge__zones">
        <span>0 Oversold</span>
        <span>50 Neutral</span>
        <span>100 Overbought</span>
      </div>
    </div>
  );
}

export default RSIGauge;
