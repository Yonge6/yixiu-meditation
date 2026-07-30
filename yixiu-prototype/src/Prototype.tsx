import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ClockIcon,
  OpacityIcon,
  PauseIcon,
  PersonIcon,
  SpeakerLoudIcon,
  TargetIcon,
  TriangleRightIcon,
} from "@radix-ui/react-icons";
import { MobileScroll } from "./mobile";

type Language = "zh" | "en";
type SceneId = "morning" | "rain" | "ocean" | "stream";
type TabId = "listen" | "focus" | "me";

const scenes = {
  morning: {
    zh: "晨雾之水",
    en: "Morning Water",
    image: "/assets/yixiu/morning-water-hero.png",
  },
  rain: {
    zh: "雨声",
    en: "Rain",
    image: "/assets/yixiu/rain.jpg",
  },
  ocean: {
    zh: "海浪",
    en: "Ocean",
    image: "/assets/yixiu/ocean.jpg",
  },
  stream: {
    zh: "溪流",
    en: "Flow",
    image: "/assets/yixiu/stream.jpg",
  },
} satisfies Record<SceneId, { zh: string; en: string; image: string }>;

const durations = [15, 30, 60] as const;

function stopAudioGraph(graph: AudioGraph | null) {
  if (!graph) return;
  graph.source.stop();
  graph.lfo?.stop();
  void graph.context.close();
}

type AudioGraph = {
  context: AudioContext;
  source: AudioBufferSourceNode;
  lfo?: OscillatorNode;
};

function useAmbientSound(scene: SceneId, isPlaying: boolean) {
  const graphRef = useRef<AudioGraph | null>(null);

  useEffect(() => {
    stopAudioGraph(graphRef.current);
    graphRef.current = null;
    if (!isPlaying) return;

    const context = new AudioContext();
    const seconds = 3;
    const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = Math.random() * 2 - 1;
    }

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    let lfo: OscillatorNode | undefined;

    if (scene === "rain") {
      filter.type = "highpass";
      filter.frequency.value = 900;
      gain.gain.value = 0.035;
    } else if (scene === "ocean") {
      filter.type = "lowpass";
      filter.frequency.value = 520;
      gain.gain.value = 0.075;
      lfo = context.createOscillator();
      const lfoGain = context.createGain();
      lfo.frequency.value = 0.12;
      lfoGain.gain.value = 0.035;
      lfo.connect(lfoGain).connect(gain.gain);
      lfo.start();
    } else if (scene === "stream") {
      filter.type = "bandpass";
      filter.frequency.value = 1500;
      filter.Q.value = 0.7;
      gain.gain.value = 0.045;
    } else {
      filter.type = "lowpass";
      filter.frequency.value = 720;
      gain.gain.value = 0.04;
    }

    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
    void context.resume();
    graphRef.current = { context, source, lfo };

    return () => {
      stopAudioGraph(graphRef.current);
      graphRef.current = null;
    };
  }, [isPlaying, scene]);
}

function formatRemaining(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function Prototype() {
  const [language, setLanguage] = useState<Language>("zh");
  const [activeScene, setActiveScene] = useState<SceneId>("morning");
  const [activeTab, setActiveTab] = useState<TabId>("listen");
  const [duration, setDuration] = useState<(typeof durations)[number]>(15);
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);

  useAmbientSound(activeScene, isPlaying);

  useEffect(() => {
    setRemainingSeconds(duration * 60);
  }, [duration, activeScene]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          setIsPlaying(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const active = scenes[activeScene];
  const orderedScenes = useMemo(
    () =>
      (["rain", "ocean", "stream"] as const).map((id) => ({
        id,
        ...scenes[id],
      })),
    [],
  );

  const chooseScene = (scene: SceneId) => {
    setActiveScene(scene);
    setIsPlaying(true);
    setActiveTab("listen");
  };

  const chooseTab = (tab: TabId) => {
    setActiveTab(tab);
    if (tab !== "listen") setIsPlaying(false);
  };

  return (
    <div className="yixiu-app" data-language={language}>
      <MobileScroll className="yixiu-scroll">
        {activeTab === "listen" ? (
          <main className="listen-screen" aria-label={language === "zh" ? "聆听首页" : "Listen home"}>
            <section className="morning-hero">
              <header className="hero-header">
                <div>
                  <h1>{language === "zh" ? "早上好" : "Good morning"}</h1>
                  <p className="eyebrow-secondary">{language === "zh" ? "GOOD MORNING" : "早上好"}</p>
                </div>
              </header>
              <div className="hero-philosophy">
                <p className="philosophy-primary">
                  {language === "zh" ? "真实自己，流动人生" : "True to yourself, flow with life"}
                </p>
                <p className="philosophy-secondary">
                  {language === "zh" ? "TRUE TO YOURSELF, FLOW WITH LIFE" : "真实自己，流动人生"}
                </p>
              </div>
            </section>

            <section className="water-sheet" aria-live="polite">
              <div className="scene-heading">
                <span className="drop-mark" aria-hidden="true">
                  <OpacityIcon />
                </span>
                <div>
                  <h2>{language === "zh" ? active.zh : active.en}</h2>
                  <p>{language === "zh" ? active.en.toUpperCase() : active.zh}</p>
                </div>
              </div>

              <button
                className={`primary-play ${isPlaying ? "is-playing" : ""}`}
                type="button"
                aria-label={isPlaying ? "暂停" : "播放"}
                aria-pressed={isPlaying}
                onClick={() => setIsPlaying((current) => !current)}
              >
                {isPlaying ? <PauseIcon /> : <TriangleRightIcon />}
              </button>

              <div className="session-meta">
                <strong>{isPlaying ? formatRemaining(remainingSeconds) : `${duration} ${language === "zh" ? "分钟" : "MIN"}`}</strong>
                <span>
                  {isPlaying
                    ? (language === "zh" ? "正在流动" : "FLOWING NOW")
                    : language === "zh"
                      ? `${duration} MIN`
                      : `${duration} 分钟`}
                </span>
              </div>

              <div className="water-wisdom">
                <span />
                <div>
                  <strong>{language === "zh" ? "如水而行" : "Be water, my friend."}</strong>
                  <small>{language === "zh" ? "BE WATER, MY FRIEND." : "如水而行"}</small>
                </div>
                <span />
              </div>

              <div className="scene-grid" aria-label={language === "zh" ? "自然声音" : "Nature sounds"}>
                {orderedScenes.map((scene) => (
                  <button
                    className={`scene-card ${activeScene === scene.id ? "is-active" : ""}`}
                    key={scene.id}
                    type="button"
                    onClick={() => chooseScene(scene.id)}
                    aria-pressed={activeScene === scene.id}
                  >
                    <img src={scene.image} alt="" draggable={false} />
                    <span className="scene-card-copy">
                      <strong>{language === "zh" ? scene.zh : scene.en}</strong>
                      <small>{language === "zh" ? scene.en.toUpperCase() : scene.zh}</small>
                    </span>
                    <span className="scene-card-play" aria-hidden="true">
                      {activeScene === scene.id && isPlaying ? <PauseIcon /> : <TriangleRightIcon />}
                    </span>
                  </button>
                ))}
              </div>

              <div className="controls-row">
                <div className="timer-wrap">
                  <button
                    className="timer-control"
                    type="button"
                    onClick={() => setTimerOpen((current) => !current)}
                    aria-expanded={timerOpen}
                  >
                    <ClockIcon />
                    <span>
                      <strong>{duration} {language === "zh" ? "分钟" : "MIN"}</strong>
                      <small>{duration} {language === "zh" ? "MIN" : "分钟"}</small>
                    </span>
                    <ChevronDownIcon />
                  </button>
                  {timerOpen ? (
                    <div className="timer-options" role="menu" aria-label="Timer duration">
                      {durations.map((minutes) => (
                        <button
                          key={minutes}
                          type="button"
                          role="menuitem"
                          className={duration === minutes ? "is-selected" : ""}
                          onClick={() => {
                            setDuration(minutes);
                            setTimerOpen(false);
                          }}
                        >
                          {minutes}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="language-control" aria-label="Language">
                  <button
                    type="button"
                    className={language === "zh" ? "is-selected" : ""}
                    onClick={() => setLanguage("zh")}
                    aria-pressed={language === "zh"}
                  >
                    中
                  </button>
                  <i />
                  <button
                    type="button"
                    className={language === "en" ? "is-selected" : ""}
                    onClick={() => setLanguage("en")}
                    aria-pressed={language === "en"}
                  >
                    EN
                  </button>
                </div>
              </div>
            </section>
          </main>
        ) : activeTab === "focus" ? (
          <FocusScreen language={language} />
        ) : (
          <MeScreen language={language} duration={duration} setDuration={setDuration} />
        )}
      </MobileScroll>

      <nav className="bottom-nav" aria-label={language === "zh" ? "主导航" : "Main navigation"}>
        <NavButton
          active={activeTab === "listen"}
          icon={<SpeakerLoudIcon />}
          primary={language === "zh" ? "聆听" : "Listen"}
          secondary={language === "zh" ? "LISTEN" : "聆听"}
          onClick={() => chooseTab("listen")}
        />
        <NavButton
          active={activeTab === "focus"}
          icon={<TargetIcon />}
          primary={language === "zh" ? "静心" : "Focus"}
          secondary={language === "zh" ? "FOCUS" : "静心"}
          onClick={() => chooseTab("focus")}
        />
        <NavButton
          active={activeTab === "me"}
          icon={<PersonIcon />}
          primary={language === "zh" ? "我的" : "Me"}
          secondary={language === "zh" ? "ME" : "我的"}
          onClick={() => chooseTab("me")}
        />
      </nav>
    </div>
  );
}

function NavButton({
  active,
  icon,
  primary,
  secondary,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  primary: string;
  secondary: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? "is-active" : ""}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      <strong>{primary}</strong>
      <small>{secondary}</small>
    </button>
  );
}

function FocusScreen({ language }: { language: Language }) {
  const [running, setRunning] = useState(false);

  return (
    <main className="secondary-screen focus-screen">
      <div className={`breathing-water ${running ? "is-running" : ""}`}>
        <OpacityIcon />
      </div>
      <p className="secondary-kicker">{language === "zh" ? "水的呼吸" : "WATER BREATH"}</p>
      <h1>{language === "zh" ? "吸气，停留，流动" : "Breathe in, pause, flow"}</h1>
      <p>
        {language === "zh"
          ? "跟随水波完成一分钟呼吸练习。"
          : "Follow the ripple through a one-minute breathing practice."}
      </p>
      <button type="button" className="secondary-cta" onClick={() => setRunning((current) => !current)}>
        {running ? (language === "zh" ? "暂停" : "Pause") : language === "zh" ? "开始 1 分钟" : "Start 1 minute"}
      </button>
    </main>
  );
}

function MeScreen({
  language,
  duration,
  setDuration,
}: {
  language: Language;
  duration: number;
  setDuration: (value: 15 | 30 | 60) => void;
}) {
  return (
    <main className="secondary-screen me-screen">
      <div className="profile-mark">
        <PersonIcon />
      </div>
      <p className="secondary-kicker">{language === "zh" ? "我的一休" : "MY YIXIU"}</p>
      <h1>{language === "zh" ? "把节奏交还给自己" : "Return to your own rhythm"}</h1>
      <section className="settings-panel">
        <div>
          <span>{language === "zh" ? "默认计时" : "Default timer"}</span>
          <strong>{duration} {language === "zh" ? "分钟" : "min"}</strong>
        </div>
        <div className="duration-chips">
          {durations.map((minutes) => (
            <button
              key={minutes}
              type="button"
              className={duration === minutes ? "is-selected" : ""}
              onClick={() => setDuration(minutes)}
            >
              {minutes}
            </button>
          ))}
        </div>
      </section>
      <p className="privacy-note">
        {language === "zh"
          ? "首版不需要账号，所有偏好只保存在本机。"
          : "No account is required. Preferences stay on this device."}
      </p>
    </main>
  );
}
