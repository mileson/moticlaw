import { siteBillingCopy, type SiteBillingCopy } from "@/components/site-billing-copy";

export type SitePointsCopy = SiteBillingCopy & {
  watchaQuotaEntryTitle: string;
  watchaQuotaEntryBody: string;
  watchaQuotaAction: string;
  watchaQuotaChecking: string;
  watchaQuotaTitle: string;
  watchaQuotaLivePaymentNotice: string;
  watchaQuotaBalance: string;
  watchaQuotaSeparatedBalance: string;
  watchaQuotaPackagesTitle: string;
  watchaQuotaPackagesBody: string;
  watchaQuotaStarter: string;
  watchaQuotaAdvanced: string;
  watchaQuotaTeam: string;
  watchaQuotaOpenPackage: string;
  watchaQuotaRecheck: string;
  watchaQuotaGrantedBody: string;
  watchaQuotaPurchaseRequiredBody: string;
  watchaQuotaUnavailableTitle: string;
  watchaQuotaUnavailableBody: string;
};

export const sitePointsCopy: Record<"en" | "zh", SitePointsCopy> = {
  en: {
    ...siteBillingCopy.en,
    eyebrow: "Points center",
    title: "Points recharge",
    intro: "Top up points for pay-as-you-go capabilities. Your new balance is available as soon as payment is confirmed.",
    signedOutBody: "You can review the points packages first. Sign in when you're ready to recharge.",
    unavailable: "Points recharge is temporarily unavailable. Please try again later.",
    choosePlan: "Points packages",
    createOrder: "Recharge now",
    continuePayment: "Continue payment",
    paymentSectionTitle: "WeChat recharge",
    scanTitle: "Scan to recharge",
    scanBody: "Use WeChat to scan this QR code. This page checks the payment automatically and updates your balance when the points arrive.",
    paymentSuccessTitle: "Recharge successful",
    paymentSuccessBody: "Your points have arrived. You can return to MotiClaw and continue the same task.",
    paidTitle: "Points have arrived",
    paidBody: "The points from this order are now available in your account.",
    recentLedger: "Points activity",
    recentOrders: "Recharge orders",
    emptyOrders: "No recharge orders yet",
    tipsBody: "Points pay for usage-based capabilities. Membership plans and points packages are purchased separately.",
    watchaQuotaEntryTitle: "Buy model points with Watcha Pay",
    watchaQuotaEntryBody: "Choose a points package and complete payment on the secure payment page.",
    watchaQuotaAction: "Buy points",
    watchaQuotaChecking: "Preparing secure checkout...",
    watchaQuotaTitle: "Buy model points",
    watchaQuotaLivePaymentNotice: "Live payment · your account will be charged after confirmation",
    watchaQuotaBalance: "Available model points",
    watchaQuotaSeparatedBalance: "After payment is confirmed, return here and check the result again.",
    watchaQuotaPackagesTitle: "Model points packages",
    watchaQuotaPackagesBody: "Confirm one of these three packages and the final amount on the payment page.",
    watchaQuotaStarter: "Starter points package",
    watchaQuotaAdvanced: "Advanced points package",
    watchaQuotaTeam: "Team points package",
    watchaQuotaOpenPackage: "Continue to payment",
    watchaQuotaRecheck: "Check payment result",
    watchaQuotaGrantedBody: "Payment has been confirmed and the purchased points are available.",
    watchaQuotaPurchaseRequiredBody: "Choose a package on the secure payment page to add model points.",
    watchaQuotaUnavailableTitle: "Points purchase is unavailable",
    watchaQuotaUnavailableBody: "No purchase or deduction was created. Close this window and try again later.",
    errors: {
      ...siteBillingCopy.en.errors,
      subscription_plan_not_found: "This points package is not available. Refresh and choose again.",
      watcha_pay_not_configured: "Watcha Pay points purchase is not available right now.",
      watcha_pay_request_failed: "Watcha Pay could not be reached. Try again shortly.",
      watcha_pay_request_rejected: "Watcha Pay did not accept this request. Try again shortly.",
      watcha_pay_response_invalid: "Watcha Pay returned an incomplete result. Try again shortly.",
      site_billing_http_502: "The points recharge service is temporarily unavailable. Please try again shortly.",
    },
  },
  zh: {
    ...siteBillingCopy.zh,
    eyebrow: "积分中心",
    title: "积分充值",
    intro: "补充按量能力所需的积分。支付确认后，新的积分余额会立即可用。",
    signedOutBody: "你可以先查看积分包，准备充值时再登录。",
    unavailable: "积分充值暂时不可用，请稍后再试。",
    choosePlan: "积分包",
    createOrder: "立即充值",
    continuePayment: "继续支付",
    paymentSectionTitle: "微信充值",
    scanTitle: "扫码充值",
    scanBody: "请用微信扫描二维码完成支付。本页会自动确认支付状态，积分到账后同步更新余额。",
    paymentSuccessTitle: "充值成功",
    paymentSuccessBody: "积分已经到账，可以回到 MotiClaw 继续刚才的任务。",
    paidTitle: "积分已到账",
    paidBody: "这笔订单的积分已经可以使用。",
    recentLedger: "积分明细",
    recentOrders: "充值订单",
    emptyOrders: "还没有充值订单",
    tipsBody: "积分用于按量能力消耗。会员套餐和积分包分别购买，互不影响。",
    watchaQuotaEntryTitle: "使用观猹 Pay 购买模型积分",
    watchaQuotaEntryBody: "选择积分包后，在安全支付页完成付款。",
    watchaQuotaAction: "购买积分",
    watchaQuotaChecking: "正在准备安全支付...",
    watchaQuotaTitle: "购买模型积分",
    watchaQuotaLivePaymentNotice: "正式支付 · 确认后将产生真实扣款",
    watchaQuotaBalance: "可用模型积分",
    watchaQuotaSeparatedBalance: "付款确认后，请返回这里重新检查支付结果。",
    watchaQuotaPackagesTitle: "模型积分包",
    watchaQuotaPackagesBody: "请在支付页确认以下三档中的一档，以及最终支付金额。",
    watchaQuotaStarter: "入门积分包",
    watchaQuotaAdvanced: "进阶积分包",
    watchaQuotaTeam: "团队积分包",
    watchaQuotaOpenPackage: "前往支付",
    watchaQuotaRecheck: "检查支付结果",
    watchaQuotaGrantedBody: "付款已经确认，购买的模型积分已可使用。",
    watchaQuotaPurchaseRequiredBody: "请前往安全支付页选择积分包，为账号增加模型积分。",
    watchaQuotaUnavailableTitle: "积分购买暂不可用",
    watchaQuotaUnavailableBody: "本次没有创建购买或扣减，请关闭后稍后重试。",
    errors: {
      ...siteBillingCopy.zh.errors,
      subscription_plan_not_found: "这个积分包暂不可用，请刷新后重新选择。",
      watcha_pay_not_configured: "观猹 Pay 积分购买当前暂不可用。",
      watcha_pay_request_failed: "暂时无法连接观猹 Pay，请稍后重试。",
      watcha_pay_request_rejected: "观猹 Pay 没有接受这次请求，请稍后重试。",
      watcha_pay_response_invalid: "观猹 Pay 返回的信息不完整，请稍后重试。",
      site_billing_http_502: "积分充值服务暂时不可用，请稍后再试。",
    },
  },
};
