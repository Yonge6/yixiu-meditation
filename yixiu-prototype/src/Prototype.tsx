import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/noto-sans-sc/500.css";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-sc/600.css";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  Cross2Icon,
  ExternalLinkIcon,
  HeartFilledIcon,
  HeartIcon,
  PauseIcon,
  PersonIcon,
  PlayIcon,
  SpeakerLoudIcon,
  SpeakerQuietIcon,
  TrackNextIcon,
  TrackPreviousIcon,
  UploadIcon,
} from "@radix-ui/react-icons";

type Language = "zh" | "en";
type RootTab = "sounds" | "focus" | "me";
type SceneId =
  | "ocean"
  | "rain"
  | "spring"
  | "birds"
  | "stream"
  | "lake"
  | "valley"
  | "bamboo"
  | "falls"
  | "window"
  | "thunder"
  | "underwater"
  | "snow"
  | "tide";
type DurationOption = 15 | 30 | 60 | 0;
type FocusDuration = 1 | 3;
type BreathingStatus = "idle" | "running" | "paused" | "complete";
type SceneCategory = "all" | "sleep" | "focus" | "morning" | "relax";
type InfoPanel = "privacy" | "support" | "philosophy" | null;
type DrawerView = "home" | "library" | "focus" | "me" | "timer" | "privacy" | "sources" | "support" | "philosophy";
type MeView = "home" | "about" | "privacy" | "sources" | "support";

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
  audio: string;
  playbackRate?: number;
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
    audio: "/assets/yixiu/audio/ocean-waves.m4a",
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
    audio: "/assets/yixiu/audio/light-rain.m4a",
    filter: "highpass",
    frequency: 900,
    level: 0.052,
    lfoRate: 0.42,
    lfoDepth: 0.008,
  },
  spring: {
    id: "spring",
    zh: "春日花溪",
    en: "Spring Creek",
    useZh: "清晨 · 舒展",
    useEn: "Morning · Restore",
    image: "/assets/yixiu/spring-creek.png",
    audio: "/assets/yixiu/audio/sunrise-river.m4a",
    filter: "bandpass",
    frequency: 1850,
    level: 0.038,
    lfoRate: 0.52,
    lfoDepth: 0.004,
  },
  birds: {
    id: "birds",
    zh: "晨林鸟语",
    en: "Morning Birds",
    useZh: "醒神 · 阅读",
    useEn: "Awake · Read",
    image: "/assets/yixiu/morning-birds.png",
    audio: "/assets/yixiu/audio/morning-birds.m4a",
    filter: "highpass",
    frequency: 2100,
    level: 0.032,
    lfoRate: 0.9,
    lfoDepth: 0.003,
  },
  stream: {
    id: "stream",
    zh: "山间溪流",
    en: "Mountain Stream",
    useZh: "工作 · 专注",
    useEn: "Work · Focus",
    image: "/assets/yixiu/stream.jpg",
    audio: "/assets/yixiu/audio/river-flow.m4a",
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
    audio: "/assets/yixiu/audio/ocean-waves.m4a",
    playbackRate: 0.86,
    filter: "lowpass",
    frequency: 720,
    level: 0.045,
    lfoRate: 0.08,
    lfoDepth: 0.012,
  },
  valley: {
    id: "valley",
    zh: "晴谷微风",
    en: "Sunny Valley",
    useZh: "工作 · 提振",
    useEn: "Work · Refresh",
    image: "/assets/yixiu/sunny-valley.png",
    audio: "/assets/yixiu/audio/forest-breeze.m4a",
    filter: "highpass",
    frequency: 1350,
    level: 0.036,
    lfoRate: 0.28,
    lfoDepth: 0.004,
  },
  bamboo: {
    id: "bamboo",
    zh: "竹林细雨",
    en: "Bamboo Rain",
    useZh: "专注 · 冥想",
    useEn: "Focus · Meditate",
    image: "/assets/yixiu/bamboo-rain.png",
    audio: "/assets/yixiu/audio/light-rain.m4a",
    playbackRate: 1.04,
    filter: "highpass",
    frequency: 1120,
    level: 0.045,
    lfoRate: 0.38,
    lfoDepth: 0.006,
  },
  falls: {
    id: "falls",
    zh: "林间瀑布",
    en: "Forest Falls",
    useZh: "遮噪 · 放松",
    useEn: "Mask · Relax",
    image: "/assets/yixiu/forest-falls.png",
    audio: "/assets/yixiu/audio/forest-waterfall.m4a",
    filter: "lowpass",
    frequency: 1250,
    level: 0.055,
    lfoRate: 0.34,
    lfoDepth: 0.01,
  },
  window: {
    id: "window",
    zh: "窗边夜雨",
    en: "Window Rain",
    useZh: "睡眠 · 安定",
    useEn: "Sleep · Settle",
    image: "/assets/yixiu/window-rain.png",
    audio: "/assets/yixiu/audio/light-rain.m4a",
    playbackRate: 0.92,
    filter: "highpass",
    frequency: 760,
    level: 0.048,
    lfoRate: 0.24,
    lfoDepth: 0.006,
  },
  thunder: {
    id: "thunder",
    zh: "远雷",
    en: "Distant Thunder",
    useZh: "遮噪 · 入睡",
    useEn: "Mask · Sleep",
    image: "/assets/yixiu/distant-thunder.png",
    audio: "/assets/yixiu/audio/distant-thunder.m4a",
    filter: "lowpass",
    frequency: 270,
    level: 0.075,
    lfoRate: 0.055,
    lfoDepth: 0.018,
  },
  underwater: {
    id: "underwater",
    zh: "水下回响",
    en: "Underwater Echo",
    useZh: "深度专注",
    useEn: "Deep Focus",
    image: "/assets/yixiu/underwater-echo.png",
    audio: "/assets/yixiu/audio/underwater-white-noise.m4a",
    filter: "lowpass",
    frequency: 330,
    level: 0.062,
    lfoRate: 0.09,
    lfoDepth: 0.012,
  },
  snow: {
    id: "snow",
    zh: "雪山风",
    en: "Snow Wind",
    useZh: "安静 · 遮噪",
    useEn: "Quiet · Mask",
    image: "/assets/yixiu/snow-wind.png",
    audio: "/assets/yixiu/audio/mountain-wind.m4a",
    filter: "bandpass",
    frequency: 680,
    level: 0.044,
    lfoRate: 0.16,
    lfoDepth: 0.007,
  },
  tide: {
    id: "tide",
    zh: "夜潮",
    en: "Night Tide",
    useZh: "深度睡眠",
    useEn: "Deep Sleep",
    image: "/assets/yixiu/night-tide.png",
    audio: "/assets/yixiu/audio/ocean-waves.m4a",
    playbackRate: 0.78,
    filter: "lowpass",
    frequency: 390,
    level: 0.068,
    lfoRate: 0.07,
    lfoDepth: 0.02,
  },
};

const sceneOrder: SceneId[] = [
  "ocean",
  "rain",
  "spring",
  "birds",
  "stream",
  "lake",
  "valley",
  "bamboo",
  "falls",
  "window",
  "thunder",
  "underwater",
  "snow",
  "tide",
];
const durations: DurationOption[] = [15, 30, 60, 0];
const focusDurations: FocusDuration[] = [1, 3];
const sceneCategories: SceneCategory[] = ["all", "sleep", "focus", "morning", "relax"];
const publicYixiuUrl = "https://yixiu.wonderelian.com/";

const sceneThumbs: Record<SceneId, string> = Object.fromEntries(
  sceneOrder.map((sceneId) => [sceneId, `/assets/yixiu/thumbs/${sceneId}.jpg`]),
) as Record<SceneId, string>;

const scenesByCategory: Record<SceneCategory, SceneId[]> = {
  all: sceneOrder,
  sleep: ["ocean", "rain", "window", "thunder", "snow", "tide"],
  focus: ["rain", "birds", "stream", "bamboo", "falls", "underwater", "snow"],
  morning: ["spring", "birds", "lake", "valley"],
  relax: ["ocean", "spring", "lake", "valley", "falls", "tide"],
};

function categoryLabel(category: SceneCategory, language: Language) {
  const labels: Record<SceneCategory, { zh: string; en: string }> = {
    all: { zh: "全部", en: "All" },
    sleep: { zh: "睡眠", en: "Sleep" },
    focus: { zh: "专注", en: "Focus" },
    morning: { zh: "清晨", en: "Morning" },
    relax: { zh: "放松", en: "Relax" },
  };
  return labels[category][language];
}

const wisdoms = [
  { zh: "水不争先，却从未停止。", en: "Water does not hurry, yet it keeps moving." },
  { zh: "慢下来，才能听见自己。", en: "Slow down enough to hear yourself." },
  { zh: "接纳此刻，如水接纳形状。", en: "Meet this moment as water meets its form." },
  { zh: "柔软不是退让，而是另一种力量。", en: "Softness is not surrender. It is another kind of strength." },
];

function useStoredState<T>(key: string, fallback: T, linkedValue: T | null = null) {
  const [value, setValue] = useState<T>(() => {
    if (linkedValue !== null) return linkedValue;
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
  audio: HTMLAudioElement;
};

function stopAudioGraph(graph: AudioGraph | null) {
  if (!graph) return;
  graph.audio.pause();
  graph.audio.removeAttribute("src");
  graph.audio.load();
}

function useAmbientSound(sceneId: SceneId, isPlaying: boolean, volume: number, fadeFactor: number) {
  const graphRef = useRef<AudioGraph | null>(null);
  const fadingGraphRef = useRef<AudioGraph | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const fadeGenerationRef = useRef(0);
  const fadeActiveRef = useRef(false);

  useEffect(() => {
    fadeGenerationRef.current += 1;
    const generation = fadeGenerationRef.current;
    if (fadeFrameRef.current !== null) {
      window.cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }
    fadeActiveRef.current = false;
    stopAudioGraph(fadingGraphRef.current);
    fadingGraphRef.current = null;

    if (!isPlaying) {
      stopAudioGraph(graphRef.current);
      graphRef.current = null;
      return;
    }

    const scene = scenes[sceneId];
    const previousGraph = graphRef.current;
    const audio = new Audio(scene.audio);
    audio.loop = true;
    audio.preload = "auto";
    audio.playbackRate = scene.playbackRate ?? 1;
    const targetVolume = Math.min(1, (volume / 100) * Math.min(scene.level * 11, 1) * fadeFactor);
    audio.volume = previousGraph ? 0 : targetVolume;
    fadeActiveRef.current = previousGraph !== null;
    fadingGraphRef.current = previousGraph;
    graphRef.current = { audio };
    void audio.play().then(() => {
      if (!previousGraph || generation !== fadeGenerationRef.current) return;
      fadeActiveRef.current = true;
      const startedAt = performance.now();
      const previousStartVolume = previousGraph.audio.volume;
      const animate = (now: number) => {
        if (generation !== fadeGenerationRef.current) return;
        const progress = Math.max(0, Math.min((now - startedAt) / 600, 1));
        audio.volume = targetVolume * progress;
        previousGraph.audio.volume = previousStartVolume * (1 - progress);
        if (progress < 1) {
          fadeFrameRef.current = window.requestAnimationFrame(animate);
        } else {
          stopAudioGraph(previousGraph);
          if (fadingGraphRef.current === previousGraph) fadingGraphRef.current = null;
          fadeFrameRef.current = null;
          fadeActiveRef.current = false;
        }
      };
      fadeFrameRef.current = window.requestAnimationFrame(animate);
    }).catch(() => {
      if (graphRef.current?.audio === audio) graphRef.current = previousGraph;
      fadeActiveRef.current = false;
      stopAudioGraph({ audio });
    });
  }, [isPlaying, sceneId]);

  useEffect(() => () => {
    fadeGenerationRef.current += 1;
    if (fadeFrameRef.current !== null) window.cancelAnimationFrame(fadeFrameRef.current);
    stopAudioGraph(graphRef.current);
    stopAudioGraph(fadingGraphRef.current);
    graphRef.current = null;
    fadingGraphRef.current = null;
  }, []);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph || fadeActiveRef.current) return;
    const scene = scenes[sceneId];
    graph.audio.volume = Math.min(1, (volume / 100) * Math.min(scene.level * 11, 1) * fadeFactor);
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

function sceneShareUrl(sceneId: SceneId, language: Language) {
  const url = new URL(publicYixiuUrl);
  url.searchParams.set("scene", sceneId);
  url.searchParams.set("lang", language);
  url.searchParams.set("utm_source", "share");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "scene_share");
  url.searchParams.set("utm_content", `${sceneId}_${language}`);
  return url.toString();
}

function recordGrowthEvent(event: string, parameters: Record<string, string | number | boolean> = {}) {
  window.dispatchEvent(new CustomEvent("yixiu:analytics", {
    detail: { event, ...parameters },
  }));
}

function linkedScene() {
  const sceneId = new URLSearchParams(window.location.search).get("scene");
  return sceneId && sceneOrder.includes(sceneId as SceneId) ? sceneId as SceneId : null;
}

function linkedLanguage() {
  const language = new URLSearchParams(window.location.search).get("lang");
  return language === "zh" || language === "en" ? language : null;
}

function preferredLanguage(): Language {
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export default function Prototype() {
  const [language, setLanguage] = useStoredState<Language>("yixiu.language", preferredLanguage(), linkedLanguage());
  const [activeScene, setActiveScene] = useStoredState<SceneId>("yixiu.scene", "ocean", linkedScene());
  const [duration, setDuration] = useStoredState<DurationOption>("yixiu.duration", 30);
  const [favorites, setFavorites] = useStoredState<SceneId[]>("yixiu.favorites", []);
  const [recentScenes, setRecentScenes] = useStoredState<SceneId[]>("yixiu.recentScenes", []);
  const [focusDuration, setFocusDuration] = useStoredState<FocusDuration>("yixiu.focusDuration", 1);
  const [focusSoundEnabled, setFocusSoundEnabled] = useStoredState<boolean>("yixiu.focusSoundEnabled", false);
  const [endBell, setEndBell] = useStoredState<boolean>("yixiu.endBell", false);
  const [backgroundPlayback, setBackgroundPlayback] = useStoredState<boolean>("yixiu.backgroundPlayback", true);
  const [activeTab, setActiveTab] = useState<RootTab>("sounds");
  const [meView, setMeView] = useState<MeView>("home");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [sceneCategory, setSceneCategory] = useState<SceneCategory>("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(72);
  const [remainingSeconds, setRemainingSeconds] = useState(duration === 0 ? 0 : duration * 60);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerView, setDrawerView] = useState<DrawerView>("home");
  const [timerOpen, setTimerOpen] = useState(false);
  const [wisdomOpen, setWisdomOpen] = useState(false);
  const [videoChannelOpen, setVideoChannelOpen] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState(false);
  const [wisdomIndex, setWisdomIndex] = useState(0);
  const [breathingStatus, setBreathingStatus] = useState<BreathingStatus>("idle");
  const [breathingElapsed, setBreathingElapsed] = useState(0);
  const [infoPanel, setInfoPanel] = useState<InfoPanel>(null);
  const swipeStartRef = useRef<SwipeStart | null>(null);
  const meBackSwipeRef = useRef<SwipeStart | null>(null);
  const meScreenRef = useRef<HTMLElement>(null);
  const meHomeScrollTopRef = useRef(0);
  const swipeSettleTimerRef = useRef<number | null>(null);
  const drawerScrollRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const breathingOriginalPlaybackRef = useRef(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [swipeSettling, setSwipeSettling] = useState(false);
  const [meBackOffset, setMeBackOffset] = useState(0);
  const [meBackDragging, setMeBackDragging] = useState(false);

  const active = scenes[activeScene] ?? scenes.ocean;
  const activeIndex = sceneOrder.indexOf(active.id);
  const previousScene = activeIndex > 0 ? scenes[sceneOrder[activeIndex - 1]] : null;
  const nextScene = activeIndex < sceneOrder.length - 1 ? scenes[sceneOrder[activeIndex + 1]] : null;
  const swipePreviewScene = swipeOffset < 0 ? nextScene : previousScene;
  const isFavorite = favorites.includes(active.id);
  const fadeFactor = duration === 0 || remainingSeconds > 20 ? 1 : Math.max(remainingSeconds / 20, 0);
  const breathingTotalSeconds = focusDuration * 60;
  const filteredSceneOrder = scenesByCategory[sceneCategory];

  useAmbientSound(active.id, isPlaying, volume, fadeFactor);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("scene", active.id);
    url.searchParams.set("lang", language);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [active.id, language]);

  useEffect(() => {
    [previousScene, active, nextScene].forEach((scene) => {
      if (!scene) return;
      const image = new Image();
      image.decoding = "async";
      image.src = scene.image;
    });
  }, [active, nextScene, previousScene]);

  useEffect(() => {
    setRemainingSeconds(duration === 0 ? 0 : duration * 60);
  }, [duration]);

  useEffect(() => {
    if (!downloadFeedback) return;
    const timeout = window.setTimeout(() => setDownloadFeedback(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [downloadFeedback]);

  useEffect(() => {
    if (!isPlaying || duration === 0) return;
    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current > 1) return current - 1;
        window.clearInterval(interval);
        setIsPlaying(false);
        setWisdomIndex((index) => (index + 1) % wisdoms.length);
        setWisdomOpen(true);
        recordGrowthEvent("yixiu_listening_complete", { completed_scene: active.id, timer_minutes: duration });
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [active.id, duration, isPlaying]);

  useEffect(() => {
    if (breathingStatus !== "running") return;
    const interval = window.setInterval(() => {
      setBreathingElapsed((current) => {
        if (current >= breathingTotalSeconds - 1) {
          setBreathingStatus("complete");
          setIsPlaying(breathingOriginalPlaybackRef.current);
          recordGrowthEvent("yixiu_focus_complete", { focus_minutes: focusDuration, nature_sound: focusSoundEnabled });
          window.clearInterval(interval);
          return breathingTotalSeconds;
        }
        return current + 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [breathingStatus, breathingTotalSeconds, focusDuration, focusSoundEnabled]);

  useEffect(() => {
    if (activeTab !== "focus" && breathingStatus === "running") {
      setIsPlaying(breathingOriginalPlaybackRef.current);
      setBreathingStatus("paused");
    }
  }, [activeTab, breathingStatus]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => drawerCloseRef.current?.focus());

    const handleDrawerKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleDrawerKeys);
    return () => {
      document.removeEventListener("keydown", handleDrawerKeys);
      document.body.style.overflow = previousOverflow;
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    drawerScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [drawerView, menuOpen]);

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

  const recordRecentScene = (sceneId: SceneId) => {
    setRecentScenes((current) => [sceneId, ...current.filter((item) => item !== sceneId)].slice(0, 4));
  };

  const moveScene = (direction: -1 | 1) => {
    const nextIndex = activeIndex + direction;
    if (nextIndex < 0 || nextIndex >= sceneOrder.length) return;
    const sceneId = sceneOrder[nextIndex];
    setActiveScene(sceneId);
    recordRecentScene(sceneId);
  };

  const shareScene = async () => {
    const title = language === "zh"
      ? `一休 · ${active.zh}｜如水而行`
      : `Yixiu · ${active.en} | Be water, my friend.`;
    const text = language === "zh"
      ? `此刻，我在一休聆听「${active.zh}」。真实自己，流动人生。`
      : `I am listening to ${active.en} in Yixiu. True to yourself, flow with life.`;
    const url = sceneShareUrl(active.id, language);
    const nativeShare = Reflect.get(navigator, "share") as Navigator["share"] | undefined;

    try {
      if (nativeShare) {
        await nativeShare.call(navigator, { title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      recordGrowthEvent("yixiu_scene_share", { shared_scene: active.id, share_method: nativeShare ? "system" : "clipboard" });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Unable to share the current Yixiu scene", error);
    }
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
    const direction = deltaX < 0 ? 1 : -1;
    const hasDestination = direction === 1 ? nextScene !== null : previousScene !== null;
    const limitedOffset = hasDestination
      ? Math.max(-width * 0.48, Math.min(width * 0.48, deltaX))
      : Math.sign(deltaX) * Math.min(18, Math.abs(deltaX) * 0.09);
    setSwipeOffset(limitedOffset);
    setSwipeProgress(hasDestination ? Math.min(Math.abs(limitedOffset) / (width * 0.42), 1) : 0);
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
    if (deltaY <= -64 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
      setSwipeOffset(0);
      setSwipeProgress(0);
      setLibraryOpen(true);
      return;
    }
    const isHorizontalSwipe = Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;
    if (!isHorizontalSwipe) {
      resetSceneSwipe();
      return;
    }

    const width = Math.max(event.currentTarget.clientWidth, 1);
    const direction = deltaX < 0 ? 1 : -1;
    const hasDestination = direction === 1 ? nextScene !== null : previousScene !== null;
    if (!hasDestination) {
      resetSceneSwipe();
      return;
    }
    setSwipeSettling(true);
    setSwipeOffset(direction === 1 ? -width * 0.72 : width * 0.72);
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

  const openMeDetail = (view: Exclude<MeView, "home">) => {
    meHomeScrollTopRef.current = meScreenRef.current?.scrollTop ?? 0;
    setMeView(view);
  };

  const returnToMeHome = () => {
    setMeBackOffset(0);
    setMeBackDragging(false);
    setMeView("home");
    window.requestAnimationFrame(() => {
      meScreenRef.current?.scrollTo({ top: meHomeScrollTopRef.current, behavior: "instant" });
    });
  };

  const startMeBackSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    meBackSwipeRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      axis: null,
    };
  };

  const moveMeBackSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = meBackSwipeRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (start.axis === null && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 8) {
      start.axis = Math.abs(deltaX) > Math.abs(deltaY) * 1.15 ? "horizontal" : "vertical";
      if (start.axis === "horizontal") {
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Synthetic pointer events may not have an active pointer to capture.
        }
      }
    }
    if (start.axis !== "horizontal" || deltaX <= 0) return;
    event.preventDefault();
    setMeBackDragging(true);
    setMeBackOffset(Math.min(36, deltaX * 0.18));
  };

  const finishMeBackSwipe = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = meBackSwipeRef.current;
    meBackSwipeRef.current = null;
    if (!start || start.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (deltaX >= 72 && deltaX > Math.abs(deltaY) * 1.15) {
      returnToMeHome();
      return;
    }
    setMeBackDragging(false);
    setMeBackOffset(0);
  };

  const selectScene = (sceneId: SceneId, play = true) => {
    setActiveScene(sceneId);
    recordRecentScene(sceneId);
    setActiveTab("sounds");
    setLibraryOpen(false);
    if (play) setIsPlaying(true);
  };

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: language === "zh" ? active.zh : active.en,
      artist: "一休 · YIXIU",
      album: language === "zh" ? "如水而行" : "Be Water, My Friend.",
      artwork: [{ src: new URL(active.image, window.location.origin).toString(), sizes: "1200x1600", type: "image/jpeg" }],
    });
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

    const actions: Array<[MediaSessionAction, MediaSessionActionHandler | null]> = [
      ["play", () => { recordRecentScene(active.id); setIsPlaying(true); }],
      ["pause", () => setIsPlaying(false)],
      ["previoustrack", previousScene ? () => moveScene(-1) : null],
      ["nexttrack", nextScene ? () => moveScene(1) : null],
    ];
    actions.forEach(([action, handler]) => {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* unsupported action */ }
    });

    return () => {
      actions.forEach(([action]) => {
        try { navigator.mediaSession.setActionHandler(action, null); } catch { /* unsupported action */ }
      });
    };
  }, [active, isPlaying, language, nextScene, previousScene]);

  const beginBreathing = () => {
    breathingOriginalPlaybackRef.current = isPlaying;
    setIsPlaying(focusSoundEnabled);
    setBreathingElapsed(0);
    setBreathingStatus("running");
    recordGrowthEvent("yixiu_focus_start", { focus_minutes: focusDuration, nature_sound: focusSoundEnabled });
  };

  const resetBreathing = () => {
    setIsPlaying(breathingOriginalPlaybackRef.current);
    setBreathingElapsed(0);
    setBreathingStatus("idle");
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

  const drawerTitle = {
    home: language === "zh" ? "你的空间" : "Your space",
    library: language === "zh" ? "声音库" : "Sound library",
    focus: language === "zh" ? "水之呼吸" : "Water breathing",
    me: language === "zh" ? "我的一休" : "My Yixiu",
    timer: language === "zh" ? "默认定时" : "Default timer",
    philosophy: language === "zh" ? "产品哲学" : "Our philosophy",
    privacy: language === "zh" ? "隐私说明" : "Privacy",
    sources: language === "zh" ? "声音来源" : "Audio sources",
    support: language === "zh" ? "支持与反馈" : "Support",
  }[drawerView];

  return (
    <main
      className={`yixiu-app ${isPlaying ? "is-audio-playing" : ""} ${swipeOffset !== 0 ? "is-scene-dragging" : ""} ${swipeSettling ? "is-swipe-settling" : ""}`}
      data-language={language}
      data-scene={active.id}
      data-tab={activeTab}
    >
      {activeTab === "sounds" && swipeOffset !== 0 && swipePreviewScene ? (
        <img
          className="ocean-backdrop scene-preview-backdrop"
          src={swipePreviewScene.image}
          data-image-scene={swipePreviewScene.id}
          alt=""
          draggable={false}
          style={{
            opacity: swipeProgress,
            transform: `translate3d(${(swipeOffset < 0 ? 1 : -1) * (1 - swipeProgress) * 7}%, 0, 0) scale(${1.018 - swipeProgress * 0.018})`,
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
          transform: `translate3d(${swipeOffset * 0.1}px, 0, 0) scale(${1 - swipeProgress * 0.012})`,
        } : undefined}
      />
      <div className="ocean-shade" aria-hidden="true" />

      {activeTab === "sounds" ? <header className="player-header">
        <button
          className="brand-button"
          type="button"
          aria-label={language === "zh" ? "切换到英文" : "Switch to Chinese"}
          data-analytics-event="yixiu_language_change"
          data-analytics-value={language === "zh" ? "en" : "zh"}
          onClick={() => setLanguage((current) => current === "zh" ? "en" : "zh")}
        >
          <span>{language === "zh" ? "一休" : "YIXIU"}</span>
          <small>{language === "zh" ? "YIXIU" : "一休"}</small>
        </button>
        <div className="header-actions">
          <button
            className="header-share-button"
            type="button"
            aria-label={language === "zh" ? `分享${active.zh}` : `Share ${active.en}`}
            onClick={shareScene}
          >
            <UploadIcon />
          </button>
        </div>
      </header> : null}

      {menuOpen ? (
        <div className="yixiu-drawer-layer">
          <button
            className="yixiu-drawer-backdrop"
            type="button"
            aria-label={language === "zh" ? "关闭菜单" : "Close menu"}
            onClick={() => setMenuOpen(false)}
          />
          <aside ref={drawerRef} className="yixiu-side-drawer" role="dialog" aria-modal="true" aria-labelledby="yixiu-drawer-title">
            <header className="yixiu-drawer-header">
              {drawerView === "home" ? (
                <span className="yixiu-drawer-orbit" aria-hidden="true"><WaterWavesIcon /></span>
              ) : (
                <button
                  className="yixiu-drawer-back"
                  type="button"
                  aria-label={language === "zh" ? "返回" : "Back"}
                  onClick={() => setDrawerView("home")}
                >
                  <ArrowLeftIcon />
                </button>
              )}
              <div>
                <span className="yixiu-drawer-brand">一休 · YIXIU</span>
                <h2 id="yixiu-drawer-title">{drawerTitle}</h2>
              </div>
              <button ref={drawerCloseRef} className="yixiu-drawer-close" type="button" aria-label={language === "zh" ? "关闭菜单" : "Close menu"} onClick={() => setMenuOpen(false)}><Cross2Icon /></button>
            </header>

            <div className="yixiu-drawer-scroll" ref={drawerScrollRef}>
              {drawerView === "home" ? (
                <>
                  <section className="yixiu-drawer-hero">
                    <small>{language === "zh" ? "十四种真实自然录音" : "FOURTEEN REAL NATURE SOUNDS"}</small>
                    <h3>{language === "zh" ? "让声音带你回到此刻" : "Let sound return you to now"}</h3>
                    <p>{language === "zh" ? `正在聆听的场景：${active.zh}` : `Current scene: ${active.en}`}</p>
                    <button type="button" onClick={() => setDrawerView("library")}>
                      <WaterWavesIcon />
                      {language === "zh" ? "浏览全部声音" : "Browse all sounds"}
                    </button>
                  </section>

                  <nav className="yixiu-drawer-nav" aria-label={language === "zh" ? "你的空间" : "Your space"}>
                    <button type="button" onClick={() => { setActiveTab("sounds"); setMenuOpen(false); }}>
                      <span className="yixiu-drawer-nav-icon"><WaterWavesIcon /></span>
                      <span><strong>{language === "zh" ? "声音播放器" : "Sound player"}</strong><small>{language === "zh" ? "回到正在聆听的画面" : "Return to the current sound"}</small></span>
                      <ChevronRightIcon />
                    </button>
                    <button type="button" onClick={() => { setIsPlaying(false); setDrawerView("focus"); }}>
                      <span className="yixiu-drawer-nav-icon">息</span>
                      <span><strong>{language === "zh" ? "水之呼吸" : "Water breathing"}</strong><small>{language === "zh" ? "一段 1 分钟的静心练习" : "A one-minute focus practice"}</small></span>
                      <ChevronRightIcon />
                    </button>
                    <button type="button" onClick={() => { setIsPlaying(false); setDrawerView("me"); }}>
                      <span className="yixiu-drawer-nav-icon"><PersonIcon /></span>
                      <span><strong>{language === "zh" ? "我的一休" : "My Yixiu"}</strong><small>{language === "zh" ? "收藏、偏好与默认设置" : "Favorites and preferences"}</small></span>
                      <ChevronRightIcon />
                    </button>
                    <button type="button" onClick={() => setDrawerView("timer")}>
                      <span className="yixiu-drawer-nav-icon"><ClockIcon /></span>
                      <span><strong>{language === "zh" ? "默认定时" : "Default timer"}</strong><small>{durationLabel(duration, language)}</small></span>
                      <ChevronRightIcon />
                    </button>
                    <div className="yixiu-drawer-nav-row">
                      <span className="yixiu-drawer-nav-icon"><SpeakerLoudIcon /></span>
                      <span><strong>{language === "zh" ? "后台播放" : "Background playback"}</strong><small>{language === "zh" ? "离开画面，水声仍可继续" : "Keep the water flowing off-screen"}</small></span>
                      <button className={`switch-control ${backgroundPlayback ? "is-active" : ""}`} role="switch" type="button" aria-label={language === "zh" ? "后台播放" : "Background playback"} aria-checked={backgroundPlayback} onClick={() => setBackgroundPlayback((current) => !current)}><i /></button>
                    </div>
                    <button type="button" onClick={() => setDrawerView("philosophy")}>
                      <span className="yixiu-drawer-nav-icon">水</span>
                      <span><strong>{language === "zh" ? "产品哲学" : "Our philosophy"}</strong><small>{language === "zh" ? "真实自己，流动人生" : "True to yourself, flow with life"}</small></span>
                      <ChevronRightIcon />
                    </button>
                    <button type="button" onClick={() => setDrawerView("privacy")}>
                      <span className="yixiu-drawer-nav-icon">静</span>
                      <span><strong>{language === "zh" ? "隐私说明" : "Privacy"}</strong><small>{language === "zh" ? "偏好只保存在这台设备" : "Preferences stay on this device"}</small></span>
                      <ChevronRightIcon />
                    </button>
                    <button type="button" onClick={() => setDrawerView("sources")}>
                      <span className="yixiu-drawer-nav-icon">录</span>
                      <span><strong>{language === "zh" ? "声音来源" : "Audio sources"}</strong><small>{language === "zh" ? "真实自然录音与授权说明" : "Real recordings and licensing"}</small></span>
                      <ChevronRightIcon />
                    </button>
                    <button type="button" onClick={() => setDrawerView("support")}>
                      <span className="yixiu-drawer-nav-icon">问</span>
                      <span><strong>{language === "zh" ? "支持与反馈" : "Support"}</strong><small>wonderelian.com</small></span>
                      <ChevronRightIcon />
                    </button>
                  </nav>
                  <p className="yixiu-drawer-footnote">{language === "zh" ? "向内认识自己，向外如水而行。" : "Know yourself within. Move like water."}</p>
                </>
              ) : drawerView === "library" ? (
                <section className="yixiu-drawer-subview yixiu-drawer-library">
                  <p className="yixiu-drawer-lead">{language === "zh" ? "选择声音后，抽屉会收起并回到对应画面。" : "Choose a sound to return to its scene."}</p>
                  <div className="scene-grid">
                    {sceneOrder.map((sceneId) => {
                      const scene = scenes[sceneId];
                      return (
                        <article key={sceneId} className={active.id === sceneId ? "is-active" : ""}>
                          <button className="scene-select" type="button" data-scene-id={sceneId} onClick={() => {
                            setActiveScene(sceneId);
                            setActiveTab("sounds");
                            setIsPlaying(true);
                            setDrawerView("home");
                            setMenuOpen(false);
                          }}>
                            <img src={scene.image} data-image-scene={scene.id} alt="" />
                            <span className="scene-card-shade" />
                            <span className="scene-card-copy">
                              <strong>{language === "zh" ? scene.zh : scene.en}</strong>
                              <small>{language === "zh" ? scene.en : scene.zh}</small>
                              <em>{language === "zh" ? scene.useZh : scene.useEn}</em>
                            </span>
                          </button>
                          <button className="scene-favorite" type="button" aria-label={`${language === "zh" ? "收藏" : "Favorite"} ${language === "zh" ? scene.zh : scene.en}`} aria-pressed={favorites.includes(sceneId)} onClick={() => toggleFavorite(sceneId)}>
                            {favorites.includes(sceneId) ? <HeartFilledIcon /> : <HeartIcon />}
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ) : drawerView === "focus" ? (
                <section className="yixiu-drawer-subview drawer-focus" aria-label={language === "zh" ? "水之呼吸" : "Water breathing"}>
                  <span className="section-kicker">{language === "zh" ? "静心 · FOCUS" : "FOCUS · 静心"}</span>
                  <h3>{language === "zh" ? "吸气，停驻，流动" : "Breathe in, pause, flow"}</h3>
                  <div className={`breathing-orbit phase-${breathingPhase} status-${breathingStatus}`} aria-hidden="true">
                    <span className="ripple ripple-one" /><span className="ripple ripple-two" /><span className="breathing-core" />
                  </div>
                  <div className="breathing-readout" aria-live="polite"><strong>{breathingPhaseCopy}</strong><span>{formatSeconds(Math.max(60 - breathingElapsed, 0))}</span></div>
                  {breathingStatus === "idle" || breathingStatus === "complete" ? (
                    <button className="focus-primary" type="button" onClick={() => { setBreathingElapsed(0); setBreathingStatus("running"); }}>
                      {breathingStatus === "complete" ? (language === "zh" ? "再来一次" : "Begin again") : (language === "zh" ? "开始 1 分钟" : "Start 1 minute")}
                    </button>
                  ) : (
                    <div className="focus-actions">
                      <button type="button" onClick={() => setBreathingStatus((current) => current === "running" ? "paused" : "running")}>{breathingStatus === "running" ? <PauseIcon /> : <PlayIcon />}<span>{breathingStatus === "running" ? (language === "zh" ? "暂停" : "Pause") : (language === "zh" ? "继续" : "Continue")}</span></button>
                      <button type="button" onClick={() => { setBreathingElapsed(0); setBreathingStatus("idle"); }}>{language === "zh" ? "重新开始" : "Restart"}</button>
                    </div>
                  )}
                  <p className="safety-note">{language === "zh" ? "顺其自然；如有不适，请暂停。" : "Let it be easy. Pause if you feel uncomfortable."}</p>
                </section>
              ) : drawerView === "me" ? (
                <section className="yixiu-drawer-subview drawer-me">
                  <section className="me-card favorites-card">
                    <div className="card-heading"><div><strong>{language === "zh" ? "我的收藏" : "Favorites"}</strong><small>{language === "zh" ? "常听的自然声" : "Your returning sounds"}</small></div><HeartIcon /></div>
                    {favorites.length ? <div className="favorite-scenes">{favorites.map((sceneId) => <button key={sceneId} type="button" onClick={() => { setActiveScene(sceneId); setDrawerView("home"); setMenuOpen(false); }}><img src={scenes[sceneId].image} data-image-scene={sceneId} alt="" /><span>{language === "zh" ? scenes[sceneId].zh : scenes[sceneId].en}</span></button>)}</div> : <p className="empty-copy">{language === "zh" ? "在播放器点亮心形，常听的声音会留在这里。" : "Favorite a sound in the player and it will stay here."}</p>}
                  </section>
                  <section className="me-card settings-list">
                    <div className="setting-row"><span>{language === "zh" ? "结束提示音" : "End bell"}</span><button className={`switch-control ${endBell ? "is-active" : ""}`} role="switch" type="button" aria-label={language === "zh" ? "结束提示音" : "End bell"} aria-checked={endBell} onClick={() => setEndBell((current) => !current)}><i /></button></div>
                    <div className="setting-row"><span>{language === "zh" ? "后台播放" : "Background playback"}</span><button className={`switch-control ${backgroundPlayback ? "is-active" : ""}`} role="switch" type="button" aria-label={language === "zh" ? "后台播放" : "Background playback"} aria-checked={backgroundPlayback} onClick={() => setBackgroundPlayback((current) => !current)}><i /></button></div>
                    <button className="drawer-setting-link" type="button" onClick={() => setDrawerView("timer")}><span>{language === "zh" ? "默认定时" : "Default timer"}</span><strong>{durationLabel(duration, language)}</strong><ChevronRightIcon /></button>
                  </section>
                </section>
              ) : drawerView === "timer" ? (
                <section className="yixiu-drawer-subview drawer-timer">
                  <p className="yixiu-drawer-lead">{language === "zh" ? "到时后声音会逐渐淡出。" : "The sound fades gently when time is up."}</p>
                  <div className="duration-options settings-duration">
                    {durations.map((minutes) => <button key={minutes} type="button" aria-pressed={duration === minutes} className={duration === minutes ? "is-active" : ""} onClick={() => { setDuration(minutes); setRemainingSeconds(minutes === 0 ? 0 : minutes * 60); }}>{minutes === 0 ? (language === "zh" ? "不限时" : "∞") : `${minutes} ${language === "zh" ? "分钟" : "MIN"}`}</button>)}
                  </div>
                </section>
              ) : (
                <section className="yixiu-drawer-subview drawer-info">
                  <small>{drawerView === "philosophy" ? "BE WATER, MY FRIEND." : drawerView === "privacy" ? "PRIVACY" : drawerView === "sources" ? "FIELD RECORDINGS" : "SUPPORT"}</small>
                  <h3>{drawerView === "philosophy" ? (language === "zh" ? "真实自己，流动人生" : "True to yourself, flow with life") : drawerView === "privacy" ? (language === "zh" ? "安静，也包括不打扰你的数据" : "Quiet includes your data") : drawerView === "sources" ? (language === "zh" ? "每个场景，都有真实的声音" : "A real sound for every scene") : (language === "zh" ? "告诉我们你的感受" : "Tell us how it feels")}</h3>
                  <p>{drawerView === "philosophy" ? (language === "zh" ? "向内认识自己，向外如水而行。认识、接纳、成为并活出自己。" : "Know yourself within, then move through the world like water.") : drawerView === "privacy" ? (language === "zh" ? "无需账号。收藏、语言和时长只保存在当前设备；不会读取位置、照片、通讯录或健康数据。" : "No account is required. Preferences stay on this device; location, photos, contacts, and health data are not accessed.") : drawerView === "sources" ? (language === "zh" ? "鸟语、雨声、河流、海浪、瀑布、远雷与山风均来自 Mixkit 自然环境录音，并按 Mixkit Sound Effects Free License 使用。" : "Birds, rain, rivers, waves, waterfalls, thunder, and wind use Mixkit nature recordings under the Mixkit Sound Effects Free License.") : (language === "zh" ? "如果声音无法播放、体验不顺或你希望加入新的自然声，请通过 wonderelian.com 联系我们。" : "For audio issues, rough edges, or new nature-sound requests, contact us through wonderelian.com.")}</p>
                  {drawerView === "sources" ? <a href="https://mixkit.co/license/" target="_blank" rel="noreferrer">{language === "zh" ? "查看 Mixkit 授权" : "View Mixkit license"}</a> : null}
                  {drawerView === "support" ? <a href="https://wonderelian.com/" target="_blank" rel="noreferrer">wonderelian.com</a> : null}
                </section>
              )}
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
              transform: `translate3d(${swipeOffset * 0.08}px, -50%, 0)`,
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

          <button className={`duration-button ${timerOpen ? "is-picker-open" : ""}`} type="button" aria-expanded={timerOpen} onClick={() => {
            setMenuOpen(false);
            setTimerOpen((current) => !current);
          }}>
            <span>{isPlaying && duration !== 0 ? formatSeconds(remainingSeconds) : durationLabel(duration, language)}</span>
          </button>

          <section className="transport" aria-label={language === "zh" ? "播放控制" : "Playback controls"}>
            <button className={`icon-button favorite-button ${isFavorite ? "is-active" : ""}`} type="button" aria-label={language === "zh" ? "收藏" : "Favorite"} aria-pressed={isFavorite} onClick={() => toggleFavorite(active.id)}>
              {isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
            </button>
            <button className="icon-button transport-skip" type="button" aria-label={language === "zh" ? "上一种声音" : "Previous sound"} disabled={!previousScene} onClick={() => moveScene(-1)}>
              <TrackPreviousIcon />
            </button>
            <button className={`primary-transport ${isPlaying ? "is-playing" : ""}`} type="button" aria-label={isPlaying ? (language === "zh" ? "暂停" : "Pause") : language === "zh" ? "播放" : "Play"} aria-pressed={isPlaying} data-scene-id={active.id} onClick={() => setIsPlaying((current) => {
              if (!current) recordRecentScene(active.id);
              return !current;
            })}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button className="icon-button transport-skip" type="button" aria-label={language === "zh" ? "下一种声音" : "Next sound"} disabled={!nextScene} onClick={() => moveScene(1)}>
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
            <input aria-label={language === "zh" ? "音量" : "Volume"} type="range" min="0" max="100" value={volume} style={{ "--volume-progress": `${volume}%` } as CSSProperties} onChange={(event) => setVolume(Number(event.currentTarget.value))} />
            <SpeakerLoudIcon />
          </section>

          <p className="sound-swipe-hint">{language === "zh" ? "上滑浏览全部声音" : "SWIPE UP FOR ALL SOUNDS"}</p>

        </section>
      ) : null}

      {activeTab === "focus" ? (
        <section className="focus-screen" aria-label={language === "zh" ? "水之呼吸" : "Water breathing"}>
          <div className="section-kicker">{language === "zh" ? "静心 · FOCUS" : "FOCUS · 静心"}</div>
          <h1>{language === "zh" ? "水之呼吸" : "Water Breathing"}</h1>
          <p className="section-intro">{language === "zh" ? "吸气，停驻，流动" : "Breathe in, pause, flow"}</p>

          <div className="focus-preferences" aria-label={language === "zh" ? "静心设置" : "Focus settings"}>
            <div className="focus-duration-options">
              {focusDurations.map((minutes) => (
                <button key={minutes} type="button" className={focusDuration === minutes ? "is-active" : ""} aria-pressed={focusDuration === minutes} onClick={() => {
                  if (breathingStatus === "running" || breathingStatus === "paused") return;
                  setFocusDuration(minutes);
                  setBreathingElapsed(0);
                }}>
                  {minutes} {language === "zh" ? "分钟" : "MIN"}
                </button>
              ))}
            </div>
            <button className={`focus-sound-toggle ${focusSoundEnabled ? "is-active" : ""}`} type="button" role="switch" aria-checked={focusSoundEnabled} onClick={() => setFocusSoundEnabled((current) => !current)}>
              <WaterWavesIcon />
              <span>{language === "zh" ? "自然声" : "Nature sound"}</span>
            </button>
          </div>

          <div className={`breathing-orbit phase-${breathingPhase} status-${breathingStatus}`} aria-hidden="true">
            <span className="ripple ripple-one" />
            <span className="ripple ripple-two" />
            <span className="breathing-core" />
          </div>

          <div className="breathing-readout" aria-live="polite">
            <strong>{breathingPhaseCopy}</strong>
            <span>{formatSeconds(Math.max(breathingTotalSeconds - breathingElapsed, 0))}</span>
          </div>

          {breathingStatus === "idle" || breathingStatus === "complete" ? (
            <button className="focus-primary" type="button" onClick={beginBreathing}>
              {breathingStatus === "complete"
                ? (language === "zh" ? "再来一次" : "Begin again")
                : (language === "zh" ? `开始 ${focusDuration} 分钟` : `Start ${focusDuration} minute${focusDuration === 1 ? "" : "s"}`)}
            </button>
          ) : (
            <div className="focus-actions">
              <button type="button" aria-label={breathingStatus === "running" ? (language === "zh" ? "暂停呼吸" : "Pause breathing") : (language === "zh" ? "继续呼吸" : "Continue breathing")} onClick={() => setBreathingStatus((current) => current === "running" ? "paused" : "running")}>
                {breathingStatus === "running" ? <PauseIcon /> : <PlayIcon />}
                <span>{breathingStatus === "running" ? (language === "zh" ? "暂停" : "Pause") : (language === "zh" ? "继续" : "Continue")}</span>
              </button>
              <button type="button" onClick={resetBreathing}>
                <span>{language === "zh" ? "重新开始" : "Restart"}</span>
              </button>
            </div>
          )}

          <p className="safety-note">{language === "zh" ? "顺其自然；如有不适，请暂停。" : "Let it be easy. Pause if you feel uncomfortable."}</p>
        </section>
      ) : null}

      {activeTab === "me" ? (
        <section ref={meScreenRef} className="me-screen" data-me-view={meView} aria-label={language === "zh" ? "我的一休" : "My Yixiu"}>
          {meView === "home" ? (
            <>
              <div className="section-kicker">{language === "zh" ? "我的一休 · MY YIXIU" : "MY YIXIU · 我的一休"}</div>
              <h1>{language === "zh" ? "回到自己的节奏" : "Return to your own rhythm"}</h1>

              <div className="me-scroll">
                <section className="me-sound-space">
                  <img src={active.image} data-image-scene={active.id} alt="" />
                  <div className="me-sound-space-shade" />
                  <div className="me-sound-space-copy">
                    <small>{language === "zh" ? "声音空间" : "SOUND SPACE"}</small>
                    <strong>{language === "zh" ? active.zh : active.en}</strong>
                    <span>{language === "zh" ? "正在聆听 · 共 14 种真实自然声" : "Now listening · 14 real nature sounds"}</span>
                    <button type="button" onClick={() => setLibraryOpen(true)}><WaterWavesIcon />{language === "zh" ? "浏览全部声音" : "Browse all sounds"}</button>
                  </div>
                </section>

                <section className="me-card favorites-card">
                  <div className="card-heading">
                    <div>
                      <strong>{language === "zh" ? "我的收藏" : "Favorites"}</strong>
                      <small>{language === "zh" ? "常听的自然声" : "Your returning sounds"}</small>
                    </div>
                    <HeartIcon />
                  </div>
                  {favorites.length ? (
                    <div className="favorite-scenes">
                      {favorites.map((sceneId) => (
                        <button key={sceneId} type="button" onClick={() => selectScene(sceneId, false)}>
                          <img src={scenes[sceneId].image} data-image-scene={sceneId} alt="" />
                          <span>{language === "zh" ? scenes[sceneId].zh : scenes[sceneId].en}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-copy">{language === "zh" ? "在声音页点亮心形，常听的自然声会留在这里。" : "Tap the heart while listening and your favorite sounds will stay here."}</p>
                  )}
                </section>

                {recentScenes.length ? (
                  <section className="me-card recent-card">
                    <div className="card-heading">
                      <div>
                        <strong>{language === "zh" ? "最近聆听" : "Recently played"}</strong>
                        <small>{language === "zh" ? "一点继续，不必重新寻找" : "Continue with one tap"}</small>
                      </div>
                      <ClockIcon />
                    </div>
                    <div className="recent-scenes">
                      {recentScenes.map((sceneId) => (
                        <button key={sceneId} type="button" onClick={() => selectScene(sceneId)}>
                          <img src={sceneThumbs[sceneId]} data-image-scene={sceneId} alt="" />
                          <span>{language === "zh" ? scenes[sceneId].zh : scenes[sceneId].en}</span>
                          <small>{language === "zh" ? scenes[sceneId].useZh : scenes[sceneId].useEn}</small>
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}

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
                    <span><strong>{language === "zh" ? "界面语言" : "Language"}</strong><small>{language === "zh" ? "中英双语随时切换" : "Chinese and English"}</small></span>
                    <div className="language-switch compact">
                      <button type="button" className={language === "zh" ? "is-active" : ""} data-analytics-event="yixiu_language_change" data-analytics-value="zh" onClick={() => setLanguage("zh")}>中</button>
                      <button type="button" className={language === "en" ? "is-active" : ""} data-analytics-event="yixiu_language_change" data-analytics-value="en" onClick={() => setLanguage("en")}>EN</button>
                    </div>
                  </div>
                  <div className="setting-row">
                    <span><strong>{language === "zh" ? "结束提示音" : "End bell"}</strong><small>{language === "zh" ? "定时结束时轻声提醒" : "A gentle ending cue"}</small></span>
                    <button className={`switch-control ${endBell ? "is-active" : ""}`} role="switch" type="button" aria-label={language === "zh" ? "结束提示音" : "End bell"} aria-checked={endBell} onClick={() => setEndBell((current) => !current)}><i /></button>
                  </div>
                  <div className="setting-row">
                    <span><strong>{language === "zh" ? "后台播放" : "Background playback"}</strong><small>{language === "zh" ? "离开画面，水声仍可继续" : "Keep listening off-screen"}</small></span>
                    <button className={`switch-control ${backgroundPlayback ? "is-active" : ""}`} role="switch" type="button" aria-label={language === "zh" ? "后台播放" : "Background playback"} aria-checked={backgroundPlayback} onClick={() => setBackgroundPlayback((current) => !current)}><i /></button>
                  </div>
                </section>

                <a className="me-app-download" href="https://apps.apple.com/app/id1461182261" target="_blank" rel="noreferrer" data-analytics-event="yixiu_download_click" data-analytics-placement="me" onClick={() => setDownloadFeedback(true)}>
                  <span>
                    <small>YIXIU FOR IPHONE</small>
                    <strong>{language === "zh" ? "下载一休 App" : "Download Yixiu"}</strong>
                    <em>{language === "zh" ? "随时聆听，支持后台播放" : "Listen anytime with background playback"}</em>
                  </span>
                  <b>App Store</b>
                  <ExternalLinkIcon />
                </a>

                <p className={`download-feedback ${downloadFeedback ? "is-visible" : ""}`} role="status" aria-live="polite">
                  {language === "zh" ? "正在打开 App Store…" : "Opening the App Store…"}
                </p>

                <p className="me-group-label">{language === "zh" ? "关于一休" : "ABOUT YIXIU"}</p>
                <section className="trust-links" aria-label={language === "zh" ? "关于与支持" : "About and support"}>
                  <button type="button" onClick={() => openMeDetail("about")}><span><strong>{language === "zh" ? "关于我们" : "About Us"}</strong><small>{language === "zh" ? "一休是谁，我们相信什么" : "Who we are and what we believe"}</small></span><ChevronRightIcon /></button>
                  <button type="button" onClick={() => openMeDetail("privacy")}><span><strong>{language === "zh" ? "隐私说明" : "Privacy"}</strong><small>{language === "zh" ? "偏好只保存在这台设备" : "Preferences stay on this device"}</small></span><ChevronRightIcon /></button>
                  <button type="button" onClick={() => openMeDetail("sources")}><span><strong>{language === "zh" ? "声音来源" : "Audio sources"}</strong><small>{language === "zh" ? "真实自然录音与授权" : "Field recordings and licensing"}</small></span><ChevronRightIcon /></button>
                  <button type="button" onClick={() => openMeDetail("support")}><span><strong>{language === "zh" ? "联系与反馈" : "Contact and feedback"}</strong><small>{language === "zh" ? "邮箱与社交媒体" : "Email and social channels"}</small></span><ChevronRightIcon /></button>
                </section>

                <p className="me-group-label">{language === "zh" ? "沿途所作" : "WORKS ALONG THE WAY"}</p>
                <section className="me-works">
                  <a href="https://wonderelian.com/" target="_blank" rel="noreferrer"><b>{language === "zh" ? "一" : "01"}</b><span><strong>WonderElian</strong><em>{language === "zh" ? "让复杂的想法变得清晰、好看而有人情味" : "Make complex ideas clear, beautiful, and human"}</em><small>{language === "zh" ? "WonderElian 是永歌 Elian 的个人创作空间。这里记录作品，也记录关于设计、AI、产品，以及如何慢慢成为自己的思考与探索。" : "An independent creative world from Wuhan, connecting visual culture, wellbeing, and real life through design, AI, and digital products."}</small></span><ExternalLinkIcon /></a>
                  <a href="https://xiazishuo.com" target="_blank" rel="noreferrer"><b>{language === "zh" ? "二" : "02"}</b><span><strong>{language === "zh" ? "虾子曰" : "Xiazi Says"}</strong><em>{language === "zh" ? "昨日世界" : "Yesterday's World"}</em><small>{language === "zh" ? "每天用全球热点与双语海报，看清复杂世界。" : "Global stories and bilingual posters make the world easier to see."}</small></span><ExternalLinkIcon /></a>
                  <a href="https://human-design.wonderelian.com/" target="_blank" rel="noreferrer"><b>{language === "zh" ? "三" : "03"}</b><span><strong>{language === "zh" ? "不二 认识自己" : "Not Two · Know Yourself"}</strong><em>{language === "zh" ? "人生使用说明书" : "A User Manual for Life"}</em><small>{language === "zh" ? "看见自己的能量结构，理解真实而独特的自己。" : "See your energy design and understand your authentic, individual self."}</small></span><ExternalLinkIcon /></a>
                  <a href="https://wendao.wonderelian.com" target="_blank" rel="noreferrer"><b>{language === "zh" ? "四" : "04"}</b><span><strong>{language === "zh" ? "三慢问道" : "Wendao"}</strong><em>{language === "zh" ? "道德经" : "Tao Te Ching"}</em><small>{language === "zh" ? "读懂经典，也在慢下来时读懂自己。" : "Read the classic slowly—and yourself with it."}</small></span><ExternalLinkIcon /></a>
                  <a href="https://style-atlas.wonderelian.com" target="_blank" rel="noreferrer"><b>{language === "zh" ? "五" : "05"}</b><span><strong>{language === "zh" ? "艺术风格图鉴" : "Style Atlas"}</strong><em>{language === "zh" ? "学习看懂一种美" : "Learn to see a style"}</em><small>{language === "zh" ? "沿着艺术与设计风格的脉络，找到自己的观看方式。" : "Follow art and design lineages to find your own way of looking."}</small></span><ExternalLinkIcon /></a>
                </section>

                <p className="me-philosophy-footnote">{language === "zh" ? "向内认识自己，向外如水而行。" : "Know within. Move like water."}</p>
              </div>
            </>
          ) : (
            <div
              className={`me-detail-view ${meBackDragging ? "is-back-dragging" : ""}`}
              style={{ transform: `translate3d(${meBackOffset}px, 0, 0)` }}
              onPointerDown={startMeBackSwipe}
              onPointerMove={moveMeBackSwipe}
              onPointerUp={finishMeBackSwipe}
              onPointerCancel={finishMeBackSwipe}
            >
              <header className="me-detail-header">
                <button type="button" aria-label={language === "zh" ? "返回" : "Back"} onClick={returnToMeHome}><ArrowLeftIcon /></button>
                <div><small>一休 · YIXIU</small><strong>{meView === "about" ? (language === "zh" ? "关于我们" : "About Us") : meView === "privacy" ? (language === "zh" ? "隐私说明" : "Privacy") : meView === "sources" ? (language === "zh" ? "声音来源" : "Audio Sources") : (language === "zh" ? "联系与反馈" : "Contact")}</strong></div>
              </header>
              <div className="me-detail-scroll">
                {meView === "about" ? (
                  <article className="me-article me-about">
                    <small>{language === "zh" ? "真实自己，流动人生" : "TRUE TO YOURSELF. FLOW WITH LIFE."}</small>
                    <h2>{language === "zh" ? "一休，是一处让声音带你回到当下的空间。" : "Yixiu is a space where sound brings you back to the present."}</h2>
                    <p>{language === "zh" ? "我们用真实自然声、定时聆听与水之呼吸，陪你在工作、阅读、睡眠或情绪起伏时先停一停，照顾身体，听见自己，再继续前行。" : "Through real nature sounds, timed listening and water breathing, we help you pause, care for the body, hear yourself and continue—through work, reading, sleep and emotional change."}</p>
                    <section className="life-philosophy">
                      <small>{language === "zh" ? "我们的生命观" : "OUR PHILOSOPHY OF LIFE"}</small>
                      <h3>{language === "zh" ? "生命不是用来证明自己的，而是用来认识、接纳、成为并活出自己。" : "Life is not for proving yourself. It is for knowing, accepting, becoming, and living as yourself."}</h3>
                      <p>{language === "zh" ? "真正的成长，不是把自己改造成某个标准答案，而是在变化中越来越诚实地看见自己，越来越从容地选择自己的活法。" : "Growth is not the work of turning yourself into a standard answer. It is learning to see yourself more honestly through change, and to choose your way of living with greater ease."}</p>
                      <div className="life-path" aria-label={language === "zh" ? "核心路径" : "Core path"}>
                        {(language === "zh" ? ["认识自己", "接纳自己", "成为自己", "活出自己"] : ["Know yourself", "Accept yourself", "Become yourself", "Live as yourself"]).map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}
                      </div>
                      <div className="life-principles">
                        {(language === "zh" ? [
                          ["一休", "先照顾身体，安顿情绪，再继续前行。"],
                          ["不二", "接纳高峰与低谷，拥抱完整而非完美。"],
                          ["三慢", "慢下来、慢慢来、慢慢成为，尊重生命的节奏。"],
                          ["如水", "向内扎根，向外流动；顺应变化，不失本心。"],
                        ] : [
                          ["Pause", "Care for the body, settle emotion, then continue."],
                          ["Wholeness", "Accept peaks and valleys; choose wholeness over perfection."],
                          ["Go slowly", "Slow down, take your time, and respect the rhythm of becoming."],
                          ["Be Water", "Root inwardly, move outwardly; adapt without losing your center."],
                        ]).map(([title, body]) => <article key={title}><strong>{title}</strong><p>{body}</p></article>)}
                      </div>
                      <blockquote>{language === "zh" ? "向内认识自己，向外如水而行。" : "Know yourself within; move through the world like water."}</blockquote>
                      <p className="life-vision">{language === "zh" ? "我们愿陪伴彼此走过低谷与高峰，探索身心健康的工作与生活方式；真实面对自己与世界，善待自己、他人与生命，并在创造和欣赏中活出生命之美。" : "We hope to accompany one another through valleys and peaks, exploring healthier ways to work and live: facing self and world truthfully, treating life with kindness, and creating and appreciating beauty."}</p>
                    </section>
                  </article>
                ) : meView === "privacy" ? (
                  <article className="me-article"><small>{language === "zh" ? "你的数据" : "YOUR DATA"}</small><h2>{language === "zh" ? "安静，也应该是私密的" : "Quiet should remain private"}</h2><p>{language === "zh" ? "一休无需账号。声音、收藏、语言、音量与定时时长只保存在当前设备。" : "Yixiu requires no account. Your sound, favorites, language, volume and timer preferences stay on this device."}</p><p>{language === "zh" ? "一休不会读取位置、照片、通讯录或健康数据。清除浏览器数据会同时移除本地偏好。" : "Yixiu does not access location, photos, contacts or health data. Clearing browser data also removes local preferences."}</p><blockquote>{language === "zh" ? "少一些记录，多一些当下。" : "Less tracking. More presence."}</blockquote></article>
                ) : meView === "sources" ? (
                  <article className="me-article"><small>{language === "zh" ? "真实自然录音" : "FIELD RECORDINGS"}</small><h2>{language === "zh" ? "每个场景，都有相应的声音" : "A fitting sound for every scene"}</h2><p>{language === "zh" ? "鸟语、雨声、河流、海浪、瀑布、远雷与山风均使用对应的自然环境录音，不以合成噪音替代具名场景。" : "Birds, rain, rivers, waves, waterfalls, thunder and wind use matching field recordings rather than generic generated noise."}</p><p>{language === "zh" ? "录音素材按 Mixkit Sound Effects Free License 使用。" : "Recordings are used under the Mixkit Sound Effects Free License."}</p><a href="https://mixkit.co/license/" target="_blank" rel="noreferrer">{language === "zh" ? "查看 Mixkit 授权" : "View Mixkit license"}</a></article>
                ) : (
                  <article className="me-article me-contact"><small>{language === "zh" ? "联系与反馈" : "CONTACT"}</small><h2>{language === "zh" ? "让一休更像你需要的样子" : "Help Yixiu become more useful to you"}</h2><p>{language === "zh" ? "如果声音无法播放、画面显示异常，或你希望加入新的自然声，请告诉我们设备、系统版本与声音名称。" : "If audio cannot play, a scene looks wrong, or you would like a new sound, tell us your device, system version and the sound name."}</p><div className="me-contact-list"><a href="https://wonderelian.com/" target="_blank" rel="noreferrer"><span>WonderElian</span><strong>wonderelian.com</strong></a><a href="mailto:hustyy986@gmail.com?subject=Yixiu%20Feedback"><span>{language === "zh" ? "邮箱" : "Email"}</span><strong>hustyy986@gmail.com</strong></a><a href="https://xhslink.cn/m/3OF5qu7Peui" target="_blank" rel="noreferrer"><span>{language === "zh" ? "小红书" : "RED"}</span><strong>{language === "zh" ? "打开主页" : "Open profile"}</strong></a><a href="https://v.douyin.com/d9L1thkye0Y/" target="_blank" rel="noreferrer"><span>{language === "zh" ? "抖音" : "Douyin"}</span><strong>{language === "zh" ? "打开主页" : "Open profile"}</strong></a><a href="https://x.com/yongyuan1?s=11" target="_blank" rel="noreferrer"><span>X</span><strong>@yongyuan1</strong></a><a href="https://www.tiktok.com/@wonderelian" target="_blank" rel="noreferrer"><span>TikTok</span><strong>@wonderelian</strong></a><button type="button" onClick={() => setVideoChannelOpen(true)}><span>{language === "zh" ? "视频号" : "WeChat Channels"}</span><strong>{language === "zh" ? "查看二维码" : "View QR code"}</strong></button></div></article>
                )}
              </div>
            </div>
          )}
        </section>
      ) : null}

      <nav className="bottom-nav" aria-label={language === "zh" ? "主导航" : "Main navigation"}>
        <button type="button" className={activeTab === "sounds" ? "is-active" : ""} aria-current={activeTab === "sounds" ? "page" : undefined} data-analytics-event="yixiu_tab_select" data-analytics-value="sounds" onClick={() => { setActiveTab("sounds"); setMeView("home"); }}><span className="nav-icon"><WaterWavesIcon /></span><span className="nav-label">{language === "zh" ? "声音" : "Sounds"}</span><small>{language === "zh" ? "SOUNDS" : "声音"}</small></button>
        <button type="button" className={activeTab === "focus" ? "is-active" : ""} aria-current={activeTab === "focus" ? "page" : undefined} data-analytics-event="yixiu_tab_select" data-analytics-value="focus" onClick={() => { setActiveTab("focus"); setMeView("home"); }}><span className="nav-icon"><span className="nav-focus-orbit" /></span><span className="nav-label">{language === "zh" ? "静心" : "Focus"}</span><small>{language === "zh" ? "FOCUS" : "静心"}</small></button>
        <button type="button" className={activeTab === "me" ? "is-active" : ""} aria-current={activeTab === "me" ? "page" : undefined} data-analytics-event="yixiu_tab_select" data-analytics-value="me" onClick={() => { setActiveTab("me"); setMeView("home"); }}><span className="nav-icon"><PersonIcon /></span><span className="nav-label">{language === "zh" ? "我的" : "Me"}</span><small>{language === "zh" ? "ME" : "我的"}</small></button>
      </nav>

      {libraryOpen ? (
        <>
          <button className="library-scrim" type="button" aria-label={language === "zh" ? "关闭声音库" : "Close sound library"} onClick={() => setLibraryOpen(false)} />
          <section className="sound-library" role="dialog" aria-modal="true" aria-label={language === "zh" ? "声音库" : "Sound library"}>
            <div className="sheet-handle" />
            <header><div><small>{language === "zh" ? "十四种真实自然录音" : "14 REAL NATURE SOUNDS"}</small><h2>{language === "zh" ? "声音库" : "Sound Library"}</h2></div><button type="button" onClick={() => setLibraryOpen(false)}>{language === "zh" ? "完成" : "Done"}</button></header>
            <div className="scene-category-tabs" role="tablist" aria-label={language === "zh" ? "声音分类" : "Sound categories"}>
              {sceneCategories.map((category) => (
                <button key={category} type="button" role="tab" aria-selected={sceneCategory === category} className={sceneCategory === category ? "is-active" : ""} onClick={() => setSceneCategory(category)}>
                  {categoryLabel(category, language)}
                </button>
              ))}
            </div>
            <div className="scene-grid">
              {filteredSceneOrder.map((sceneId) => {
                const scene = scenes[sceneId];
                return <article key={scene.id} className={activeScene === scene.id ? "is-active" : ""}><button className="scene-select" type="button" data-scene-id={scene.id} aria-label={language === "zh" ? `切换到${scene.zh}` : `Switch to ${scene.en}`} onClick={() => selectScene(scene.id)}><img src={sceneThumbs[scene.id]} data-image-scene={scene.id} alt="" loading="eager" decoding="async" /><span className="scene-card-shade" /><span className="scene-card-copy"><strong>{language === "zh" ? scene.zh : scene.en}</strong><small>{language === "zh" ? scene.en : scene.zh}</small><em>{language === "zh" ? scene.useZh : scene.useEn}</em></span></button><button className="scene-favorite" type="button" aria-label={language === "zh" ? `收藏${scene.zh}` : `Favorite ${scene.en}`} aria-pressed={favorites.includes(scene.id)} onClick={() => toggleFavorite(scene.id)}>{favorites.includes(scene.id) ? <HeartFilledIcon /> : <HeartIcon />}</button></article>;
              })}
            </div>
          </section>
        </>
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

      {videoChannelOpen ? (
        <div className="video-channel-modal" role="dialog" aria-modal="true" aria-label={language === "zh" ? "视频号二维码" : "WeChat Channels QR code"}>
          <button className="video-channel-backdrop" type="button" aria-label={language === "zh" ? "关闭" : "Close"} onClick={() => setVideoChannelOpen(false)} />
          <figure>
            <button type="button" aria-label={language === "zh" ? "关闭" : "Close"} onClick={() => setVideoChannelOpen(false)}>×</button>
            <img src="/assets/yixiu/video-channel.jpg" alt={language === "zh" ? "WonderElian 视频号二维码" : "WonderElian WeChat Channels QR code"} />
            <figcaption>{language === "zh" ? "扫码关注视频号" : "Scan to follow on WeChat Channels"}</figcaption>
          </figure>
        </div>
      ) : null}

    </main>
  );
}
