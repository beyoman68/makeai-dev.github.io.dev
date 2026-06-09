// 주식 포트폴리오 (Stock Portfolio)
import { useState } from "react";

interface Stock {
  name: string;
  code: string;
  qty: number;
  avgPrice: number;
  currentPrice: number;
  evalProfit: number;
  returnRate: number;
  weight: number;
  color: string;
}

const stocks: Stock[] = [
  {
    name: "한화에어로스페이스",
    code: "012450",
    qty: 8,
    avgPrice: 1425000,
    currentPrice: 1277000,
    evalProfit: -1184000,
    returnRate: -10.4,
    weight: 21.1,
    color: "#00e5ff",
  },
  {
    name: "원익IPS",
    code: "240810",
    qty: 70,
    avgPrice: 143900,
    currentPrice: 119000,
    evalProfit: -1743000,
    returnRate: -17.3,
    weight: 17.2,
    color: "#e040fb",
  },
  {
    name: "SK스퀘어",
    code: "402340",
    qty: 8,
    avgPrice: 1175000,
    currentPrice: 1084000,
    evalProfit: -728000,
    returnRate: -7.7,
    weight: 17.9,
    color: "#7c4dff",
  },
  {
    name: "두산에너빌리티",
    code: "034020",
    qty: 100,
    avgPrice: 106000,
    currentPrice: 108300,
    evalProfit: 230000,
    returnRate: 2.2,
    weight: 22.3,
    color: "#00e676",
  },
  {
    name: "CJ ENM",
    code: "035760",
    qty: 250,
    avgPrice: 41300,
    currentPrice: 41900,
    evalProfit: 150000,
    returnRate: 1.4,
    weight: 21.6,
    color: "#ff5252",
  },
];

// const fmt = (n: number) => `₩${Math.abs(n).toLocaleString()}`;

export default function StockPortfolio() {
  const [orderCode, setOrderCode] = useState("005930 (삼성전자)");
  const [orderName, setOrderName] = useState("삼성전자");
  const [orderQty, setOrderQty] = useState("");
  const [orderPrice, setOrderPrice] = useState("0");

  const totalWeights = stocks.reduce((s, st) => s + st.weight, 0);
  let cumAngle = 0;
  const slices = stocks.map((st) => {
    const angle = (st.weight / totalWeights) * 360;
    const startAngle = cumAngle;
    cumAngle += angle;
    return { ...st, startAngle, angle };
  });

  const polarToXY = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: 100 + r * Math.cos(rad), y: 100 + r * Math.sin(rad) };
  };

  const describeArc = (start: number, sweep: number, r: number) => {
    const s = polarToXY(start, r);
    const e = polarToXY(start + sweep, r);
    const large = sweep > 180 ? 1 : 0;
    return `M 100 100 L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
  };

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
          { label: "보유 종목 수", value: "5", sub: "최대 비중 10%/종목" },
          { label: "주식 평가금액", value: "48.5M", sub: "미실현 ₩3,275,000" },
          { label: "예수금 (페이퍼)", value: "58.9M", sub: "가용 매수 여력" },
          {
            label: "누적 실현손익",
            value: "+10,811,430",
            sub: "API 갱신 오전 9:11:54",
            accent: "#00e676",
          },
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
            <div
              style={{
                color: c.accent || "#fff",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {c.value}
            </div>
            <div style={{ color: "#556", fontSize: 11, marginTop: 4 }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Holdings + Chart */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 8,
          padding: "0 16px",
        }}
      >
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
              ● 보유 종목 현황 (페이퍼 계좌)
            </span>
            <span style={{ color: "#445", fontSize: 11 }}>
              pykrx 현재가 기준
            </span>
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr style={{ color: "#556", borderBottom: "1px solid #1e2a38" }}>
                {[
                  "종목명",
                  "코드",
                  "수량",
                  "평균단가",
                  "현재가",
                  "평가손익",
                  "수익률",
                  "비중",
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
              {stocks.map((s) => (
                <tr key={s.code} style={{ borderBottom: "1px solid #141c24" }}>
                  <td style={{ padding: "8px", color: "#e0e0e0" }}>{s.name}</td>
                  <td style={{ padding: "8px", color: "#445" }}>{s.code}</td>
                  <td style={{ padding: "8px" }}>{s.qty}주</td>
                  <td style={{ padding: "8px" }}>
                    ₩{s.avgPrice.toLocaleString()}
                  </td>
                  <td style={{ padding: "8px", fontWeight: 600 }}>
                    ₩{s.currentPrice.toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      color: s.evalProfit >= 0 ? "#00e676" : "#ff5252",
                      fontWeight: 600,
                    }}
                  >
                    {s.evalProfit >= 0 ? "+" : ""}₩
                    {Math.abs(s.evalProfit).toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      color: s.returnRate >= 0 ? "#00e676" : "#ff5252",
                    }}
                  >
                    {s.returnRate}%
                  </td>
                  <td style={{ padding: "8px" }}>{s.weight}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Donut */}
        <div
          style={{
            background: "#111820",
            border: "1px solid #1e2a38",
            borderRadius: 6,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#00e676",
              fontSize: 12,
              alignSelf: "flex-start",
              marginBottom: 8,
            }}
          >
            ● 종목 비중
          </div>
          <svg viewBox="0 0 200 200" width="160" height="160">
            {slices.map((s) => (
              <path
                key={s.code}
                d={describeArc(s.startAngle, s.angle, 80)}
                fill={s.color}
                opacity={0.85}
              />
            ))}
            <circle cx="100" cy="100" r="50" fill="#111820" />
          </svg>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              marginTop: 8,
            }}
          >
            {stocks.map((s) => (
              <span key={s.code} style={{ fontSize: 11, color: "#aaa" }}>
                <span style={{ color: s.color }}>■ </span>
                {s.name.slice(0, 6)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Order panel */}
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
            ● 오늘 체결 이력
          </div>
          <div style={{ color: "#445", fontSize: 12, marginBottom: 12 }}>
            빠른 매수
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              placeholder="종목코드 (예: 005930)"
              style={inputStyle}
            />
            <input
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              placeholder="종목명 (예: 삼성전자)"
              style={inputStyle}
            />
            <input
              value={orderQty}
              onChange={(e) => setOrderQty(e.target.value)}
              placeholder="수량"
              style={{ ...inputStyle, width: 80 }}
            />
            <input
              value={orderPrice}
              onChange={(e) => setOrderPrice(e.target.value)}
              placeholder="단가 (0=시장가)"
              style={{ ...inputStyle, width: 100 }}
            />
            <button style={btnStyle("#1a3a2a", "#00e676")}>✏ 매수</button>
            <button style={btnStyle("#3a1a1a", "#ff5252")}>✏ 매도</button>
            <button style={btnStyle("#2a2a1a", "#f9a825")}>⚠ 손절 체크</button>
            <button style={btnStyle("#1a1a3a", "#7c4dff")}>🗑 전량 청산</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#0d1117",
  border: "1px solid #2a3a4a",
  borderRadius: 4,
  color: "#ccc",
  padding: "6px 10px",
  fontSize: 12,
  width: 160,
};

const btnStyle = (bg: string, color: string): React.CSSProperties => ({
  background: bg,
  border: `1px solid ${color}`,
  borderRadius: 4,
  color,
  padding: "6px 14px",
  fontSize: 12,
  cursor: "pointer",
});
