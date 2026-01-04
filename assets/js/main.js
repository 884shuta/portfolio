// I18Nデータ（国際化）
const i18n = {
  en: {
    // ナビゲーション
    nav_projects: "Projects", nav_about: "About", nav_contact: "Contact",
    // ヒーローセクション
    hero_title: "Creative Developer",
    hero_desc: "Building digital products with a focus on modern aesthetics, performance, and user experience.",
    hero_cta: "View My Work",
    // 注目プロジェクト
    featured_title: "Featured Projects",
    view_all: "View All Projects",
    loading: "Loading...",
    footer: "&copy; 2026 884shuta.",
    // プロジェクトページ
    projects_title: "All Projects",
    projects_desc: "Explore my latest work and side projects.",
    search_placeholder: "Search projects...",
    btn_view: "View Project",
    // Aboutページ
    about_title: "About Me",
    about_profile_title: "Profile",
    about_profile_desc: "I am a passionate frontend developer and UI/UX enthusiast. I love turning complex problems into simple, beautiful, and intuitive interface designs.",
    about_profile_desc2: "With a background in computer science and design, I bridge the gap between engineering and art.",
    about_skills_title: "Skills",
    about_exp_title: "Experience",
    about_exp_1_role: "Senior Frontend Engineer",
    about_exp_1_comp: "Tech Corp Inc.",
    about_exp_2_role: "Web Developer",
    about_exp_2_comp: "Creative Studio",
    about_exp_3_role: "Junior Designer",
    about_exp_3_comp: "Design Agency",
    // Contactページ
    contact_title: "Get In Touch",
    contact_desc: "I'm currently available for freelance work and open to full-time opportunities. If you have a project in mind, let's chat.",
    contact_email: "Email",
    contact_github: "GitHub",
    contact_twitter: "Twitter",
    contact_linkedin: "LinkedIn",
    contact_instagram: "Instagram"
  },
  ja: {
    // ナビゲーション
    nav_projects: "実績", nav_about: "私について", nav_contact: "連絡先",
    // ヒーローセクション
    hero_title: "クリエイティブ・デベロッパー",
    hero_desc: "モダンな美学、パフォーマンス、UXに焦点を当てたデジタルプロダクトを構築します。",
    hero_cta: "実績を見る",
    // 注目プロジェクト
    featured_title: "注目のプロジェクト",
    view_all: "すべてのプロジェクトを見る",
    loading: "読み込み中...",
    footer: "&copy; 2026 884shuta.",
    // プロジェクトページ
    projects_title: "プロジェクト一覧",
    projects_desc: "最新の仕事やサイドプロジェクトをご覧ください。",
    search_placeholder: "プロジェクトを検索...",
    btn_view: "詳細を見る",
    // Aboutページ
    about_title: "私について",
    about_profile_title: "プロフィール",
    about_profile_desc: "フロントエンド開発とUI/UXデザインに情熱を注いでいます。複雑な問題をシンプルで美しく、直感的なインターフェースに変えることが好きです。",
    about_profile_desc2: "コンピュータサイエンスとデザインのバックグラウンドを持ち、エンジニアリングとアートの架け橋となります。",
    about_skills_title: "スキル",
    about_exp_title: "経歴",
    about_exp_1_role: "シニアフロントエンドエンジニア",
    about_exp_1_comp: "テックコープ株式会社",
    about_exp_2_role: "ウェブ開発者",
    about_exp_2_comp: "クリエイティブスタジオ",
    about_exp_3_role: "ジュニアデザイナー",
    about_exp_3_comp: "デザインエージェンシー",
    // Contactページ
    contact_title: "お問い合わせ",
    contact_desc: "現在、フリーランスの仕事を受け付けており、フルタイムの機会も検討しています。プロジェクトのご相談はお気軽にどうぞ。",
    contact_email: "メール",
    contact_github: "GitHub",
    contact_twitter: "Twitter",
    contact_linkedin: "LinkedIn",
    contact_instagram: "Instagram"
  }
};

let globalProjectsData = [];

document.addEventListener("DOMContentLoaded", async () => {
  initLanguage();
  initStickyNav();
  await initData();
});

/* --- 言語ロジック --- */
function initLanguage() {
  const currentLang = localStorage.getItem("lang") || "ja";
  applyLanguage(currentLang);

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      applyLanguage(lang);
      localStorage.setItem("lang", lang);
    });
  });
}

function applyLanguage(lang) {
  const texts = i18n[lang];
  if (!texts) return;

  // アクティブボタンの状態
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // テキストコンテンツの更新
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (texts[key]) {
      if (el.tagName === "INPUT") el.placeholder = texts[key];
      else el.innerHTML = texts[key];
    }
  });

  // タイトル/説明の言語を更新するためにプロジェクトを再レンダリング
  if (globalProjectsData.length > 0) {
    const path = window.location.pathname;
    const isHome = path.endsWith("index.html") || path === "/" || path.endsWith("/portfolio/");
    const isProjects = path.includes("/projects/");

    if (isHome) renderFeatured(globalProjectsData);
    if (isProjects) initProjectsPage(globalProjectsData);
  }
}

/* --- ナビゲーション --- */
function initStickyNav() {
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });
}

/* --- データとルーティング --- */
async function initData() {
  const assetPrefix = document.body.dataset.assetPrefix || "./";
  const dataUrl = `${assetPrefix}projects-data.json`;

  const path = window.location.pathname;
  const isHome = path.endsWith("index.html") || path === "/" || path.endsWith("/portfolio/");
  const isProjects = path.includes("/projects/");

  if (isHome || isProjects) {
    try {
      const resp = await fetch(dataUrl);
      if (!resp.ok) throw new Error("Fetch failed");
      globalProjectsData = await resp.json();

      if (isHome) renderFeatured(globalProjectsData);
      if (isProjects) initProjectsPage(globalProjectsData);
    } catch (e) {
      console.error(e);
    }
  }
}

function renderCard(project) {
  const lang = localStorage.getItem("lang") || "en";
  const btnText = i18n[lang].btn_view;

  // 言語に基づいてテキストを選択
  const title = (lang === 'ja' && project.title_ja) ? project.title_ja : project.title;
  const desc = (lang === 'ja' && project.description_ja) ? project.description_ja : project.description;

  const tagsHtml = (project.tags || []).map(t => `<span class="tag">#${t}</span>`).join("");
  return `
    <article class="card glass">
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="card-tags">${tagsHtml}</div>
      <a href="${project.link}" target="_blank" class="btn" style="margin-top: 1.5rem; width: 100%;">${btnText}</a>
    </article>
  `;
}

function renderFeatured(data) {
  const container = document.getElementById("featured-list");
  if (!container) return;
  const featured = data.filter(p => p.featured).slice(0, 3);
  container.innerHTML = featured.map(renderCard).join("");
}

function initProjectsPage(data) {
  const container = document.getElementById("project-list");
  const searchInput = document.getElementById("search-input");
  const tagFilters = document.getElementById("tag-filters");
  if (!container) return;

  // タグ
  const allTags = new Set();
  data.forEach(p => (p.tags || []).forEach(t => allTags.add(t)));

  let currentFilter = "All";
  // 必要に応じてフィルターUIをリセット、またはレンダリング済みか確認？
  // 言語を再レンダリングする場合、フィルターロジックをリセットすべきではないが、タグボタンを毎回再構築する必要はないかもしれない。
  // 簡潔にするため、リストのみを更新する。タグボタンは通常、言語に依存しない。

  if (tagFilters.innerHTML.trim() === "") {
    tagFilters.innerHTML = `<button class="filter-btn active" data-tag="All">All</button>` +
      Array.from(allTags).map(t => `<button class="filter-btn" data-tag="${t}">${t}</button>`).join("");

    tagFilters.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-btn")) {
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        currentFilter = e.target.dataset.tag;
        doRender();
      }
    });
  }

  const doRender = () => {
    const q = searchInput.value.toLowerCase();
    const lang = localStorage.getItem("lang") || "en";

    const filtered = data.filter(p => {
      // 現在表示されている言語で検索するか、すべてで検索するか？
      // UX向上のため、両方で検索する。
      const titleEn = p.title.toLowerCase();
      const descEn = p.description.toLowerCase();
      const titleJa = (p.title_ja || "").toLowerCase();
      const descJa = (p.description_ja || "").toLowerCase();

      const matchSearch = titleEn.includes(q) || descEn.includes(q) || titleJa.includes(q) || descJa.includes(q);
      const matchTag = currentFilter === "All" || (p.tags && p.tags.includes(currentFilter));
      return matchSearch && matchTag;
    });
    container.innerHTML = filtered.map(renderCard).join("");
  };

  // 新規の場合のみリスナーを再アタッチ（ただし、言語切り替え時にinitProjectsPageを再実行する）。
  // 理想的には、searchInputリスナーは一度だけアタッチされるべき。
  // 単に古いリスナーをクリアするか？名前付き関数参照なしでは難しい。
  // 単にoninputプロパティを設定すればよい。
  searchInput.oninput = doRender;

  doRender();
}
