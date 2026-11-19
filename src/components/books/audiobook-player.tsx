"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { Icon } from "../icons";

// Audiobook player (instructions §7.1): chapter selection, play/pause, progress and speed. The
// recording streams from a media service (e.g. a Supabase Storage or Cloudflare R2 public bucket),
// not from the website's own server. Listening position is remembered on this device.

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const time = (s: number) => {
  if (!Number.isFinite(s)) return "0:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return h ? `${h}:${m.toString().padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};

export function AudiobookPlayer({ slug, title, src, chapters = [] }: { slug: string; title: string; src: string; chapters?: { title: string; start: number }[] }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const started = useRef(false);
  const reached = useRef(new Set<number>());
  const key = `cmf:audio:${slug}`;

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    try {
      const saved = Number(window.localStorage.getItem(key));
      if (saved > 0) a.currentTime = saved;
    } catch {}
  }, [key]);

  const chapterIndex = chapters.reduce((i, c, j) => (current >= c.start ? j : i), 0);

  const onTime = () => {
    const a = audio.current!;
    setCurrent(a.currentTime);
    try {
      window.localStorage.setItem(key, String(Math.floor(a.currentTime)));
    } catch {}
    if (a.duration) {
      const p = (a.currentTime / a.duration) * 100;
      for (const m of [25, 50, 75, 100]) {
        if (p >= m - 0.5 && !reached.current.has(m)) {
          reached.current.add(m);
          track("audiobook_progress", { book: slug, percent: m });
        }
      }
    }
  };

  const toggle = () => {
    const a = audio.current!;
    if (a.paused) {
      a.play();
      if (!started.current) {
        started.current = true;
        track("audiobook_start", { book: slug });
      }
    } else a.pause();
  };

  return (
    <div className="tile p-5 sm:p-6">
      <audio
        ref={audio}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={onTime}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <div className="flex items-center gap-4">
        <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="flex size-14 shrink-0 items-center justify-center rounded-full bg-bronze text-white hover:bg-bronze-dark">
          {playing ? (
            <span aria-hidden="true" className="flex gap-1">
              <span className="h-5 w-1.5 bg-white" />
              <span className="h-5 w-1.5 bg-white" />
            </span>
          ) : (
            <span aria-hidden="true" className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg text-ink">{chapters[chapterIndex]?.title ?? title}</p>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={current}
            onChange={(e) => {
              audio.current!.currentTime = Number(e.target.value);
            }}
            aria-label="Position in the recording"
            className="mt-2 w-full accent-[var(--color-bronze)]"
          />
          <p className="flex justify-between text-xs text-muted tabular-nums">
            <span>{time(current)}</span>
            <span>{time(duration)}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <button type="button" onClick={() => (audio.current!.currentTime = Math.max(0, current - 15))} className="flex items-center gap-1 rounded border border-line px-3 py-1.5">
          <Icon name="chevronLeft" className="size-3.5" /> 15s
        </button>
        <button type="button" onClick={() => (audio.current!.currentTime = current + 30)} className="flex items-center gap-1 rounded border border-line px-3 py-1.5">
          30s <Icon name="chevronRight" className="size-3.5" />
        </button>
        <label className="ml-auto flex items-center gap-2">
          Speed
          <select
            value={speed}
            onChange={(e) => {
              const v = Number(e.target.value);
              setSpeed(v);
              audio.current!.playbackRate = v;
            }}
            className="rounded border border-line bg-white px-2 py-1"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </label>
      </div>
      {chapters.length > 0 && (
        <ol className="mt-5 max-h-64 overflow-y-auto border-t border-line pt-3 text-sm">
          {chapters.map((c, i) => (
            <li key={c.title}>
              <button
                type="button"
                onClick={() => {
                  audio.current!.currentTime = c.start;
                  if (audio.current!.paused) toggle();
                }}
                aria-current={i === chapterIndex ? "true" : undefined}
                className="flex w-full justify-between gap-3 rounded px-2 py-1.5 text-left hover:bg-blush aria-[current]:font-semibold aria-[current]:text-bronze"
              >
                <span>{c.title}</span>
                <span className="text-muted tabular-nums">{time(c.start)}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
