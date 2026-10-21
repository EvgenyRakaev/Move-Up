import { Route } from "lucide-react";

// Stylised route map from the Figma frame (680 x 156 reference box).
const W = 680;
const x = (px: number) => `${(px / W) * 100}%`;

const segments = [
  { left: 112, top: 110, w: 55, h: 4 },
  { left: 163, top: 92, w: 4, h: 22 },
  { left: 163, top: 90, w: 194, h: 4 },
  { left: 353, top: 35, w: 4, h: 59 },
  { left: 353, top: 33, w: 190, h: 4 },
  { left: 539, top: 35, w: 4, h: 23 },
];

export function RouteMap({ from, to, distance }: { from: string; to: string; distance: string }) {
  return (
    <div className="relative h-[156px] w-full overflow-hidden rounded-lg bg-map">
      <div className="absolute top-[18px] h-[72px] rounded-xl bg-park" style={{ left: x(215), width: x(116) }} />
      <div className="absolute top-[108px] h-[64px] rounded-[10px] bg-park" style={{ left: x(484), width: x(140) }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/street-network.png"
        alt=""
        className="absolute"
        style={{ top: "17.44%", right: "11.03%", bottom: "13.02%", left: "8.24%", width: "80.73%", height: "69.54%" }}
      />
      {segments.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-[2px] bg-brand"
          style={{ left: x(s.left), top: s.top, width: s.w === 4 ? 4 : x(s.w), height: s.h }}
        />
      ))}
      <span
        className="absolute flex size-[26px] items-center justify-center rounded-full border-2 border-white bg-brand text-[11px] font-bold text-white"
        style={{ left: `calc(${x(112)} - 13px)`, top: 99 }}
      >
        1
      </span>
      <span
        className="absolute flex size-[26px] items-center justify-center rounded-full border-2 border-white bg-success text-[11px] font-bold text-white"
        style={{ left: `calc(${x(541)} - 13px)`, top: 45 }}
      >
        2
      </span>
      <span className="absolute top-[64px] text-[11px] text-muted uppercase" style={{ left: x(74) }}>
        {from}
      </span>
      <span className="absolute top-[79px] text-[11px] text-muted uppercase" style={{ left: x(486) }}>
        {to}
      </span>
      <span
        className="absolute top-[115px] flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-[10px] font-semibold whitespace-nowrap text-ink"
        style={{ left: x(275) }}
      >
        <Route size={13} className="text-brand" />
        {distance}
      </span>
    </div>
  );
}
