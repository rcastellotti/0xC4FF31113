import { render } from "preact";
import { useState } from "preact/hooks";
import repoQr from "./repo-qr.svg";

const D = [
  {
    id: "rbge",
    n: "Red Bull Green Edition",
    i: "R",
    c: "#14923a",
    ml: 250,
    caf: 80,
    sug: 11,
    d: "La Red Bull Green Edition offre il gusto del dragon fruit.",
  },
  {
    id: "mw",
    n: "Monster Ultra White",
    i: "M",
    c: "#ffffff",
    ml: 500,
    caf: 150,
    sug: 0,
    d: "Monster Energy Ultra ha un leggero sapore di agrumi rinfrescante.",
  },
  {
    id: "mufm",
    n: "Monster Ultra Fiesta Mango",
    i: "M",
    c: "#017574",
    ml: 500,
    caf: 150,
    sug: 0,
    d: "Ultra Fiesta Mango ha un fresco sapore di mango. ",
  },
];
const Q0 = { rbge: 6, mw: 3, mufm:2 };
const items = D.map((drink) => ({ ...drink, q: Q0[drink.id] || 0 }));

function Stat({ value, label }) {
  return (
    <div class="stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

function Summary({ items }) {
  const sum = (value) =>
    items.reduce((total, drink) => total + drink.q * value(drink), 0);
  const cells = [
    [sum(() => 1), "cans in the collection"],
    [items.filter((d) => d.q).length, "types owned"],
    [(sum((d) => d.ml) / 1000).toFixed(1) + " L", "total liquid"],
    [(sum((d) => d.caf) / 1000).toFixed(1) + " g", "total caffeine"],
    [Math.round(sum((d) => d.sug)) + " g", "total sugar"],
  ];
  return (
    <div class="summary">
      {cells.map(([value, label]) => (
        <Stat key={label} value={value} label={label} />
      ))}
    </div>
  );
}

function Shelf({ items, sel, pick }) {
  return (
    <div class="shelf" role="group" aria-label="Energy drinks">
      {items.map((d) => (
        <button
          key={d.id}
          class={
            "can" + (sel && sel !== d.id ? " dim" : "") + (d.q ? "" : " none")
          }
          style={"--c:" + d.c}
          aria-pressed={sel === d.id}
          aria-label={d.n + ", " + d.q + " in collection"}
          onClick={() => pick(d.id)}
        >
          <span class="tin">
            {d.i}
            <small>{d.ml} ml</small>
            <span class="cnt">{d.q}</span>
          </span>
          {d.n}
          <span class="caf">{d.caf} mg caffeine</span>
        </button>
      ))}
    </div>
  );
}

function Detail({ d }) {
  if (!d) {
    return (
      <div class="detail" style="--c:var(--line)">
        <h3>Drink details</h3>
        <p>Select a can above to see its numbers.</p>
      </div>
    );
  }
  const per100 = Math.round((d.caf / d.ml) * 1000) / 10;
  return (
    <div class="detail" style={"--c:" + d.c} aria-live="polite">
      <h3>{d.n}</h3>
      <p>{d.d}</p>
      <Stat value={d.caf + " mg"} label="caffeine per serving" />
      <Stat value={d.sug + " g"} label="sugar per serving" />
      <Stat value={d.ml + " ml"} label="serving size" />
      <Stat value={per100 + " mg"} label="caffeine per 100 ml" />
      <Stat value={d.q} label="in the collection" />
    </div>
  );
}

function Collection({ items, sel, pick }) {
  return (
    <div class="chartbox">
      {items.map((d) => (
        <div
          key={d.id}
          class={"crow" + (sel === d.id ? " on" : "")}
          style={"--c:" + d.c}
        >
          <button
            class="nm"
            aria-pressed={sel === d.id}
            onClick={() => pick(d.id)}
          >
            {d.n}
          </button>
          <div class="pics" role="img" aria-label={d.q + " cans"}>
            {d.q ? (
              Array.from({ length: d.q }, (_, i) => <i class="mini" key={i} />)
            ) : (
              <span class="zero">None yet</span>
            )}
          </div>
          <span class="qty" aria-label={d.q + " in the collection"}>
            {d.q}
          </span>
        </div>
      ))}
    </div>
  );
}

function Scatter({ items, sel, pick }) {
  const W = 640;
  const H = 390;
  const m = { l: 44, r: 20, t: 14, b: 52 };
  const X = (v) => m.l + (v / 320) * (W - m.l - m.r);
  const Y = (v) => H - m.b - ((v + 10) / 78) * (H - m.t - m.b);
  const offsets = { hr: -22, cel: 36, rbsf: -18, ultra: -18 };
  const bubbles = [...items].sort((a, b) => b.ml - a.ml);

  return (
    <div class="chartbox">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Bubble chart of caffeine against sugar per serving"
      >
        {[0, 20, 40, 60].map((v) => (
          <g key={v}>
            <line
              x1={m.l}
              x2={W - m.r}
              y1={Y(v)}
              y2={Y(v)}
              stroke="var(--line)"
            />
            <text x={m.l - 8} y={Y(v) + 3} text-anchor="end">
              {v}
            </text>
          </g>
        ))}
        {[0, 50, 100, 150, 200, 250, 300].map((v) => (
          <text key={v} x={X(v)} y={H - m.b + 18} text-anchor="middle">
            {v}
          </text>
        ))}
        <text x={(W + m.l) / 2} y={H - 8} text-anchor="middle">
          Caffeine per serving (mg)
        </text>
        <text
          x="10"
          y={H / 2}
          transform={`rotate(-90 10 ${H / 2})`}
          text-anchor="middle"
        >
          Sugar per serving (g)
        </text>
        {[63, 200].map((v) => (
          <line
            key={v}
            x1={X(v)}
            x2={X(v)}
            y1={m.t}
            y2={H - m.b}
            stroke="var(--ink)"
            stroke-dasharray="3 4"
            opacity=".5"
          />
        ))}
        {bubbles.map((d) => {
          const r = 6 + Math.sqrt(d.ml) * 1.15;
          const cx = X(d.caf);
          const cy = Y(d.sug);
          return (
            <g
              key={d.id}
              class="bubble"
              tabindex="0"
              role="button"
              aria-label={
                d.n + ": " + d.caf + " mg caffeine, " + d.sug + " g sugar"
              }
              opacity={sel && sel !== d.id ? 0.25 : d.q ? 1 : 0.4}
              onClick={() => pick(d.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  pick(d.id);
                }
              }}
            >
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={d.c}
                fill-opacity=".85"
                stroke={sel === d.id ? "var(--ink)" : "var(--surface)"}
                stroke-width={sel === d.id ? 3 : 1.5}
              />
              <text
                class="lbl"
                x={cx}
                y={cy + (offsets[d.id] ?? -r - 6)}
                text-anchor="middle"
              >
                {d.n}
              </text>
            </g>
          );
        })}
      </svg>
      <div class="legend">
        <span>Bubble size = can size</span>
      </div>
    </div>
  );
}

function Bars({ items, sel, pick }) {
  const max = 320;
  return (
    <div class="chartbox">
      {[...items]
        .sort((a, b) => b.caf - a.caf)
        .map((d) => (
          <button
            key={d.id}
            class={"row" + (sel === d.id ? " on" : "")}
            style={"--c:" + d.c}
            aria-pressed={sel === d.id}
            onClick={() => pick(d.id)}
          >
            <span>{d.n}</span>
            <span class="track">
              <span class="fill" style={{ width: (d.caf / max) * 100 + "%" }} />
              <i class="ref" style={{ left: (63 / max) * 100 + "%" }} />
              <i class="ref" style={{ left: (200 / max) * 100 + "%" }} />
            </span>
            <span class="val">{d.caf} mg</span>
          </button>
        ))}
      <div class="legend">
        <span>| one espresso, 63 mg</span>
        <span>|| 200 mg single-dose guidance</span>
      </div>
    </div>
  );
}

function App() {
  const [sel, setSel] = useState(null);
  const pick = (id) => setSel((current) => (current === id ? null : id));

  return (
    <main>
      <h1>DB00201 - 0xc4ff31113 please</h1>
      <p class="lede">if you are reading this send energy drinks please !!!</p>
      <Summary items={items} />
      <Shelf items={items} sel={sel} pick={pick} />
      <div class="print-hidden">
        <Detail d={items.find((d) => d.id === sel)} />
      </div>
      <h2>How many are in the collection</h2>
      <Collection items={items} sel={sel} pick={pick} />
      <section class="print-only contribute">
        <div class="contribute-copy">
          <h2>Want to add a drink? send a PR</h2>
          <a class="repo-link" href="https://github.com/rcastellotti/0xC4FF3III3">https://github.com/rcastellotti/0xC4FF3III3</a>
          <a class="repo-link" href="https://rcastellotti.github.io/0xC4FF3III3">https://rcastellotti.github.io/0xC4FF3III3</a>
          <div class="write-in" aria-hidden="true"></div>
        </div>
        <a href="https://github.com/rcastellotti/0xC4FF3III3" aria-label="Open the energy drink collection GitHub repository">
          <img class="repo-qr" src={repoQr} alt="QR code for the energy drink collection GitHub repository" />
        </a>
      </section>
      <section class="print-hidden">
        <h2>Caffeine against sugar</h2>
        <Scatter items={items} sel={sel} pick={pick} />
        <h2>Caffeine per serving</h2>
        <Bars items={items} sel={sel} pick={pick} />
      </section>
    </main>
  );
}

render(<App />, document.getElementById("app"));
