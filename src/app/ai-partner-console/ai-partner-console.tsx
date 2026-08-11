"use client";

/*
## 核心功能
实现 MotiClaw AI 伙伴管理台原型的客户端筛选、搜索、视图切换、伙伴详情、任务时间线和操作入口演示。
## 输入
接收服务端解析后的 locale，并使用本文件内置 demo AI 伙伴数据。
## 输出
输出可交互的浅色高密度管理台界面。
## 定位
位于 `src/app/ai-partner-console`，只服务当前体验路由，避免污染首页零水合组件。
## 依赖
依赖 React 客户端状态和 `@phosphor-icons/react` 图标。
## 维护规则
- 用户可见文案保持 partner-first，统一使用 AI 伙伴。
- 不在界面文案暴露 API、模型、数据库、HTTP 状态码等实现细节。
- 新增 demo 字段时同步维护中英文文案。
*/
import {
  BellRinging,
  ChatCircleText,
  CheckCircle,
  ClockCounterClockwise,
  GearSix,
  Kanban,
  MagnifyingGlass,
  MapPinLine,
  PauseCircle,
  PlayCircle,
  Pulse,
  SlidersHorizontal,
  UserCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/locale";

type Localized = Record<Locale, string>;
type PartnerStatus = "working" | "idle" | "offline" | "exception";
type Channel = "feishu" | "wechat" | "none";
type Health = "healthy" | "attention" | "risk";
type TaskState = "running" | "waiting" | "done" | "blocked";
type ViewMode = "manage" | "patrol";
type ActionPreview = "chat" | "config" | "handoff";

type PartnerTask = {
  id: string;
  title: Localized;
  state: TaskState;
  progress: number;
  time: Localized;
};

type AiPartner = {
  id: string;
  name: Localized;
  role: Localized;
  team: Localized;
  avatar: string;
  accent: string;
  status: PartnerStatus;
  channel: Channel;
  usage: number;
  skills: number;
  tasks: number;
  recent: Localized;
  health: Health;
  healthText: Localized;
  timeline: PartnerTask[];
};

const copy = {
  zh: {
    eyebrow: "AI 伙伴管理台",
    title: "像管理团队一样，管理你的 AI 伙伴",
    lead: "筛选状态、查看渠道、巡查任务进度，把每个 AI 伙伴的最近活动和健康状态放在同一张工作台里。",
    demoNotice: "当前为官网交互原型，数据用于演示管理体验。",
    search: "搜索 AI 伙伴、角色或团队",
    manage: "管理台",
    patrol: "巡航视图",
    all: "全部",
    statusLabel: "状态筛选",
    channelLabel: "渠道",
    summary: "今日概览",
    partnerCount: "AI 伙伴",
    workingCount: "工作中",
    taskCount: "进行中任务",
    usageCount: "今日消耗",
    clear: "清除",
    selected: "当前选中",
    team: "团队",
    usage: "消耗",
    skills: "技能",
    tasks: "任务",
    recent: "最近活动",
    health: "健康状态",
    timeline: "任务时间线",
    expandTimeline: "展开时间线",
    collapseTimeline: "收起时间线",
    openChat: "对话",
    openConfig: "配置",
    handoff: "交接",
    pushTask: "推进任务",
    noResult: "没有找到匹配的 AI 伙伴",
    noResultHint: "换一个状态或关键词试试。",
    previewTitle: "操作演示",
    chatPreview: "已打开对话入口：你可以在这里查看该 AI 伙伴对当前任务的下一步说明。",
    configPreview: "已打开配置入口：这里会承接身份、技能、渠道和工作节奏设置。",
    handoffPreview: "已生成交接视图：适合把进行中的任务移交给另一个 AI 伙伴或人工确认。",
    status: {
      working: "工作中",
      idle: "空闲",
      offline: "离线",
      exception: "异常",
    },
    channels: {
      feishu: "飞书",
      wechat: "微信",
      none: "未接入",
    },
    healthStates: {
      healthy: "稳定",
      attention: "需关注",
      risk: "风险",
    },
    taskStates: {
      running: "进行中",
      waiting: "等待确认",
      done: "已完成",
      blocked: "需处理",
    },
  },
  en: {
    eyebrow: "AI Partner Console",
    title: "Manage AI partners like a working team",
    lead: "Filter status, review channels, patrol task progress, and keep every AI partner's recent activity and health in one work surface.",
    demoNotice: "This is an interactive website prototype with demo data.",
    search: "Search AI partners, roles, or teams",
    manage: "Console",
    patrol: "Patrol",
    all: "All",
    statusLabel: "Status filter",
    channelLabel: "Channel",
    summary: "Today",
    partnerCount: "AI partners",
    workingCount: "Working",
    taskCount: "Active tasks",
    usageCount: "Today usage",
    clear: "Clear",
    selected: "Selected",
    team: "Team",
    usage: "Usage",
    skills: "Skills",
    tasks: "Tasks",
    recent: "Recent activity",
    health: "Health",
    timeline: "Task timeline",
    expandTimeline: "Expand timeline",
    collapseTimeline: "Collapse timeline",
    openChat: "Chat",
    openConfig: "Configure",
    handoff: "Handoff",
    pushTask: "Move task",
    noResult: "No matching AI partners",
    noResultHint: "Try another status or keyword.",
    previewTitle: "Action preview",
    chatPreview: "Chat entry opened: review this AI partner's next-step notes for the current task.",
    configPreview: "Configuration entry opened: identity, skills, channels, and work rhythm would live here.",
    handoffPreview: "Handoff view prepared: useful when a task should move to another AI partner or a human check.",
    status: {
      working: "Working",
      idle: "Idle",
      offline: "Offline",
      exception: "Exception",
    },
    channels: {
      feishu: "Feishu",
      wechat: "WeChat",
      none: "Not connected",
    },
    healthStates: {
      healthy: "Healthy",
      attention: "Watch",
      risk: "Risk",
    },
    taskStates: {
      running: "Running",
      waiting: "Waiting",
      done: "Done",
      blocked: "Needs help",
    },
  },
} as const;

const initialPartners: AiPartner[] = [
  {
    id: "ops-lead",
    name: { zh: "晨星", en: "Morning Star" },
    role: { zh: "运营总控", en: "Operations lead" },
    team: { zh: "增长运营", en: "Growth Ops" },
    avatar: "晨",
    accent: "#ef7b43",
    status: "working",
    channel: "feishu",
    usage: 42800,
    skills: 18,
    tasks: 12,
    recent: { zh: "刚整理完 4 条客户跟进提醒", en: "Organized 4 customer follow-up reminders" },
    health: "healthy",
    healthText: { zh: "节奏稳定，任务响应及时", en: "Stable rhythm with timely task response" },
    timeline: [
      { id: "ops-1", title: { zh: "汇总今日运营待办", en: "Summarize today's ops tasks" }, state: "running", progress: 72, time: { zh: "12 分钟前", en: "12 min ago" } },
      { id: "ops-2", title: { zh: "标记待确认客户承诺", en: "Flag customer commitments" }, state: "waiting", progress: 48, time: { zh: "31 分钟前", en: "31 min ago" } },
      { id: "ops-3", title: { zh: "生成晚间巡查摘要", en: "Prepare evening patrol digest" }, state: "done", progress: 100, time: { zh: "1 小时前", en: "1 hour ago" } },
    ],
  },
  {
    id: "wechat-keeper",
    name: { zh: "竹影", en: "Bamboo Shade" },
    role: { zh: "微信群助手", en: "WeChat group helper" },
    team: { zh: "社群", en: "Community" },
    avatar: "竹",
    accent: "#2f855a",
    status: "working",
    channel: "wechat",
    usage: 31760,
    skills: 14,
    tasks: 9,
    recent: { zh: "识别出 3 条需要人工回复的问题", en: "Found 3 questions that need a human reply" },
    health: "attention",
    healthText: { zh: "问题密度升高，建议晚间复核", en: "Question density is rising; review tonight" },
    timeline: [
      { id: "wechat-1", title: { zh: "归类群内反馈", en: "Classify group feedback" }, state: "running", progress: 66, time: { zh: "8 分钟前", en: "8 min ago" } },
      { id: "wechat-2", title: { zh: "准备可发送回复草稿", en: "Draft sendable replies" }, state: "waiting", progress: 39, time: { zh: "25 分钟前", en: "25 min ago" } },
      { id: "wechat-3", title: { zh: "沉淀高频问题", en: "Capture common questions" }, state: "done", progress: 100, time: { zh: "54 分钟前", en: "54 min ago" } },
    ],
  },
  {
    id: "release-captain",
    name: { zh: "折桂", en: "Laurel" },
    role: { zh: "发版清单员", en: "Release checklist owner" },
    team: { zh: "产品研发", en: "Product" },
    avatar: "桂",
    accent: "#2f80ed",
    status: "idle",
    channel: "feishu",
    usage: 18920,
    skills: 12,
    tasks: 5,
    recent: { zh: "等待下一版发布范围确认", en: "Waiting for the next release scope" },
    health: "healthy",
    healthText: { zh: "当前无阻塞，适合接新任务", en: "No blockers; ready for new work" },
    timeline: [
      { id: "release-1", title: { zh: "核对发布前检查项", en: "Check pre-release list" }, state: "done", progress: 100, time: { zh: "2 小时前", en: "2 hours ago" } },
      { id: "release-2", title: { zh: "等待变更摘要", en: "Wait for change summary" }, state: "waiting", progress: 20, time: { zh: "3 小时前", en: "3 hours ago" } },
      { id: "release-3", title: { zh: "同步帮助文档提示", en: "Sync help doc notes" }, state: "done", progress: 100, time: { zh: "昨天", en: "Yesterday" } },
    ],
  },
  {
    id: "content-scout",
    name: { zh: "拾光", en: "Light Picker" },
    role: { zh: "素材整理员", en: "Material organizer" },
    team: { zh: "内容", en: "Content" },
    avatar: "拾",
    accent: "#b7791f",
    status: "working",
    channel: "feishu",
    usage: 54210,
    skills: 21,
    tasks: 15,
    recent: { zh: "把 28 条素材聚成 6 个选题", en: "Grouped 28 materials into 6 topics" },
    health: "healthy",
    healthText: { zh: "素材处理量高，但节奏正常", en: "High material volume, still on pace" },
    timeline: [
      { id: "content-1", title: { zh: "整理访谈材料", en: "Organize interview material" }, state: "running", progress: 81, time: { zh: "5 分钟前", en: "5 min ago" } },
      { id: "content-2", title: { zh: "生成选题候选", en: "Generate topic candidates" }, state: "done", progress: 100, time: { zh: "37 分钟前", en: "37 min ago" } },
      { id: "content-3", title: { zh: "标注可复用片段", en: "Mark reusable snippets" }, state: "running", progress: 58, time: { zh: "1 小时前", en: "1 hour ago" } },
    ],
  },
  {
    id: "sales-memory",
    name: { zh: "听澜", en: "Tide Listener" },
    role: { zh: "客户记忆员", en: "Customer memory keeper" },
    team: { zh: "销售交付", en: "Sales Delivery" },
    avatar: "澜",
    accent: "#0f766e",
    status: "working",
    channel: "wechat",
    usage: 37640,
    skills: 16,
    tasks: 8,
    recent: { zh: "更新了 2 个客户的下一步动作", en: "Updated next actions for 2 customers" },
    health: "healthy",
    healthText: { zh: "客户上下文完整，提醒准时", en: "Customer context is complete and reminders are on time" },
    timeline: [
      { id: "sales-1", title: { zh: "提取客户下一步", en: "Extract customer next steps" }, state: "running", progress: 74, time: { zh: "19 分钟前", en: "19 min ago" } },
      { id: "sales-2", title: { zh: "整理会议承诺", en: "Organize meeting commitments" }, state: "done", progress: 100, time: { zh: "46 分钟前", en: "46 min ago" } },
      { id: "sales-3", title: { zh: "等待报价确认", en: "Wait for quote confirmation" }, state: "waiting", progress: 35, time: { zh: "2 小时前", en: "2 hours ago" } },
    ],
  },
  {
    id: "support-drafter",
    name: { zh: "青简", en: "Green Draft" },
    role: { zh: "答疑初稿员", en: "Support draft writer" },
    team: { zh: "用户支持", en: "Support" },
    avatar: "简",
    accent: "#3b82f6",
    status: "exception",
    channel: "feishu",
    usage: 22180,
    skills: 11,
    tasks: 7,
    recent: { zh: "有 1 条回复草稿需要重新确认语气", en: "1 reply draft needs tone review" },
    health: "risk",
    healthText: { zh: "草稿语气偏硬，建议人工确认", en: "Draft tone is too sharp; review before sending" },
    timeline: [
      { id: "support-1", title: { zh: "改写高频问题回复", en: "Rewrite frequent-question reply" }, state: "blocked", progress: 52, time: { zh: "6 分钟前", en: "6 min ago" } },
      { id: "support-2", title: { zh: "等待用户语气偏好", en: "Wait for tone preference" }, state: "waiting", progress: 28, time: { zh: "21 分钟前", en: "21 min ago" } },
      { id: "support-3", title: { zh: "同步已确认回答", en: "Sync approved answers" }, state: "done", progress: 100, time: { zh: "1 小时前", en: "1 hour ago" } },
    ],
  },
  {
    id: "finance-watch",
    name: { zh: "归衡", en: "Balance" },
    role: { zh: "账单巡查员", en: "Billing watcher" },
    team: { zh: "经营", en: "Business" },
    avatar: "衡",
    accent: "#64748b",
    status: "idle",
    channel: "none",
    usage: 9800,
    skills: 8,
    tasks: 4,
    recent: { zh: "完成本周费用摘要", en: "Finished this week's cost summary" },
    health: "attention",
    healthText: { zh: "尚未接入工作渠道，只能手动巡查", en: "No work channel connected; manual patrol only" },
    timeline: [
      { id: "finance-1", title: { zh: "汇总费用变化", en: "Summarize cost movement" }, state: "done", progress: 100, time: { zh: "今天早上", en: "This morning" } },
      { id: "finance-2", title: { zh: "等待渠道接入", en: "Wait for channel connection" }, state: "waiting", progress: 10, time: { zh: "昨天", en: "Yesterday" } },
      { id: "finance-3", title: { zh: "生成经营备注", en: "Prepare business notes" }, state: "waiting", progress: 15, time: { zh: "昨天", en: "Yesterday" } },
    ],
  },
  {
    id: "researcher",
    name: { zh: "远山", en: "Far Hill" },
    role: { zh: "资料研究员", en: "Research partner" },
    team: { zh: "战略", en: "Strategy" },
    avatar: "山",
    accent: "#4f46e5",
    status: "offline",
    channel: "none",
    usage: 0,
    skills: 19,
    tasks: 2,
    recent: { zh: "等待本机唤醒后继续整理资料", en: "Waiting for local wake-up to continue research" },
    health: "attention",
    healthText: { zh: "当前离线，任务不会自动推进", en: "Offline now; tasks will not move automatically" },
    timeline: [
      { id: "research-1", title: { zh: "整理竞品观察", en: "Organize competitor notes" }, state: "waiting", progress: 45, time: { zh: "昨天", en: "Yesterday" } },
      { id: "research-2", title: { zh: "生成研究摘要", en: "Generate research summary" }, state: "waiting", progress: 18, time: { zh: "昨天", en: "Yesterday" } },
      { id: "research-3", title: { zh: "待恢复巡查", en: "Pending patrol resume" }, state: "waiting", progress: 8, time: { zh: "2 天前", en: "2 days ago" } },
    ],
  },
  {
    id: "meeting-scribe",
    name: { zh: "墨庭", en: "Ink Court" },
    role: { zh: "会议纪要员", en: "Meeting scribe" },
    team: { zh: "管理", en: "Management" },
    avatar: "墨",
    accent: "#db2777",
    status: "working",
    channel: "feishu",
    usage: 26450,
    skills: 10,
    tasks: 6,
    recent: { zh: "把会后事项拆成 5 条可执行任务", en: "Split meeting notes into 5 executable tasks" },
    health: "healthy",
    healthText: { zh: "纪要结构清晰，后续动作完整", en: "Clear notes with complete follow-up actions" },
    timeline: [
      { id: "meeting-1", title: { zh: "拆解会议行动项", en: "Break down meeting actions" }, state: "running", progress: 88, time: { zh: "3 分钟前", en: "3 min ago" } },
      { id: "meeting-2", title: { zh: "提醒负责人确认", en: "Remind owners to confirm" }, state: "waiting", progress: 44, time: { zh: "16 分钟前", en: "16 min ago" } },
      { id: "meeting-3", title: { zh: "归档会议摘要", en: "Archive meeting summary" }, state: "done", progress: 100, time: { zh: "38 分钟前", en: "38 min ago" } },
    ],
  },
  {
    id: "qa-patrol",
    name: { zh: "明镜", en: "Clear Mirror" },
    role: { zh: "质量巡查员", en: "Quality patrol" },
    team: { zh: "交付质量", en: "Delivery Quality" },
    avatar: "镜",
    accent: "#dc2626",
    status: "exception",
    channel: "wechat",
    usage: 15120,
    skills: 9,
    tasks: 5,
    recent: { zh: "发现 2 条交付记录缺少确认", en: "Found 2 delivery records missing confirmation" },
    health: "risk",
    healthText: { zh: "需要尽快补齐确认记录", en: "Confirmation records should be completed soon" },
    timeline: [
      { id: "qa-1", title: { zh: "巡查交付记录", en: "Patrol delivery records" }, state: "blocked", progress: 61, time: { zh: "11 分钟前", en: "11 min ago" } },
      { id: "qa-2", title: { zh: "等待负责人补充", en: "Wait for owner update" }, state: "waiting", progress: 33, time: { zh: "40 分钟前", en: "40 min ago" } },
      { id: "qa-3", title: { zh: "输出风险摘要", en: "Create risk summary" }, state: "running", progress: 49, time: { zh: "1 小时前", en: "1 hour ago" } },
    ],
  },
  {
    id: "talent-map",
    name: { zh: "栖木", en: "Perch" },
    role: { zh: "伙伴编排员", en: "Partner coordinator" },
    team: { zh: "团队编排", en: "Team Design" },
    avatar: "栖",
    accent: "#7c3aed",
    status: "idle",
    channel: "feishu",
    usage: 11290,
    skills: 13,
    tasks: 3,
    recent: { zh: "建议把 2 个重复技能合并", en: "Suggested merging 2 overlapping skills" },
    health: "healthy",
    healthText: { zh: "配置清晰，适合做团队调整", en: "Clear configuration; ready for team tuning" },
    timeline: [
      { id: "talent-1", title: { zh: "检查技能重叠", en: "Check skill overlap" }, state: "done", progress: 100, time: { zh: "50 分钟前", en: "50 min ago" } },
      { id: "talent-2", title: { zh: "等待角色调整确认", en: "Wait for role tuning approval" }, state: "waiting", progress: 24, time: { zh: "1 小时前", en: "1 hour ago" } },
      { id: "talent-3", title: { zh: "准备伙伴接力建议", en: "Prepare partner relay suggestions" }, state: "waiting", progress: 18, time: { zh: "2 小时前", en: "2 hours ago" } },
    ],
  },
];

const statusOrder: PartnerStatus[] = ["working", "idle", "offline", "exception"];
const channelOrder: Channel[] = ["feishu", "wechat", "none"];

export function AiPartnerConsole({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [partners, setPartners] = useState<AiPartner[]>(initialPartners);
  const [statusFilter, setStatusFilter] = useState<PartnerStatus | "all">("all");
  const [channelFilter, setChannelFilter] = useState<Channel | "all">("all");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("manage");
  const [selectedId, setSelectedId] = useState(initialPartners[0].id);
  const [timelineOpen, setTimelineOpen] = useState(true);
  const [actionPreview, setActionPreview] = useState<ActionPreview>("chat");

  const filteredPartners = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return partners.filter((partner) => {
      const matchesStatus = statusFilter === "all" || partner.status === statusFilter;
      const matchesChannel = channelFilter === "all" || partner.channel === channelFilter;
      const text = [partner.name[locale], partner.role[locale], partner.team[locale], partner.recent[locale]].join(" ").toLowerCase();
      const matchesKeyword = !keyword || text.includes(keyword);

      return matchesStatus && matchesChannel && matchesKeyword;
    });
  }, [channelFilter, locale, partners, query, statusFilter]);

  const orderedPartners = useMemo(() => {
    if (viewMode === "manage") return filteredPartners;
    const weight: Record<Health, number> = { risk: 0, attention: 1, healthy: 2 };
    return [...filteredPartners].sort((a, b) => weight[a.health] - weight[b.health] || b.tasks - a.tasks);
  }, [filteredPartners, viewMode]);

  const selectedPartner = partners.find((partner) => partner.id === selectedId) ?? partners[0];
  const activeTasks = partners.reduce(
    (sum, partner) => sum + partner.timeline.filter((task) => task.state === "running" || task.state === "blocked").length,
    0,
  );
  const todayUsage = partners.reduce((sum, partner) => sum + partner.usage, 0);
  const statusCounts = Object.fromEntries(statusOrder.map((status) => [status, partners.filter((partner) => partner.status === status).length])) as Record<
    PartnerStatus,
    number
  >;

  function moveTaskForward() {
    setPartners((current) =>
      current.map((partner) => {
        if (partner.id !== selectedPartner.id) return partner;
        const [firstTask, ...restTasks] = partner.timeline;
        if (!firstTask) return partner;
        const nextProgress = Math.min(100, firstTask.progress + 14);
        const updatedTask: PartnerTask = {
          ...firstTask,
          progress: nextProgress,
          state: nextProgress >= 100 ? "done" : firstTask.state === "blocked" ? "running" : firstTask.state,
          time: { zh: "刚刚", en: "Just now" },
        };

        return {
          ...partner,
          status: partner.status === "offline" ? "idle" : "working",
          tasks: nextProgress >= 100 ? Math.max(0, partner.tasks - 1) : partner.tasks,
          recent: { zh: "刚推进了 1 条任务进度", en: "Just moved 1 task forward" },
          timeline: [updatedTask, ...restTasks],
        };
      }),
    );
    setActionPreview("handoff");
  }

  return (
    <section className="min-h-screen bg-[#f4f6f8] px-3 pb-8 pt-[5.25rem] text-[#17212b] sm:px-5 lg:px-6">
      <div className="mx-auto grid w-full max-w-[92rem] gap-4 lg:grid-cols-[15.5rem_minmax(0,1fr)_22rem]">
        <aside className="rounded-lg border border-[#d9e1e8] bg-white p-3 shadow-[0_6px_18px_rgba(23,33,43,0.06)] lg:sticky lg:top-[5.75rem] lg:h-[calc(100vh-6.75rem)]">
          <div className="flex items-center gap-2 border-b border-[#e5ebf0] pb-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#fff3eb] text-[#d95f26]">
              <Kanban size={19} weight="duotone" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#d95f26]">{t.eyebrow}</p>
              <p className="truncate text-sm font-semibold text-[#17212b]">MotiClaw</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1">
            <SummaryTile icon={<UserCircle size={16} />} label={t.partnerCount} value={String(partners.length)} />
            <SummaryTile icon={<Pulse size={16} />} label={t.workingCount} value={String(statusCounts.working)} />
            <SummaryTile icon={<ClockCounterClockwise size={16} />} label={t.taskCount} value={String(activeTasks)} />
            <SummaryTile icon={<MapPinLine size={16} />} label={t.usageCount} value={compactNumber(todayUsage)} />
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#5f6b76]">{t.statusLabel}</p>
              <div className="grid gap-1.5">
                <FilterButton active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
                  <span>{t.all}</span>
                  <span>{partners.length}</span>
                </FilterButton>
                {statusOrder.map((status) => (
                  <FilterButton key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)}>
                    <span className="inline-flex items-center gap-2">
                      <StatusDot status={status} />
                      {t.status[status]}
                    </span>
                    <span>{statusCounts[status]}</span>
                  </FilterButton>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#5f6b76]">{t.channelLabel}</p>
              <div className="grid gap-1.5">
                <FilterButton active={channelFilter === "all"} onClick={() => setChannelFilter("all")}>
                  <span>{t.all}</span>
                  <span>{partners.length}</span>
                </FilterButton>
                {channelOrder.map((channel) => (
                  <FilterButton key={channel} active={channelFilter === channel} onClick={() => setChannelFilter(channel)}>
                    <span>{t.channels[channel]}</span>
                    <span>{partners.filter((partner) => partner.channel === channel).length}</span>
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-4">
          <div className="rounded-lg border border-[#d9e1e8] bg-white p-4 shadow-[0_6px_18px_rgba(23,33,43,0.06)]">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[#d95f26]">{t.summary}</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-normal text-[#17212b] sm:text-3xl">{t.title}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5f6b76]">{t.lead}</p>
              </div>
              <div className="inline-flex w-fit rounded-lg border border-[#d9e1e8] bg-[#f7f9fb] p-1">
                <ViewButton active={viewMode === "manage"} onClick={() => setViewMode("manage")}>
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  {t.manage}
                </ViewButton>
                <ViewButton active={viewMode === "patrol"} onClick={() => setViewMode("patrol")}>
                  <Pulse size={16} aria-hidden="true" />
                  {t.patrol}
                </ViewButton>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 xl:flex-row">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">{t.search}</span>
                <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7b8793]" size={18} aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.search}
                  className="h-11 w-full rounded-lg border border-[#d9e1e8] bg-white pl-10 pr-4 text-sm text-[#17212b] outline-none transition focus:border-[#ef7b43] focus:ring-2 focus:ring-[#ef7b43]/20"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("all");
                  setChannelFilter("all");
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#d9e1e8] bg-white px-4 text-sm font-medium text-[#17212b] transition hover:border-[#ef7b43]/45 hover:bg-[#fff7f1]"
              >
                {t.clear}
              </button>
            </div>
          </div>

          {orderedPartners.length ? (
            <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-3">
              {orderedPartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  locale={locale}
                  partner={partner}
                  selected={partner.id === selectedPartner.id}
                  viewMode={viewMode}
                  onClick={() => {
                    setSelectedId(partner.id);
                    setActionPreview("chat");
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="grid min-h-[22rem] place-items-center rounded-lg border border-dashed border-[#cbd5df] bg-white p-8 text-center">
              <div>
                <WarningCircle className="mx-auto text-[#d95f26]" size={36} aria-hidden="true" />
                <p className="mt-3 text-base font-semibold text-[#17212b]">{t.noResult}</p>
                <p className="mt-1 text-sm text-[#5f6b76]">{t.noResultHint}</p>
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-lg border border-[#d9e1e8] bg-white p-4 shadow-[0_6px_18px_rgba(23,33,43,0.06)] lg:sticky lg:top-[5.75rem] lg:h-[calc(100vh-6.75rem)] lg:overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#5f6b76]">{t.selected}</p>
              <h2 className="mt-1 truncate text-xl font-semibold text-[#17212b]">{selectedPartner.name[locale]}</h2>
              <p className="mt-1 text-sm text-[#5f6b76]">{selectedPartner.role[locale]}</p>
            </div>
            <Avatar partner={selectedPartner} large />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <DetailMetric label={t.team} value={selectedPartner.team[locale]} />
            <DetailMetric label={t.channelLabel} value={t.channels[selectedPartner.channel]} />
            <DetailMetric label={t.usage} value={compactNumber(selectedPartner.usage)} />
            <DetailMetric label={t.skills} value={String(selectedPartner.skills)} />
          </div>

          <div className="mt-4 rounded-lg border border-[#e5ebf0] bg-[#f8fafb] p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[#17212b]">{t.health}</span>
              <HealthBadge health={selectedPartner.health} label={t.healthStates[selectedPartner.health]} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[#5f6b76]">{selectedPartner.healthText[locale]}</p>
            <p className="mt-2 text-xs leading-5 text-[#7b8793]">
              <strong className="font-semibold text-[#17212b]">{t.recent}: </strong>
              {selectedPartner.recent[locale]}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <ActionButton onClick={() => setActionPreview("chat")}>
              <ChatCircleText size={16} aria-hidden="true" />
              {t.openChat}
            </ActionButton>
            <ActionButton onClick={() => setActionPreview("config")}>
              <GearSix size={16} aria-hidden="true" />
              {t.openConfig}
            </ActionButton>
            <ActionButton onClick={() => setActionPreview("handoff")}>
              <BellRinging size={16} aria-hidden="true" />
              {t.handoff}
            </ActionButton>
          </div>

          <button
            type="button"
            onClick={moveTaskForward}
            className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#ef7b43] px-4 text-sm font-semibold text-[#2f241d] transition hover:bg-[#d95f26] focus:outline-none focus:ring-2 focus:ring-[#ef7b43]/35"
          >
            <PlayCircle size={17} weight="fill" aria-hidden="true" />
            {t.pushTask}
          </button>

          <div className="mt-4 rounded-lg border border-[#e5ebf0] bg-white p-3">
            <p className="text-sm font-semibold text-[#17212b]">{t.previewTitle}</p>
            <p className="mt-2 min-h-[3rem] text-sm leading-6 text-[#5f6b76]">
              {actionPreview === "chat" ? t.chatPreview : actionPreview === "config" ? t.configPreview : t.handoffPreview}
            </p>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setTimelineOpen((open) => !open)}
              aria-expanded={timelineOpen}
              className="flex w-full items-center justify-between rounded-lg border border-[#e5ebf0] bg-[#f8fafb] px-3 py-2 text-left text-sm font-semibold text-[#17212b]"
            >
              <span>{t.timeline}</span>
              <span className="text-xs font-medium text-[#5f6b76]">{timelineOpen ? t.collapseTimeline : t.expandTimeline}</span>
            </button>

            {timelineOpen ? (
              <div className="mt-3 space-y-2">
                {selectedPartner.timeline.map((task) => (
                  <div key={task.id} className="rounded-lg border border-[#e5ebf0] bg-[#fbfcfd] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-5 text-[#17212b]">{task.title[locale]}</p>
                        <p className="mt-1 text-xs text-[#7b8793]">{task.time[locale]}</p>
                      </div>
                      <TaskBadge state={task.state} label={t.taskStates[task.state]} />
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8edf2]">
                      <div className="h-full rounded-full bg-[#ef7b43] transition-[width] duration-300" style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <p className="mt-4 rounded-lg border border-[#f1dccf] bg-[#fff7f1] p-3 text-xs leading-5 text-[#8a4b28]">{t.demoNotice}</p>
        </aside>
      </div>
    </section>
  );
}

function SummaryTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-h-[4.25rem] rounded-lg border border-[#e5ebf0] bg-[#f8fafb] p-3">
      <div className="flex items-center gap-2 text-[#5f6b76]">
        {icon}
        <span className="text-[0.72rem] font-medium">{label}</span>
      </div>
      <p className="mt-1 text-lg font-semibold text-[#17212b]">{value}</p>
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 items-center justify-between gap-3 rounded-lg border px-3 text-sm transition ${
        active ? "border-[#ef7b43]/35 bg-[#fff3eb] text-[#9f4c20]" : "border-[#e5ebf0] bg-white text-[#4d5965] hover:border-[#ef7b43]/30"
      }`}
    >
      {children}
    </button>
  );
}

function ViewButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition ${
        active ? "bg-white text-[#17212b] shadow-sm" : "text-[#5f6b76] hover:text-[#17212b]"
      }`}
    >
      {children}
    </button>
  );
}

function PartnerCard({
  locale,
  partner,
  selected,
  viewMode,
  onClick,
}: {
  locale: Locale;
  partner: AiPartner;
  selected: boolean;
  viewMode: ViewMode;
  onClick: () => void;
}) {
  const t = copy[locale];
  const firstTask = partner.timeline[0];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[13.75rem] flex-col rounded-lg border bg-white p-3 text-left shadow-[0_6px_18px_rgba(23,33,43,0.05)] transition duration-150 hover:-translate-y-0.5 hover:border-[#ef7b43]/40 ${
        selected ? "border-[#ef7b43] ring-2 ring-[#ef7b43]/18" : "border-[#d9e1e8]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar partner={partner} />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[#17212b]">{partner.name[locale]}</p>
            <p className="truncate text-xs text-[#5f6b76]">{partner.role[locale]}</p>
          </div>
        </div>
        <StatusBadge status={partner.status} label={t.status[partner.status]} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <MiniMetric label={t.usage} value={compactNumber(partner.usage)} />
        <MiniMetric label={t.skills} value={String(partner.skills)} />
        <MiniMetric label={t.tasks} value={String(partner.tasks)} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-full border border-[#d9e1e8] bg-[#f8fafb] px-2 py-1 text-[0.72rem] font-medium text-[#4d5965]">
          {t.channels[partner.channel]}
        </span>
        <HealthBadge health={partner.health} label={t.healthStates[partner.health]} />
      </div>

      <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-[#5f6b76]">{partner.recent[locale]}</p>

      <div className="mt-auto pt-3">
        {viewMode === "patrol" && firstTask ? (
          <div className="mb-2 rounded-lg bg-[#f8fafb] p-2">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-semibold text-[#17212b]">{firstTask.title[locale]}</p>
              <span className="text-[0.7rem] text-[#7b8793]">{firstTask.progress}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e8edf2]">
              <div className="h-full rounded-full bg-[#ef7b43]" style={{ width: `${firstTask.progress}%` }} />
            </div>
          </div>
        ) : null}
        <div className="flex items-center justify-between border-t border-[#edf1f4] pt-2">
          <span className="truncate text-xs text-[#7b8793]">{partner.team[locale]}</span>
          <span className="text-xs font-semibold text-[#d95f26]">{selected ? t.selected : t.openConfig}</span>
        </div>
      </div>
    </button>
  );
}

function Avatar({ partner, large = false }: { partner: AiPartner; large?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-lg text-sm font-semibold text-white shadow-sm ${large ? "h-12 w-12" : "h-10 w-10"}`}
      style={{ background: `linear-gradient(135deg, ${partner.accent}, ${partner.accent}cc)` }}
      aria-hidden="true"
    >
      {partner.avatar}
    </span>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-[#e5ebf0] bg-[#fbfcfd] px-2 py-2">
      <p className="truncate text-[0.68rem] text-[#7b8793]">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-[#17212b]">{value}</p>
    </div>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-[4rem] rounded-lg border border-[#e5ebf0] bg-[#fbfcfd] p-3">
      <p className="text-[0.7rem] font-medium text-[#7b8793]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#17212b]">{value}</p>
    </div>
  );
}

function StatusDot({ status }: { status: PartnerStatus }) {
  const color = {
    working: "#16a34a",
    idle: "#64748b",
    offline: "#9ca3af",
    exception: "#dc2626",
  }[status];

  return <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />;
}

function StatusBadge({ status, label }: { status: PartnerStatus; label: string }) {
  const classes = {
    working: "border-[#bbf7d0] bg-[#ecfdf3] text-[#166534]",
    idle: "border-[#d9e1e8] bg-[#f8fafb] text-[#475569]",
    offline: "border-[#e5e7eb] bg-[#f3f4f6] text-[#6b7280]",
    exception: "border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]",
  }[status];

  return <span className={`shrink-0 rounded-full border px-2 py-1 text-[0.72rem] font-semibold ${classes}`}>{label}</span>;
}

function HealthBadge({ health, label }: { health: Health; label: string }) {
  const classes = {
    healthy: "border-[#bbf7d0] bg-[#ecfdf3] text-[#166534]",
    attention: "border-[#fde68a] bg-[#fffbeb] text-[#92400e]",
    risk: "border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]",
  }[health];

  return <span className={`inline-flex rounded-full border px-2 py-1 text-[0.72rem] font-semibold ${classes}`}>{label}</span>;
}

function TaskBadge({ state, label }: { state: TaskState; label: string }) {
  const icon = state === "done" ? <CheckCircle size={13} /> : state === "blocked" ? <WarningCircle size={13} /> : state === "running" ? <PlayCircle size={13} /> : <PauseCircle size={13} />;
  const classes = {
    running: "border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8]",
    waiting: "border-[#d9e1e8] bg-[#f8fafb] text-[#475569]",
    done: "border-[#bbf7d0] bg-[#ecfdf3] text-[#166534]",
    blocked: "border-[#fecaca] bg-[#fff1f2] text-[#b91c1c]",
  }[state];

  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[0.68rem] font-semibold ${classes}`}>
      {icon}
      {label}
    </span>
  );
}

function ActionButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-[#d9e1e8] bg-white px-2 text-xs font-semibold text-[#17212b] transition hover:border-[#ef7b43]/40 hover:bg-[#fff7f1]"
    >
      {children}
    </button>
  );
}

function compactNumber(value: number) {
  if (value >= 10000) return `${Math.round(value / 1000) / 10}k`;
  return String(value);
}
