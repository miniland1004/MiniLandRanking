(function () {
  var query = parseQuery(window.location.search);
  var selectedCharacterId = toNumber(query.characterid, 1001);

  var DEMO_DATA = {
    meta: {
      serverName: "MiniLand Demo",
      updatedAt: "2026-05-31 15:10 KST",
      worldId: toNumber(query.worldid, 0)
    },
    viewer: {
      characterId: selectedCharacterId,
      name: "PenguinHero",
      job: "나이트로드",
      level: 200,
      guild: "MiniLand",
      rank: 12,
      jobRank: 3,
      avatarUrl: "./assets/demo-avatar-nightlord.png"
    },
    jobs: ["전체", "나이트로드", "히어로", "비숍", "보우마스터"],
    rankings: {
      overall: [
        { characterId: 2001, rank: 1, name: "IceEmperor", job: "히어로", level: 200, guild: "Aurora", avatarUrl: "./assets/demo-avatar-hero.png" },
        { characterId: 2002, rank: 2, name: "MintBishop", job: "비숍", level: 200, guild: "Misty", avatarUrl: "./assets/demo-avatar-bishop.png" },
        { characterId: 2003, rank: 3, name: "SkyArrow", job: "보우마스터", level: 200, guild: "Falcon", avatarUrl: "./assets/demo-avatar-bowmaster.png" },
        { characterId: 1001, rank: 12, name: "PenguinHero", job: "나이트로드", level: 200, guild: "MiniLand", avatarUrl: "./assets/demo-avatar-nightlord.png" },
        { characterId: 2010, rank: 13, name: "CobaltSin", job: "나이트로드", level: 199, guild: "Nova", avatarUrl: "./assets/demo-avatar-nightlord.png" },
        { characterId: 2011, rank: 14, name: "MapleVolt", job: "히어로", level: 198, guild: "Titan", avatarUrl: "./assets/demo-avatar-hero.png" },
        { characterId: 2012, rank: 15, name: "LunarHeal", job: "비숍", level: 198, guild: "Lumen", avatarUrl: "./assets/demo-avatar-bishop.png" },
        { characterId: 2013, rank: 16, name: "PineShot", job: "보우마스터", level: 197, guild: "Forest", avatarUrl: "./assets/demo-avatar-bowmaster.png" }
      ],
      byJob: {
        "나이트로드": [
          { characterId: 2021, rank: 1, name: "ShadowMint", job: "나이트로드", level: 200, guild: "Noir", avatarUrl: "./assets/demo-avatar-nightlord.png" },
          { characterId: 2022, rank: 2, name: "CrescentSin", job: "나이트로드", level: 200, guild: "Eclipse", avatarUrl: "./assets/demo-avatar-nightlord.png" },
          { characterId: 1001, rank: 3, name: "PenguinHero", job: "나이트로드", level: 200, guild: "MiniLand", avatarUrl: "./assets/demo-avatar-nightlord.png" },
          { characterId: 2024, rank: 4, name: "DustBlade", job: "나이트로드", level: 199, guild: "Quartz", avatarUrl: "./assets/demo-avatar-nightlord.png" }
        ],
        "히어로": [
          { characterId: 2101, rank: 1, name: "IceEmperor", job: "히어로", level: 200, guild: "Aurora", avatarUrl: "./assets/demo-avatar-hero.png" },
          { characterId: 2102, rank: 2, name: "MapleVolt", job: "히어로", level: 198, guild: "Titan", avatarUrl: "./assets/demo-avatar-hero.png" },
          { characterId: 2103, rank: 3, name: "FlareSword", job: "히어로", level: 197, guild: "Forge", avatarUrl: "./assets/demo-avatar-hero.png" }
        ],
        "비숍": [
          { characterId: 2201, rank: 1, name: "MintBishop", job: "비숍", level: 200, guild: "Misty", avatarUrl: "./assets/demo-avatar-bishop.png" },
          { characterId: 2202, rank: 2, name: "LunarHeal", job: "비숍", level: 198, guild: "Lumen", avatarUrl: "./assets/demo-avatar-bishop.png" }
        ],
        "보우마스터": [
          { characterId: 2301, rank: 1, name: "SkyArrow", job: "보우마스터", level: 200, guild: "Falcon", avatarUrl: "./assets/demo-avatar-bowmaster.png" },
          { characterId: 2302, rank: 2, name: "PineShot", job: "보우마스터", level: 197, guild: "Forest", avatarUrl: "./assets/demo-avatar-bowmaster.png" }
        ]
      }
    }
  };

  var state = {
    data: normalizeData(DEMO_DATA),
    view: query.view === "job" ? "job" : "overall",
    selectedJob: query.job || "",
    selectedCharacterId: selectedCharacterId,
    status: "정적 데모 데이터를 표시 중입니다."
  };

  var elements = {
    serverLabel: document.getElementById("serverLabel"),
    viewerLabel: document.getElementById("viewerLabel"),
    heroAvatar: document.getElementById("heroAvatar"),
    heroRankLabel: document.getElementById("heroRankLabel"),
    heroName: document.getElementById("heroName"),
    heroJob: document.getElementById("heroJob"),
    heroLevel: document.getElementById("heroLevel"),
    heroGuild: document.getElementById("heroGuild"),
    heroWorld: document.getElementById("heroWorld"),
    heroJobRank: document.getElementById("heroJobRank"),
    panelTitle: document.getElementById("panelTitle"),
    updatedAt: document.getElementById("updatedAt"),
    rankingList: document.getElementById("rankingList"),
    statusText: document.getElementById("statusText"),
    jobFilters: document.getElementById("jobFilters"),
    tabs: findByClass(document, "view-tab")
  };

  if (!state.selectedJob) {
    state.selectedJob = state.data.viewer.job || state.data.jobs[1] || "전체";
  }

  function parseQuery(search) {
    var result = {};
    var source = search || "";
    var queryText = source.charAt(0) === "?" ? source.substring(1) : source;
    if (!queryText) {
      return result;
    }

    var pairs = queryText.split("&");
    var i;
    for (i = 0; i < pairs.length; i += 1) {
      if (!pairs[i]) {
        continue;
      }
      var part = pairs[i].split("=");
      var key = decodeValue(part[0]);
      result[key] = decodeValue(part.length > 1 ? part.slice(1).join("=") : "");
    }
    return result;
  }

  function decodeValue(value) {
    var safe = value || "";
    safe = safe.replace(/\+/g, " ");
    try {
      return decodeURIComponent(safe);
    } catch (error) {
      return safe;
    }
  }

  function toNumber(value, fallbackValue) {
    var parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallbackValue : parsed;
  }

  function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
  }

  function addEvent(element, eventName, handler) {
    if (!element) {
      return;
    }
    if (element.addEventListener) {
      element.addEventListener(eventName, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + eventName, handler);
    }
  }

  function hasClass(element, className) {
    return (" " + element.className + " ").indexOf(" " + className + " ") >= 0;
  }

  function setClassState(element, className, enabled) {
    if (!element) {
      return;
    }

    var classText = " " + (element.className || "") + " ";
    var target = " " + className + " ";
    while (classText.indexOf(target) >= 0) {
      classText = classText.replace(target, " ");
    }

    if (enabled) {
      classText += className + " ";
    }

    element.className = classText.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
  }

  function findByClass(root, className) {
    if (root.querySelectorAll) {
      return root.querySelectorAll("." + className);
    }

    var results = [];
    var nodes = root.getElementsByTagName("*");
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      if (hasClass(nodes[i], className)) {
        results.push(nodes[i]);
      }
    }
    return results;
  }

  function cloneRow(source) {
    var row = source || {};
    return {
      characterId: toNumber(row.characterId, 0),
      rank: toNumber(row.rank, 0),
      name: row.name || "Unknown",
      job: row.job || "-",
      level: toNumber(row.level, 0),
      guild: row.guild || "-",
      avatarUrl: row.avatarUrl || "./assets/avatar-placeholder.png"
    };
  }

  function copyRows(list) {
    var rows = [];
    var source = list || [];
    var i;
    for (i = 0; i < source.length; i += 1) {
      rows.push(cloneRow(source[i]));
    }
    return rows;
  }

  function buildByJob(overallRows, sourceByJob) {
    var byJob = {};
    var jobName;
    var i;

    if (sourceByJob) {
      for (jobName in sourceByJob) {
        if (hasOwn(sourceByJob, jobName)) {
          byJob[jobName] = copyRows(sourceByJob[jobName]);
        }
      }
    }

    if (!sourceByJob || isEmptyObject(sourceByJob)) {
      for (i = 0; i < overallRows.length; i += 1) {
        jobName = overallRows[i].job || "-";
        if (!byJob[jobName]) {
          byJob[jobName] = [];
        }
        byJob[jobName].push(cloneRow(overallRows[i]));
      }
    }

    return byJob;
  }

  function isEmptyObject(object) {
    var key;
    for (key in object) {
      if (hasOwn(object, key)) {
        return false;
      }
    }
    return true;
  }

  function ensureJobList(sourceJobs, overallRows, byJob, viewerJob) {
    var jobs = ["전체"];
    var i;
    var jobName;

    if (sourceJobs && sourceJobs.length) {
      for (i = 0; i < sourceJobs.length; i += 1) {
        pushUnique(jobs, sourceJobs[i]);
      }
    }

    for (jobName in byJob) {
      if (hasOwn(byJob, jobName)) {
        pushUnique(jobs, jobName);
      }
    }

    for (i = 0; i < overallRows.length; i += 1) {
      pushUnique(jobs, overallRows[i].job);
    }

    if (viewerJob) {
      pushUnique(jobs, viewerJob);
    }

    return jobs;
  }

  function pushUnique(list, value) {
    if (!value) {
      return;
    }
    var i;
    for (i = 0; i < list.length; i += 1) {
      if (list[i] === value) {
        return;
      }
    }
    list.push(value);
  }

  function collectAllRows(overallRows, byJob) {
    var rows = [];
    var seen = {};
    var i;
    var jobName;
    var row;
    var key;

    for (i = 0; i < overallRows.length; i += 1) {
      row = overallRows[i];
      key = String(row.characterId);
      if (!seen[key]) {
        rows.push(row);
        seen[key] = true;
      }
    }

    for (jobName in byJob) {
      if (!hasOwn(byJob, jobName)) {
        continue;
      }
      for (i = 0; i < byJob[jobName].length; i += 1) {
        row = byJob[jobName][i];
        key = String(row.characterId);
        if (!seen[key]) {
          rows.push(row);
          seen[key] = true;
        }
      }
    }

    return rows;
  }

  function findRowByCharacterId(rows, characterId) {
    var i;
    for (i = 0; i < rows.length; i += 1) {
      if (rows[i].characterId === characterId) {
        return rows[i];
      }
    }
    return null;
  }

  function resolveViewer(rawViewer, overallRows, byJob) {
    var viewer = cloneRow(rawViewer || {});
    var allRows = collectAllRows(overallRows, byJob);
    var matched = findRowByCharacterId(allRows, selectedCharacterId);

    if (matched) {
      viewer.characterId = matched.characterId;
      viewer.name = matched.name;
      viewer.job = matched.job;
      viewer.level = matched.level;
      viewer.guild = matched.guild;
      viewer.avatarUrl = matched.avatarUrl;
      if (!viewer.rank) {
        viewer.rank = matched.rank;
      }
    } else if (selectedCharacterId) {
      viewer.characterId = selectedCharacterId;
    }

    viewer.rank = toNumber(rawViewer && rawViewer.rank, viewer.rank || 0);
    viewer.jobRank = toNumber(rawViewer && rawViewer.jobRank, 0);
    return viewer;
  }

  function normalizeData(raw) {
    var source = raw || {};
    var sourceRankings = source.rankings || {};
    var overallRows = copyRows(sourceRankings.overall || []);
    var byJob = buildByJob(overallRows, sourceRankings.byJob || {});
    var viewer = resolveViewer(source.viewer || {}, overallRows, byJob);
    var jobs = ensureJobList(source.jobs || [], overallRows, byJob, viewer.job);
    var meta = source.meta || {};

    return {
      meta: {
        serverName: meta.serverName || "MiniLand",
        updatedAt: meta.updatedAt || "",
        worldId: toNumber(meta.worldId, toNumber(query.worldid, 0))
      },
      viewer: viewer,
      jobs: jobs,
      rankings: {
        overall: overallRows,
        byJob: byJob
      }
    };
  }

  function buildRequestUrl(baseUrl) {
    var url = baseUrl;
    var separator = url.indexOf("?") >= 0 ? "&" : "?";

    if (query.worldid) {
      url += separator + "worldid=" + encodeURIComponent(query.worldid);
      separator = "&";
    }

    if (query.characterid) {
      url += separator + "characterid=" + encodeURIComponent(query.characterid);
    }

    return url;
  }

  function resolveDataUrl() {
    if (query.api) {
      return {
        url: buildRequestUrl(query.api),
        label: "외부 API"
      };
    }

    if (window.location.protocol !== "file:") {
      return {
        url: buildRequestUrl("./data/latest.json"),
        label: "GitHub Pages"
      };
    }

    return null;
  }

  function parseJson(text) {
    if (window.JSON && window.JSON.parse) {
      return window.JSON.parse(text);
    }
    return (new Function("return (" + text + ");"))();
  }

  function requestJson(url, onSuccess, onFailure) {
    var xhr = createRequest();
    if (!xhr) {
      onFailure("브라우저가 XMLHttpRequest 를 지원하지 않습니다.");
      return;
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          onSuccess(parseJson(xhr.responseText));
        } catch (error) {
          onFailure("JSON 파싱 실패");
        }
      } else {
        onFailure("HTTP " + xhr.status);
      }
    };

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.send(null);
  }

  function createRequest() {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }

    if (window.ActiveXObject) {
      try {
        return new ActiveXObject("Msxml2.XMLHTTP");
      } catch (firstError) {
        try {
          return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (secondError) {
          return null;
        }
      }
    }

    return null;
  }

  function loadRemoteData(onComplete) {
    var source = resolveDataUrl();
    if (!source) {
      onComplete();
      return;
    }

    requestJson(
      source.url,
      function (data) {
        state.data = normalizeData(data);
        state.status = source.label + " 데이터를 표시 중입니다.";
        if (!state.selectedJob || state.selectedJob === "전체") {
          state.selectedJob = state.data.viewer.job || state.data.jobs[1] || "전체";
        }
        onComplete();
      },
      function (message) {
        if (source.label === "GitHub Pages") {
          state.status = "data/latest.json 을 찾지 못해 데모 데이터를 표시합니다. (" + message + ")";
        } else {
          state.status = "API 연결 실패: " + message + ". 데모 데이터를 표시합니다.";
        }
        onComplete();
      }
    );
  }

  function currentRows() {
    if (state.view === "job") {
      return state.data.rankings.byJob[state.selectedJob] || [];
    }
    return state.data.rankings.overall || [];
  }

  function selectedEntry(rows) {
    return findRowByCharacterId(rows, state.selectedCharacterId) || rows[0] || state.data.viewer;
  }

  function syncHero(entry) {
    var viewer = state.data.viewer || {};
    var worldId = toNumber(state.data.meta.worldId, toNumber(query.worldid, 0));
    var jobRows = state.data.rankings.byJob[entry.job] || [];
    var i;
    var jobRank = 0;

    for (i = 0; i < jobRows.length; i += 1) {
      if (jobRows[i].characterId === entry.characterId) {
        jobRank = i + 1;
        break;
      }
    }

    elements.heroAvatar.src = entry.avatarUrl || "./assets/avatar-placeholder.png";
    elements.heroRankLabel.innerHTML = "RANK " + (entry.rank || viewer.rank || 0);
    elements.heroName.innerHTML = entry.name || viewer.name || "Unknown";
    elements.heroJob.innerHTML = entry.job || viewer.job || "-";
    elements.heroLevel.innerHTML = String(entry.level || viewer.level || 0);
    elements.heroGuild.innerHTML = entry.guild || viewer.guild || "-";
    elements.heroWorld.innerHTML = String(worldId);
    elements.heroJobRank.innerHTML = String(jobRank || viewer.jobRank || "-");
  }

  function renderJobs() {
    var jobs = state.data.jobs || ["전체"];
    var i;
    elements.jobFilters.innerHTML = "";

    for (i = 0; i < jobs.length; i += 1) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "job-pill" + (state.selectedJob === jobs[i] ? " is-selected" : "");
      button.innerHTML = jobs[i];
      button._jobName = jobs[i];
      addEvent(button, "click", function () {
        state.selectedJob = this._jobName;
        state.view = this._jobName === "전체" ? "overall" : "job";
        render();
      });
      elements.jobFilters.appendChild(button);
    }
  }

  function renderRows() {
    var rows = currentRows();
    var activeEntry = selectedEntry(rows);
    var i;

    if (activeEntry) {
      state.selectedCharacterId = activeEntry.characterId;
    }

    elements.rankingList.innerHTML = "";

    for (i = 0; i < rows.length; i += 1) {
      var row = rows[i];
      var line = document.createElement("div");
      line.className = "table-row" + (row.characterId === state.selectedCharacterId ? " is-selected" : "");
      line._characterId = row.characterId;
      line.setAttribute("tabindex", "0");
      line.innerHTML = ""
        + "<span class=\"table-col table-col-rank\"><span class=\"rank-badge\">" + row.rank + "</span></span>"
        + "<span class=\"table-col table-col-name\"><strong>" + row.name + "</strong><small>" + (row.guild || "-") + "</small></span>"
        + "<span class=\"table-col table-col-job\">" + row.job + "</span>"
        + "<span class=\"table-col table-col-level\">" + row.level + "</span>";
      addEvent(line, "click", function () {
        state.selectedCharacterId = this._characterId;
        render();
      });
      elements.rankingList.appendChild(line);
    }

    syncHero(activeEntry || state.data.viewer);
  }

  function renderTabs() {
    var i;
    for (i = 0; i < elements.tabs.length; i += 1) {
      var tab = elements.tabs[i];
      var isActive = tab.getAttribute("data-view") === state.view;
      setClassState(tab, "is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    }
  }

  function renderMeta() {
    var viewer = state.data.viewer || {};
    elements.serverLabel.innerHTML = state.data.meta.serverName || "MiniLand";
    elements.viewerLabel.innerHTML = "CID " + (viewer.characterId || query.characterid || 0);
    elements.updatedAt.innerHTML = state.data.meta.updatedAt || "no timestamp";
    elements.panelTitle.innerHTML = state.view === "job" ? (state.selectedJob + " 랭킹") : "전체 랭킹";
    elements.statusText.innerHTML = state.status;
  }

  function render() {
    renderTabs();
    renderJobs();
    renderMeta();
    renderRows();
  }

  function bindTabs() {
    var i;
    for (i = 0; i < elements.tabs.length; i += 1) {
      addEvent(elements.tabs[i], "click", function () {
        state.view = this.getAttribute("data-view");
        if (state.view === "overall") {
          state.selectedJob = "전체";
        } else if (state.selectedJob === "전체") {
          state.selectedJob = state.data.viewer.job || state.data.jobs[1] || "전체";
        }
        render();
      });
    }
  }

  function start() {
    bindTabs();
    loadRemoteData(function () {
      render();
    });
  }

  start();
}());
