import { ChevronDownIcon, Cross2Icon, HeartFilledIcon, HeartIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { LibraryScope } from "./library";

type Item = { id: string; zh: string; en: string; useZh: string; useEn: string };
type Props<T extends Item, C extends string> = {
  language: "zh" | "en"; items: readonly T[]; activeID: string;
  scope: LibraryScope; query: string; category: C; categories: readonly { id: C; label: string }[];
  favorites: readonly string[]; recent: readonly string[];
  thumbnails: Record<string, string>; badge: (id: T["id"]) => ReactNode;
  onScope: (scope: LibraryScope) => void; onQuery: (query: string) => void; onCategory: (category: C) => void;
  onSelect: (id: T["id"]) => void; onFavorite: (id: T["id"]) => void; onClose: () => void;
};

export function SoundLibrary<T extends Item, C extends string>(props: Props<T, C>) {
  const { language, items, scope, query, category } = props;
  const zh = language === "zh";
  const grid = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchOpen, setSearchOpen] = useState(Boolean(query));
  useEffect(() => { grid.current?.scrollTo({ top: 0 }); }, [scope, query, category]);
  useEffect(() => { if (searchOpen) searchInput.current?.focus(); }, [searchOpen]);
  const labels = zh ? ["全部", "免费", "收藏", "最近听过"] : ["All", "Free", "Favorites", "Recent"];
  const scopeValues = ["all", "free", "favorites", "recent"] as const;
  const reset = () => { props.onQuery(""); props.onScope("all"); props.onCategory(props.categories[0].id); };
  const toggleSearch = () => {
    if (searchOpen && query) props.onQuery("");
    setSearchOpen(!searchOpen);
  };
  return <section className="sound-library" data-modal="library" role="dialog" aria-modal="true" aria-label={zh ? "声音库" : "Sound library"}>
    <div className="sheet-handle" />
    <header className="library-header">
      <div className="library-title-row">
        <h2>{zh ? "声音库" : "Sound Library"}</h2>
        <span className="library-header-spacer" />
        <button className="library-close-button" type="button" data-modal-initial aria-label={zh ? "关闭声音库" : "Close sound library"} onClick={props.onClose}><Cross2Icon /></button>
      </div>
      <div className="library-filter-row">
        <button className="library-tool-button" type="button" aria-label={zh ? "搜索声音" : "Search sounds"} aria-expanded={searchOpen} onClick={toggleSearch}><MagnifyingGlassIcon /></button>
        <span className="library-filter-label">{zh ? "显示" : "Show"}</span>
        <label className="library-scope-select">
          <select aria-label={zh ? "聆听筛选" : "Listening filter"} value={scope} onChange={event => props.onScope(event.currentTarget.value as LibraryScope)}>
            {scopeValues.map((value, index) => <option key={value} value={value}>{labels[index]}</option>)}
          </select>
          <ChevronDownIcon aria-hidden="true" />
        </label>
      </div>
    </header>
    {searchOpen ? <div className="library-search">
      <MagnifyingGlassIcon aria-hidden="true" />
      <input ref={searchInput} type="search" aria-label={zh ? "搜索声音、曲名或作曲家" : "Search sounds, titles or composers"} placeholder={zh ? "搜索声音、曲名或作曲家" : "Sound, title or composer"} value={query} onChange={event => props.onQuery(event.currentTarget.value)} />
      {query ? <button type="button" aria-label={zh ? "清除搜索" : "Clear search"} onClick={() => props.onQuery("")}><Cross2Icon /></button> : null}
    </div> : null}
    <div className="scene-category-tabs" role="tablist" aria-label={zh ? "声音分类" : "Sound categories"}>
      {props.categories.map((value, index) => <button key={value.id} type="button" role="tab" tabIndex={category === value.id ? 0 : -1} aria-selected={category === value.id} className={category === value.id ? "is-active" : ""} onClick={() => props.onCategory(value.id)} onKeyDown={event => {
        const n = props.categories.length;
        const next = event.key === "ArrowRight" ? (index + 1) % n : event.key === "ArrowLeft" ? (index + n - 1) % n : event.key === "Home" ? 0 : event.key === "End" ? n - 1 : -1;
        if (next < 0) return;
        event.preventDefault(); props.onCategory(props.categories[next].id);
        const target = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next];
        target?.focus(); target?.scrollIntoView({ block: "nearest", inline: "nearest" });
      }}>{value.label}</button>)}
    </div>
    <div className="scene-grid" ref={grid}>
      {!items.length ? <div className="library-empty"><strong>{zh ? "这里还没有声音" : "No sounds here yet"}</strong><p>{scope === "favorites" && !props.favorites.length ? (zh ? "点声音卡片上的心形，就能把喜欢的声音留在这里。" : "Tap a card’s heart to keep a favorite here.") : scope === "recent" && !props.recent.length ? (zh ? "开始聆听后，你最近听过的声音会出现在这里。" : "Your recent sounds will appear after listening.") : (zh ? "换一个词，或清除筛选再看看。" : "Try another word, or clear your filters.")}</p><button type="button" onClick={reset}>{zh ? "查看全部声音" : "Browse all sounds"}</button></div> : null}
      {items.map(item => <article key={item.id} className={props.activeID === item.id ? "is-active" : ""}>
        <button className="scene-select" type="button" data-scene-id={item.id} aria-label={zh ? `切换到${item.zh}` : `Switch to ${item.en}`} onClick={() => props.onSelect(item.id)}>
          <img src={props.thumbnails[item.id]} data-image-scene={item.id} alt="" loading="lazy" decoding="async" />
          <span className="scene-card-shade" /><span className="scene-card-copy"><strong>{zh ? item.zh : item.en}</strong><small>{zh ? item.en : item.zh}</small><em>{zh ? item.useZh : item.useEn}</em></span>{props.badge(item.id)}
        </button>
        <button className="scene-favorite" type="button" aria-label={zh ? `收藏${item.zh}` : `Favorite ${item.en}`} aria-pressed={props.favorites.includes(item.id)} onClick={() => props.onFavorite(item.id)}>{props.favorites.includes(item.id) ? <HeartFilledIcon /> : <HeartIcon />}</button>
      </article>)}
    </div>
  </section>;
}
