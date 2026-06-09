// 제어판 (Control Panel)
import { useState } from "react";

interface RiskParam {
  label: string;
  key: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
}

export default function ControlPanel() {
  const [params, setParams] = useState<RiskParam[]>([
    {
      label: "종목당 최대 비중",
      key: "maxWeight",
      min: 1,
      max: 30,
      step: 1,
      value: 10,
      unit: "%",
    },
    {
      label: "손절선",
      key: "stopLoss",
      min: -20,
      max: -1,
      step: 1,
      value: -7,
      unit: "%",
    },
    {
      label: "일일 손실 한도 (주식)",
      key: "dailyLoss",
      min: -10,
      max: -1,
      step: 1,
      value: -2,
      unit: "%",
    },
    {
      label: "선물 최대 계약 수",
      key: "maxContracts",
      min: 1,
      max: 20,
      step: 1,
      value: 5,
      unit: "계약",
    },
    {
      label: "선물 손절 틱",
      key: "futuresTick",
      min: 1,
      max: 20,
      step: 1,
      value: 3,
      unit: "틱",
    },
    {
      label: "LLM 신뢰도 최소 임계",
      key: "llmThreshold",
      min: 0.1,
      max: 1.0,
      step: 0.05,
      value: 0.65,
      unit: "",
    },
  ]);

  const [stockCode, setStockCode] = useState("005930 (삼성전자)");
  const [stockName, setStockName] = useState("삼성전자");
  const [qty, setQty] = useState("10");
  const [price, setPrice] = useState("0");
  const [saved, setSaved] = useState(false);

  const [logs] = useState([
    { time: "09:08:21", msg: "[INFO] paper_account.json 기반 페이퍼 트레이딩" },
    { time: "09:08:21", msg: "[INFO] global_data(yfinance): ✓ 로드됨" },
    { time: "09:08:21", msg: "[INFO] market_data(pykrx): ✓ 로드됨" },
    { time: "09:08:21", msg: "[SYS] DeepMoney v3.1.1 실데이터 모드 시작" },
  ]);

  const updateParam = (key: string, value: number) => {
    setParams((prev) => prev.map((p) => (p.key === key ? { ...p, value } : p)));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          padding: "12px 16px",
        }}
      >
        {/* Trade control */}
        <div
          style={{
            background: "#111820",
            border: "1px solid #1e2a38",
            borderRadius: 6,
            padding: 16,
          }}
        >
          <div style={{ color: "#00e676", fontSize: 12, marginBottom: 14 }}>
            ● 거래 제어
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button style={ctrlBtn("#3a0a0a", "#ff5252", "#ff5252")}>
              ● 전체 거래 즉시중단
            </button>
            <button style={ctrlBtn("#0a3a0a", "#00e676", "#00e676")}>
              ▶ 거래 재개
            </button>
            <button style={ctrlBtn("#3a1a0a", "#ff6e40", "#ff6e40")}>
              ⚡ 선물 강제 청산
            </button>
            <button style={ctrlBtn("#2a1a2a", "#e040fb", "#e040fb")}>
              ✉ 주식 전량 청산
            </button>
            <button style={ctrlBtn("#1a1a2a", "#778", "#aaa")}>
              ● 스크리닝 수동 실행
            </button>
            <button style={ctrlBtn("#1a2a2a", "#778", "#aaa")}>
              ✦ LLM 추천 재생성
            </button>
            <button style={ctrlBtn("#1a1a2a", "#778", "#aaa")}>
              ✂ 손절 체크 실행
            </button>
          </div>
        </div>

        {/* Risk params */}
        <div
          style={{
            background: "#111820",
            border: "1px solid #1e2a38",
            borderRadius: 6,
            padding: 16,
          }}
        >
          <div style={{ color: "#f9a825", fontSize: 12, marginBottom: 14 }}>
            ● 리스크 파라미터
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {params.map((p) => (
              <div key={p.key}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: "#aaa", fontSize: 12 }}>{p.label}</span>
                  <span
                    style={{ color: "#00e676", fontSize: 12, fontWeight: 600 }}
                  >
                    {p.value}
                    {p.unit}
                  </span>
                </div>
                <div
                  style={{
                    position: "relative",
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={p.value}
                    onChange={(e) =>
                      updateParam(p.key, parseFloat(e.target.value))
                    }
                    style={{
                      width: "100%",
                      accentColor: "#00e676",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={handleSave}
              style={{
                background: saved ? "#0a3a1a" : "#0d2a1a",
                border: "1px solid #00e676",
                borderRadius: 4,
                color: "#00e676",
                padding: "8px",
                fontSize: 12,
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              {saved ? "✓ 저장됨" : "💾 파라미터 저장"}
            </button>
          </div>
        </div>

        {/* Manual order */}
        <div
          style={{
            background: "#111820",
            border: "1px solid #1e2a38",
            borderRadius: 6,
            padding: 16,
          }}
        >
          <div style={{ color: "#00e5ff", fontSize: 12, marginBottom: 14 }}>
            ● 수동 페이퍼 주문
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={{ color: "#556", fontSize: 11, marginBottom: 4 }}>
                종목 코드
              </div>
              <input
                value={stockCode}
                onChange={(e) => setStockCode(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <div style={{ color: "#556", fontSize: 11, marginBottom: 4 }}>
                종목명
              </div>
              <input
                value={stockName}
                onChange={(e) => setStockName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <div>
                <div style={{ color: "#556", fontSize: 11, marginBottom: 4 }}>
                  수량
                </div>
                <input
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <div style={{ color: "#556", fontSize: 11, marginBottom: 4 }}>
                  단가 (0=시장가)
                </div>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
                marginTop: 4,
              }}
            >
              <button style={ctrlBtn("#0a2a1a", "#00e676", "#00e676")}>
                ✏ 페이퍼 매수
              </button>
              <button style={ctrlBtn("#3a0a0a", "#ff5252", "#ff5252")}>
                ✏ 페이퍼 매도
              </button>
            </div>
            <div style={{ marginTop: 4 }}>
              <div style={{ color: "#556", fontSize: 11, marginBottom: 6 }}>
                선물 수동 진입
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 6,
                }}
              >
                <button style={ctrlBtn("#0a1a3a", "#00b0ff", "#00b0ff")}>
                  ↑ LONG
                </button>
                <button style={ctrlBtn("#2a1a3a", "#e040fb", "#e040fb")}>
                  ↓ SHORT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System log */}
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
            <span style={{ color: "#778", fontSize: 12 }}>● 시스템 로그</span>
            <button
              style={{
                background: "none",
                border: "1px solid #2a3a4a",
                borderRadius: 4,
                color: "#556",
                padding: "2px 10px",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              클리어
            </button>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 12 }}>
            {logs.map((l, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "3px 0",
                  borderBottom: "1px solid #141c24",
                }}
              >
                <span style={{ color: "#445" }}>{l.time}</span>
                <span
                  style={{
                    color: l.msg.includes("[SYS]")
                      ? "#00e5ff"
                      : l.msg.includes("[INFO]")
                        ? "#00e676"
                        : "#aaa",
                  }}
                >
                  {l.msg}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ctrlBtn = (
  bg: string,
  border: string,
  color: string,
): React.CSSProperties => ({
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: 4,
  color,
  padding: "8px 12px",
  fontSize: 12,
  cursor: "pointer",
  textAlign: "left",
});

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#0d1117",
  border: "1px solid #2a3a4a",
  borderRadius: 4,
  color: "#ccc",
  padding: "6px 10px",
  fontSize: 12,
};
