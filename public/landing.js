(function () {
  "use strict";

  var THEME_KEY = "moticlaw-theme";
  var LOCALE_KEY = "moticlaw-locale";

  function $(id) {
    return document.getElementById(id);
  }

  /* ---------------- Theme toggle ---------------- */
  function resolvedTheme() {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
  }

  var themeToggle = $("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function (event) {
      var next = resolvedTheme() === "dark" ? "light" : "dark";
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || reduceMotion) {
        applyTheme(next);
        return;
      }

      var toggleRect = themeToggle.getBoundingClientRect();
      var x = event.clientX || toggleRect.left + toggleRect.width / 2;
      var y = event.clientY || toggleRect.top + toggleRect.height / 2;
      var endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

      var transition = document.startViewTransition(function () {
        applyTheme(next);
      });
      transition.ready
        .then(function () {
          document.documentElement.animate(
            { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + endRadius + "px at " + x + "px " + y + "px)"] },
            { duration: 420, easing: "ease-out", pseudoElement: "::view-transition-new(root)" }
          );
        })
        .catch(function () {});
    });
  }

  /* ---------------- Locale menu ---------------- */
  var localeToggle = $("locale-toggle");
  var localeMenu = $("locale-menu");
  var localeBackdrop = $("locale-menu-backdrop");
  var scrollLockDepth = 0;
  var scrollLockY = 0;
  var scrollLockSnapshot = null;

  function lockPageScroll() {
    scrollLockDepth += 1;
    if (scrollLockDepth > 1) return;

    var root = document.documentElement;
    var body = document.body;
    var scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    var currentPaddingRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    scrollLockY = window.scrollY || root.scrollTop || body.scrollTop || 0;
    scrollLockSnapshot = {
      htmlOverflow: root.style.overflow,
      htmlScrollbarGutter: root.style.scrollbarGutter,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };

    root.classList.add("page-scroll-locked");
    body.classList.add("page-scroll-locked");
    root.style.overflow = "hidden";
    root.style.scrollbarGutter = "stable";
    body.style.position = "fixed";
    body.style.top = "-" + scrollLockY + "px";
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = currentPaddingRight + scrollbarWidth + "px";
    }
  }

  function unlockPageScroll() {
    if (scrollLockDepth === 0) return;
    scrollLockDepth -= 1;
    if (scrollLockDepth > 0) return;

    var root = document.documentElement;
    var body = document.body;
    var snapshot = scrollLockSnapshot;
    scrollLockSnapshot = null;
    root.classList.remove("page-scroll-locked");
    body.classList.remove("page-scroll-locked");

    if (snapshot) {
      root.style.overflow = snapshot.htmlOverflow;
      root.style.scrollbarGutter = snapshot.htmlScrollbarGutter;
      body.style.position = snapshot.bodyPosition;
      body.style.top = snapshot.bodyTop;
      body.style.left = snapshot.bodyLeft;
      body.style.right = snapshot.bodyRight;
      body.style.width = snapshot.bodyWidth;
      body.style.overflow = snapshot.bodyOverflow;
      body.style.paddingRight = snapshot.bodyPaddingRight;
    }
    window.scrollTo(0, scrollLockY);
    scrollLockY = 0;
  }

  function closeLocaleMenu() {
    if (!localeMenu) return;
    var wasOpen = !localeMenu.hidden;
    localeMenu.hidden = true;
    if (localeBackdrop) localeBackdrop.hidden = true;
    if (localeToggle) localeToggle.setAttribute("aria-expanded", "false");
    if (wasOpen) unlockPageScroll();
  }

  function openLocaleMenu() {
    if (!localeMenu || !localeToggle) return;
    var wasClosed = localeMenu.hidden;
    var rect = localeToggle.getBoundingClientRect();
    localeMenu.style.top = rect.bottom + 4 + "px";
    localeMenu.style.right = Math.max(16, window.innerWidth - rect.right) + "px";
    localeMenu.hidden = false;
    if (localeBackdrop) {
      var header = $("site-header-shell");
      var backdropTop = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
      localeBackdrop.style.top = backdropTop + "px";
      localeBackdrop.hidden = false;
    }
    localeToggle.setAttribute("aria-expanded", "true");
    if (wasClosed) lockPageScroll();
  }

  if (localeToggle && localeMenu) {
    localeToggle.addEventListener("click", function () {
      if (localeMenu.hidden) openLocaleMenu();
      else closeLocaleMenu();
    });
    if (localeBackdrop) localeBackdrop.addEventListener("click", closeLocaleMenu);
    localeMenu.querySelectorAll("[data-locale-option]").forEach(function (option) {
      option.addEventListener("click", function () {
        try {
          localStorage.setItem(LOCALE_KEY, option.getAttribute("data-locale-option"));
        } catch (e) {}
      });
    });
    window.addEventListener("resize", function () {
      if (!localeMenu.hidden) openLocaleMenu();
    });
  }

  /* ---------------- Header pinned state (landing variant) ---------------- */
  var headerShell = $("site-header-shell");
  if (headerShell && headerShell.dataset.variant === "landing") {
    var onScroll = function () {
      headerShell.classList.toggle("is-pinned", window.scrollY > 8);
    };
    var schedulePinnedState = function () {
      setTimeout(function () {
        requestAnimationFrame(onScroll);
        window.addEventListener("scroll", onScroll, { passive: true });
      }, 120);
    };
    if (document.readyState === "complete") {
      schedulePinnedState();
    } else {
      window.addEventListener("load", schedulePinnedState, { once: true });
    }
  }

  /* ---------------- Pricing billing period ---------------- */
  var pricingPeriodSwitch = document.querySelector("[data-pricing-period-switch]");
  var pricingPlanGrid = document.querySelector("[data-pricing-plan-grid]");
  if (pricingPeriodSwitch && pricingPlanGrid) {
    var pricingPeriodButtons = Array.prototype.slice.call(
      pricingPeriodSwitch.querySelectorAll("[data-pricing-period-toggle]")
    );
    var pricingPlanCards = Array.prototype.slice.call(
      pricingPlanGrid.querySelectorAll("[data-pricing-plan-period]")
    );

    var setPricingPeriod = function (period) {
      if (period !== "monthly" && period !== "annual") return;
      pricingPlanGrid.dataset.pricingPeriod = period;
      pricingPeriodButtons.forEach(function (button) {
        var active = button.getAttribute("data-pricing-period-toggle") === period;
        button.setAttribute("aria-pressed", String(active));
        button.setAttribute("data-active", String(active));
      });
      pricingPlanCards.forEach(function (card) {
        card.hidden = card.getAttribute("data-pricing-plan-period") !== period;
      });
    };

    pricingPeriodButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setPricingPeriod(button.getAttribute("data-pricing-period-toggle"));
      });
    });
    setPricingPeriod("monthly");
  }

  /* ---------------- Modal manager ---------------- */
  var openModalId = null;

  function openModal(id) {
    var modal = $(id);
    if (!modal) return;
    closeModal();
    modal.hidden = false;
    openModalId = id;
    lockPageScroll();
    if (id === "promo-video-modal") {
      var player = $("promo-video-player");
      if (player && !player.src) {
        player.src = player.getAttribute("data-src") || "";
      }
      if (player) {
        player.play().catch(function () {});
      }
    }
    if (id === "download-modal") {
      runPlatformDetection();
    }
  }

  function closeModal() {
    if (!openModalId) return;
    var modal = $(openModalId);
    if (modal) modal.hidden = true;
    if (openModalId === "promo-video-modal") {
      var player = $("promo-video-player");
      if (player) player.pause();
    }
    openModalId = null;
    unlockPageScroll();
  }

  document.querySelectorAll("[data-open-download]").forEach(function (el) {
    el.addEventListener("click", function (event) {
      event.preventDefault();
      openModal("download-modal");
    });
  });

  document.querySelectorAll("[data-open-contact]").forEach(function (el) {
    el.addEventListener("click", function () {
      openModal("contact-qr-modal");
    });
  });

  var heroVideoFrame = $("hero-video-frame");
  if (heroVideoFrame) {
    heroVideoFrame.addEventListener("click", function () {
      openModal("promo-video-modal");
    });
  }

  document.querySelectorAll(".landing-modal").forEach(function (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
    modal.querySelectorAll("[data-close-modal]").forEach(function (button) {
      button.addEventListener("click", closeModal);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (openModalId) closeModal();
    else closeLocaleMenu();
  });

  /* ---------------- Other platforms accordion ---------------- */
  var platformToggle = $("download-platform-toggle");
  var platformGroups = $("download-platform-groups");
  if (platformToggle && platformGroups) {
    platformToggle.addEventListener("click", function () {
      var open = platformGroups.hidden;
      platformGroups.hidden = !open;
      platformToggle.setAttribute("aria-expanded", String(open));
      var caret = $("download-platform-caret");
      if (caret) caret.classList.toggle("download-platform-caret-open", open);
    });
  }

  /* ---------------- Hero video lazy init ---------------- */
  // Defer the hero video until after load + idle so its download never competes with LCP.
  var heroVideo = $("hero-video");
  if (heroVideo) {
    var initHeroVideo = function () {
      var src = heroVideo.getAttribute("data-src");
      if (!src) return;
      var source = document.createElement("source");
      source.src = src;
      source.type = "video/mp4";
      heroVideo.appendChild(source);
      heroVideo.load();
      var hidePlaceholder = function () {
        var placeholder = $("hero-video-placeholder");
        if (placeholder) placeholder.classList.add("hero-video-placeholder-hidden");
      };
      heroVideo.addEventListener("loadeddata", hidePlaceholder);
      heroVideo.addEventListener("canplay", hidePlaceholder);
      heroVideo.muted = true;
      heroVideo.autoplay = true;
      heroVideo.play().catch(function () {});
    };
    var scheduleHeroVideo = function () {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(initHeroVideo, { timeout: 2500 });
      } else {
        setTimeout(initHeroVideo, 1500);
      }
    };
    if (document.readyState === "complete") {
      scheduleHeroVideo();
    } else {
      window.addEventListener("load", scheduleHeroVideo, { once: true });
    }
  }

  /* ---------------- Platform detection + recommended download ---------------- */
  var landingDataEl = $("landing-data");
  var landingData = null;
  if (landingDataEl) {
    try {
      landingData = JSON.parse(landingDataEl.textContent || "null");
    } catch (e) {
      landingData = null;
    }
  }

  /* ---------------- AI partner console demo ---------------- */
  function isZhLocale() {
    return (landingData && landingData.locale === "zh") || document.documentElement.lang === "zh";
  }

  function partnerPayloadFromButton(button) {
    var partnerKey = button.getAttribute("data-partner-key") || "";
    var partner = landingData && landingData.partners ? landingData.partners[partnerKey] : null;
    if (!partner) return null;
    return Object.assign({ action: button.getAttribute("data-console-action") || "skills" }, partner);
  }

  function setPartnerModalHeader(payload, title) {
    var modalTitle = $("partner-console-modal-title");
    var subtitle = $("partner-console-modal-subtitle");
    if (modalTitle) modalTitle.textContent = title;
    if (subtitle) {
      subtitle.textContent = isZhLocale()
        ? payload.name + " / " + payload.role + " / " + payload.status
        : payload.name + " / " + payload.role + " / " + payload.status;
    }
  }

  function clearPartnerModal() {
    var listPanel = $("partner-console-list-panel");
    var list = $("partner-console-list");
    var chatPanel = $("partner-console-chat-panel");
    var chatLog = $("partner-console-chat-log");
    var input = $("partner-console-chat-input");
    var modal = $("partner-console-modal");
    if (list) list.textContent = "";
    if (chatLog) chatLog.textContent = "";
    if (input) input.value = "";
    if (listPanel) listPanel.hidden = false;
    if (chatPanel) chatPanel.hidden = true;
    if (modal) modal.classList.remove("is-skill-manager", "is-schedule-manager", "is-activity-manager");
  }

  function appendPartnerRow(title, meta, tone) {
    var list = $("partner-console-list");
    if (!list) return;
    var item = document.createElement("div");
    item.className = "partner-console-row";
    var dot = document.createElement("span");
    dot.className = "partner-console-row-dot partner-console-row-dot-" + (tone || "neutral");
    var copy = document.createElement("span");
    copy.className = "partner-console-row-copy";
    var strong = document.createElement("strong");
    strong.textContent = title;
    var small = document.createElement("small");
    small.textContent = meta || "";
    copy.appendChild(strong);
    if (meta) copy.appendChild(small);
    item.appendChild(dot);
    item.appendChild(copy);
    list.appendChild(item);
  }

  function appendSkillCard(skill, index, parent) {
    var list = parent || $("partner-console-list");
    if (!list) return;
    var label = typeof skill === "string" ? skill : (skill && skill.label) || "";
    var description = typeof skill === "string" ? "" : (skill && skill.description) || "";
    var item = document.createElement("button");
    var tone = (skill && skill.tone) || (index % 4 === 0 ? "blue" : index % 4 === 1 ? "green" : index % 4 === 2 ? "amber" : "slate");
    item.type = "button";
    item.className = "partner-console-skill-card partner-console-skill-card-" + tone;
    item.setAttribute("data-partner-skill-card", "true");
    item.setAttribute("data-partner-skill-search", (label + " " + description).toLowerCase());
    var cover = document.createElement("span");
    cover.className = "partner-console-skill-cover";
    cover.setAttribute("aria-hidden", "true");
    if (skill && skill.coverUrl) {
      var image = document.createElement("img");
      image.src = skill.coverUrl;
      image.alt = "";
      image.loading = "lazy";
      cover.appendChild(image);
    } else {
      var mark = document.createElement("span");
      mark.textContent = String(label).trim().slice(0, 1) || "M";
      cover.appendChild(mark);
    }
    var copy = document.createElement("span");
    copy.className = "partner-console-skill-copy";
    var icon = document.createElement("span");
    icon.className = "partner-console-skill-bot";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "⌘";
    var strong = document.createElement("strong");
    strong.textContent = label;
    var small = document.createElement("small");
    small.textContent = description || (isZhLocale() ? "可直接用于当前工作流" : "Ready for this workflow");
    copy.appendChild(icon);
    copy.appendChild(strong);
    copy.appendChild(small);
    item.appendChild(cover);
    item.appendChild(copy);
    list.appendChild(item);
  }

  function normalizeSkillSearch(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, "");
  }

  function matchesSkillSearch(source, query) {
    var text = normalizeSkillSearch(source);
    var needle = normalizeSkillSearch(query);
    var cursor = 0;
    var i;
    if (!needle) return true;
    if (text.indexOf(needle) !== -1) return true;
    for (i = 0; i < text.length && cursor < needle.length; i += 1) {
      if (text.charAt(i) === needle.charAt(cursor)) cursor += 1;
    }
    return cursor === needle.length;
  }

  var activitySessionOffsets = {};

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function isWorkingPartner(payload) {
    return /工作中|working/i.test(String(payload.status || ""));
  }

  function twoDigit(value) {
    return String(value).padStart(2, "0");
  }

  function formatActivityTimestamp(minutesAgo) {
    var now = new Date();
    var target = new Date(now.getTime() - minutesAgo * 60 * 1000);
    var hours = twoDigit(target.getHours());
    var minutes = twoDigit(target.getMinutes());
    if (isZhLocale()) return (target.getMonth() + 1) + "月" + target.getDate() + "日 " + hours + ":" + minutes;
    return target.toLocaleString("en-US", { month: "short", day: "numeric" }) + " " + hours + ":" + minutes;
  }

  function workingActivityOffsets(key, count) {
    if (!activitySessionOffsets[key]) {
      var offsets = [];
      var latest = randomInt(4, 16);
      for (var i = 0; i < count; i += 1) {
        latest += i === 0 ? 0 : randomInt(i < 3 ? 4 : 18, i < 3 ? 12 : 42);
        offsets.push(latest);
      }
      activitySessionOffsets[key] = offsets;
    }
    return activitySessionOffsets[key];
  }

  function activitiesForRender(payload) {
    var activities = payload.activities || [];
    if (!isWorkingPartner(payload)) return activities;
    var offsets = workingActivityOffsets(payload.name || "partner", activities.length);
    return activities.map(function (item, index) {
      var minutesAgo = offsets[index] || offsets[offsets.length - 1] || 8;
      return Object.assign({}, item, {
        time: formatActivityTimestamp(minutesAgo),
        ageHours: minutesAgo / 60,
      });
    });
  }

  function renderSkills(payload) {
    var title = isZhLocale() ? "技能管理" : "Skill management";
    var list = $("partner-console-list");
    var modal = $("partner-console-modal");
    setPartnerModalHeader(payload, title);
    clearPartnerModal();
    if (modal) modal.classList.add("is-skill-manager");
    if (list) {
      var shell = document.createElement("div");
      shell.className = "partner-console-skill-manager";

      var intro = document.createElement("div");
      intro.className = "partner-console-skill-manager-intro";
      var introIcon = document.createElement("span");
      introIcon.className = "partner-console-skill-manager-icon";
      introIcon.setAttribute("aria-hidden", "true");
      introIcon.textContent = "⌘";
      var introCopy = document.createElement("div");
      var introTitle = document.createElement("strong");
      introTitle.textContent = isZhLocale() ? "技能管理" : "Skill management";
      var chip = document.createElement("span");
      chip.className = "partner-console-skill-agent-chip";
      if (payload.avatarUrl) {
        var avatar = document.createElement("img");
        avatar.src = payload.avatarUrl;
        avatar.alt = "";
        avatar.loading = "lazy";
        chip.appendChild(avatar);
      }
      var chipText = document.createElement("span");
      chipText.textContent = payload.name;
      chip.appendChild(chipText);
      introCopy.appendChild(introTitle);
      introCopy.appendChild(chip);
      intro.appendChild(introIcon);
      intro.appendChild(introCopy);

      var toolbar = document.createElement("label");
      toolbar.className = "partner-console-skill-search";
      var searchIcon = document.createElement("span");
      searchIcon.className = "partner-console-skill-search-icon";
      searchIcon.setAttribute("aria-hidden", "true");
      var input = document.createElement("input");
      input.placeholder = isZhLocale() ? "搜索技能" : "Search skills";
      toolbar.appendChild(searchIcon);
      toolbar.appendChild(input);

      var grid = document.createElement("div");
      grid.className = "partner-console-skill-grid";
      payload.skills.forEach(function (skill, index) {
        appendSkillCard(skill, index, grid);
      });
      input.addEventListener("input", function () {
        var query = input.value;
        grid.querySelectorAll("[data-partner-skill-card]").forEach(function (card) {
          var source = card.getAttribute("data-partner-skill-search") || card.textContent || "";
          card.hidden = !matchesSkillSearch(source, query);
        });
      });

      shell.appendChild(intro);
      shell.appendChild(toolbar);
      shell.appendChild(grid);
      list.appendChild(shell);
    }
    openModal("partner-console-modal");
  }

  function renderTasks(payload) {
    var title = isZhLocale() ? payload.name + " 的定时任务" : payload.name + "'s automations";
    var list = $("partner-console-list");
    var modal = $("partner-console-modal");
    setPartnerModalHeader(payload, title);
    clearPartnerModal();
    if (modal) modal.classList.add("is-schedule-manager");
    if (list) {
      var shell = document.createElement("div");
      shell.className = "partner-console-schedule";

      var header = document.createElement("header");
      header.className = "partner-console-schedule-header";
      var titleBlock = document.createElement("div");
      titleBlock.className = "partner-console-schedule-title";
      var badge = document.createElement("span");
      badge.textContent = isZhLocale() ? "定时任务" : "Automations";
      var heading = document.createElement("h3");
      heading.textContent = title;
      var body = document.createElement("p");
      body.textContent = isZhLocale() ? "查看当前 AI 伙伴的定时任务列表。" : "View the current AI partner's automation list.";
      titleBlock.appendChild(badge);
      titleBlock.appendChild(heading);
      titleBlock.appendChild(body);

      header.appendChild(titleBlock);

      var grid = document.createElement("div");
      grid.className = "partner-console-schedule-grid";
      payload.tasks.forEach(function (task) {
        var card = document.createElement("article");
        card.className = "partner-console-schedule-card";
        if (task.enabled === false) card.classList.add("is-disabled");
        card.innerHTML = [
          "<div class=\"partner-console-schedule-card-top\">",
          "<div><strong></strong><p></p></div>",
          "<span class=\"" + (task.enabled === false ? "disabled" : "enabled") + "\"><i aria-hidden=\"true\"></i>" + (task.enabled === false ? (isZhLocale() ? "未启用" : "Disabled") : (isZhLocale() ? "已启用" : "Enabled")) + "</span>",
          "</div>",
          "<div class=\"partner-console-schedule-info-row has-delivery\">",
          "<div class=\"partner-console-schedule-info blue\"><span>" + (isZhLocale() ? "重复频率" : "Repeat Frequency") + "</span><p><i aria-hidden=\"true\">◷</i><b></b></p></div>",
          "<div class=\"partner-console-schedule-info violet\"><span>" + (isZhLocale() ? "投递方式" : "Delivery") + "</span><p><i aria-hidden=\"true\">↗</i><b></b></p></div>",
          "</div>",
          "<div class=\"partner-console-schedule-meta\">",
          "<div><span>" + (isZhLocale() ? "上次执行" : "Last Run") + "</span><strong></strong></div>",
          "<div><span>" + (isZhLocale() ? "下次执行" : "Next Run") + "</span><strong></strong></div>",
          "</div>",
        ].join("");
        card.querySelector(".partner-console-schedule-card-top strong").textContent = task.title || "";
        card.querySelector(".partner-console-schedule-card-top p").textContent = task.description || "";
        card.querySelector(".partner-console-schedule-info.blue b").textContent = task.frequency || "";
        card.querySelector(".partner-console-schedule-info.violet b").textContent = task.delivery || "";
        card.querySelector(".partner-console-schedule-meta div:first-child strong").textContent = task.lastRun || "";
        card.querySelector(".partner-console-schedule-meta div:last-child strong").textContent = task.nextRun || "";
        grid.appendChild(card);
      });

      var footer = document.createElement("footer");
      footer.className = "partner-console-schedule-footerbar";
      var closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.textContent = isZhLocale() ? "关闭" : "Close";
      closeButton.addEventListener("click", closeModal);
      footer.appendChild(closeButton);

      shell.appendChild(header);
      shell.appendChild(grid);
      shell.appendChild(footer);
      list.appendChild(shell);
    }
    openModal("partner-console-modal");
  }

  function renderActivity(payload) {
    var title = isZhLocale() ? "活动时间线" : "Activity timeline";
    var list = $("partner-console-list");
    var modal = $("partner-console-modal");
    setPartnerModalHeader(payload, title);
    clearPartnerModal();
    if (modal) modal.classList.add("is-activity-manager");
    var subtitle = $("partner-console-modal-subtitle");
    if (subtitle) {
      subtitle.textContent = "";
      if (payload.avatarUrl) {
        var avatar = document.createElement("img");
        avatar.src = payload.avatarUrl;
        avatar.alt = "";
        subtitle.appendChild(avatar);
      }
      var name = document.createElement("strong");
      name.textContent = payload.name || "";
      var engine = document.createElement("span");
      engine.textContent = "Hermes";
      subtitle.appendChild(name);
      subtitle.appendChild(engine);
    }
    if (list) {
      var shell = document.createElement("div");
      shell.className = "partner-console-activity agent-activity-dialog-shell";

      var categories = [
        { value: "all", label: isZhLocale() ? "全部" : "All" },
        { value: "conversation", label: isZhLocale() ? "对话" : "Chats" },
        { value: "tool", label: isZhLocale() ? "工具" : "Tools" },
        { value: "system", label: isZhLocale() ? "系统" : "System" },
        { value: "scheduled", label: isZhLocale() ? "定时任务" : "Automations" },
        { value: "skill", label: isZhLocale() ? "技能调用" : "Skill calls" },
      ];
      var ranges = [
        { value: "all", label: isZhLocale() ? "全部" : "All", hours: Infinity },
        { value: "24h", label: isZhLocale() ? "近 24 小时" : "Last 24h", hours: 24 },
        { value: "7d", label: isZhLocale() ? "近 7 天" : "Last 7d", hours: 168 },
        { value: "30d", label: isZhLocale() ? "近 30 天" : "Last 30d", hours: 720 },
      ];
      var activityItems = activitiesForRender(payload);
      var activeCategory = "all";
      var activeRange = "all";

      var toolbar = document.createElement("div");
      toolbar.className = "agent-activity-toolbar";
      var tabs = document.createElement("div");
      tabs.className = "agent-dialog-tabs";
      categories.forEach(function (category) {
        var button = document.createElement("button");
        var count = category.value === "all"
          ? activityItems.length
          : activityItems.filter(function (item) { return item.category === category.value; }).length;
        button.type = "button";
        button.className = category.value === "all" ? "active" : "";
        button.setAttribute("data-activity-filter", category.value);
        button.innerHTML = "<span></span><small></small>";
        button.querySelector("span").textContent = category.label;
        button.querySelector("small").textContent = String(count);
        tabs.appendChild(button);
      });

      var searchRow = document.createElement("div");
      searchRow.className = "agent-activity-search-row";
      var searchLabel = document.createElement("label");
      searchLabel.className = "agent-activity-search";
      var searchIcon = document.createElement("span");
      searchIcon.setAttribute("aria-hidden", "true");
      searchIcon.textContent = "⌕";
      var input = document.createElement("input");
      input.placeholder = isZhLocale() ? "搜索动态内容" : "Search activity";
      var clear = document.createElement("button");
      clear.type = "button";
      clear.textContent = isZhLocale() ? "清除" : "Clear";
      clear.hidden = true;
      searchLabel.appendChild(searchIcon);
      searchLabel.appendChild(input);
      searchLabel.appendChild(clear);

      var rangeRow = document.createElement("div");
      rangeRow.className = "agent-activity-range-row";
      ranges.forEach(function (range) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = range.value === activeRange ? "active" : "";
        button.setAttribute("data-activity-range", range.value);
        button.textContent = range.label;
        rangeRow.appendChild(button);
      });
      searchRow.appendChild(searchLabel);
      searchRow.appendChild(rangeRow);
      toolbar.appendChild(tabs);
      toolbar.appendChild(searchRow);

      var grid = document.createElement("div");
      grid.className = "agent-activity-content-grid";
      var panel = document.createElement("section");
      panel.className = "agent-activity-timeline-panel";
      var timeline = document.createElement("ol");
      timeline.className = "agent-activity-timeline";
      var empty = document.createElement("div");
      empty.className = "partner-console-activity-empty";
      empty.hidden = true;
      empty.innerHTML = "<strong></strong><span></span>";
      empty.querySelector("strong").textContent = isZhLocale() ? "没有匹配的动态" : "No matching activity";
      empty.querySelector("span").textContent = isZhLocale() ? "换一个分类、时间范围或关键词试试。" : "Try another category, range, or keyword.";

      function sourceIcon(source) {
        if (source === "wechat") return "/landing/ai-partner-cards/wechat.svg";
        if (source === "feishu") return "/landing/ai-partner-cards/feishu.png";
        return "/landing/ai-partner-cards/moticlaw-mark.svg";
      }

      function eventTone(category) {
        if (category === "scheduled") return "scheduled";
        if (category === "skill") return "skill";
        if (category === "tool") return "tool";
        if (category === "system") return "system";
        return "neutral";
      }

      function buildSourceBadge(item) {
        return "<span class=\"agent-conversation-source-badge\"><img alt=\"\" src=\"" + sourceIcon(item.source) + "\"><strong></strong></span>";
      }

      activityItems.forEach(function (item) {
        var entry = document.createElement("li");
        entry.className = "agent-activity-entry " + item.category + (item.category === "conversation" ? " conversation" : "");
        entry.setAttribute("data-activity-entry", "true");
        entry.setAttribute("data-activity-category", item.category || "system");
        entry.setAttribute("data-activity-age", String(item.ageHours || 0));
        entry.setAttribute("data-activity-search", normalizeSkillSearch([item.label, item.title, item.body, item.reply, item.channel].join(" ")));
        entry.innerHTML = [
          "<span class=\"agent-activity-dot\"></span>",
          "<div class=\"agent-activity-entry-body\">",
          "<div class=\"agent-activity-entry-meta\"><time></time><span class=\"agent-activity-type-badge\"></span></div>",
          "<div class=\"agent-activity-entry-content\"></div>",
          "</div>",
        ].join("");
        entry.querySelector("time").textContent = item.time || "";
        entry.querySelector(".agent-activity-type-badge").textContent = item.label || "";
        var content = entry.querySelector(".agent-activity-entry-content");
        if (item.category === "conversation") {
          content.className = "agent-conversation-bubbles";
          var userRow = document.createElement("div");
          userRow.className = "agent-conversation-row user";
          userRow.innerHTML = "<div class=\"agent-conversation-bubble user with-tail\"><div class=\"agent-conversation-markdown\"></div>" + buildSourceBadge(item) + "</div>";
          userRow.querySelector(".agent-conversation-markdown").textContent = item.body || "";
          userRow.querySelector(".agent-conversation-source-badge strong").textContent = item.channel || "";
          content.appendChild(userRow);
          if (item.reply) {
            var replyRow = document.createElement("div");
            replyRow.className = "agent-conversation-row assistant";
            replyRow.innerHTML = "<div class=\"agent-conversation-bubble assistant with-tail\"><div class=\"agent-conversation-markdown\"></div>" + buildSourceBadge(item) + "</div>";
            replyRow.querySelector(".agent-conversation-markdown").textContent = item.reply;
            replyRow.querySelector(".agent-conversation-source-badge strong").textContent = item.channel || "";
            content.appendChild(replyRow);
          }
        } else {
          var card = document.createElement("article");
          card.className = "agent-activity-event-card " + eventTone(item.category) + (item.body ? " has-body" : "");
          card.innerHTML = [
            "<div class=\"agent-activity-event-icon\" aria-hidden=\"true\"></div>",
            "<div class=\"agent-activity-event-head\"><strong></strong></div>",
            "<div class=\"agent-activity-event-body\"><p class=\"agent-activity-event-summary\"></p><span class=\"agent-activity-chip-row\"><span class=\"agent-activity-detail-chip\"></span></span></div>",
          ].join("");
          card.querySelector(".agent-activity-event-icon").textContent = item.category === "tool" ? "⌘" : item.category === "skill" ? "✦" : item.category === "scheduled" ? "◷" : "✓";
          card.querySelector("strong").textContent = item.title || "";
          card.querySelector("p").textContent = item.body || "";
          card.querySelector(".agent-activity-detail-chip").textContent = item.channel || "MotiClaw";
          content.appendChild(card);
        }
        timeline.appendChild(entry);
      });

      function applyActivityFilters() {
        var query = input.value || "";
        var range = ranges.find(function (item) { return item.value === activeRange; }) || ranges[0];
        var visibleCount = 0;
        clear.hidden = !query;
        timeline.querySelectorAll("[data-activity-entry]").forEach(function (entry) {
          var category = entry.getAttribute("data-activity-category") || "";
          var age = Number(entry.getAttribute("data-activity-age") || "0");
          var searchText = entry.getAttribute("data-activity-search") || "";
          var visible = (activeCategory === "all" || category === activeCategory)
            && age <= range.hours
            && matchesSkillSearch(searchText, query);
          entry.hidden = !visible;
          if (visible) visibleCount += 1;
        });
        empty.hidden = visibleCount !== 0;
        timeline.hidden = visibleCount === 0;
        panel.classList.toggle("empty", visibleCount === 0);
      }

      tabs.querySelectorAll("[data-activity-filter]").forEach(function (button) {
        button.addEventListener("click", function () {
          activeCategory = button.getAttribute("data-activity-filter") || "all";
          tabs.querySelectorAll("button").forEach(function (item) {
            item.classList.toggle("active", item === button);
          });
          applyActivityFilters();
        });
      });
      rangeRow.querySelectorAll("[data-activity-range]").forEach(function (button) {
        button.addEventListener("click", function () {
          activeRange = button.getAttribute("data-activity-range") || "all";
          rangeRow.querySelectorAll("button").forEach(function (item) {
            item.classList.toggle("active", item === button);
          });
          applyActivityFilters();
        });
      });
      input.addEventListener("input", applyActivityFilters);
      clear.addEventListener("click", function () {
        input.value = "";
        input.focus();
        applyActivityFilters();
      });

      panel.appendChild(timeline);
      panel.appendChild(empty);
      grid.appendChild(panel);
      shell.appendChild(toolbar);
      shell.appendChild(grid);
      list.appendChild(shell);
      applyActivityFilters();
    }
    openModal("partner-console-modal");
  }

  function renderConfig(payload) {
    var title = isZhLocale() ? payload.name + "的配置" : payload.name + " settings";
    setPartnerModalHeader(payload, title);
    clearPartnerModal();
    payload.configItems.forEach(function (item, index) {
      appendPartnerRow(item, isZhLocale() ? "演示配置，可点击切换" : "Demo setting, click to toggle", index === 0 ? "active" : "neutral");
    });
    var list = $("partner-console-list");
    if (list) {
      list.querySelectorAll(".partner-console-row").forEach(function (row, index) {
        row.setAttribute("role", "button");
        row.setAttribute("tabindex", "0");
        row.setAttribute("aria-pressed", index === 0 ? "true" : "false");
        row.addEventListener("click", function () {
          var pressed = row.getAttribute("aria-pressed") === "true";
          row.setAttribute("aria-pressed", String(!pressed));
        });
        row.addEventListener("keydown", function (event) {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          row.click();
        });
      });
    }
    openModal("partner-console-modal");
  }

  function appendChatMessage(kind, text) {
    var chatLog = $("partner-console-chat-log");
    if (!chatLog) return;
    var bubble = document.createElement("div");
    bubble.className = "partner-console-chat-message partner-console-chat-message-" + kind;
    bubble.textContent = text;
    chatLog.appendChild(bubble);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function partnerReply(payload) {
    return isZhLocale()
      ? "我是" + payload.name + "，负责" + payload.role + "。我已经收到你的指令，很乐意继续为你服务。你可以让我先整理目标、拆任务，或提醒下一步。"
      : "I am " + payload.name + ", focused on " + payload.role + ". I received your instruction and I am glad to help. You can ask me to organize goals, break down tasks, or remind the next step.";
  }

  function renderChat(payload) {
    var title = isZhLocale() ? payload.channel + "对话" : payload.channel + " chat";
    var listPanel = $("partner-console-list-panel");
    var chatPanel = $("partner-console-chat-panel");
    setPartnerModalHeader(payload, title);
    clearPartnerModal();
    if (listPanel) listPanel.hidden = true;
    if (chatPanel) chatPanel.hidden = false;
    appendChatMessage("partner", partnerReply(payload));
    openModal("partner-console-modal");
    var input = $("partner-console-chat-input");
    if (input) {
      setTimeout(function () {
        input.focus();
      }, 80);
    }
  }

  function initPartnerConsoleControls() {
    var grid = document.querySelector("[data-console-grid]");
    if (!grid) return;
    var search = document.querySelector("[data-console-search]");
    var filters = Array.prototype.slice.call(document.querySelectorAll("[data-console-filter]"));
    var modeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-console-mode-toggle]"));
    var activeFilter = "all";
    var activeMode = "manage";
    var originalCards = Array.prototype.slice.call(grid.querySelectorAll("[data-console-partner-card]"));
    var priority = { crashed: 0, working: 1, idle: 2, offline: 3 };

    function setMode(mode) {
      activeMode = mode === "patrol" ? "patrol" : "manage";
      modeButtons.forEach(function (button) {
        var active = button.getAttribute("data-console-mode-toggle") === activeMode;
        button.dataset.active = String(active);
        button.setAttribute("aria-pressed", String(active));
      });
      if (activeMode === "patrol") {
        grid.dataset.consoleMode = activeMode;
      } else {
        delete grid.dataset.consoleMode;
      }
      applyConsoleFilters();
    }

    function sortCards(cards) {
      if (activeMode !== "patrol") return originalCards;
      return cards.slice().sort(function (a, b) {
        var aStatus = a.getAttribute("data-console-partner-status") || "";
        var bStatus = b.getAttribute("data-console-partner-status") || "";
        return (priority[aStatus] ?? 9) - (priority[bStatus] ?? 9);
      });
    }

    function applyConsoleFilters() {
      var query = search ? search.value.trim().toLowerCase() : "";
      var visibleCount = 0;
      var orderedCards = sortCards(originalCards);
      orderedCards.forEach(function (card) {
        grid.appendChild(card);
      });
      originalCards.forEach(function (card) {
        var status = card.getAttribute("data-console-partner-status") || "";
        var haystack = card.getAttribute("data-console-partner-search") || "";
        var matchesStatus = activeFilter === "all" || status === activeFilter;
        var matchesSearch = !query || haystack.indexOf(query) !== -1;
        var visible = matchesStatus && matchesSearch;
        card.hidden = !visible;
        var shouldDim = activeMode === "patrol" && visible && status === "offline";
        if (shouldDim) {
          card.dataset.consoleDimmed = "true";
        } else {
          delete card.dataset.consoleDimmed;
        }
        if (visible) visibleCount += 1;
      });
      if (visibleCount === 0) {
        grid.dataset.empty = "true";
      } else {
        delete grid.dataset.empty;
      }
    }

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-console-filter") || "all";
        filters.forEach(function (item) {
          var active = item === button;
          item.setAttribute("aria-pressed", String(active));
        });
        applyConsoleFilters();
      });
    });

    modeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setMode(button.getAttribute("data-console-mode-toggle"));
      });
    });

    if (search) search.addEventListener("input", applyConsoleFilters);
    setMode("manage");
  }

  document.querySelectorAll("[data-console-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      var payload = partnerPayloadFromButton(button);
      if (!payload) return;
      if (payload.action === "tasks") renderTasks(payload);
      else if (payload.action === "activity") renderActivity(payload);
      else if (payload.action === "chat") renderChat(payload);
      else if (payload.action === "config") renderConfig(payload);
      else renderSkills(payload);
    });
  });

  initPartnerConsoleControls();

  var partnerChatForm = $("partner-console-chat-form");
  if (partnerChatForm) {
    partnerChatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = $("partner-console-chat-input");
      if (!input) return;
      var text = input.value.trim();
      if (!text) return;
      appendChatMessage("user", text);
      input.value = "";
      var modalTitle = $("partner-console-modal-title");
      var subtitle = $("partner-console-modal-subtitle");
      var name = subtitle && subtitle.textContent ? subtitle.textContent.split(" / ")[0] : "";
      var role = subtitle && subtitle.textContent ? subtitle.textContent.split(" / ")[1] || "" : "";
      setTimeout(function () {
        appendChatMessage(
          "partner",
          isZhLocale()
            ? "收到。我是" + name + "，会按“" + text + "”先帮你整理下一步，并在需要你确认的时候提醒你。"
            : "Got it. I am " + name + ". I will start from \"" + text + "\" and remind you when your confirmation is needed."
        );
        if (modalTitle && role) modalTitle.setAttribute("data-last-role", role);
      }, 220);
    });
  }

  function initPartnerSceneVideos() {
    var videos = Array.prototype.slice.call(document.querySelectorAll("[data-console-scene-video]"));
    if (!videos.length) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function loadVideo(video) {
      var src = video.getAttribute("data-scene-video-src");
      if (!src || video.getAttribute("src")) return;
      video.setAttribute("src", src);
      video.preload = "metadata";
      video.addEventListener(
        "loadeddata",
        function () {
          video.classList.add("ready");
        },
        { once: true }
      );
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") playPromise.catch(function () {});
    }

    if (!("IntersectionObserver" in window)) {
      videos.slice(0, 4).forEach(loadVideo);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting && entry.intersectionRatio <= 0) return;
          loadVideo(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "360px 0px" }
    );

    videos.forEach(function (video) {
      observer.observe(video);
    });
  }

  window.setTimeout(initPartnerSceneVideos, 700);

  var detectionDone = false;

  function detectOs(userAgent, platform, uaDataPlatform) {
    var combined = (uaDataPlatform + " " + platform).toLowerCase();
    if (userAgent.indexOf("mac") !== -1 || combined.indexOf("mac") !== -1) return "mac";
    if (userAgent.indexOf("win") !== -1 || combined.indexOf("win") !== -1) return "win";
    if (userAgent.indexOf("linux") !== -1 || combined.indexOf("linux") !== -1) return "linux";
    return "unknown";
  }

  function normalizeArch(architecture, bitness) {
    var arch = (architecture || "").toLowerCase();
    var bits = (bitness || "").toLowerCase();
    if (arch === "arm") return bits === "32" ? "unknown" : "arm64";
    if (arch === "x86") return bits === "32" ? "unknown" : "x64";
    if (arch === "arm64" || arch === "aarch64") return "arm64";
    if (arch === "x64" || arch === "x86_64" || arch === "amd64") return "x64";
    return "unknown";
  }

  function archFromUserAgent(userAgent, platform) {
    var combined = (userAgent + " " + platform).toLowerCase();
    if (/(^|[\s_/-])(arm64|aarch64|armv8)([\s_/-]|$)|\barm\b/.test(combined)) return "arm64";
    if (/\b(x86_64|amd64|x64|wow64|win64)\b/.test(combined) || combined.indexOf("intel") !== -1) return "x64";
    return "unknown";
  }

  function macArchFromWebGl() {
    try {
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!context) return "unknown";
      var debugInfo = context.getExtension("WEBGL_debug_renderer_info");
      if (!debugInfo) return "unknown";
      var renderer = context.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      if (typeof renderer !== "string") return "unknown";
      var normalized = renderer.toLowerCase();
      if (normalized.indexOf("apple") !== -1) return "arm64";
      if (normalized.indexOf("intel") !== -1 || normalized.indexOf("amd") !== -1 || normalized.indexOf("radeon") !== -1) return "x64";
    } catch (e) {}
    return "unknown";
  }

  function detectPlatform() {
    var nav = window.navigator;
    var userAgent = (nav.userAgent || "").toLowerCase();
    var platform = (nav.platform || "").toLowerCase();
    var uaData = nav.userAgentData;
    var uaDataPlatform = ((uaData && uaData.platform) || "").toLowerCase();
    var os = detectOs(userAgent, platform, uaDataPlatform);

    if (os === "unknown") return Promise.resolve({ os: os, arch: "unknown" });

    var archPromise = Promise.resolve("unknown");
    if (uaData && typeof uaData.getHighEntropyValues === "function") {
      archPromise = uaData
        .getHighEntropyValues(["architecture", "bitness"])
        .then(function (values) {
          return normalizeArch(values.architecture, values.bitness);
        })
        .catch(function () {
          return "unknown";
        });
    }

    return archPromise.then(function (arch) {
      if (arch === "unknown" && os === "mac") arch = macArchFromWebGl();
      if (arch === "unknown") arch = archFromUserAgent(userAgent, platform);
      return { os: os, arch: arch };
    });
  }

  function groupForOs(os) {
    if (os === "mac") return "macos";
    if (os === "win") return "windows";
    if (os === "linux") return "linux";
    return null;
  }

  function candidateKeys(os, arch) {
    if (os === "win") return ["windows-x64"];

    var order = arch === "arm64" ? ["arm64", "x64"] : ["x64", "arm64"];
    var keys = [];
    order.forEach(function (a) {
      if (os === "mac") keys.push(a === "arm64" ? "darwin-arm64" : "darwin-x64");
    });
    if (os === "linux") {
      order.forEach(function (a) {
        keys.push(a === "arm64" ? "linux-deb-arm64" : "linux-deb-x64");
      });
      order.forEach(function (a) {
        keys.push(a === "arm64" ? "linux-appimage-arm64" : "linux-appimage-x64");
      });
      keys.push("linux-rpm-x64");
    }
    return keys;
  }

  function visibleArtifact(key, artifact) {
    if (!artifact || !artifact.url) return false;
    if (key === "windows-x64") {
      return (artifact.filename || "").toLowerCase().slice(-10) === "-setup.exe";
    }
    return true;
  }

  function formatBytes(value) {
    if (!value) return "";
    return (value / 1024 / 1024).toFixed(1) + " MB";
  }

  function detectedLabel(os, arch, strings) {
    var group = groupForOs(os);
    if (!group) return strings.unknownDevice;
    var base = strings.groups[group];
    if (arch === "unknown") return base;
    return base + (arch === "arm64" ? " (ARM64)" : " (x64)");
  }

  function installNoteFor(key, strings) {
    if (key.indexOf("darwin") === 0) return strings.installNotes.mac;
    if (key.indexOf("windows") === 0) return strings.installNotes.win;
    return "";
  }

  function runPlatformDetection() {
    if (detectionDone || !landingData) return;
    detectionDone = true;
    var strings = landingData.strings;

    detectPlatform().then(function (detected) {
      var label = $("download-detected-label");
      if (label) label.textContent = detectedLabel(detected.os, detected.arch, strings);

      var recommendedKey = null;
      var keys = candidateKeys(detected.os, detected.arch);
      for (var i = 0; i < keys.length; i += 1) {
        if (visibleArtifact(keys[i], landingData.artifacts[keys[i]])) {
          recommendedKey = keys[i];
          break;
        }
      }

      var card = $("download-recommended-card");
      var title = $("download-recommended-title");
      var file = $("download-recommended-file");
      var meta = $("download-recommended-meta");
      var action = $("download-recommended-action");
      var note = $("download-recommended-note");
      var noteText = $("download-recommended-note-text");
      if (!card || !title || !file) return;

      if (recommendedKey) {
        var artifact = landingData.artifacts[recommendedKey];
        card.classList.remove("download-recommended-card-unavailable");
        card.href = artifact.url;
        title.textContent = strings.platforms[recommendedKey] || recommendedKey;
        file.textContent = artifact.filename || strings.githubRelease;
        if (meta) {
          meta.textContent = artifact.sizeBytes ? strings.size + " " + formatBytes(artifact.sizeBytes) : strings.githubRelease;
        }
        if (action) action.hidden = false;
        if (note && noteText) {
          var noteValue = installNoteFor(recommendedKey, strings);
          if (noteValue) {
            noteText.textContent = noteValue;
            note.hidden = false;
          }
        }
      } else {
        title.textContent = detected.os === "unknown" ? strings.recommendedPendingTitle : detectedLabel(detected.os, detected.arch, strings);
        file.textContent = detected.os === "unknown" ? strings.recommendedPendingNote : strings.comingSoon;
        if (meta) meta.textContent = "";
      }
    });
  }

  /* ---------------- ?download=1 deep link ---------------- */
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get("download") === "1") {
      openModal("download-modal");
      params.delete("download");
      var nextSearch = params.toString();
      var nextUrl = window.location.pathname + (nextSearch ? "?" + nextSearch : "") + window.location.hash;
      window.history.replaceState({}, "", nextUrl);
    }
  } catch (e) {}
})();
