// LLM 리포트 (LLM Report)
const sectorTags = [
  { name: "반도체", positive: true },
  { name: "방산", positive: true },
  { name: "바이오", positive: true },
  { name: "IT서비스", positive: false },
  { name: "화학", positive: false },
];

const recommendations = [
  {
    rank: 1,
    name: "메일유업",
    reason:
      "단백질 보충제 시장의 견고한 성장세와 긍정적인 뉴스 감성(0.95)이 주가 동력으로 작용하고 있습니다. 건강기능식품 라인업 확대로 인한 수익성 개선이 기대됩니다.",
    signal: "BUY",
    confidence: 92,
    target: "₩52,000",
    stopLoss: "₩42,000",
  },
  {
    rank: 2,
    name: "포스코퓨처엠",
    reason:
      "차세대 배터리 핵심 소재인 실리콘 음극재 양산 임박 뉴스가 강력한 모멘텀을 형성하고 있습니다. 이차전지 소재 국산화 및 기술 우위로 중장기 성장성이 매우 높습니다.",
    signal: "BUY",
    confidence: 95,
    target: "₩310,000",
    stopLoss: "₩240,000",
  },
];

export default function LLMReport() {
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
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          padding: "12px 16px",
        }}
      >
        {/* Market briefing */}
        <div
          style={{
            background: "#111820",
            border: "1px solid #1e2a38",
            borderRadius: 6,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <span style={{ color: "#00e676", fontSize: 12 }}>
              ● 오늘의 시장 브리핑
            </span>
            <span style={{ color: "#445", fontSize: 11 }}>
              GPT-4o · 2026-05-21 08:32:25 생성
            </span>
          </div>

          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#00e676",
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            강세
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            {sectorTags.map((t) => (
              <span
                key={t.name}
                style={{
                  background: t.positive ? "#0a2a1a" : "#2a1a1a",
                  border: `1px solid ${t.positive ? "#00e676" : "#ff5252"}`,
                  color: t.positive ? "#00e676" : "#ff5252",
                  padding: "2px 10px",
                  borderRadius: 4,
                  fontSize: 11,
                }}
              >
                {t.positive ? "↑" : "↓"} {t.name}
              </span>
            ))}
            <span style={{ color: "#556", fontSize: 11, alignSelf: "center" }}>
              섹터 로테이션 모니터링 중
            </span>
          </div>

          <p style={{ color: "#bbb", lineHeight: 1.7, fontSize: 13 }}>
            미 국채 금리 급락과 견조한 경제 지표에 힘입어 뉴욕 증시 선물이
            강세를 보였습니다. 유가 폭락은 인플레이션 우려를 완화하며 국내
            증시의 반등 모멘텀으로 작용할 전망입니다.
          </p>
        </div>

        {/* Macro summary */}
        <div
          style={{
            background: "#111820",
            border: "1px solid #1e2a38",
            borderRadius: 6,
            padding: 20,
          }}
        >
          <div style={{ color: "#f9a825", fontSize: 12, marginBottom: 14 }}>
            ● 매크로 요약
          </div>

          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                color: "#556",
                fontSize: 11,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              글로벌 매크로
            </div>
            <p style={{ color: "#bbb", lineHeight: 1.7, fontSize: 12 }}>
              금일 증시는 미 국채 금리의 하락과 뉴욕 3대 지수 선물의 강세에
              힘입어 상승 출발이 예상됩니다. 특히 10년물 국채 금리가 2% 이상
              하락하며 성장주에 우호적인 환경이 조성되었습니다. WTI 원유 가격이
              8% 넘게 폭락하며 인플레이션 압력이 낮아진 점은 긍정적이나, 이는
              동시에 글로벌 수요 둔화 우려를 자극할 수 있어 주의가 필요합니다.
            </p>
          </div>

          <div
            style={{
              marginBottom: 12,
              paddingTop: 10,
              borderTop: "1px solid #1e2a38",
            }}
          >
            <div style={{ color: "#556", fontSize: 11, marginBottom: 6 }}>
              국내 시장
            </div>
            <p style={{ color: "#bbb", fontSize: 12 }}>
              외국인 순매수 지속. 코스피 박스권 등락 반복.
            </p>
          </div>

          <div style={{ paddingTop: 10, borderTop: "1px solid #1e2a38" }}>
            <div style={{ color: "#ff5252", fontSize: 11, marginBottom: 6 }}>
              ⚠ 리스크 요인
            </div>
            <p style={{ color: "#bbb", fontSize: 12 }}>
              환율 변동성 확대에 따른 외국인 수급 부담, 유가 급락에 따른 글로벌
              경기 둔화 우려
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
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
              marginBottom: 12,
            }}
          >
            <span style={{ color: "#00e676", fontSize: 12 }}>
              ● LLM 종목 추천 TOP 4
            </span>
            <span style={{ color: "#445", fontSize: 11 }}>
              pykrx 스크리닝 + BERT 감성 + 매크로 통합 → GPT-4o
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recommendations.map((r) => (
              <div
                key={r.name}
                style={{
                  background: "#0d1117",
                  border: "1px solid #1e2a38",
                  borderRadius: 6,
                  padding: 14,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <span
                    style={{
                      color: "#00e5ff",
                      fontSize: 22,
                      fontWeight: 700,
                      minWidth: 24,
                    }}
                  >
                    {r.rank}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}
                    >
                      {r.name}
                    </div>
                    <p
                      style={{
                        color: "#aaa",
                        fontSize: 12,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {r.reason}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 8,
                        alignItems: "center",
                      }}
                    >
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
                        {r.signal}
                      </span>
                      <span style={{ color: "#778", fontSize: 11 }}>
                        신뢰도 {r.confidence}%
                      </span>
                      <span style={{ color: "#00e676", fontSize: 11 }}>
                        목표 {r.target}
                      </span>
                      <span style={{ color: "#ff5252", fontSize: 11 }}>
                        손절 {r.stopLoss}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div
              style={{
                background: "#0d1117",
                border: "1px dashed #1e2a38",
                borderRadius: 6,
                padding: 14,
                textAlign: "center",
                color: "#445",
                fontSize: 12,
              }}
            >
              TOP 3, 4 — 추가 추천 종목 자리
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
