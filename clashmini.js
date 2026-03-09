function main(config) {
  const proxies = config.proxies ? config.proxies.map(p => p.name) : [];
  const originalGroups = config['proxy-groups'] ? config['proxy-groups'].map(g => g.name) : [];

  // 1. 定义标准分组
  const myGroups = [
    { name: "🚀 国外流量", type: "select", proxies: ["♻️ 自动选择", "✈️ 手动选择", "🛩️ 手动选择备用"] },
    { name: "✈️ 手动选择", type: "select", proxies: proxies },
    { name: "🛩️ 手动选择备用", type: "select", proxies: proxies },
    // 将 AI 和 TikTok 的首选设为“手动选择备用”
    { name: "🧚 AI", type: "select", proxies: ["🛩️ 手动选择备用", "✈️ 手动选择", "DIRECT"] },
    { name: "🎶 TikTok", type: "select", proxies: ["🛩️ 手动选择备用", "✈️ 手动选择", "DIRECT"] },
    { name: "♻️ 自动选择", type: "url-test", proxies: proxies, url: "http://www.gstatic.com/generate_204", interval: 300 }
  ];

  // 2. 自动化规则处理器
  if (config.rules) {
    // 【置顶补漏】
    const topRules = [
      "DOMAIN-KEYWORD,openai,🧚 AI",
      "DOMAIN-KEYWORD,chatgpt,🧚 AI",
      "DOMAIN-KEYWORD,grok,🧚 AI",
      "DOMAIN-KEYWORD,gemini,🧚 AI",
      "DOMAIN-SUFFIX,gemini.google.com,🧚 AI",
      "DOMAIN-SUFFIX,sora.com,🧚 AI",
      "DOMAIN-KEYWORD,tiktok,🎶 TikTok"
    ];

    // 【原地修改】扫描并收编规则
    const modifiedRules = config.rules.map(rule => {
      if (/(OpenAI|ChatGPT|Grok|Gemini|Claude|Anthropic)/i.test(rule)) {
        return rule.replace(/,[^,]+$/, ",🧚 AI");
      }
      if (rule.includes("TikTok")) {
        return rule.replace(/,[^,]+$/, ",🎶 TikTok");
      }
      return rule;
    });

    config.rules = [...topRules, ...modifiedRules];
  }

  // 3. 补丁逻辑
  const currentNames = myGroups.map(g => g.name);
  originalGroups.forEach(old => {
    if (!currentNames.includes(old)) {
      myGroups.push({ name: old, type: "select", proxies: ["✈️ 手动选择", "DIRECT"] });
    }
  });

  config['proxy-groups'] = myGroups;
  return config;
}