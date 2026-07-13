(function () {
  "use strict";

  var BLOG_PATH = "webapp/content/blog";
  var OWNER = "dimi365";
  var REPO = "m365-agent-spicker";
  var BRANCH = "main";

  function getRepoConfig() {
    var host = window.location.hostname || "";
    var path = window.location.pathname || "";

    if (host.endsWith("github.io")) {
      OWNER = host.split(".")[0] || OWNER;
      var parts = path.split("/").filter(Boolean);
      if (parts.length > 0) {
        REPO = parts[0];
      }
    }

    return {
      owner: OWNER,
      repo: REPO,
      branch: BRANCH,
      apiUrl:
        "https://api.github.com/repos/" +
        OWNER +
        "/" +
        REPO +
        "/contents/" +
        BLOG_PATH +
        "?ref=" +
        BRANCH,
    };
  }

  function escapeHtml(input) {
    return String(input || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseFrontmatter(markdown) {
    var fm = {};
    var body = markdown;

    if (markdown.startsWith("---")) {
      var match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
      if (match) {
        var fmBlock = match[1].split("\n");
        fmBlock.forEach(function (line) {
          var idx = line.indexOf(":");
          if (idx > -1) {
            var key = line.slice(0, idx).trim();
            var value = line.slice(idx + 1).trim();
            fm[key] = value;
          }
        });
        body = markdown.slice(match[0].length);
      }
    }

    return { frontmatter: fm, body: body };
  }

  function stripMarkdown(md) {
    return (md || "")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[`*_>#-]/g, "")
      .replace(/\n+/g, " ")
      .trim();
  }

  function dateToLabel(dateStr) {
    if (!dateStr) {
      return { day: "--", month: "---" };
    }
    var dt = new Date(dateStr);
    if (Number.isNaN(dt.getTime())) {
      return { day: "--", month: "---" };
    }
    var day = String(dt.getDate());
    var month = dt.toLocaleDateString("de-CH", { month: "short" });
    return { day: day, month: month };
  }

  function sortByDateDesc(posts) {
    return posts.sort(function (a, b) {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });
  }

  async function fetchPosts() {
    var cfg = getRepoConfig();
    var response = await fetch(cfg.apiUrl, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) {
      throw new Error("Blog-Ordner konnte nicht geladen werden (" + response.status + ")");
    }

    var files = await response.json();
    var mdFiles = files.filter(function (f) {
      return f.type === "file" && /\.md$/i.test(f.name);
    });

    var posts = await Promise.all(
      mdFiles.map(async function (file) {
        var res = await fetch(file.download_url);
        if (!res.ok) {
          throw new Error("Post konnte nicht geladen werden: " + file.name);
        }

        var raw = await res.text();
        var parsed = parseFrontmatter(raw);
        var title = parsed.frontmatter.title || file.name.replace(/\.md$/i, "");
        var date = parsed.frontmatter.date || "";
        var tag = parsed.frontmatter.tag || "Allgemein";
        var excerpt = parsed.frontmatter.excerpt || stripMarkdown(parsed.body).slice(0, 180) + "...";
        var slug = file.name.replace(/\.md$/i, "");

        return {
          slug: slug,
          title: title,
          date: date,
          tag: tag,
          excerpt: excerpt,
          markdown: parsed.body,
          source: file.download_url,
          labels: dateToLabel(date),
        };
      })
    );

    return sortByDateDesc(posts);
  }

  async function fetchPostBySlug(slug) {
    var posts = await fetchPosts();
    return posts.find(function (p) {
      return p.slug === slug;
    });
  }

  window.BlogData = {
    fetchPosts: fetchPosts,
    fetchPostBySlug: fetchPostBySlug,
    escapeHtml: escapeHtml,
  };
})();
