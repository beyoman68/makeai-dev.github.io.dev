// 선물 트레이딩 (Futures Trading)
import { useState } from "react";

const ks200Data = [
  940, 945, 950, 955, 958, 960, 962, 965, 970, 975, 985, 995, 1000, 1010, 1020,
  1040, 1060, 1080, 1100, 1120, 1140, 1155, 1165, 1175, 1185, 1200, 1210, 1220,
  1230, 1240, 1230, 1225, 1220, 1215, 1210, 1200, 1195, 1190, 1180, 1160,
];

export default function FuturesTrading() {
  const [contracts, setContracts] = useState("1");
  const chartH = 220;
  const chartW = 560;
  const maxV = Math.max(...ks200Data);
  const minV = Math.min(...ks200Data);

  const points = ks200Data
    .map((v, i) => {
      const x = (i / (ks200Data.length - 1)) * chartW;
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
      {/* KPI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          padding: "12px 16px",
        }}
      >
        {[
          {
            label: "KS200 지수 (YFINANCE)",
            value: "1125.51",
            sub: "+190.08%",
            subColor: "#00e676",
          },
          {
            label: "오늘 선물 P&L",
            value: "+ 0",
            sub: "+0틱",
            subColor: "#00e676",
          },
          { label: "오늘 거래 횟수", value: "0", sub: "진입 / 청산" },
          { label: "연속 손실", value: "0", sub: "한도 3회" },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: "#111820",
              border: "1px solid #1e2a38",
              borderRadius: 6,
              padding: "12px 16px",
            }}
          >
            <div style={{ color: "#556", fontSize: 11, marginBottom: 4 }}>
              {c.label}
            </div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
              {c.value}
            </div>
            <div
              style={{
                color: c.subColor || "#556",
                fontSize: 11,
                marginTop: 4,
              }}
            >
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          padding: "0 16px",
        }}
      >
        {/* Position */}
        <div
          style={{
            background: "#111820",
            border: "1px solid #1e2a38",
            borderRadius: 6,
            padding: 16,
          }}
        >
          <div style={{ color: "#00e676", fontSize: 12, marginBottom: 16 }}>
            ● 현재 포지션
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px 0",
            }}
          >
            <div style={{ color: "#00e676", fontSize: 48, marginBottom: 8 }}>
              ✓
            </div>
            <div style={{ color: "#778", fontSize: 14 }}>
              포지션 없음 (청산 완료)
            </div>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <div
              style={{
                background: "#0d1117",
                border: "1px solid #1e2a38",
                borderRadius: 4,
                padding: "10px 16px",
              }}
            >
              <div style={{ color: "#556", fontSize: 11 }}>오늘 P&L</div>
              <div style={{ color: "#00e676", fontSize: 18, fontWeight: 700 }}>
                +0틱
              </div>
              <div style={{ color: "#445", fontSize: 10 }}>+₩0</div>
            </div>
            <div
              style={{
                background: "#0d1117",
                border: "1px solid #1e2a38",
                borderRadius: 4,
                padding: "10px 16px",
              }}
            >
              <div style={{ color: "#556", fontSize: 11 }}>거래 횟수</div>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>
                0
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
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
              ● 코스피200 일봉
            </span>
            <span style={{ color: "#445", fontSize: 11 }}>
              yfinance ^KS200 · 최근 20거래일
            </span>
          </div>
          <svg
            viewBox={`-40 0 ${chartW + 50} ${chartH + 20}`}
            style={{ width: "100%", height: 200 }}
          >
            <defs>
              <linearGradient id="futGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00b0ff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00b0ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[900, 950, 1000, 1050, 1100, 1150, 1200, 1250].map((v) => {
              const y = chartH - ((v - minV) / (maxV - minV)) * chartH;
              return (
                <g key={v}>
                  <line
                    x1={0}
                    y1={y}
                    x2={chartW}
                    y2={y}
                    stroke="#1a2230"
                    strokeWidth="1"
                  />
                  <text
                    x={-5}
                    y={y + 4}
                    fill="#445"
                    fontSize="9"
                    textAnchor="end"
                  >
                    {v}
                  </text>
                </g>
              );
            })}
            <polyline
              points={points}
              fill="none"
              stroke="#00b0ff"
              strokeWidth="2"
            />
            <polygon
              points={`0,${chartH} ${points} ${chartW},${chartH}`}
              fill="url(#futGrad)"
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
            {["04/20", "04/24", "04/30", "05/08", "05/14"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Trade history + controls */}
      <div style={{ padding: "8px 16px 16px" }}>
        <div
          style={{
            background: "#111820",
            border: "1px solid #1e2a38",
            borderRadius: 6,
            padding: 16,
          }}
        >
          <div style={{ color: "#f9a825", fontSize: 12, marginBottom: 10 }}>
            ● 오늘 선물 거래 이력 (페이퍼)
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 4,
              color: "#445",
              fontSize: 11,
              borderBottom: "1px solid #1e2a38",
              paddingBottom: 6,
              marginBottom: 8,
            }}
          >
            {[
              "시간",
              "구분",
              "방향",
              "계약",
              "진입가",
              "청산가",
              "P&L(틱)",
            ].map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          <div style={{ color: "#445", fontSize: 12, padding: "8px 0" }}>
            거래 이력 없음
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#778", fontSize: 12 }}>
              선물 포지션 제어
            </span>
            <input
              value={contracts}
              onChange={(e) => setContracts(e.target.value)}
              style={{
                background: "#0d1117",
                border: "1px solid #2a3a4a",
                borderRadius: 4,
                color: "#ccc",
                padding: "5px 8px",
                fontSize: 12,
                width: 50,
              }}
            />
            <button
              style={{
                background: "#0a2a4a",
                border: "1px solid #0060a0",
                borderRadius: 4,
                color: "#00b0ff",
                padding: "6px 14px",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ↑ LONG 진입
            </button>
            <button
              style={{
                background: "#2a0a3a",
                border: "1px solid #8000a0",
                borderRadius: 4,
                color: "#e040fb",
                padding: "6px 14px",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ↓ SHORT 진입
            </button>
            <button
              style={{
                background: "#3a1a1a",
                border: "1px solid #a04000",
                borderRadius: 4,
                color: "#ff6e40",
                padding: "6px 14px",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              🚩 포지션 청산
            </button>
            <button
              style={{
                background: "#1a2a1a",
                border: "1px solid #2a4a2a",
                borderRadius: 4,
                color: "#aaa",
                padding: "6px 14px",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              🔍 모니터링 실행
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
