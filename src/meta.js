/* 模型星图 · 领域、开放程度与厂商字典 */

const DOMAINS = [
  { id: 'origin',     label: '起源·里程碑', short: '起源', color: '#8a6a3b', desc: '奠基性论文、架构与标志性事件' },
  { id: 'language',   label: '语言大模型',   short: '语言', color: '#3b5bdb', desc: '通用文本、推理与对话模型' },
  { id: 'multimodal', label: '多模态理解',   short: '多模态', color: '#7048e8', desc: '图文、音视频联合理解与交互' },
  { id: 'image',      label: '图像生成',     short: '图像', color: '#e8590c', desc: '文生图、图像编辑与视觉创作' },
  { id: 'video',      label: '视频生成',     short: '视频', color: '#d6336c', desc: '文生视频、视频编辑与世界模拟' },
  { id: 'audio',      label: '语音与音乐',   short: '音频', color: '#b8860b', desc: '语音合成、识别、音乐与实时音频' },
  { id: 'code',       label: '代码模型',     short: '代码', color: '#0c8599', desc: '代码生成、理解与软件工程代理' },
  { id: 'science',    label: '科学智能',     short: '科学', color: '#2b8a3e', desc: '生命科学、数学、材料与气象' },
  { id: 'threeD',     label: '3D 生成',      short: '3D', color: '#5c940d', desc: '三维资产、场景重建与可微渲染' },
  { id: 'world',      label: '世界模型',     short: '世界', color: '#1971c2', desc: '可交互环境、空间智能与具身预测' }
];

const DOMAIN_MAP = Object.fromEntries(DOMAINS.map(d => [d.id, d]));

const OPENNESS = [
  { id: 'oss',     label: '开源',     short: '开源', color: '#2f9e44', desc: '许可宽松（Apache-2.0 / MIT 等），允许商用与再分发。' },
  { id: 'open',    label: '开放权重', short: '开放权重', color: '#1971c2', desc: '权重可下载，但附商用 / 非商业或使用条款（如 Llama Community License、Gemma Terms）。' },
  { id: 'closed',  label: '闭源',     short: '闭源', color: '#e03131', desc: '仅通过 API、产品访问，不提供权重下载。' },
  { id: 'unknown', label: '未注明',   short: '未注明', color: '#868e96', desc: '发布时未明确许可，或档案尚未核实。' }
];

const OPENNESS_MAP = Object.fromEntries(OPENNESS.map(o => [o.id, o]));

const VENDORS = {
  science: {
    name: '科学界', en: 'Scientific Community', regions: ['跨国'], color: '#8a6a3b', icon: 'science',
    official: { label: '论文与里程碑索引', url: 'https://arxiv.org/' }
  },
  openai: {
    name: 'OpenAI', en: 'OpenAI', regions: ['美国'], color: '#10a37f', icon: 'openai',
    official: { label: 'OpenAI 发布记录', url: 'https://openai.com/news/' }
  },
  anthropic: {
    name: 'Anthropic', en: 'Anthropic', regions: ['美国'], color: '#d97757', icon: 'anthropic',
    official: { label: 'Anthropic 发布记录', url: 'https://www.anthropic.com/news' }
  },
  google: {
    name: 'Google DeepMind', en: 'Google DeepMind', regions: ['美国', '英国'], color: '#4285f4', icon: 'google',
    official: { label: 'Google AI 发布记录', url: 'https://blog.google/technology/ai/' }
  },
  meta: {
    name: 'Meta AI', en: 'Meta AI', regions: ['美国'], color: '#0866ff', icon: 'meta',
    official: { label: 'Meta AI 发布记录', url: 'https://ai.meta.com/blog/' }
  },
  xai: {
    name: 'xAI', en: 'xAI', regions: ['美国'], color: '#111111', icon: 'xai',
    official: { label: 'xAI 发布记录', url: 'https://x.ai/news' }
  },
  microsoft: {
    name: 'Microsoft', en: 'Microsoft', regions: ['美国'], color: '#0078d4', icon: 'microsoft',
    official: { label: 'Microsoft AI 发布记录', url: 'https://azure.microsoft.com/en-us/blog/' }
  },
  amazon: {
    name: 'Amazon', en: 'Amazon', regions: ['美国'], color: '#ff9900', icon: 'amazon',
    official: { label: 'AWS 发布记录', url: 'https://aws.amazon.com/blogs/aws/' }
  },
  apple: {
    name: 'Apple', en: 'Apple', regions: ['美国'], color: '#111111', icon: 'apple',
    official: { label: 'Apple 机器学习研究', url: 'https://machinelearning.apple.com/' }
  },
  nvidia: {
    name: 'NVIDIA', en: 'NVIDIA', regions: ['美国'], color: '#76b900', icon: 'nvidia',
    official: { label: 'NVIDIA 开发者博客', url: 'https://developer.nvidia.com/blog/' }
  },
  ibm: {
    name: 'IBM', en: 'IBM', regions: ['美国'], color: '#0f62fe', icon: 'ibm',
    official: { label: 'IBM 研究新闻', url: 'https://research.ibm.com/blog' }
  },
  mistral: {
    name: 'Mistral AI', en: 'Mistral AI', regions: ['法国'], color: '#fa520f', icon: 'mistral',
    official: { label: 'Mistral 发布记录', url: 'https://mistral.ai/news' }
  },
  cohere: {
    name: 'Cohere', en: 'Cohere', regions: ['加拿大'], color: '#39594d', icon: 'cohere',
    official: { label: 'Cohere 发布记录', url: 'https://cohere.com/blog' }
  },
  ai21: {
    name: 'AI21 Labs', en: 'AI21 Labs', regions: ['以色列'], color: '#0d2b45', icon: 'ai21',
    official: { label: 'AI21 发布记录', url: 'https://www.ai21.com/blog' }
  },
  stability: {
    name: 'Stability AI', en: 'Stability AI', regions: ['英国'], color: '#8b5cf6', icon: 'stability',
    official: { label: 'Stability AI 发布记录', url: 'https://stability.ai/news' }
  },
  bfl: {
    name: 'Black Forest Labs', en: 'Black Forest Labs', regions: ['德国'], color: '#ff5a1f', icon: 'bfl',
    official: { label: 'BFL 发布记录', url: 'https://bfl.ai/blog' }
  },
  midjourney: {
    name: 'Midjourney', en: 'Midjourney', regions: ['美国'], color: '#111111', icon: 'midjourney',
    official: { label: 'Midjourney 更新记录', url: 'https://www.midjourney.com/updates' }
  },
  runway: {
    name: 'Runway', en: 'Runway', regions: ['美国'], color: '#111111', icon: 'runway',
    official: { label: 'Runway 发布记录', url: 'https://runwayml.com/news' }
  },
  pika: {
    name: 'Pika', en: 'Pika', regions: ['美国'], color: '#e84a8a', icon: 'pika',
    official: { label: 'Pika 博客', url: 'https://pika.art/blog' }
  },
  luma: {
    name: 'Luma AI', en: 'Luma AI', regions: ['美国'], color: '#111111', icon: 'luma',
    official: { label: 'Luma 发布记录', url: 'https://lumalabs.ai/blog' }
  },
  elevenlabs: {
    name: 'ElevenLabs', en: 'ElevenLabs', regions: ['美国', '英国'], color: '#111111', icon: 'elevenlabs',
    official: { label: 'ElevenLabs 发布记录', url: 'https://elevenlabs.io/blog' }
  },
  suno: {
    name: 'Suno', en: 'Suno', regions: ['美国'], color: '#111111', icon: 'suno',
    official: { label: 'Suno 发布记录', url: 'https://suno.com/blog' }
  },
  udio: {
    name: 'Udio', en: 'Udio', regions: ['美国'], color: '#7c3aed', icon: 'udio',
    official: { label: 'Udio 博客', url: 'https://www.udio.com/blog' }
  },
  adobe: {
    name: 'Adobe', en: 'Adobe', regions: ['美国'], color: '#e32636', icon: 'adobe',
    official: { label: 'Adobe 发布记录', url: 'https://blog.adobe.com/' }
  },
  ideogram: {
    name: 'Ideogram', en: 'Ideogram', regions: ['加拿大'], color: '#111111', icon: 'ideogram',
    official: { label: 'Ideogram 发布记录', url: 'https://about.ideogram.ai/' }
  },
  recraft: {
    name: 'Recraft', en: 'Recraft', regions: ['美国'], color: '#111111', icon: 'recraft',
    official: { label: 'Recraft 博客', url: 'https://www.recraft.ai/blog' }
  },
  perplexity: {
    name: 'Perplexity', en: 'Perplexity', regions: ['美国'], color: '#1fb8cd', icon: 'perplexity',
    official: { label: 'Perplexity 发布记录', url: 'https://www.perplexity.ai/hub/blog' }
  },
  together: {
    name: 'Together AI', en: 'Together AI', regions: ['美国'], color: '#8b5cf6', icon: 'together',
    official: { label: 'Together AI 博客', url: 'https://www.together.ai/blog' }
  },
  huggingface: {
    name: 'Hugging Face', en: 'Hugging Face', regions: ['美国', '法国'], color: '#ffd21e', icon: 'huggingface',
    official: { label: 'Hugging Face 博客', url: 'https://huggingface.co/blog' }
  },
  eleutherai: {
    name: 'EleutherAI', en: 'EleutherAI', regions: ['美国'], color: '#1f8a70', icon: 'eleutherai',
    official: { label: 'EleutherAI 博客', url: 'https://blog.eleuther.ai/' }
  },
  ai2: {
    name: 'Allen AI (AI2)', en: 'Allen Institute for AI', regions: ['美国'], color: '#1d4ed8', icon: 'ai2',
    official: { label: 'AI2 博客', url: 'https://blog.allenai.org/' }
  },
  tii: {
    name: 'TII', en: 'Technology Innovation Institute', regions: ['阿联酋'], color: '#111111', icon: 'falcon',
    official: { label: 'Falcon 发布记录', url: 'https://falconllm.tii.ae/' }
  },
  databricks: {
    name: 'Databricks', en: 'Databricks', regions: ['美国'], color: '#ff3621', icon: 'databricks',
    official: { label: 'Databricks 博客', url: 'https://www.databricks.com/blog' }
  },
  deepseek: {
    name: 'DeepSeek', en: 'DeepSeek', regions: ['中国'], color: '#4d6bfe', icon: 'deepseek',
    official: { label: 'DeepSeek 发布记录', url: 'https://api-docs.deepseek.com/news/' }
  },
  alibaba: {
    name: '阿里巴巴 · 通义', en: 'Alibaba Qwen', regions: ['中国'], color: '#ff6a00', icon: 'alibaba',
    official: { label: 'Qwen 发布记录', url: 'https://qwen.ai/blog' }
  },
  bytedance: {
    name: '字节跳动 · 豆包', en: 'ByteDance Seed', regions: ['中国'], color: '#3c8cff', icon: 'bytedance',
    official: { label: 'Seed 发布记录', url: 'https://seed.bytedance.com/en/blog' }
  },
  kuaishou: {
    name: '快手 · 可灵', en: 'Kuaishou Kling', regions: ['中国'], color: '#ff4906', icon: 'kuaishou',
    official: { label: '快手投资者发布', url: 'https://ir.kuaishou.com/news-releases' }
  },
  zhipu: {
    name: '智谱 · Z.ai', en: 'Zhipu AI', regions: ['中国'], color: '#111111', icon: 'zhipu',
    official: { label: 'Z.ai 发布记录', url: 'https://z.ai/blog' }
  },
  moonshot: {
    name: '月之暗面 · Kimi', en: 'Moonshot AI', regions: ['中国'], color: '#111111', icon: 'moonshot',
    official: { label: 'Moonshot 发布记录', url: 'https://www.moonshot.ai/' }
  },
  minimax: {
    name: 'MiniMax', en: 'MiniMax', regions: ['中国'], color: '#e73562', icon: 'minimax',
    official: { label: 'MiniMax 发布记录', url: 'https://www.minimax.io/news' }
  },
  tencent: {
    name: '腾讯 · 混元', en: 'Tencent Hunyuan', regions: ['中国'], color: '#1a73e8', icon: 'tencenthy',
    official: { label: '腾讯混元发布', url: 'https://cloud.tencent.com/developer' }
  },
  baidu: {
    name: '百度 · 文心', en: 'Baidu ERNIE', regions: ['中国'], color: '#2932e1', icon: 'baidu',
    official: { label: '文心发布记录', url: 'https://ernie.baidu.com/' }
  },
  huawei: {
    name: '华为 · 盘古', en: 'Huawei PanGu', regions: ['中国'], color: '#ff0000', icon: 'huawei',
    official: { label: '华为云盘古', url: 'https://www.huaweicloud.com/intl/en-us/product/pangu.html' }
  },
  iflytek: {
    name: '科大讯飞 · 星火', en: 'iFlytek Spark', regions: ['中国'], color: '#1e6fff', icon: 'iflytek',
    official: { label: '讯飞星火发布', url: 'https://www.iflytek.com/en/news.html' }
  },
  sensetime: {
    name: '商汤 · 日日新', en: 'SenseTime SenseNova', regions: ['中国'], color: '#00a6a6', icon: 'sensetime',
    official: { label: '商汤发布记录', url: 'https://www.sensetime.com/en/news' }
  },
  stepfun: {
    name: '阶跃星辰', en: 'StepFun', regions: ['中国'], color: '#16a34a', icon: 'stepfun',
    official: { label: '阶跃星辰发布', url: 'https://www.stepfun.com/' }
  },
  worldlabs: {
    name: 'World Labs', en: 'World Labs', regions: ['美国'], color: '#0ea5a4', icon: 'worldlabs',
    official: { label: 'World Labs 发布记录', url: 'https://www.worldlabs.ai/blog' }
  },
  physical: {
    name: 'Physical Intelligence', en: 'Physical Intelligence', regions: ['美国'], color: '#111111', icon: 'physical',
    official: { label: 'Physical Intelligence 博客', url: 'https://www.physicalintelligence.company/blog' }
  },
  decart: {
    name: 'Decart', en: 'Decart', regions: ['以色列'], color: '#7c3aed', icon: 'decart',
    official: { label: 'Decart 发布记录', url: 'https://decart.ai/blog' }
  },
  cursor: {
    name: 'Cursor · Anysphere', en: 'Anysphere', regions: ['美国'], color: '#111111', icon: 'cursor',
    official: { label: 'Cursor 发布记录', url: 'https://cursor.com/blog' }
  },
  tripo: {
    name: 'Tripo · VAST', en: 'VAST AI', regions: ['中国', '美国'], color: '#0f9b8e', icon: 'tripo',
    official: { label: 'Tripo 发布记录', url: 'https://www.tripo3d.ai/blog' }
  },
  sesame: {
    name: 'Sesame', en: 'Sesame AI', regions: ['美国'], color: '#b0723c', icon: 'sesame',
    official: { label: 'Sesame 发布记录', url: 'https://www.sesame.com/research' }
  },
  lightricks: {
    name: 'Lightricks · LTX', en: 'Lightricks', regions: ['以色列'], color: '#5b4bff', icon: 'lightricks',
    official: { label: 'LTX 发布记录', url: 'https://ltx.io/newsroom' }
  },
  cartesia: {
    name: 'Cartesia', en: 'Cartesia AI', regions: ['美国'], color: '#7b61ff', icon: 'cartesia',
    official: { label: 'Cartesia 文档', url: 'https://docs.cartesia.ai' }
  },
  meshy: {
    name: 'Meshy', en: 'Meshy AI', regions: ['美国'], color: '#1f8ad6', icon: 'meshy',
    official: { label: 'Meshy 发布记录', url: 'https://www.meshy.ai/blog' }
  },
  hyper3d: {
    name: 'Hyper3D · 影眸', en: 'Deemos Tech', regions: ['中国'], color: '#2f6bd8', icon: 'hyper3d',
    official: { label: 'Rodin 发布记录', url: 'https://hyper3d.ai' }
  },
  reve: {
    name: 'Reve', en: 'Reve AI', regions: ['美国'], color: '#e2456b', icon: 'reve',
    official: { label: 'Reve 发布记录', url: 'https://reve.art' }
  },
  vidu: {
    name: 'Vidu · 生数', en: 'Shengshu Technology', regions: ['中国'], color: '#6355ff', icon: 'vidu',
    official: { label: 'Vidu 发布记录', url: 'https://www.vidu.cn' }
  },
  sandai: {
    name: 'Sand.ai', en: 'Sand AI', regions: ['中国'], color: '#0d9470', icon: 'sandai',
    official: { label: 'Sand.ai 博客', url: 'https://sand.ai/blog' }
  },
  inworld: {
    name: 'Inworld', en: 'Inworld AI', regions: ['美国'], color: '#1f2a44', icon: 'inworld',
    official: { label: 'Inworld 更新日志', url: 'https://docs.inworld.ai/release-notes' }
  }
};
