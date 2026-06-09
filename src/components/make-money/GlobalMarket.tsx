// 글로벌 시장 (Global Market)
const globalKPIs = [
  { label: "S&P500 선물", value: "7418.25", change: "+0.55%" },
  { label: "나스닥100 선물", value: "29183.25", change: "+0.90%" },
  { label: "USD/KRW", value: "1499.54", change: "-0.55%" },
  { label: "미국 10년 국채", value: "4.57", change: "-2.04%" },
  { label: "VIX 공포지수", value: "17.44", change: "-3.43%" },
];

const commodities = [
  {
    name: "WTI 원유",
    price: 99,
    change: "-8.18%",
    positive: false,
    source: "yfinance",
  },
  {
    name: "금 선물",
    price: 4549,
    change: "+0.94%",
    positive: true,
    source: "yfinance",
  },
  {
    name: "Bitcoin",
    price: 0,
    change: "+0.00%",
    positive: true,
    source: "yfinance",
  },
];

const fredData = [
  {
    label: "기준금리 (FFR)",
    value: "3.62%",
    color: "#f9a825",
    source: "FRED · 등급",
  },
  { label: "CPI (YOY)", value: "332.4%", color: "#f9a825", source: "FRED" },
  { label: "실업률", value: "4.3%", color: "#00e676", source: "FRED" },
  {
    label: "DXY 달러지수",
    value: "99.15",
    color: "#ff5252",
    source: "yfinance",
  },
  {
    label: "KOSPI 외국인",
    value: "+2,180억",
    color: "#00e676",
    source: "3일 연속 순매수",
  },
];

// Chart data: S&P500, KOSPI, NASDAQ over ~10 days
const chartDays = [
  "5/12",
  "5/13",
  "5/14",
  "5/15",
  "5/16",
  "5/17",
  "5/18",
  "5/19",
  "5/20",
  "오늘",
];
const sp500 = [
  100, 100.2, 100.1, 100.3, 100.5, 100.4, 100.8, 100.6, 100.9, 101.0,
];
const kospi = [
  100, 100.5, 101.2, 102.0, 103.0, 102.5, 101.8, 100.5, 98.8, 97.5,
];
const nasdaq = [
  100, 100.3, 100.2, 100.5, 100.8, 100.7, 101.2, 101.0, 101.5, 101.8,
];

export default function GlobalMarket() {
  const chartH = 160;
  const chartW = 480;
  const allVals = [...sp500, ...kospi, ...nasdaq];
  const maxV = Math.max(...allVals);
  const minV = Math.min(...allVals);

  const toPoints = (data: number[]) =>
    data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * chartW;
        const y = chartH - ((v - minV) / (maxV - minV)) * chartH;
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <div
      style={{
        background: "#0d1117",
        minHeight: "100vh",
        fontFamily: "'Noto Sans KR', sans-serif",
        color: "#e0e0e0",
        fontSize: 13,
      }}
    >
      {/* KPI row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 8,
          padding: "12px 16px",
        }}
      >
        {globalKPIs.map((k) => {
          const pos = k.change.startsWith("+");
          return (
            <div
              key={k.label}
              style={{
                background: "#111820",
                border: "1px solid #1e2a38",
                borderRadius: 6,
                padding: "12px 16px",
              }}
            >
              <div style={{ color: "#556", fontSize: 11, marginBottom: 4 }}>
                {k.label}
              </div>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
                {k.value}
              </div>
              <div
                style={{
                  color: pos ? "#00e676" : "#ff5252",
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                {k.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart + Commodities */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 8,
          padding: "0 16px",
        }}
      >
        {/* Line chart */}
        <div
          style={{
            background: "#111820",
            border: "1px solid #1e2a38",
            borderRadius: 6,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ color: "#00e676", fontSize: 12 }}>
              ● 글로벌 지수 추이
            </span>
            <span style={{ color: "#445", fontSize: 11 }}>
              yfinance · 최근 10주
            </span>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 6 }}>
            <span style={{ color: "#00e676", fontSize: 11 }}>─ S&P500</span>
            <span style={{ color: "#00b0ff", fontSize: 11 }}>─ KOSPI</span>
            <span style={{ color: "#e040fb", fontSize: 11 }}>─ NASDAQ</span>
          </div>
          <svg
            viewBox={`0 0 ${chartW} ${chartH + 20}`}
            style={{ width: "100%", height: 180 }}
          >
            <polyline
              points={toPoints(sp500)}
              fill="none"
              stroke="#00e676"
              strokeWidth="2"
            />
            <polyline
              points={toPoints(kospi)}
              fill="none"
              stroke="#00b0ff"
              strokeWidth="2"
            />
            <polyline
              points={toPoints(nasdaq)}
              fill="none"
              stroke="#e040fb"
              strokeWidth="2"
            />
          </svg>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#445",
              fontSize: 10,
            }}
          >
            {chartDays.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        {/* Commodities */}
        <div
          style={{
            background: "#111820",
            border: "1px solid #1e2a38",
            borderRadius: 6,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span style={{ color: "#00e676", fontSize: 12 }}>
              ● 원자재·가상자산
            </span>
            <span style={{ color: "#445", fontSize: 11 }}>yfinance 실시간</span>
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr style={{ color: "#556", borderBottom: "1px solid #1e2a38" }}>
                {["자산", "현재가", "등락", "소스"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "6px 4px",
                      textAlign: "left",
                      fontWeight: 400,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commodities.map((c) => (
                <tr key={c.name} style={{ borderBottom: "1px solid #141c24" }}>
                  <td style={{ padding: "8px 4px" }}>{c.name}</td>
                  <td style={{ padding: "8px 4px", fontWeight: 600 }}>
                    {c.price}
                  </td>
                  <td
                    style={{
                      padding: "8px 4px",
                      color: c.positive ? "#00e676" : "#ff5252",
                    }}
                  >
                    {c.change}
                  </td>
                  <td style={{ padding: "8px 4px", color: "#445" }}>
                    {c.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FRED indicators */}
      <div style={{ padding: "8px 16px 16px" }}>
        <div
          style={{
            background: "#111820",
            border: "1px solid #1e2a38",
            borderRadius: 6,
            padding: 16,
          }}
        >
          <div style={{ color: "#e040fb", fontSize: 12, marginBottom: 10 }}>
            ● FRED 미국 거시경제 지표
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
            }}
          >
            {fredData.map((f) => (
              <div
                key={f.label}
                style={{
                  background: "#0d1117",
                  border: "1px solid #1e2a38",
                  borderRadius: 4,
                  padding: "12px",
                }}
              >
                <div style={{ color: "#556", fontSize: 10, marginBottom: 6 }}>
                  {f.label}
                </div>
                <div style={{ color: f.color, fontSize: 18, fontWeight: 700 }}>
                  {f.value}
                </div>
                <div style={{ color: "#445", fontSize: 10, marginTop: 4 }}>
                  {f.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
