// 종합현황 (Overview Dashboard)
import { useState } from "react";

import AIPrediction from "@/components/make-money/AIPrediction";
import ControlPanel from "@/components/make-money/ControlPanel";
import FuturesTrading from "@/components/make-money/FuturesTrading";
import GlobalMarket from "@/components/make-money/GlobalMarket";
import LLMReport from "@/components/make-money/LLMReport";
import StockPortfolio from "@/components/make-money/StockPortfolio";

const tabs = [
  "종합현황",
  "주식 포트폴리오",
  "선물 트레이딩",
  "AI 예측",
  "글로벌 시장",
  "LLM 리포트",
  "제어판",
] as const;

type Tab = (typeof tabs)[number];

const TAB_COMPONENTS: Partial<Record<Tab, () => React.JSX.Element>> = {
  "주식 포트폴리오": StockPortfolio,
  "선물 트레이딩": FuturesTrading,
  "AI 예측": AIPrediction,
  "글로벌 시장": GlobalMarket,
  "LLM 리포트": LLMReport,
  제어판: ControlPanel,
};

const pipelineItems = [
  { time: "06:00", label: "pykrx 데이터 수집 + 모델 학습", done: true },
  { time: "07:00", label: "BERT 뉴스 모델 업데이트", done: true },
  { time: "08:30", label: "pykrx 종목 스크리닝 (3단계)", done: true },
  { time: "08:45", label: "BERT 감성 분석", done: true },
  { time: "09:00", label: "LLM 추천 + 페이퍼 매수 실행", done: true },
  { time: "09:00", label: "선물 데이 트레이딩 (KS200)", done: true },
];

const eventLog = [
  { time: "06:00", msg: "[OK] pykrx OHLCV 수집 + 학습 완료" },
  { time: "07:00", msg: "[OK] BERT 뉴스 모델 업데이트 완료" },
  { time: "08:30", msg: "[SCR] pykrx 스크리닝 → searched_items.csv 저장" },
  { time: "08:45", msg: "[BERT] 감성 분석 → bert_results.json 저장" },
  { time: "09:01", msg: "[LLM] GPT-4o → llm_report.json 저장" },
  { time: "09:01", msg: "[BUY] 삼성전자 30주 @ 72,400원 → paper_trades.json" },
  { time: "09:02", msg: "[FUTURES] LONG 2계약 진입" },
  { time: "11:00", msg: "[FUTURES] 청산 +14.5틱 → futures_trades.json" },
  { time: "15:30", msg: "[STOCK] 손절 체크 완료 – 이상 없음" },
];

const cumulativeData = [
  0, 0.2, 0.3, 0.5, 0.7, 0.8, 1.0, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.1, 2.3, 2.5,
  2.8, 3.0, 3.2, 3.5, 3.8, 4.0, 4.2, 4.5, 5.0, 5.5, 6.0, 6.5, 7.2, 7.9,
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("종합현황");

  const maxVal = Math.max(...cumulativeData);
  const minVal = Math.min(...cumulativeData);
  const chartH = 180;
  const chartW = 580;
  const points = cumulativeData
    .map((v, i) => {
      const x = (i / (cumulativeData.length - 1)) * chartW;
      const y = chartH - ((v - minVal) / (maxVal - minVal)) * chartH;
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
      {/* Header */}
      <div
        style={{
          background: "#0d1117",
          borderBottom: "1px solid #1e2a38",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: "#00e5ff", fontWeight: 700, fontSize: 18 }}>
          MAKE<span style={{ color: "#fff" }}>MONEY</span>
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              border: "1px solid #334",
              padding: "2px 10px",
              borderRadius: 4,
              fontSize: 11,
              color: "#aaa",
            }}
          >
            PAPER TRADING
          </span>
          <span
            style={{
              background: "#00c853",
              color: "#000",
              padding: "2px 10px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            ● LIVE
          </span>
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              marginLeft: 16,
            }}
          >
            09:12:59
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          background: "#0d1117",
          borderBottom: "1px solid #1e2a38",
          padding: "0 16px",
          display: "flex",
          gap: 4,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: activeTab === tab ? "#00e5ff" : "#778",
              borderBottom:
                activeTab === tab
                  ? "2px solid #00e5ff"
                  : "2px solid transparent",
              padding: "10px 14px",
              fontSize: 13,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab !== "종합현황" ? (
        (() => {
          const ActiveComponent = TAB_COMPONENTS[activeTab];
          return ActiveComponent ? <ActiveComponent /> : null;
        })()
      ) : (
        <>
          {/* KPI Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 8,
              padding: "12px 16px",
            }}
          >
            {[
              {
                label: "총 자산",
                value: "107.4M",
                sub: "초기 100M 대비 +7.42%",
              },
              {
                label: "예수금 (페이퍼)",
                value: "58.9M",
                sub: "주식 평가 48.5M",
              },
              {
                label: "당일 실현손익",
                value: "+ 0",
                sub: "당일 0건",
                accent: "#00e676",
              },
              {
                label: "선물 P&L",
                value: "+0틱",
                sub: "+₩0",
                accent: "#00e676",
              },
              {
                label: "AI 앙상블 신호",
                value: "STRONG BUY",
                sub: "확신도 70.2%",
                accent: "#00e5ff",
              },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  background: "#111820",
                  border: "1px solid #1e2a38",
                  borderRadius: 6,
                  padding: "12px 16px",
                }}
              >
                <div style={{ color: "#556", fontSize: 11, marginBottom: 4 }}>
                  {card.label}
                </div>
                <div
                  style={{
                    color: card.accent || "#fff",
                    fontSize: card.value.length > 8 ? 16 : 22,
                    fontWeight: 700,
                  }}
                >
                  {card.value}
                </div>
                <div style={{ color: "#556", fontSize: 11, marginTop: 4 }}>
                  {card.sub}
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
            {/* Cumulative chart */}
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
                  ● 누적 수익률 곡선
                </span>
                <span style={{ color: "#556", fontSize: 11 }}>
                  최근 30거래일 · 초기자금 1억 기준
                </span>
              </div>
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                style={{ width: "100%", height: 160 }}
              >
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e676" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00e676" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  points={points}
                  fill="none"
                  stroke="#00e676"
                  strokeWidth="2"
                />
                <polygon
                  points={`0,${chartH} ${points} ${chartW},${chartH}`}
                  fill="url(#grad)"
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
                {["D-29", "D-24", "D-19", "D-14", "D-9", "D-4"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>

            {/* Event log */}
            <div
              style={{
                background: "#111820",
                border: "1px solid #1e2a38",
                borderRadius: 6,
                padding: 16,
              }}
            >
              <div style={{ color: "#f9a825", fontSize: 12, marginBottom: 8 }}>
                ● 오늘 이벤트 로그
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  maxHeight: 180,
                  overflowY: "auto",
                }}
              >
                {eventLog.map((e, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", gap: 10, fontSize: 12 }}
                  >
                    <span style={{ color: "#445", minWidth: 40 }}>
                      {e.time}
                    </span>
                    <span
                      style={{
                        color:
                          e.msg.includes("[BUY]") || e.msg.includes("[OK]")
                            ? "#00e676"
                            : e.msg.includes("[FUTURES]")
                              ? "#00b0ff"
                              : "#aaa",
                      }}
                    >
                      {e.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pipeline + Asset */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              padding: "8px 16px 16px",
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
              <div style={{ color: "#00e676", fontSize: 12, marginBottom: 10 }}>
                ● 오늘 파이프라인 상태
              </div>
              {pipelineItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "5px 0",
                    borderBottom: "1px solid #1a2230",
                  }}
                >
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ color: "#445", fontSize: 11 }}>
                      {item.time}
                    </span>
                    <span style={{ color: "#ccc", fontSize: 12 }}>
                      {item.label}
                    </span>
                  </div>
                  <span
                    style={{
                      background: "#0a2a1a",
                      color: "#00e676",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                    }}
                  >
                    ✓ 완료
                  </span>
                </div>
              ))}
            </div>

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
                  marginBottom: 10,
                }}
              >
                ● 자산 구성
              </div>
              <svg viewBox="0 0 200 200" width="160" height="160">
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#00e5ff"
                  strokeWidth="28"
                  strokeDasharray="219.9 219.9"
                  strokeDashoffset="0"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#00e676"
                  strokeWidth="28"
                  strokeDasharray="99 340.8"
                  strokeDashoffset="-219.9"
                />
                <circle cx="100" cy="100" r="44" fill="#111820" />
              </svg>
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                <span style={{ color: "#00e5ff", fontSize: 11 }}>
                  ■ 예수금 55%
                </span>
                <span style={{ color: "#00e676", fontSize: 11 }}>
                  ■ 주식평가액 45%
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
