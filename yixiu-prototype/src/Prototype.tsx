import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  Cross2Icon,
  HamburgerMenuIcon,
  HeartFilledIcon,
  HeartIcon,
  PauseIcon,
  PersonIcon,
  PlayIcon,
  SpeakerLoudIcon,
  SpeakerQuietIcon,
  TrackNextIcon,
  TrackPreviousIcon,
} from "@radix-ui/react-icons";

type Language = "zh" | "en";
type RootTab = "sounds" | "focus" | "me";
type SceneId = "ocean" | "rain" | "stream" | "lake" | "falls" | "tide";
type DurationOption = 15 | 30 | 60 | 0;
type BreathingStatus = "idle" | "running" | "paused" | "complete";
type InfoPanel = "privacy" | "support" | "philosophy" | null;

type SwipeStart = {
  pointerId: number;
  x: number;
  y: number;
  axis: "horizontal" | "vertical" | null;
};

type Scene = {
  id: SceneId;
  zh: string;
  en: string;
  useZh: string;
  useEn: string;
  image: string;
  filter: BiquadFilterType;
  frequency: number;
  level: number;
  lfoRate?: number;
  lfoDepth?: number;
};

const scenes: Record<SceneId, Scene> = {
  ocean: {
    id: "ocean",
    zh: "大海",
    en: "Ocean Waves",
    useZh: "放松 · 睡眠",
    useEn: "Relax · Sleep",
    image: "/assets/yixiu/deep-ocean-hero.png",
    filter: "lowpass",
    frequency: 520,
    level: 0.08,
    lfoRate: 0.12,
    lfoDepth: 0.025,
  },
  rain: {
    id: "rain",
    zh: "屋檐雨",
    en: "Rain on Eaves",
    useZh: "睡眠 · 阅读",
    useEn: "Sleep · Read",
    image: "/assets/yixiu/rain.jpg",
    filter: "highpass",
    frequency: 900,
    level: 0.052,
    lfoRate: 0.42,
    lfoDepth: 0.008,
  },
  stream: {
    id: "stream",
    zh: "山间溪流",
    en: "Mountain Stream",
    useZh: "工作 · 专注",
    useEn: "Work · Focus",
    image: "/assets/yixiu/stream.jpg",
    filter: "bandpass",
    frequency: 1500,
    level: 0.05,
    lfoRate: 0.7,
    lfoDepth: 0.006,
  },
  lake: {
    id: "lake",
    zh: "晨雾湖岸",
    en: "Morning Lake",
    useZh: "清晨 · 冥想",
    useEn: "Morning · Meditate",
    image: "/assets/yixiu/morning-lake.png",
    filter: "lowpass",
    frequency: 720,
    level: 0.045,
    lfoRate: 0.08,
    lfoDepth: 0.012,
  },
  falls: {
    id: "falls",
    zh: "林间瀑布",
    en: "Forest Falls",
    useZh: "遮噪 · 放松",
    useEn: "Mask · Relax",
    image: "/assets/yixiu/forest-falls.png",
    filter: "lowpass",
    frequency: 1250,
    level: 0.055,
    lfoRate: 0.34,
    lfoDepth: 0.01,
  },
  tide: {
    id: "tide",
    zh: "夜潮",
    en: "Night Tide",
    useZh: "深度睡眠",
    useEn: "Deep Sleep",
    image: "/assets/yixiu/night-tide.png",
    filter: "lowpass",
    frequency: 390,
    level: 0.068,
    lfoRate: 0.07,
    lfoDepth: 0.02,
  },
};

const sceneOrder: SceneId[] = ["ocean", "rain", "stream", "lake", "falls", "tide"];
const durations: DurationOption[] = [15, 30, 60, 0];

const wisdoms = [
  { zh: "水不争先，却从未停止。", en: "Water does not hurry, yet it keeps moving." },
  { zh: "慢下来，才能听见自己。", en: "Slow down enough to hear yourself." },
  { zh: "接纳此刻，如水接纳形状。", en: "Meet this moment as water meets its form." },
  { zh: "柔软不是退让，而是另一种力量。", en: "Softness is not surrender. It is another kind of strength." },
];

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? fallback : JSON.parse(stored) as T;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function WaterWavesIcon() {
  return (
    <svg className="water-waves-icon" viewBox="0 0 28 24" aria-hidden="true">
      <path d="M1 4.5c3.4-3 6.7-3 10.1 0s6.7 3 10.1 0 5.7-2.6 6.8-1.7" />
      <path d="M1 11.5c3.4-3 6.7-3 10.1 0s6.7 3 10.1 0 5.7-2.6 6.8-1.7" />
      <path d="M1 18.5c3.4-3 6.7-3 10.1 0s6.7 3 10.1 0 5.7-2.6 6.8-1.7" />
    </svg>
  );
}

type AudioGraph = {
  context: AudioContext;
  source: AudioBufferSourceNode;
  gain: GainNode;
  lfo?: OscillatorNode;
};

function stopAudioGraph(graph: AudioGraph | null) {
  if (!graph) return;
  try {
    graph.source.stop();
    graph.lfo?.stop();
  } catch {
    // The graph may already be stopped while React is cleaning up.
  }
  void graph.context.close();
}

function useAmbientSound(sceneId: SceneId, isPlaying: boolean, volume: number, fadeFactor: number) {
  const graphRef = useRef<AudioGraph | null>(null);

  useEffect(() => {
    stopAudioGraph(graphRef.current);
    graphRef.current = null;
    if (!isPlaying || typeof AudioContext === "undefined") return;

    const context = new AudioContext();
    const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = Math.random() * 2 - 1;
    }

    const scene = scenes[sceneId];
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    let lfo: OscillatorNode | undefined;

    source.buffer = buffer;
    source.loop = true;
    filter.type = scene.filter;
    filter.frequency.value = scene.frequency;
    filter.Q.value = sceneId === "stream" ? 0.7 : 1;
    gain.gain.value = (volume / 100) * scene.level * fadeFactor;

    if (scene.lfoRate && scene.lfoDepth) {
      lfo = context.createOscillator();
      const lfoGain = context.createGain();
      lfo.frequency.value = scene.lfoRate;
      lfoGain.gain.value = scene.lfoDepth;
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();
    }

    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
    void context.resume().catch(() => undefined);
    graphRef.current = { context, source, gain, lfo };

    return () => {
      stopAudioGraph(graphRef.current);
      graphRef.current = null;
    };
  }, [isPlaying, sceneId]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;
    const scene = scenes[sceneId];
    graph.gain.gain.setTargetAtTime(
      (volume / 100) * scene.level * fadeFactor,
      graph.context.currentTime,
      0.08,
    );
  }, [fadeFactor, sceneId, volume]);
}

function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function durationLabel(duration: DurationOption, language: Language) {
  if (duration === 0) return language === "zh" ? "不限时" : "UNLIMITED";
  return `${duration} ${language === "zh" ? "分钟" : "MIN"}`;
}

function BottomNavigation({ activeTab, language, onChange }: {
  activeTab: RootTab;
  language: Language;
  onChange: (tab: RootTab) => void;
}) {
  const items: Array<{ id: RootTab; zh: string; en: string; icon: React.ReactNode }> = [
    { id: "sounds", zh: "声音", en: "SOUNDS", icon: <WaterWavesIcon /> },
    { id: "focus", zh: "静心", en: "FOCUS", icon: <ClockIcon /> },
    { id: "me", zh: "我的", en: "ME", icon: <PersonIcon /> },
  ];

  return (
    <nav className="bottom-nav" aria-label={language === "zh" ? "主导航" : "Main navigation"}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={activeTab === item.id ? "is-active" : ""}
          aria-current={activeTab === item.id ? "page" : undefined}
          onClick={() => onChange(item.id)}
        >
          {item.icon}
          <span>{language === "zh" ? item.zh : item.en[0] + item.en.slice(1).toLowerCase()}</span>
          <small>{language === "zh" ? item.en : item.zh}</small>
        </button>
      ))}
    </nav>
  );
}

export default function Prototype() {
  const [language, setLanguage] = useStoredState<Language>("yixiu.language", "zh");
  const [activeScene, setActiveScene] = useStoredState<SceneId>("yixiu.scene", "ocean");
  const [duration, setDuration] = useStoredState<DurationOption>("yixiu.duration", 30);
  const [favorites, setFavorites] = useStoredState<SceneId[]>("yixiu.favorites", []);
  const [endBell, setEndBell] = useStoredState<boolean>("yixiu.endBell", false);
  const [backgroundPlayback, setBackgroundPlayback] = useStoredState<boolean>("yixiu.backgroundPlayback", true);
  const [activeTab, setActiveTab] = useState<RootTab>("sounds");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(62);
  const [remainingSeconds, setRemainingSeconds] = useState(duration === 0 ? 0 : duration * 60);
  const [menuOpen, setMenuOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [wisdomOpen, setWisdomOpen] = useState(false);
  const [wisdomIndex, setWisdomIndex] = useState(0);
  const [breathingStatus, setBreathingStatus] = useState<BreathingStatus>("idle");
  const [breathingElapsed, setBreathingElapsed] = useState(0);
  const [infoPanel, setInfoPanel] = useState<InfoPanel>(null);
  const swipeStartRef = useRef<SwipeStart | null>(null);
  const swipeSettleTimerRef = useRef<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeSettling, setSwipeSettling] = useState(false);

  const active = scenes[activeScene] ?? scenes.ocean;
  const activeIndex = sceneOrder.indexOf(active.id);
  const previousScene = scenes[sceneOrder[(activeIndex - 1 + sceneOrder.length) % sceneOrder.length]];
  const nextScene = scenes[sceneOrder[(activeIndex + 1) % sceneOrder.length]];
  const swipePreviewScene = swipeOffset < 0 ? nextScene : previousScene;
  const isFavorite = favorites.includes(active.id);
  const fadeFactor = duration === 0 || remainingSeconds > 20 ? 1 : Math.max(remainingSeconds / 20, 0);

  useAmbientSound(active.id, isPlaying, volume, fadeFactor);

  useEffect(() => {
    setRemainingSeconds(duration === 0 ? 0 : duration * 60);
  }, [duration]);

  useEffect(() => {
    if (!isPlaying || duration === 0) return;
    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current > 1) return current - 1;
        window.clearInterval(interval);
        setIsPlaying(false);
        setWisdomIndex((index) => (index + 1) % wisdoms.length);
        setWisdomOpen(true);
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [duration, isPlaying]);

  useEffect(() => {
    if (breathingStatus !== "running") return;
    const interval = window.setInterval(() => {
      setBreathingElapsed((current) => {
        if (current >= 59) {
          setBreathingStatus("complete");
          window.clearInterval(interval);
          return 60;
        }
        return current + 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [breathingStatus]);

  useEffect(() => {
    if (activeTab !== "focus" && breathingStatus === "running") {
      setBreathingStatus("paused");
    }
    setMenuOpen(false);
    setTimerOpen(false);
    setLibraryOpen(false);
  }, [activeTab, breathingStatus]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => () => {
    if (swipeSettleTimerRef.current !== null) {
      window.clearTimeout(swipeSettleTimerRef.current);
    }
  }, []);

  const localized = useMemo(
    () => ({
      scenePrimary: language === "zh" ? active.zh : active.en,
      sceneSecondary: language === "zh" ? active.en : active.zh,
      philosophyPrimary: language === "zh" ? "如水而行" : "Be water, my friend.",
      philosophySecondary: language === "zh" ? "BE WATER, MY FRIEND." : "如水而行",
    }),
    [active, language],
  );

  const moveScene = (direction: -1 | 1) => {
    const nextIndex = (activeIndex + direction + sceneOrder.length) % sceneOrder.length;
    setActiveScene(sceneOrder[nextIndex]);
  };

  const startSceneSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || swipeSettling) return;
    swipeStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      axis: null,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic pointer events may not have an active browser pointer to capture.
    }
  };

  const moveSceneSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start || start.pointerId !== event.pointerId || swipeSettling) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (start.axis === null && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 8) {
      start.axis = Math.abs(deltaX) > Math.abs(deltaY) * 1.15 ? "horizontal" : "vertical";
    }
    if (start.axis !== "horizontal") return;

    event.preventDefault();
    const width = Math.max(event.currentTarget.clientWidth, 1);
    const limitedOffset = Math.max(-width * 0.72, Math.min(width * 0.72, deltaX));
    setSwipeOffset(limitedOffset);
    setSwipeProgress(Math.min(Math.abs(limitedOffset) / (width * 0.62), 1));
  };

  const resetSceneSwipe = () => {
    setSwipeSettling(true);
    setSwipeOffset(0);
    setSwipeProgress(0);
    swipeSettleTimerRef.current = window.setTimeout(() => {
      setSwipeSettling(false);
      swipeSettleTimerRef.current = null;
    }, 220);
  };

  const finishSceneSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start || start.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const isHorizontalSwipe = Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
    if (!isHorizontalSwipe) {
      resetSceneSwipe();
      return;
    }

    const width = Math.max(event.currentTarget.clientWidth, 1);
    const direction = deltaX < 0 ? 1 : -1;
    setSwipeSettling(true);
    setSwipeOffset(direction === 1 ? -width : width);
    setSwipeProgress(1);
    swipeSettleTimerRef.current = window.setTimeout(() => {
      moveScene(direction);
      setSwipeOffset(0);
      setSwipeProgress(0);
      setSwipeSettling(false);
      swipeSettleTimerRef.current = null;
    }, 260);
  };

  const toggleFavorite = (sceneId: SceneId) => {
    setFavorites((current) => current.includes(sceneId)
      ? current.filter((item) => item !== sceneId)
      : [...current, sceneId]);
  };

  const selectDuration = (minutes: DurationOption) => {
    setDuration(minutes);
    setRemainingSeconds(minutes === 0 ? 0 : minutes * 60);
    setTimerOpen(false);
  };

  const selectScene = (sceneId: SceneId, play = true) => {
    setActiveScene(sceneId);
    setActiveTab("sounds");
    setLibraryOpen(false);
    if (play) setIsPlaying(true);
  };

  const changeTab = (tab: RootTab) => {
    if (tab !== "sounds") setIsPlaying(false);
    if (tab === "sounds" && activeTab === "sounds") {
      setLibraryOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const breathingCycleSecond = breathingElapsed % 12;
  const breathingPhase = breathingStatus === "complete"
    ? "complete"
    : breathingCycleSecond < 4
      ? "inhale"
      : breathingCycleSecond < 6
        ? "hold"
        : "exhale";

  const breathingPhaseCopy = {
    inhale: language === "zh" ? "吸气" : "Breathe in",
    hold: language === "zh" ? "停留" : "Hold",
    exhale: language === "zh" ? "呼气" : "Breathe out",
    complete: language === "zh" ? "完成" : "Complete",
  }[breathingPhase];

  return (
    <main
      className={`yixiu-app ${swipeSettling ? "is-swipe-settling" : ""}`}
      data-language={language}
      data-scene={active.id}
      data-tab={activeTab}
    >
      {activeTab === "sounds" && swipeOffset !== 0 ? (
        <img
          className="ocean-backdrop scene-preview-backdrop"
          src={swipePreviewScene.image}
          data-image-scene={swipePreviewScene.id}
          alt=""
          draggable={false}
          style={{
            opacity: swipeProgress,
            transform: `translate3d(${(swipeOffset < 0 ? 1 : -1) * (1 - swipeProgress) * 11}%, 0, 0) scale(${1.035 - swipeProgress * 0.035})`,
          }}
        />
      ) : null}
      <img
        className="ocean-backdrop scene-current-backdrop"
        src={activeTab === "focus" ? scenes.lake.image : activeTab === "me" ? scenes.tide.image : active.image}
        data-image-scene={activeTab === "focus" ? "lake" : activeTab === "me" ? "tide" : active.id}
        alt=""
        draggable={false}
        style={activeTab === "sounds" ? {
          opacity: 1 - swipeProgress * 0.9,
          transform: `translate3d(${swipeOffset * 0.16}px, 0, 0) scale(${1 - swipeProgress * 0.025})`,
        } : undefined}
      />
      <div className="ocean-shade" aria-hidden="true" />

      <header className="player-header">
        <div className="brand-button">
          <span>{language === "zh" ? "一休" : "YIXIU"}</span>
          <small>{language === "zh" ? "YIXIU" : "一休"}</small>
        </div>
        <div className="header-actions">
          <button
            className="header-language-toggle"
            type="button"
            aria-label={language === "zh" ? "切换到英文" : "Switch to Chinese"}
            onClick={() => setLanguage((current) => current === "zh" ? "en" : "zh")}
          >
            {language === "zh" ? "EN" : "中文"}
          </button>
          <button
            className="icon-button menu-button"
            type="button"
            aria-label={language === "zh" ? "打开菜单" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              setTimerOpen(false);
              setLibraryOpen(false);
              setMenuOpen(true);
            }}
          >
            <HamburgerMenuIcon />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="yixiu-drawer-layer">
          <button
            className="yixiu-drawer-backdrop"
            type="button"
            aria-label={language === "zh" ? "关闭菜单" : "Close menu"}
            onClick={() => setMenuOpen(false)}
          />
          <aside className="yixiu-side-drawer" role="dialog" aria-modal="true" aria-labelledby="yixiu-drawer-title">
            <header className="yixiu-drawer-header">
              <span className="yixiu-drawer-orbit" aria-hidden="true"><WaterWavesIcon /></span>
              <div>
                <span className="yixiu-drawer-brand">一休 · YIXIU</span>
                <h2 id="yixiu-drawer-title">{language === "zh" ? "你的空间" : "Your space"}</h2>
              </div>
              <button className="yixiu-drawer-close" type="button" aria-label={language === "zh" ? "关闭菜单" : "Close menu"} onClick={() => setMenuOpen(false)}>×</button>
            </header>

            <div className="yixiu-drawer-scroll">
              <section className="yixiu-drawer-hero">
                <small>{language === "zh" ? "六种水声" : "SIX WATERS"}</small>
                <h3>{language === "zh" ? "让声音带你回到此刻" : "Let sound return you to now"}</h3>
                <p>{language === "zh" ? `正在聆听的场景：${active.zh}` : `Current water: ${active.en}`}</p>
                <button type="button" onClick={() => {
                  setMenuOpen(false);
                  setActiveTab("sounds");
                  setLibraryOpen(true);
                }}>
                  <WaterWavesIcon />
                  {language === "zh" ? "浏览全部声音" : "Browse all sounds"}
                </button>
              </section>

              <nav className="yixiu-drawer-nav" aria-label={language === "zh" ? "你的空间" : "Your space"}>
                <button type="button" onClick={() => {
                  setMenuOpen(false);
                  setActiveTab("sounds");
                  setTimerOpen(true);
                }}>
                  <span className="yixiu-drawer-nav-icon"><ClockIcon /></span>
                  <span><strong>{language === "zh" ? "默认定时" : "Default timer"}</strong><small>{durationLabel(duration, language)}</small></span>
                  <ChevronRightIcon />
                </button>
                <div className="yixiu-drawer-nav-row">
                  <span className="yixiu-drawer-nav-icon"><SpeakerLoudIcon /></span>
                  <span><strong>{language === "zh" ? "后台播放" : "Background playback"}</strong><small>{language === "zh" ? "离开画面，水声仍可继续" : "Keep the water flowing off-screen"}</small></span>
                  <button className={`switch-control ${backgroundPlayback ? "is-active" : ""}`} role="switch" type="button" aria-label={language === "zh" ? "后台播放" : "Background playback"} aria-checked={backgroundPlayback} onClick={() => setBackgroundPlayback((current) => !current)}><i /></button>
                </div>
                <button type="button" onClick={() => { setMenuOpen(false); setInfoPanel("philosophy"); }}>
                  <span className="yixiu-drawer-nav-icon">水</span>
                  <span><strong>{language === "zh" ? "产品哲学" : "Our philosophy"}</strong><small>{language === "zh" ? "真实自己，流动人生" : "True to yourself, flow with life"}</small></span>
                  <ChevronRightIcon />
                </button>
                <button type="button" onClick={() => { setMenuOpen(false); setInfoPanel("privacy"); }}>
                  <span className="yixiu-drawer-nav-icon">静</span>
                  <span><strong>{language === "zh" ? "隐私说明" : "Privacy"}</strong><small>{language === "zh" ? "偏好只保存在这台设备" : "Preferences stay on this device"}</small></span>
                  <ChevronRightIcon />
                </button>
                <button type="button" onClick={() => { setMenuOpen(false); setInfoPanel("support"); }}>
                  <span className="yixiu-drawer-nav-icon">问</span>
                  <span><strong>{language === "zh" ? "支持与反馈" : "Support"}</strong><small>wonderelian.com</small></span>
                  <ChevronRightIcon />
                </button>
              </nav>

              <p className="yixiu-drawer-footnote">{language === "zh" ? "向内认识自己，向外如水而行。" : "Know yourself within. Move like water without."}</p>
            </div>
          </aside>
        </div>
      ) : null}

      {activeTab === "sounds" ? (
        <section className="sounds-screen" aria-label={language === "zh" ? "声音播放器" : "Sound player"}>
          <div
            className="scene-swipe-zone"
            aria-hidden="true"
            onPointerDown={startSceneSwipe}
            onPointerMove={moveSceneSwipe}
            onPointerUp={finishSceneSwipe}
            onPointerCancel={() => {
              swipeStartRef.current = null;
              resetSceneSwipe();
            }}
          />
          <section
            className="scene-identity"
            aria-live="polite"
            style={{
              opacity: 1 - swipeProgress * 0.55,
              transform: `translate3d(${swipeOffset * 0.12}px, -50%, 0)`,
            }}
          >
            <h1>{localized.scenePrimary}</h1>
            <p className="scene-english">{localized.sceneSecondary}</p>
            <p className="scene-philosophy">
              <span>{localized.philosophyPrimary}</span>
              <i aria-hidden="true">·</i>
              <em>{localized.philosophySecondary}</em>
            </p>
          </section>

          <section className="transport" aria-label={language === "zh" ? "播放控制" : "Playback controls"}>
            <button className={`icon-button favorite-button ${isFavorite ? "is-active" : ""}`} type="button" aria-label={language === "zh" ? "收藏" : "Favorite"} aria-pressed={isFavorite} onClick={() => toggleFavorite(active.id)}>
              {isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
            </button>
            <button className="icon-button transport-skip" type="button" aria-label={language === "zh" ? "上一种声音" : "Previous sound"} onClick={() => moveScene(-1)}>
              <TrackPreviousIcon />
            </button>
            <button className={`primary-transport ${isPlaying ? "is-playing" : ""}`} type="button" aria-label={isPlaying ? (language === "zh" ? "暂停" : "Pause") : language === "zh" ? "播放" : "Play"} aria-pressed={isPlaying} onClick={() => setIsPlaying((current) => !current)}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="icon-button transport-skip" type="button" aria-label={language === "zh" ? "下一种声音" : "Next sound"} onClick={() => moveScene(1)}>
              <TrackNextIcon />
            </button>
            <button className="icon-button timer-shortcut" type="button" aria-label={language === "zh" ? "定时" : "Timer"} aria-expanded={timerOpen} onClick={() => {
              setMenuOpen(false);
              setTimerOpen((current) => !current);
            }}>
              <ClockIcon />
            </button>
          </section>

          <section className="volume-control" aria-label={language === "zh" ? "音量" : "Volume"}>
            <SpeakerQuietIcon />
            <input aria-label={language === "zh" ? "音量" : "Volume"} type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.currentTarget.value))} />
            <SpeakerLoudIcon />
          </section>

          <button className="duration-button" type="button" aria-expanded={timerOpen} onClick={() => {
            setMenuOpen(false);
            setTimerOpen((current) => !current);
          }}>
            <span>{isPlaying && duration !== 0 ? formatSeconds(remainingSeconds) : durationLabel(duration, language)}</span>
            <ChevronDownIcon />
          </button>
        </section>
      ) : null}

      {activeTab === "focus" ? (
        <section className="focus-screen" aria-label={language === "zh" ? "水之呼吸" : "Water breathing"}>
          <div className="section-kicker">{language === "zh" ? "静心 · FOCUS" : "FOCUS · 静心"}</div>
          <h1>{language === "zh" ? "水之呼吸" : "Water Breathing"}</h1>
          <p className="section-intro">{language === "zh" ? "吸气，停驻，流动" : "Breathe in, pause, flow"}</p>

          <div className={`breathing-orbit phase-${breathingPhase} status-${breathingStatus}`} aria-hidden="true">
            <span className="ripple ripple-one" />
            <span className="ripple ripple-two" />
            <span className="breathing-core" />
          </div>

          <div className="breathing-readout" aria-live="polite">
            <strong>{breathingPhaseCopy}</strong>
            <span>{formatSeconds(Math.max(60 - breathingElapsed, 0))}</span>
          </div>

          {breathingStatus === "idle" || breathingStatus === "complete" ? (
            <button className="focus-primary" type="button" onClick={() => {
              setBreathingElapsed(0);
              setBreathingStatus("running");
            }}>
              {breathingStatus === "complete"
                ? (language === "zh" ? "再来一次" : "Begin again")
                : (language === "zh" ? "开始 1 分钟" : "Start 1 minute")}
            </button>
          ) : (
            <div className="focus-actions">
              <button type="button" aria-label={breathingStatus === "running" ? (language === "zh" ? "暂停呼吸" : "Pause breathing") : (language === "zh" ? "继续呼吸" : "Continue breathing")} onClick={() => setBreathingStatus((current) => current === "running" ? "paused" : "running")}>
                {breathingStatus === "running" ? <PauseIcon /> : <PlayIcon />}
                <span>{breathingStatus === "running" ? (language === "zh" ? "暂停" : "Pause") : (language === "zh" ? "继续" : "Continue")}</span>
              </button>
              <button type="button" onClick={() => {
                setBreathingElapsed(0);
                setBreathingStatus("idle");
              }}>
                <span>{language === "zh" ? "重新开始" : "Restart"}</span>
              </button>
            </div>
          )}

          <p className="safety-note">{language === "zh" ? "顺其自然；如有不适，请暂停。" : "Let it be easy. Pause if you feel uncomfortable."}</p>
        </section>
      ) : null}

      {activeTab === "me" ? (
        <section className="me-screen" aria-label={language === "zh" ? "我的一休" : "My Yixiu"}>
          <div className="section-kicker">{language === "zh" ? "我的一休 · MY YIXIU" : "MY YIXIU · 我的一休"}</div>
          <h1>{language === "zh" ? "回到自己的节奏" : "Return to your own rhythm"}</h1>

          <div className="me-scroll">
            <section className="me-card favorites-card">
              <div className="card-heading">
                <div>
                  <strong>{language === "zh" ? "我的收藏" : "Favorites"}</strong>
                  <small>{language === "zh" ? "常听的水声" : "Your returning waters"}</small>
                </div>
                <HeartIcon />
              </div>
              {favorites.length ? (
                <div className="favorite-scenes">
                  {favorites.map((sceneId) => (
                    <button key={sceneId} type="button" onClick={() => selectScene(sceneId, false)}>
                      <img src={scenes[sceneId].image} alt="" />
                      <span>{language === "zh" ? scenes[sceneId].zh : scenes[sceneId].en}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="empty-copy">{language === "zh" ? "在聆听页点亮心形，常听的水声会留在这里。" : "Tap the heart while listening and your favorite waters will stay here."}</p>
              )}
            </section>

            <section className="me-card">
              <div className="setting-title">
                <strong>{language === "zh" ? "默认定时" : "Default timer"}</strong>
                <span>{durationLabel(duration, language)}</span>
              </div>
              <div className="duration-options settings-duration">
                {durations.map((minutes) => (
                  <button key={minutes} type="button" aria-pressed={duration === minutes} className={duration === minutes ? "is-active" : ""} onClick={() => selectDuration(minutes)}>
                    {minutes === 0 ? (language === "zh" ? "不限时" : "∞") : `${minutes} ${language === "zh" ? "分钟" : "MIN"}`}
                  </button>
                ))}
              </div>
            </section>

            <section className="me-card settings-list">
              <div className="setting-row">
                <span>{language === "zh" ? "界面语言" : "Language"}</span>
                <div className="language-switch compact">
                  <button type="button" className={language === "zh" ? "is-active" : ""} onClick={() => setLanguage("zh")}>中</button>
                  <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")}>EN</button>
                </div>
              </div>
              <div className="setting-row">
                <span>{language === "zh" ? "结束提示音" : "End bell"}</span>
                <button className={`switch-control ${endBell ? "is-active" : ""}`} role="switch" type="button" aria-label={language === "zh" ? "结束提示音" : "End bell"} aria-checked={endBell} onClick={() => setEndBell((current) => !current)}><i /></button>
              </div>
              <div className="setting-row">
                <span>{language === "zh" ? "后台播放" : "Background playback"}</span>
                <button className={`switch-control ${backgroundPlayback ? "is-active" : ""}`} role="switch" type="button" aria-label={language === "zh" ? "后台播放" : "Background playback"} aria-checked={backgroundPlayback} onClick={() => setBackgroundPlayback((current) => !current)}><i /></button>
              </div>
            </section>

            <section className="trust-links" aria-label={language === "zh" ? "关于与支持" : "About and support"}>
              <button type="button" onClick={() => setInfoPanel("philosophy")}>{language === "zh" ? "产品哲学" : "Our philosophy"}<span>›</span></button>
              <button type="button" onClick={() => setInfoPanel("privacy")}>{language === "zh" ? "隐私说明" : "Privacy"}<span>›</span></button>
              <button type="button" onClick={() => setInfoPanel("support")}>{language === "zh" ? "支持与反馈" : "Support"}<span>›</span></button>
            </section>

            <p className="version-copy">YIXIU 2.0 · {language === "zh" ? "偏好只保存在这台设备" : "Preferences stay on this device"}</p>
          </div>
        </section>
      ) : null}

      {timerOpen ? (
        <section className="timer-panel" aria-label={language === "zh" ? "选择时长" : "Choose duration"}>
          {durations.map((minutes) => (
            <button key={minutes} type="button" className={duration === minutes ? "is-active" : ""} aria-pressed={duration === minutes} onClick={() => selectDuration(minutes)}>
              <strong>{minutes === 0 ? "∞" : minutes}</strong>
              <span>{minutes === 0 ? (language === "zh" ? "不限时" : "UNLIMITED") : (language === "zh" ? "分钟" : "MIN")}</span>
            </button>
          ))}
        </section>
      ) : null}

      {libraryOpen ? (
        <section className="sound-library" role="dialog" aria-modal="true" aria-label={language === "zh" ? "声音库" : "Sound library"}>
          <div className="sheet-handle" aria-hidden="true" />
          <header>
            <div>
              <small>{language === "zh" ? "六种水声" : "SIX WATERS"}</small>
              <h2>{language === "zh" ? "声音库" : "Sound Library"}</h2>
            </div>
            <button className="icon-button" type="button" aria-label={language === "zh" ? "关闭声音库" : "Close sound library"} onClick={() => setLibraryOpen(false)}><Cross2Icon /></button>
          </header>
          <div className="scene-grid">
            {sceneOrder.map((sceneId) => {
              const scene = scenes[sceneId];
              return (
                <article key={sceneId} className={active.id === sceneId ? "is-active" : ""}>
                  <button className="scene-select" type="button" onClick={() => selectScene(sceneId)}>
                    <img src={scene.image} alt="" />
                    <span className="scene-card-shade" />
                    <span className="scene-card-copy">
                      <strong>{language === "zh" ? scene.zh : scene.en}</strong>
                      <small>{language === "zh" ? scene.en : scene.zh}</small>
                      <em>{language === "zh" ? scene.useZh : scene.useEn}</em>
                    </span>
                    <span className="scene-card-play">{active.id === sceneId && isPlaying ? <PauseIcon /> : <PlayIcon />}</span>
                  </button>
                  <button className="scene-favorite" type="button" aria-label={`${language === "zh" ? "收藏" : "Favorite"} ${language === "zh" ? scene.zh : scene.en}`} aria-pressed={favorites.includes(sceneId)} onClick={() => toggleFavorite(sceneId)}>
                    {favorites.includes(sceneId) ? <HeartFilledIcon /> : <HeartIcon />}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {wisdomOpen ? (
        <section className="wisdom-panel" role="dialog" aria-modal="true" aria-label={language === "zh" ? "水之箴言" : "Water wisdom"}>
          <small>{language === "zh" ? "水之箴言" : "WATER WISDOM"}</small>
          <blockquote>{language === "zh" ? wisdoms[wisdomIndex].zh : wisdoms[wisdomIndex].en}</blockquote>
          <button type="button" onClick={() => {
            setWisdomOpen(false);
            setRemainingSeconds(duration === 0 ? 0 : duration * 60);
          }}>{language === "zh" ? "收下" : "Keep it"}</button>
        </section>
      ) : null}

      {infoPanel ? (
        <section className="info-panel" role="dialog" aria-modal="true" aria-label={language === "zh" ? "信息" : "Information"}>
          <button className="icon-button info-close" type="button" aria-label={language === "zh" ? "关闭" : "Close"} onClick={() => setInfoPanel(null)}><Cross2Icon /></button>
          {infoPanel === "philosophy" ? (
            <>
              <small>BE WATER, MY FRIEND.</small>
              <h2>{language === "zh" ? "真实自己，流动人生" : "True to yourself, flow with life"}</h2>
              <p>{language === "zh" ? "向内认识自己，向外如水而行。认识、接纳、成为并活出自己。" : "Know yourself within, then move through the world like water: recognize, accept, become, and live as yourself."}</p>
            </>
          ) : infoPanel === "privacy" ? (
            <>
              <small>PRIVACY</small>
              <h2>{language === "zh" ? "安静，也包括不打扰你的数据" : "Quiet includes your data"}</h2>
              <p>{language === "zh" ? "无需账号。收藏、语言和时长只保存在当前设备；此体验不会读取位置、照片、通讯录或健康数据。" : "No account is required. Favorites, language, and timer settings stay on this device. We do not access location, photos, contacts, or health data."}</p>
            </>
          ) : (
            <>
              <small>SUPPORT</small>
              <h2>{language === "zh" ? "告诉我们你的感受" : "Tell us how it feels"}</h2>
              <p>{language === "zh" ? "如果声音无法播放、体验不顺或你希望加入新的水声，请通过 wonderelian.com 联系我们。" : "If audio does not play, something feels rough, or you would like a new water scene, contact us through wonderelian.com."}</p>
            </>
          )}
        </section>
      ) : null}

      <BottomNavigation activeTab={activeTab} language={language} onChange={changeTab} />
    </main>
  );
}
