export type SiteBillingCopy = {
  home: string;
  settings: string;
  signIn: string;
  signOut: string;
  signInToPurchase: string;
  signedOutState: string;
  currentAccountLabel: string;
  membershipStatusLabel: string;
  viewBalance: string;
  viewOrders: string;
  notActivated: string;
  perMonth: string;
  perYear: string;
  expiresOn: string;
  freeTierName: string;
  maxAgentsLabel: string;
  agentsUnit: string;
  unlimitedAgentsValue: string;
  renewLabel: string;
  currentPlanBadge: string;
  signedIn: string;
  guest: string;
  refresh: string;
  title: string;
  eyebrow: string;
  intro: string;
  ordersIntro: string;
  heroFactLabel: string;
  planCountUnit: string;
  signedOutTitle: string;
  signedOutBody: string;
  ordersSignedOutBody: string;
  unavailable: string;
  balance: string;
  recharged: string;
  consumed: string;
  lastUpdated: string;
  choosePlan: string;
  planNotes: string;
  amountLabel: string;
  recommended: string;
  points: string;
  createOrder: string;
  continuePayment: string;
  creatingOrder: string;
  upgradeTitle: string;
  upgradeSubtitle: string;
  upgradeListPrice: string;
  upgradeCredit: string;
  upgradeTotal: string;
  upgradeEffective: string;
  upgradeEndsCurrent: string;
  upgradeConfirm: string;
  upgradeCancel: string;
  upgradePreviewLoading: string;
  upgradePreviewRetry: string;
  statusLabel: string;
  timeLabel: string;
  typeLabel: string;
  changeLabel: string;
  balanceAfterLabel: string;
  noteLabel: string;
  paymentSectionTitle: string;
  scanTitle: string;
  scanBody: string;
  scanUnavailable: string;
  confirmPayment: string;
  checkingPayment: string;
  paymentPendingTitle: string;
  paymentPendingBody: string;
  paymentSuccessTitle: string;
  paymentSuccessBody: string;
  paymentDoneButton: string;
  awaitingPayment: string;
  paidTitle: string;
  paidBody: string;
  expiredOrder: string;
  balanceDetailsTitle: string;
  tipsTitle: string;
  tipsBody: string;
  desktopReturnHint: string;
  activityTitle: string;
  recentLedger: string;
  emptyLedger: string;
  recentOrders: string;
  emptyOrders: string;
  rechargeKind: string;
  consumeKind: string;
  adjustmentKind: string;
  orderNumber: string;
  copyOrderNumber: string;
  copiedOrderNumber: string;
  copyFailed: string;
  status: Record<string, string>;
  errors: Record<string, string>;
};

export const siteBillingCopy: Record<"en" | "zh", SiteBillingCopy> = {
  en: {
    home: "Back home",
    settings: "Settings",
    signIn: "Sign in",
    signOut: "Sign out",
    signInToPurchase: "Sign in to purchase",
    signedOutState: "Signed out",
    currentAccountLabel: "Current account",
    membershipStatusLabel: "Current membership",
    viewBalance: "View balance",
    viewOrders: "View orders",
    notActivated: "Free plan",
    perMonth: "/ month",
    perYear: "/ year",
    expiresOn: "Valid until",
    freeTierName: "Free plan",
    maxAgentsLabel: "AI partners",
    agentsUnit: "AI partners",
    unlimitedAgentsValue: "Unlimited AI partners",
    renewLabel: "Renew",
    currentPlanBadge: "Current plan",
    signedIn: "Signed in",
    guest: "Guest",
    refresh: "Refresh",
    title: "Membership plans",
    eyebrow: "Account center",
    intro: "Choose monthly or annual billing to raise hosted-model capacity, AI partner access, and paid writing capabilities. The plan activates right after payment.",
    ordersIntro: "Review your recent membership orders, payment progress, and the records that update after checkout.",
    heroFactLabel: "Configured plans",
    planCountUnit: "plans",
    signedOutTitle: "Sign in before purchasing",
    signedOutBody: "You can review the membership plans first. Sign in when you're ready to place the order.",
    ordersSignedOutBody: "Sign in before reviewing membership orders.",
    unavailable: "Membership plans are not available right now. Please try again later.",
    balance: "Model points balance",
    recharged: "Total credited points",
    consumed: "Total used points",
    lastUpdated: "Last updated",
    choosePlan: "Membership plans",
    planNotes: "Notes",
    amountLabel: "Amount",
    recommended: "Recommended",
    points: "model points",
    createOrder: "Activate now",
    continuePayment: "Continue payment",
    creatingOrder: "Creating order...",
    upgradeTitle: "Confirm upgrade to {plan}",
    upgradeSubtitle: "Your remaining Plus value is applied automatically · upgrade right after payment",
    upgradeListPrice: "{plan}",
    upgradeCredit: "Plus · {days} days remaining",
    upgradeTotal: "Pay now",
    upgradeEffective: "Active right after payment · estimated valid until {date}",
    upgradeEndsCurrent: "Your current Plus plan ends after the upgrade succeeds",
    upgradeConfirm: "Confirm upgrade and pay {amount}",
    upgradeCancel: "Not now",
    upgradePreviewLoading: "Calculating your upgrade price",
    upgradePreviewRetry: "Try again",
    statusLabel: "Status",
    timeLabel: "Time",
    typeLabel: "Type",
    changeLabel: "Change",
    balanceAfterLabel: "Balance after",
    noteLabel: "Note",
    paymentSectionTitle: "WeChat payment",
    scanTitle: "Scan to pay",
    scanBody: "Scan with WeChat, plan activates after payment",
    scanUnavailable: "The payment code has not returned yet. Refresh the order or create a new one.",
    confirmPayment: "I've paid",
    checkingPayment: "Checking...",
    paymentPendingTitle: "Payment not confirmed yet",
    paymentPendingBody: "If you have just paid, wait a moment and check again.",
    paymentSuccessTitle: "Activated successfully",
    paymentSuccessBody: "Your membership benefits are active. You can return to MotiClaw Desktop and continue.",
    paymentDoneButton: "Done",
    awaitingPayment: "Waiting for payment",
    paidTitle: "Plan activated",
    paidBody: "Your plan is active and the higher limits are in effect. You can return to MotiClaw Desktop and continue working with the same account.",
    expiredOrder: "This payment code has expired. Create a new order to continue.",
    balanceDetailsTitle: "Points details",
    tipsTitle: "Before you buy",
    tipsBody: "Membership plans raise your usage limits for the billing period you choose. Points stay separate: they cover pay-as-you-go usage and are never affected by plan changes.",
    desktopReturnHint: "After the payment succeeds, you can return to MotiClaw Desktop and continue the same task with the same account.",
    activityTitle: "Recent activity",
    recentLedger: "Points records",
    emptyLedger: "No points records yet",
    recentOrders: "Membership orders",
    emptyOrders: "No purchase orders yet",
    rechargeKind: "Points credited",
    consumeKind: "Used",
    adjustmentKind: "Adjustment",
    orderNumber: "Order",
    copyOrderNumber: "Copy order number",
    copiedOrderNumber: "Order number copied",
    copyFailed: "Couldn't copy right now. Please try again.",
    status: {
      created: "Created",
      pending: "Waiting",
      paid: "Paid",
      closed: "Closed",
      failed: "Failed",
      expired: "Expired",
    },
    errors: {
      site_auth_session_missing: "Sign in again before recharging.",
      auth_session_missing: "Sign in again before recharging.",
      wechat_pay_disabled: "WeChat payment is not open in this environment.",
      wechat_pay_not_configured: "Payment is not ready yet. Please try again later.",
      wechat_pay_app_id_missing: "Payment is not ready yet. Please try again later.",
      wechat_pay_mch_id_missing: "Payment is not ready yet. Please try again later.",
      wechat_pay_cert_serial_no_missing: "Payment is not ready yet. Please try again later.",
      wechat_pay_private_key_missing: "Payment is not ready yet. Please try again later.",
      wechat_pay_public_key_id_missing: "Payment is not ready yet. Please try again later.",
      wechat_pay_public_key_missing: "Payment is not ready yet. Please try again later.",
      wechat_pay_api_v3_key_missing: "Payment is not ready yet. Please try again later.",
      wechatpay_request_failed: "WeChat Pay cannot be reached right now. Please try again shortly.",
      wechatpay_request_rejected: "WeChat Pay rejected this order. Please refresh and try again.",
      wechatpay_response_invalid: "WeChat Pay did not return a valid payment code. Please try again.",
      payment_qr_missing: "The payment code has not returned yet. Refresh the order or create a new one.",
      sub2api_not_ready: "Recharge cannot be completed right now. Please try again later.",
      subscription_plan_not_found: "This recharge option is not available. Refresh and choose again.",
      subscription_order_not_found: "This order is no longer available. Refresh and try again.",
      membership_quote_changed: "Your plan or price changed · we've refreshed the upgrade price for you",
      membership_upgrade_requires_support: "This upgrade needs help from support · your current plan remains unchanged",
      membership_upgrade_source_missing: "We couldn't verify the remaining value of your current plan · contact support before upgrading",
      membership_upgrade_preview_invalid: "We couldn't calculate this upgrade right now · try again shortly",
      point_ledger_kind_invalid: "Choose a valid points record filter.",
      site_billing_http_502: "The recharge service is temporarily unavailable. Please try again shortly.",
    },
  },
  zh: {
    home: "返回首页",
    settings: "设置",
    signIn: "登录",
    signOut: "退出登录",
    signInToPurchase: "登录后购买",
    signedOutState: "未登录",
    currentAccountLabel: "当前账号",
    membershipStatusLabel: "当前会员方案",
    viewBalance: "查看明细",
    viewOrders: "查看订单",
    notActivated: "免费版",
    perMonth: "/ 月",
    perYear: "/ 年",
    expiresOn: "有效期至",
    freeTierName: "免费版",
    maxAgentsLabel: "AI 伙伴",
    agentsUnit: "个 AI 伙伴",
    unlimitedAgentsValue: "AI 伙伴不设上限",
    renewLabel: "续费",
    currentPlanBadge: "当前方案",
    signedIn: "已登录",
    guest: "访客",
    refresh: "刷新",
    title: "会员套餐",
    eyebrow: "账号中心",
    intro: "选择按月或按年开通套餐，提升托管模型容量、AI 伙伴权限和付费写作能力，支付后立即生效。",
    ordersIntro: "查看最近会员订单、支付状态，以及下单后会自动更新的记录。",
    heroFactLabel: "当前已配置",
    planCountUnit: "个套餐",
    signedOutTitle: "先登录，再开通",
    signedOutBody: "你可以先查看会员套餐和开通说明，准备下单时再登录。",
    ordersSignedOutBody: "登录后再查看会员订单。",
    unavailable: "会员套餐暂时不可用，请稍后再试。",
    balance: "模型积分余额",
    recharged: "累计到账积分",
    consumed: "累计消耗积分",
    lastUpdated: "最近更新",
    choosePlan: "会员套餐",
    planNotes: "说明",
    amountLabel: "金额",
    recommended: "推荐",
    points: "模型积分",
    createOrder: "立即开通",
    continuePayment: "继续支付",
    creatingOrder: "正在创建订单...",
    upgradeTitle: "确认升级到 {plan}",
    upgradeSubtitle: "Plus 剩余价值将自动抵扣，支付成功后立即升级",
    upgradeListPrice: "{plan}",
    upgradeCredit: "Plus 剩余 {days} 天抵扣",
    upgradeTotal: "本次支付",
    upgradeEffective: "支付成功后立即生效 · 预计有效期至 {date}",
    upgradeEndsCurrent: "原 Plus 套餐将在升级成功后结束",
    upgradeConfirm: "确认升级并支付 {amount}",
    upgradeCancel: "暂不升级",
    upgradePreviewLoading: "正在计算本次升级价格",
    upgradePreviewRetry: "重新计算",
    statusLabel: "状态",
    timeLabel: "时间",
    typeLabel: "类型",
    changeLabel: "变动",
    balanceAfterLabel: "变动后余额",
    noteLabel: "备注",
    paymentSectionTitle: "微信支付",
    scanTitle: "扫码支付",
    scanBody: "微信扫码支付，成功后套餐立即生效",
    scanUnavailable: "付款二维码还没有返回，请刷新订单或重新创建订单。",
    confirmPayment: "我已支付完成",
    checkingPayment: "正在确认...",
    paymentPendingTitle: "暂未查到支付完成",
    paymentPendingBody: "如果刚刚完成支付，请稍等片刻再确认",
    paymentSuccessTitle: "恭喜你已开通成功",
    paymentSuccessBody: "会员权益已生效，可回到桌面端继续使用",
    paymentDoneButton: "完成",
    awaitingPayment: "等待支付",
    paidTitle: "套餐已生效",
    paidBody: "套餐已生效，新的使用限额立即可用。现在可以回到 MotiClaw Desktop，用同一个账号继续使用。",
    expiredOrder: "这个付款码已经过期，请重新创建订单。",
    balanceDetailsTitle: "积分明细",
    tipsTitle: "购买说明",
    tipsBody: "会员套餐在你选择的计费周期内提升使用限额；积分独立结算，用于按量补充，开通或到期都不会影响积分余额。",
    desktopReturnHint: "积分到账后，可以直接回到 MotiClaw Desktop 继续当前任务。",
    activityTitle: "最近动态",
    recentLedger: "积分流水",
    emptyLedger: "还没有积分记录",
    recentOrders: "会员订单",
    emptyOrders: "还没有购买订单",
    rechargeKind: "积分到账",
    consumeKind: "消耗",
    adjustmentKind: "调整",
    orderNumber: "订单",
    copyOrderNumber: "复制订单号",
    copiedOrderNumber: "已复制订单号",
    copyFailed: "暂时无法复制，请稍后再试。",
    status: {
      created: "已创建",
      pending: "待支付",
      paid: "已支付",
      closed: "已关闭",
      failed: "支付失败",
      expired: "已过期",
    },
    errors: {
      site_auth_session_missing: "请重新登录后再充值。",
      auth_session_missing: "请重新登录后再充值。",
      wechat_pay_disabled: "当前环境暂未开放微信支付。",
      wechat_pay_not_configured: "支付暂未准备好，请稍后再试。",
      wechat_pay_app_id_missing: "支付暂未准备好，请稍后再试。",
      wechat_pay_mch_id_missing: "支付暂未准备好，请稍后再试。",
      wechat_pay_cert_serial_no_missing: "支付暂未准备好，请稍后再试。",
      wechat_pay_private_key_missing: "支付暂未准备好，请稍后再试。",
      wechat_pay_public_key_id_missing: "支付暂未准备好，请稍后再试。",
      wechat_pay_public_key_missing: "支付暂未准备好，请稍后再试。",
      wechat_pay_api_v3_key_missing: "支付暂未准备好，请稍后再试。",
      wechatpay_request_failed: "暂时无法连接微信支付，请稍后再试。",
      wechatpay_request_rejected: "微信支付没有接受这笔订单，请刷新后再试。",
      wechatpay_response_invalid: "微信支付没有返回有效付款码，请重新创建订单。",
      payment_qr_missing: "付款二维码还没有返回，请刷新订单或重新创建订单。",
      sub2api_not_ready: "当前暂时无法完成充值，请稍后再试。",
      subscription_plan_not_found: "这个充值档位暂不可用，请刷新后重新选择。",
      subscription_order_not_found: "这笔订单已经不可用，请刷新后再试。",
      membership_quote_changed: "你的套餐或价格刚刚发生变化，我们已为你重新计算升级价格",
      membership_upgrade_requires_support: "这次升级需要客服协助，当前套餐不会受到影响",
      membership_upgrade_source_missing: "暂时无法核对当前套餐的剩余价值，请联系客服后再升级",
      membership_upgrade_preview_invalid: "暂时无法计算这次升级价格，请稍后再试",
      point_ledger_kind_invalid: "请选择有效的积分记录类型。",
      site_billing_http_502: "充值服务暂时不可用，请稍后再试。",
    },
  },
};
