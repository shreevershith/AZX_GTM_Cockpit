(function () {
  const TYPE_LABELS = {
    all: "All",
    investor_content: "Investor",
    company: "Company",
    oss: "Open source",
    hiring: "Hiring",
  };

  async function loadData() {
    const res = await fetch("data/gtm-data.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Could not load data/gtm-data.json");
    return res.json();
  }

  function el(tag, className, html) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function renderPipeline(data) {
    const panel = el("section", "panel");
    const header = el("div", "panel-header");
    header.appendChild(el("h2", "panel-title", "Pipeline snapshot"));
    const b = el("span", "badge warn", "Illustrative only");
    b.title = "Counts are UI examples, not company metrics.";
    header.appendChild(b);
    panel.appendChild(header);

    const funnel = el("div", "funnel");
    data.pipeline.stages.forEach((s) => {
      const cell = el("div", "stage");
      cell.appendChild(el("span", "stage-label", s.label));
      cell.appendChild(el("span", "stage-count", String(s.count)));
      funnel.appendChild(cell);
    });
    panel.appendChild(funnel);

    if (data.pipeline.alerts?.length) {
      const ul = el("ul", "alerts");
      data.pipeline.alerts.forEach((a) => {
        ul.appendChild(el("li", null, a.text));
      });
      panel.appendChild(ul);
    }

    return panel;
  }

  function renderSignals(data) {
    const panel = el("section", "panel");
    const header = el("div", "panel-header");
    header.appendChild(el("h2", "panel-title", "Sourced signals"));
    header.appendChild(el("span", "badge ok", "Links verify"));
    panel.appendChild(header);

    const chips = el("div", "chips");
    const types = ["all", ...new Set(data.signals.map((s) => s.type))];
    types.forEach((t) => {
      const btn = el("button", "chip", TYPE_LABELS[t] || t);
      btn.type = "button";
      btn.dataset.filter = t;
      btn.setAttribute("aria-pressed", t === "all" ? "true" : "false");
      chips.appendChild(btn);
    });
    panel.appendChild(chips);

    const list = el("div", "signal-list");
    data.signals.forEach((s) => {
      const a = el("a", "signal");
      a.href = s.sourceUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.dataset.type = s.type;
      a.appendChild(el("p", "signal-title", s.title));
      const meta = el("div", "signal-meta");
      meta.appendChild(el("span", "type-pill", s.type.replace("_", " ")));
      meta.appendChild(el("span", null, s.source));
      meta.appendChild(el("span", null, s.date));
      a.appendChild(meta);
      list.appendChild(a);
    });
    panel.appendChild(list);

    chips.addEventListener("click", (e) => {
      const btn = e.target.closest("button.chip");
      if (!btn) return;
      const f = btn.dataset.filter;
      chips.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === btn ? "true" : "false"));
      list.querySelectorAll(".signal").forEach((row) => {
        row.classList.toggle("hidden", f !== "all" && row.dataset.type !== f);
      });
    });

    return panel;
  }

  function renderStrategicFocus(data) {
    const panel = el("section", "panel");
    const header = el("div", "panel-header");
    header.appendChild(el("h2", "panel-title", "Strategic ecosystem"));
    const b = el("span", "badge warn", "Demo tiers");
    b.title = "Tier letters are UI scaffolding only.";
    header.appendChild(b);
    panel.appendChild(header);

    const wrap = el("div", "table-wrap");
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    thead.innerHTML =
      "<tr><th>Account</th><th>Sector</th><th>Demo tier</th><th>Source</th></tr>";
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    const rows = [...data.strategicFocus].sort((a, b) =>
      a.tierDemo.localeCompare(b.tierDemo)
    );
    rows.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><strong>${escapeHtml(r.account)}</strong><br/><span style="color:var(--muted);font-size:0.8rem">${escapeHtml(
        r.note
      )}</span></td><td>${escapeHtml(r.sector)}</td><td><span class="tier">${escapeHtml(
        r.tierDemo
      )}</span></td><td><a href="${escapeAttr(r.sourceUrl)}" target="_blank" rel="noopener noreferrer">azx.io/careers</a></td>`;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    panel.appendChild(wrap);

    return panel;
  }

  function renderContentQueue(data) {
    const panel = el("section", "panel");
    const header = el("div", "panel-header");
    header.appendChild(el("h2", "panel-title", "Content queue"));
    header.appendChild(el("span", "badge", "Ideas"));
    panel.appendChild(header);

    const q = el("div", "queue");
    data.contentQueue.forEach((c) => {
      const item = el("div", "queue-item");
      const title = el("p", "queue-title");
      const link = document.createElement("a");
      link.href = c.relatedUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = c.title;
      title.appendChild(link);
      item.appendChild(title);
      const meta = el("div", "queue-meta");
      meta.appendChild(el("span", "status", c.status));
      meta.appendChild(el("span", null, c.channel));
      item.appendChild(meta);
      q.appendChild(item);
    });
    panel.appendChild(q);

    return panel;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  async function init() {
    const app = document.getElementById("app");
    const loading = document.getElementById("loading");

    try {
      const data = await loadData();
      loading.remove();

      document.getElementById("asOf").textContent = `As of ${data.asOf}`;
      document.getElementById("footerDisclaimer").textContent = data.disclaimer;
      const note = data.applicationNotesForApplicant;
      document.getElementById("applicantNote").textContent = note || "";

      app.appendChild(renderPipeline(data));
      app.appendChild(renderSignals(data));
      app.appendChild(renderStrategicFocus(data));
      app.appendChild(renderContentQueue(data));
    } catch (e) {
      loading.remove();
      const err = el("div", "error-box");
      err.innerHTML =
        "<strong>Could not load data.</strong> Open this site via a local server (e.g. <code>npx serve .</code>) or deploy to GitHub Pages / Netlify / Vercel so <code>fetch</code> can read <code>data/gtm-data.json</code>.";
      app.appendChild(err);
      console.error(e);
    }
  }

  init();
})();
