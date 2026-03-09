function main(config) {
  const proxies = config.proxies ? config.proxies.map(p => p.name) : [];
  const originalGroups = config['proxy-groups'] ? config['proxy-groups'].map(g => g.name) : [];

  function getProxies(regex) {
    return proxies.filter(name => regex.test(name));
  }

  function createGroup(name, type, proxyLists, options = {}) {
    let flatProxies = [];
    for (let list of proxyLists) {
      if (Array.isArray(list)) flatProxies.push(...list);
      else if (typeof list === 'string') flatProxies.push(list);
    }
    flatProxies = [...new Set(flatProxies)];
    if (flatProxies.length === 0) flatProxies = ["DIRECT"];
    return { name, type, proxies: flatProxies, ...options };
  }

  // --- 正则定义 ---
  const rxDomestic = /(电信|联通|移动)/i;
  const rxNonDomestic = /^(?!.*(电信|联通|移动)).*/i;
  const rxCN = /(CN|电信|联通|移动)/i;
  const rxYouTube = /(尼日利亚|NG|土耳其|TR|Turkey|印度|IN|蒙古|MN|澳门|MO|RU|尼泊尔|NP|阿塞拜疆|孟加拉|BD|约旦|JO|柬埔寨|KH|阿根廷|AR)/i;
  const rxNetflixDisney = /(新加坡|坡|狮城|SG|Singapore|台|新北|彰化|TW|Taiwan|港|HK|Hong Kong)/i;
  const rxHBO = /(台|新北|彰化|TW|Taiwan)/i;
  const rxEmby = /(Emby|emby)/i;
  const rxBahamut = /(台|TW|Taiwan|港|HK|Hong Kong)/i;
  const rxBilibili = /(港|HK|Hong Kong|台|TW|Taiwan)/i;
  const rxSpotify = /(菲律宾|PH|巴基斯坦|PK|土耳其|TR|Turkey|尼日利亚|NG)/i;

  const urlTestBase = { url: "http://www.gstatic.com/generate_204", interval: 300, tolerance: 50 };
  const newProxyGroups = [];

  // --- 1. 基础组 ---
  newProxyGroups.push(createGroup("🚀 国外流量", "select", ["♻️ 自动选择", "🔯 故障转移", "🔮 负载均衡", "✈️ 手动选择", "🛩️ 手动选择备用"]));
  newProxyGroups.push(createGroup("✈️ 手动选择", "select", [proxies]));
  newProxyGroups.push(createGroup("🛩️ 手动选择备用", "select", [proxies]));
  const baseNodes = ["✈️ 手动选择", "🛩️ 手动选择备用"];

  // --- 2. 核心分流组 ---
  newProxyGroups.push(createGroup("🎯 国内流量", "select", ["DIRECT", getProxies(rxDomestic), "🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("🛸 IP归属地伪装", "select", ["🎯 国内流量", getProxies(rxCN), ...baseNodes]));
  newProxyGroups.push(createGroup("🐟 漏网之鱼", "select", ["🚀 国外流量", "🎯 国内流量", ...baseNodes]));
  
  // --- 3. 应用分流组 ---
  newProxyGroups.push(createGroup("🧚 AI", "select", [...baseNodes]));
  newProxyGroups.push(createGroup("📹 YouTube", "select", ["🚀 国外流量", getProxies(rxYouTube), ...baseNodes]));
  newProxyGroups.push(createGroup("🎥 Netflix", "select", ["🚀 国外流量", ...baseNodes, getProxies(rxNetflixDisney)]));
  newProxyGroups.push(createGroup("🐹 DisneyPlus", "select", ["🚀 国外流量", ...baseNodes, getProxies(rxNetflixDisney)]));
  newProxyGroups.push(createGroup("📽️ PrimeVideo", "select", ["🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("🎦 HBO", "select", [getProxies(rxHBO), "🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("🎬 EMBY", "select", ["🚀 国外流量", getProxies(rxEmby), "🎯 国内流量", ...baseNodes]));
  newProxyGroups.push(createGroup("🍎 AppleTV", "select", ["🎯 国内流量", "🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("📺 巴哈姆特", "select", [getProxies(rxBahamut), ...baseNodes]));
  newProxyGroups.push(createGroup("📺 Bilibili", "select", ["🎯 国内流量", getProxies(rxBilibili), ...baseNodes]));
  newProxyGroups.push(createGroup("🎵 Spotify", "select", ["🎯 国内流量", getProxies(rxSpotify), "🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("🎶 TikTok", "select", ["🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("🌍 国外媒体", "select", ["🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("🌏 国内媒体", "select", ["🎯 国内流量", ...baseNodes]));
  newProxyGroups.push(createGroup("📲 Telegram", "select", ["🚀 国外流量", "🎯 国内流量", ...baseNodes]));
  newProxyGroups.push(createGroup("🤖 Discord", "select", ["🚀 国外流量", "🎯 国内流量", ...baseNodes]));
  newProxyGroups.push(createGroup("👨‍💻 GitHub", "select", ["🚀 国外流量", "🎯 国内流量", ...baseNodes]));
  newProxyGroups.push(createGroup("📢 谷歌FCM", "select", ["🎯 国内流量", "🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("Ⓜ️ 微软云盘", "select", ["🎯 国内流量", "🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("Ⓜ️ 微软服务", "select", ["🎯 国内流量", "🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("🍎 苹果服务", "select", ["🎯 国内流量", "🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("🎮 游戏平台", "select", ["🎯 国内流量", "🚀 国外流量", ...baseNodes]));
  newProxyGroups.push(createGroup("🛑 广告拦截", "select", ["REJECT", "🎯 国内流量", "🚀 国外流量"]));

  // --- 4. 自动选择组 ---
  newProxyGroups.push(createGroup("♻️ 自动选择", "url-test", [getProxies(rxNonDomestic)], urlTestBase));
  newProxyGroups.push(createGroup("🔯 故障转移", "fallback", [getProxies(rxNonDomestic)], urlTestBase));
  newProxyGroups.push(createGroup("🔮 负载均衡", "load-balance", [getProxies(rxNonDomestic)], urlTestBase));

  // --- 5. 万能动态补丁 (防止 Rules 报错) ---
  const newNames = newProxyGroups.map(g => g.name);
  originalGroups.forEach(old => {
    if (!newNames.includes(old)) {
      newProxyGroups.push(createGroup(old, "select", ["✈️ 手动选择", "DIRECT"]));
    }
  });

  config['proxy-groups'] = newProxyGroups;

  // --- 6. 核心：强制置顶分流规则 (新增 Grok & Sora) ---
  const customRules = [
    // TikTok 置顶
    "DOMAIN-SUFFIX,tiktok.com,🎶 TikTok",
    "DOMAIN-SUFFIX,tiktokv.com,🎶 TikTok",
    "DOMAIN-SUFFIX,tiktokcdn.com,🎶 TikTok",
    "DOMAIN-SUFFIX,byteoversea.com,🎶 TikTok",
    "DOMAIN-KEYWORD,tiktok,🎶 TikTok",
    // AI 置顶 (含 Sora 和 Grok)
    "DOMAIN-SUFFIX,openai.com,🧚 AI",
    "DOMAIN-SUFFIX,chatgpt.com,🧚 AI",
    "DOMAIN-SUFFIX,sora.com,🧚 AI",
    "DOMAIN-SUFFIX,anthropic.com,🧚 AI",
    "DOMAIN-SUFFIX,claude.ai,🧚 AI",
    "DOMAIN-SUFFIX,grok.com,🧚 AI",
    "DOMAIN-SUFFIX,x.ai,🧚 AI",
    "DOMAIN-SUFFIX,gemini.google.com,🧚 AI",
    "DOMAIN-KEYWORD,openai,🧚 AI",
    "DOMAIN-KEYWORD,chatgpt,🧚 AI",
    "DOMAIN-KEYWORD,anthropic,🧚 AI",
    "DOMAIN-KEYWORD,claude,🧚 AI",
    "DOMAIN-KEYWORD,grok,🧚 AI"
  ];

  if (config.rules) {
    config.rules = [...customRules, ...config.rules];
  } else {
    config.rules = customRules;
  }

  return config;
}
