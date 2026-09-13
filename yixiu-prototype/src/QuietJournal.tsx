import { useState } from "react";
import entries from "./data/quiet-journal.json";

export type QuietArticle = typeof entries[number];
export const quietArticles = entries;
export function journalPath(language: "zh" | "en", slug = "") {
  return `/journal/${language === "zh" ? "zh/" : ""}${slug ? slug + "/" : ""}`;
}

export function QuietJournal({ language, articleId, onArticle, onPractice }: {
  language: "zh" | "en";
  articleId: string | null;
  onArticle: (id: string) => void;
  onPractice: (article: QuietArticle) => void;
}) {
  const [category, setCategory] = useState("all");
  const article = entries.find(entry => entry.slug === articleId);
  if (article) {
    const copy = article[language];
    return <article className="quiet-journal quiet-article">
      <img className="quiet-article-image" src={article.image} alt="" />
      <div className="quiet-meta"><span>{copy.category}</span><span>{copy.readTime}</span></div>
      <h3>{copy.title}</h3><p className="quiet-intro">{copy.summary}</p>
      {copy.sections.map(section => <section key={section.title}><h4>{section.title}</h4><p>{section.body}</p></section>)}
      <button className="quiet-practice" type="button" data-analytics-event="yixiu_journal_practice" data-analytics-value={article.slug} onClick={() => onPractice(article)}>{copy.cta}<span aria-hidden="true">↗</span></button>
      <a className="quiet-permalink" href={journalPath(language, article.slug)} target="_blank" rel="noreferrer" data-analytics-event="yixiu_journal_permalink" data-analytics-value={article.slug}>{language === "zh" ? "打开独立阅读页" : "Open reading page"} ↗</a>
      <p className="quiet-date">{language === "zh" ? "一休编辑 · " : "Yixiu Editorial · "}<time dateTime={article.date}>{article.date}</time></p>
    </article>;
  }
  return <section className="quiet-journal" aria-label={language === "zh" ? "一休日常文章" : "Quiet Journal articles"}>
    <p className="quiet-intro">{language === "zh" ? "把安静放进日常。关于睡前、专注，和属于自己的片刻。" : "A little quiet in everyday life. Notes for rest, focus, and a moment of your own."}</p>
    <div className="quiet-filters" aria-label={language === "zh" ? "文章分类" : "Article categories"}>
      {(["all", "sleep", "focus", "reset"] as const).map((key, index) => <button type="button" key={key} aria-pressed={category === key} onClick={() => setCategory(key)}>{(language === "zh" ? ["全部", "睡前", "专注", "片刻"] : ["All", "Rest", "Focus", "Pause"])[index]}</button>)}
    </div>
    <div className="quiet-articles">{entries.filter(entry => category === "all" || entry.category === category).map(entry => <button className="quiet-card" type="button" key={entry.slug} data-analytics-event="yixiu_journal_read" data-analytics-value={entry.slug} onClick={() => onArticle(entry.slug)}>
      <img src={entry.image} alt="" loading="lazy" /><span className="quiet-card-copy"><span className="quiet-meta">{entry[language].category} · {entry[language].readTime}</span><strong>{entry[language].title}</strong><span>{entry[language].summary}</span><span className="quiet-card-link">{language === "zh" ? "读一读" : "Read the note"} ↗</span></span>
    </button>)}</div>
    <a className="quiet-permalink" href={journalPath(language)} target="_blank" rel="noreferrer">{language === "zh" ? "浏览独立栏目页" : "Browse the journal"} ↗</a>
  </section>;
}
