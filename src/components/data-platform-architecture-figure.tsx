/**
 * MZO Data Platform architecture diagram (SVG).
 * Ported from `.dev/code/20260417_1647_Document_Platform/src/app/App.tsx`.
 * Copy aligned with `.dev/txt/20260417_1616.txt` (format breadth + native-first + strong OCR).
 */
export function DataPlatformArchitectureFigure() {
  /** Colors from `.data-platform-architecture-figure` in `index.css` (light + `.dark`). */
  const dp = {
    canvas: "var(--dp-canvas)",
    headline: "var(--dp-headline)",
    subtitle: "var(--dp-subtitle)",
    muted: "var(--dp-muted)",
    body: "var(--dp-body)",
    tertiary: "var(--dp-tertiary)",
    faint: "var(--dp-faint)",
    borderLight: "var(--dp-border-light)",
    nativeFill: "var(--dp-native-fill)",
    nativeBorder: "var(--dp-native-border)",
    lineMain: "var(--dp-line-main)",
    cardFill: "var(--dp-card-fill)",
    mergeBg: "var(--dp-merge-bg)",
    mergeText: "var(--dp-merge-text)",
    mergeLabel: "var(--dp-merge-label)",
    mergeSub: "var(--dp-merge-sub)",
    mergeDivider: "var(--dp-merge-divider)",
    mergeInner: "var(--dp-merge-inner)",
  } as const;

  const font = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  /** Match processing-block borders; reads clearly when the SVG scales down. */
  const connectorSw = 1.5;

  // ─── Card Geometry ─────────────────────────────────────────────────────────
  const INP_H   = 34;
  const INP_GAP = 7;
  const STEP    = INP_H + INP_GAP;  // 41

  // ─── Native Inputs ─────────────────────────────────────────────────────────
  const nativeFormats = ['DOC / DOCX', 'XLS / XLSX', 'PPT / PPTX', 'HWP / HWPX', 'HTML'];
  const NATIVE_Y0 = 80;
  const nativeYs   = nativeFormats.map((_, i) => NATIVE_Y0 + i * STEP);
  const nativeCYs  = nativeYs.map(y => y + INP_H / 2);
  const nativeBottom  = nativeYs[nativeYs.length - 1] + INP_H;  // 276
  const nativeCentroid = (nativeCYs[0] + nativeCYs[nativeCYs.length - 1]) / 2; // 177

  // ─── OCR Inputs ───────────────────────────────────────────────────────────
  const ocrFormats = ['PDF', 'JPG', 'PNG'];
  const OCR_Y0    = nativeBottom + 22;  // 298
  const ocrYs     = ocrFormats.map((_, i) => OCR_Y0 + i * STEP);
  const ocrCYs    = ocrYs.map(y => y + INP_H / 2);
  const ocrBottom = ocrYs[ocrYs.length - 1] + INP_H;   // 414
  const ocrCentroid = (ocrCYs[0] + ocrCYs[ocrCYs.length - 1]) / 2; // 356

  // ─── Center Y ────────────────────────────────────────────────────────────
  const CENTER_Y = (nativeCentroid + ocrCentroid) / 2;  // 266.5

  // ─── X Columns ───────────────────────────────────────────────────────────
  const INP_X     = 22;
  const INP_W     = 112;
  const INP_RX    = 5;
  const INP_RIGHT = INP_X + INP_W;   // 134

  const PROC_X    = 194;
  const PROC_W    = 176;
  const PROC_RIGHT = PROC_X + PROC_W; // 370

  const MERGE_X   = 428;
  const MERGE_W   = 198;
  const MERGE_RIGHT = MERGE_X + MERGE_W; // 626

  const OUT_X     = 682;
  const OUT_W     = 130;
  const OUT_RIGHT = OUT_X + OUT_W;    // 812

  // ─── Connector Midpoints ──────────────────────────────────────────────────
  const BUS_X   = Math.round((INP_RIGHT + PROC_X) / 2);   // 164
  const CONV_X  = Math.round((PROC_RIGHT + MERGE_X) / 2); // 399
  const FAN_X   = Math.round((MERGE_RIGHT + OUT_X) / 2);  // 654

  // ─── Processing Blocks ────────────────────────────────────────────────────
  const NATIVE_PROC_H = 152;
  const NATIVE_PROC_Y = Math.round(nativeCentroid - NATIVE_PROC_H / 2); // 101

  const OCR_PROC_H = 104;
  const OCR_PROC_Y = Math.round(ocrCentroid - OCR_PROC_H / 2); // 304

  // ─── Merge Block ─────────────────────────────────────────────────────────
  const MERGE_H = 242;
  const MERGE_Y = Math.round(CENTER_Y - MERGE_H / 2); // 146

  // ─── Output Cards ────────────────────────────────────────────────────────
  const OUT_H   = 34;
  const OUT_GAP = 9;
  const OUT_STEP = OUT_H + OUT_GAP; // 43
  const outputs  = ['JSON', 'Markdown', 'Search Index', 'RAG / AI Context', 'Automation Workflows'];
  const OUT_TOTAL_H = outputs.length * OUT_H + (outputs.length - 1) * OUT_GAP; // 206
  const OUT_Y0   = Math.round(CENTER_Y - OUT_TOTAL_H / 2); // 164
  const outYs    = outputs.map((_, i) => OUT_Y0 + i * OUT_STEP);
  const outCYs   = outYs.map(y => y + OUT_H / 2);

  // ─── ViewBox ──────────────────────────────────────────────────────────────
  const VB_W = 960;
  const VB_H = ocrBottom + 24; // padding below last input row

  // ─── Merge feature tags ───────────────────────────────────────────────────
  const mergeTags = ['sections', 'paragraphs', 'tables', 'key fields', 'reading order', 'metadata'];

  return (
    <div className="data-platform-architecture-figure w-full bg-background">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="mx-auto block h-auto w-full max-w-[960px]"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="data-platform-arch-title"
      >
        <title id="data-platform-arch-title">
          MZO Data Platform: diverse inputs flow through native parsing or strong
          OCR into structured document representation, then outputs including JSON,
          Markdown, search index, RAG and AI context, and automation workflows.
          One platform: the right extraction path for each format.
        </title>
        <defs>
          {/* Arrow markers */}
          <marker id="arrMain" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <polyline
              points="0.5,1 6,4 0.5,7"
              stroke={dp.lineMain}
              strokeWidth={connectorSw}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
          <marker id="arrOut" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <polyline
              points="0.5,1 6,4 0.5,7"
              stroke={dp.lineMain}
              strokeWidth={connectorSw}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        <rect width={VB_W} height={VB_H} fill={dp.canvas} />

        {/* ═══════════════════════════════════════════════════
            HEADLINE
        ═══════════════════════════════════════════════════ */}
        <text
          x={VB_W / 2} y={22}
          textAnchor="middle"
          fontSize="17" fontWeight="700" fill={dp.headline}
          fontFamily={font}
          letterSpacing="-0.3"
        >
          Support more formats
        </text>
        <text
          x={VB_W / 2} y={40}
          textAnchor="middle"
          fontSize="11" fill={dp.subtitle}
          fontFamily={font}
          letterSpacing="0.2"
        >
          Extract more structure. Move faster.
        </text>

        {/* ═══════════════════════════════════════════════════
            SECTION LABELS
        ═══════════════════════════════════════════════════ */}
        {[
          { label: 'INPUTS',     cx: (INP_X + INP_RIGHT) / 2 },
          { label: 'PROCESSING', cx: (PROC_X + PROC_RIGHT) / 2 },
          { label: 'OUTPUTS',    cx: (OUT_X + OUT_RIGHT) / 2 },
        ].map(({ label, cx }) => (
          <text
            key={label}
            x={cx} y={60}
            textAnchor="middle"
            fontSize="8.5" fontWeight="600" fill={dp.muted}
            letterSpacing="1.8"
            fontFamily={font}
          >
            {label}
          </text>
        ))}

        {/* ═══════════════════════════════════════════════════
            CONNECTOR LINES  (rendered first, behind cards)
        ═══════════════════════════════════════════════════ */}

        {/* — Native bus branches (card → bus) */}
        {nativeCYs.map((cy, i) => (
          <line key={`nb-${i}`}
            x1={INP_RIGHT} y1={cy}
            x2={BUS_X}     y2={cy}
            stroke={dp.lineMain} strokeWidth={connectorSw}
          />
        ))}
        {/* Native vertical bus */}
        <line
          x1={BUS_X} y1={nativeCYs[0]}
          x2={BUS_X} y2={nativeCYs[nativeCYs.length - 1]}
          stroke={dp.lineMain} strokeWidth={connectorSw}
        />
        {/* Native bus → Native Parsing block */}
        <line
          x1={BUS_X}  y1={nativeCentroid}
          x2={PROC_X} y2={nativeCentroid}
          stroke={dp.lineMain} strokeWidth={connectorSw}
          markerEnd="url(#arrMain)"
        />

        {/* — OCR bus branches (card → bus) */}
        {ocrCYs.map((cy, i) => (
          <line key={`ob-${i}`}
            x1={INP_RIGHT} y1={cy}
            x2={BUS_X}     y2={cy}
            stroke={dp.lineMain} strokeWidth={connectorSw}
          />
        ))}
        {/* OCR vertical bus */}
        <line
          x1={BUS_X} y1={ocrCYs[0]}
          x2={BUS_X} y2={ocrCYs[ocrCYs.length - 1]}
          stroke={dp.lineMain} strokeWidth={connectorSw}
        />
        {/* OCR bus → OCR block */}
        <line
          x1={BUS_X}  y1={ocrCentroid}
          x2={PROC_X} y2={ocrCentroid}
          stroke={dp.lineMain} strokeWidth={connectorSw}
          markerEnd="url(#arrMain)"
        />

        {/* — Native Parsing → convergence point */}
        <path
          d={`M ${PROC_RIGHT},${nativeCentroid} H ${CONV_X} V ${CENTER_Y}`}
          stroke={dp.lineMain} strokeWidth={connectorSw} fill="none"
        />
        {/* — OCR → convergence point */}
        <path
          d={`M ${PROC_RIGHT},${ocrCentroid} H ${CONV_X} V ${CENTER_Y}`}
          stroke={dp.lineMain} strokeWidth={connectorSw} fill="none"
        />
        {/* — Convergence → Merge block */}
        <line
          x1={CONV_X}   y1={CENTER_Y}
          x2={MERGE_X}  y2={CENTER_Y}
          stroke={dp.lineMain} strokeWidth={connectorSw}
          markerEnd="url(#arrMain)"
        />

        {/* — Merge → fan-out bus */}
        <line
          x1={MERGE_RIGHT} y1={CENTER_Y}
          x2={FAN_X}       y2={CENTER_Y}
          stroke={dp.lineMain} strokeWidth={connectorSw}
        />
        {/* Fan vertical bus */}
        <line
          x1={FAN_X} y1={outCYs[0]}
          x2={FAN_X} y2={outCYs[outCYs.length - 1]}
          stroke={dp.lineMain} strokeWidth={connectorSw}
        />
        {/* Fan branches → output cards */}
        {outCYs.map((cy, i) => (
          <line key={`fan-${i}`}
            x1={FAN_X} y1={cy}
            x2={OUT_X} y2={cy}
            stroke={dp.lineMain} strokeWidth={connectorSw}
            markerEnd="url(#arrOut)"
          />
        ))}

        {/* ═══════════════════════════════════════════════════
            INPUT CARDS — NATIVE GROUP
        ═══════════════════════════════════════════════════ */}
        {nativeFormats.map((fmt, i) => (
          <g key={`ni-${i}`}>
            <rect
              x={INP_X} y={nativeYs[i]}
              width={INP_W} height={INP_H} rx={INP_RX}
              fill={dp.cardFill} stroke={dp.borderLight} strokeWidth="1"
            />
            {/* tiny doc corner fold */}
            <path
              d={`M ${INP_X + INP_W - 10},${nativeYs[i]} L ${INP_X + INP_W},${nativeYs[i] + 10}`}
              stroke={dp.faint} strokeWidth="0.75" fill="none"
            />
            <text
              x={INP_X + INP_W / 2 - 4}
              y={nativeYs[i] + INP_H / 2 + 4}
              textAnchor="middle"
              fontSize="10.5" fontWeight="500" fill={dp.body}
              fontFamily={font}
            >
              {fmt}
            </text>
          </g>
        ))}

        {/* Group label: native */}
        <text
          x={INP_X + INP_W / 2}
          y={nativeBottom + 13}
          textAnchor="middle"
          fontSize="8" fill={dp.faint}
          fontFamily={font}
          letterSpacing="0.5"
        >
          ·  ·  ·  ·  ·  ·  ·  ·  ·
        </text>

        {/* ═══════════════════════════════════════════════════
            INPUT CARDS — OCR GROUP
        ═══════════════════════════════════════════════════ */}
        {ocrFormats.map((fmt, i) => (
          <g key={`oi-${i}`}>
            <rect
              x={INP_X} y={ocrYs[i]}
              width={INP_W} height={INP_H} rx={INP_RX}
              fill={dp.cardFill} stroke={dp.borderLight} strokeWidth="1"
            />
            <text
              x={INP_X + INP_W / 2}
              y={ocrYs[i] + INP_H / 2 + 4}
              textAnchor="middle"
              fontSize="10.5" fontWeight="500" fill={dp.body}
              fontFamily={font}
            >
              {fmt}
            </text>
          </g>
        ))}

        {/* ═══════════════════════════════════════════════════
            NATIVE PARSING BLOCK
        ═══════════════════════════════════════════════════ */}
        <rect
          x={PROC_X} y={NATIVE_PROC_Y}
          width={PROC_W} height={NATIVE_PROC_H} rx={7}
          fill={dp.nativeFill} stroke={dp.nativeBorder} strokeWidth="1.5"
        />
        {/* Block title */}
        <text
          x={PROC_X + PROC_W / 2}
          y={NATIVE_PROC_Y + 26}
          textAnchor="middle"
          fontSize="12.5" fontWeight="700" fill={dp.headline}
          fontFamily={font}
        >
          Native Parsing
        </text>
        <text
          x={PROC_X + PROC_W / 2}
          y={NATIVE_PROC_Y + 42}
          textAnchor="middle"
          fontSize="9" fill={dp.muted}
          fontFamily={font}
        >
          Native-first where structure exists
        </text>
        {/* Divider */}
        <line
          x1={PROC_X + 14} y1={NATIVE_PROC_Y + 53}
          x2={PROC_RIGHT - 14} y2={NATIVE_PROC_Y + 53}
          stroke={dp.borderLight} strokeWidth="1"
        />
        {/* Feature tags */}
        {['text extraction', 'table extraction', 'layout understanding', 'metadata & structure'].map((tag, i) => (
          <text
            key={`nt-${i}`}
            x={PROC_X + PROC_W / 2}
            y={NATIVE_PROC_Y + 70 + i * 18}
            textAnchor="middle"
            fontSize="9.5" fill={dp.tertiary}
            fontFamily={font}
          >
            {tag}
          </text>
        ))}

        {/* ═══════════════════════════════════════════════════
            OCR BLOCK  (same border / type scale as Native Parsing)
        ═══════════════════════════════════════════════════ */}
        <rect
          x={PROC_X} y={OCR_PROC_Y}
          width={PROC_W} height={OCR_PROC_H} rx={7}
          fill={dp.nativeFill} stroke={dp.nativeBorder} strokeWidth="1.5"
        />
        <text
          x={PROC_X + PROC_W / 2}
          y={OCR_PROC_Y + 26}
          textAnchor="middle"
          fontSize="12.5" fontWeight="700" fill={dp.headline}
          fontFamily={font}
        >
          Strong OCR when needed
        </text>
        <text
          x={PROC_X + PROC_W / 2}
          y={OCR_PROC_Y + 42}
          textAnchor="middle"
          fontSize="9" fill={dp.muted}
          fontFamily={font}
        >
          Scans, PDFs, and image-based inputs
        </text>
        <line
          x1={PROC_X + 14} y1={OCR_PROC_Y + 53}
          x2={PROC_RIGHT - 14} y2={OCR_PROC_Y + 53}
          stroke={dp.borderLight} strokeWidth="1"
        />
        {['text recognition · layout analysis', 'table detection · multilingual'].map((tag, i) => (
          <text
            key={`ot-${i}`}
            x={PROC_X + PROC_W / 2}
            y={OCR_PROC_Y + 70 + i * 18}
            textAnchor="middle"
            fontSize="9.5" fill={dp.tertiary}
            fontFamily={font}
          >
            {tag}
          </text>
        ))}

        {/* ═══════════════════════════════════════════════════
            STRUCTURED DOCUMENT REPRESENTATION  (hero block)
        ═══════════════════════════════════════════════════ */}
        <rect
          x={MERGE_X} y={MERGE_Y}
          width={MERGE_W} height={MERGE_H} rx={9}
          fill={dp.mergeBg}
        />
        {/* Subtle inner border */}
        <rect
          x={MERGE_X + 1} y={MERGE_Y + 1}
          width={MERGE_W - 2} height={MERGE_H - 2} rx={8}
          fill="none" stroke={dp.mergeInner} strokeWidth="1"
        />

        {/* Block label */}
        <text
          x={MERGE_X + MERGE_W / 2}
          y={MERGE_Y + 33}
          textAnchor="middle"
          fontSize="9" fontWeight="600" fill={dp.mergeLabel}
          letterSpacing="1.5"
          fontFamily={font}
        >
          STRUCTURED OUTPUT
        </text>
        <text
          x={MERGE_X + MERGE_W / 2}
          y={MERGE_Y + 56}
          textAnchor="middle"
          fontSize="13" fontWeight="700" fill={dp.mergeText}
          fontFamily={font}
          letterSpacing="-0.2"
        >
          Document
        </text>
        <text
          x={MERGE_X + MERGE_W / 2}
          y={MERGE_Y + 73}
          textAnchor="middle"
          fontSize="13" fontWeight="700" fill={dp.mergeText}
          fontFamily={font}
          letterSpacing="-0.2"
        >
          Representation
        </text>
        {/* Divider */}
        <line
          x1={MERGE_X + 18} y1={MERGE_Y + 86}
          x2={MERGE_RIGHT - 18} y2={MERGE_Y + 86}
          stroke={dp.mergeDivider} strokeWidth="1"
        />
        {/* Feature tags — stacked vertically */}
        {mergeTags.map((tag, i) => (
          <text
            key={`mt-${i}`}
            x={MERGE_X + MERGE_W / 2}
            y={MERGE_Y + 106 + i * 21}
            textAnchor="middle"
            fontSize="10" fill={dp.mergeSub}
            fontFamily={font}
          >
            {tag}
          </text>
        ))}

        {/* ═══════════════════════════════════════════════════
            OUTPUT CARDS
        ═══════════════════════════════════════════════════ */}
        {outputs.map((out, i) => (
          <g key={`oc-${i}`}>
            <rect
              x={OUT_X} y={outYs[i]}
              width={OUT_W} height={OUT_H} rx={INP_RX}
              fill={dp.cardFill} stroke={dp.borderLight} strokeWidth="1"
            />
            <text
              x={OUT_X + OUT_W / 2}
              y={outYs[i] + OUT_H / 2 + 4}
              textAnchor="middle"
              fontSize="10.5" fontWeight="500" fill={dp.body}
              fontFamily={font}
            >
              {out}
            </text>
          </g>
        ))}

        {/* Bottom caption under outputs */}
        <text
          x={(OUT_X + OUT_RIGHT) / 2}
          y={outYs[outYs.length - 1] + OUT_H + 16}
          textAnchor="middle"
          fontSize="8.5" fill={dp.muted}
          fontFamily={font}
        >
          Ready for search, automation, and AI
        </text>

        {/* ═══════════════════════════════════════════════════
            BOTTOM TAGLINE
        ═══════════════════════════════════════════════════ */}
        <text
          x={VB_W / 2} y={VB_H - 10}
          textAnchor="middle"
          fontSize="9" fill={dp.faint}
          fontFamily={font}
          letterSpacing="0.3"
          fontStyle="italic"
        >
          The right extraction path for each format
        </text>
      </svg>
    </div>
  );
}
