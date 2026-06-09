// AI 예측 (AI Prediction)
// import { useState } from "react";

interface ModelResult {
  name: string;
  confidence: number;
  color: string;
}

const models: ModelResult[] = [
  { name: "StackedLSTM", confidence: 95, color: "#00e676" },
  { name: "AutoEncoderLSTM", confidence: 95, color: "#00e676" },
  { name: "FuturesLSTM", confidence: 95, color: "#00e676" },
  { name: "VanillaTransformer", confidence: 5, color: "#00b0ff" },
  { name: "AutoEncoderTransformer", confidence: 5, color: "#00b0ff" },
  { name: "HybridTransformerLSTM", confidence: 5, color: "#00b0ff" },
  { name: "ResTransformer", confidence: 95, color: "#e040fb" },
];

interface SentimentStock {
  name: string;
  code: string;
  positive: number;
  negative: number;
  signal: string;
}

const sentimentStocks: SentimentStock[] = [
  {
    name: "메일유업",
    code: "267980",
    positive: 95,
    negative: 5,
    signal: "STRONG BUY",
  },
  {
    name: "현대위아",
    code: "011210",
    positive: 95,
    negative: 5,
    signal: "STRONG BUY",
  },
  {
    name: "CJ ENM",
    code: "035760",
    positive: 94,
    negative: 6,
    signal: "STRONG BUY",
  },
  {
    name: "네오위즈",
    code: "095660",
    positive: 94,
    negative: 6,
    signal: "STRONG BUY",
  },
  {
    name: "포스코퓨처엠",
    code: "003670",
    positive: 94,
    negative: 6,
    signal: "STRONG BUY",
  },
  {
    name: "대웅제약",
    code: "069620",
    positive: 94,
    negative: 6,
    signal: "STRONG BUY",
  },
];

// KS200 prediction chart data
const actualData = [
  950, 960, 970, 990, 1010, 1050, 1080, 1100, 1130, 1160, 1180, 1200, 1210,
  1205, 1195, 1180, 1160, 1140, 1120, 1100,
];
const predictData = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  1155,
  1120,
  1090,
  1060,
  1040,
  1020,
  1010,
  998,
];
const targetVal = 998;

export default function AIPrediction() {
  // const [activeSignal] = useState<"신호" | "차트">("신호");
  const chartH = 160;
  const chartW = 500;
  const allVals = [...actualData, ...(predictData.filter(Boolean) as number[])];
  const maxV = Math.max(...allVals);
  const minV = Math.min(...allVals);

  const toXY = (vals: (number | null)[], startIdx = 0) => {
    const filtered: { x: number; y: number }[] = [];
    vals.forEach((v, i) => {
      if (v !== null) {
        const x =
          ((startIdx + i) /
            (actualData.length + predictData.filter(Boolean).length - 1)) *
          chartW;
        const y = chartH - ((v - minV) / (maxV - minV)) * chartH;
        filtered.push({ x, y });
      }
    });
    return filtered;
  };

  const actualPts = toXY(actualData)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");
  const predictPts = toXY(predictData, 12)
    .map((p) => `${p.x},${p.y}`)
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
      {/* Main panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          padding: "12px 16px",
        }}
      >
        {/* Ensemble predictions */}
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
              marginBottom: 12,
            }}
          >
            <div>
              <span style={{ color: "#00e676", fontSize: 12 }}>
                ● 앙상블 예측 결과
              </span>
              <span style={{ color: "#778", fontSize: 12, marginLeft: 8 }}>
                삼성전자 (005930) · 20일 예측
              </span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                style={{
                  background: "#0a2a1a",
                  border: "1px solid #00e676",
                  borderRadius: 4,
                  color: "#00e676",
                  padding: "3px 10px",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                신호
              </button>
              <button
                style={{
                  background: "none",
                  border: "1px solid #2a3a4a",
                  borderRadius: 4,
                  color: "#778",
                  padding: "3px 10px",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                차트
              </button>
            </div>
          </div>

          {models.map((m) => (
            <div
              key={m.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  color: "#778",
                  fontSize: 11,
                  width: 180,
                  minWidth: 180,
                }}
              >
                {m.name}
              </span>
              <div
                style={{
                  flex: 1,
                  background: "#0d1117",
                  borderRadius: 2,
                  height: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${m.confidence}%`,
                    height: "100%",
                    background: m.color,
                    borderRadius: 2,
                  }}
                />
              </div>
              <span
                style={{
                  color: m.color,
                  fontSize: 11,
                  width: 30,
                  textAlign: "right",
                }}
              >
                {m.confidence}%
              </span>
            </div>
          ))}

          <div
            style={{
              marginTop: 16,
              padding: "12px 0 0",
              borderTop: "1px solid #1e2a38",
            }}
          >
            <div style={{ color: "#778", fontSize: 11, marginBottom: 4 }}>
              앙상블 합산 신호
            </div>
            <div
              style={{
                color: "#f9a825",
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: 2,
              }}
            >
              HOLD
            </div>
            <div style={{ color: "#556", fontSize: 11, marginTop: 2 }}>
              7개 모델 평균 확신도 56.4%
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ color: "#778", fontSize: 11 }}>20일 목표가</div>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
                ₩173,523
              </div>
              <div style={{ color: "#ff5252", fontSize: 11 }}>
                -39.6% (현재 ₩287,500)
              </div>
            </div>
          </div>
        </div>

        {/* KS200 prediction chart */}
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
            <span style={{ color: "#00e5ff", fontSize: 12 }}>
              ● 선물 방향 예측 &nbsp; ks200 DMI · Stochastic · 앙상블
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                style={{
                  background: "none",
                  border: "1px solid #2a3a4a",
                  borderRadius: 4,
                  color: "#778",
                  padding: "3px 10px",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                신호
              </button>
              <button
                style={{
                  background: "#0a2a1a",
                  border: "1px solid #00e676",
                  borderRadius: 4,
                  color: "#00e676",
                  padding: "3px 10px",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                차트
              </button>
            </div>
          </div>

          <div style={{ color: "#556", fontSize: 11, marginBottom: 8 }}>
            KS200 1132 → 목표 1008{" "}
            <span style={{ color: "#ff5252" }}>-10.95%</span> (실대비)
          </div>

          <svg
            viewBox={`0 -10 ${chartW} ${chartH + 30}`}
            style={{ width: "100%", height: 180 }}
          >
            {/* Legend */}
            <text x="0" y={chartH + 25} fill="#00b0ff" fontSize="9">
              ■ 실제 (20일)
            </text>
            <text x="70" y={chartH + 25} fill="#f9a825" fontSize="9">
              ■ 예측 (20일)
            </text>
            <text x="140" y={chartH + 25} fill="#00e676" fontSize="9">
              ● 목표
            </text>
            {/* Actual line */}
            <polyline
              points={actualPts}
              fill="none"
              stroke="#00b0ff"
              strokeWidth="2"
            />
            {/* Predicted dashed */}
            <polyline
              points={predictPts}
              fill="none"
              stroke="#f9a825"
              strokeWidth="2"
              strokeDasharray="5,3"
            />
            {/* Target dot */}
            <circle
              cx={chartW}
              cy={chartH - ((targetVal - minV) / (maxV - minV)) * chartH}
              r="5"
              fill="#00e676"
            />
          </svg>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#445",
              fontSize: 10,
              marginTop: 4,
            }}
          >
            {["4/17", "4/27", "5/07", "5/15", "5/27", "6/4", "6/12"].map(
              (d) => (
                <span key={d}>{d}</span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* BERT Sentiment */}
      <div style={{ padding: "0 16px 16px" }}>
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
              ● BERT 뉴스 감성 분석
            </span>
            <span style={{ color: "#445", fontSize: 11 }}>
              pykrx 스크리닝 종목 · 08:45 기준 · Google 뉴스 크롤링
            </span>
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr style={{ color: "#556", borderBottom: "1px solid #1e2a38" }}>
                {[
                  "종목명",
                  "긍정 확률",
                  "부정 확률",
                  "긍정 바",
                  "분석 뉴스",
                  "신호",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "6px 8px",
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
              {sentimentStocks.map((s) => (
                <tr key={s.code} style={{ borderBottom: "1px solid #141c24" }}>
                  <td style={{ padding: "8px" }}>
                    {s.name} <span style={{ color: "#445" }}>{s.code}</span>
                  </td>
                  <td style={{ padding: "8px", color: "#00e676" }}>
                    {s.positive}%
                  </td>
                  <td style={{ padding: "8px", color: "#ff5252" }}>
                    {s.negative}%
                  </td>
                  <td style={{ padding: "8px" }}>
                    <div
                      style={{
                        width: 120,
                        background: "#0d1117",
                        borderRadius: 2,
                        height: 6,
                      }}
                    >
                      <div
                        style={{
                          width: `${s.positive}%`,
                          height: "100%",
                          background: "#00e676",
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ padding: "8px", color: "#445" }}>-</td>
                  <td style={{ padding: "8px" }}>
                    <span
                      style={{
                        background: "#0a2a1a",
                        border: "1px solid #00e676",
                        color: "#00e676",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 11,
                      }}
                    >
                      {s.signal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
