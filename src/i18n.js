import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入你的翻译文件
import translation_zh from './locales/zh/translation.json';
import translation_en from './locales/en/translation.json';

const resources = {
  zh: {
    translation: translation_zh,
  },
  en: {
    translation: translation_en,
  },
};

i18n
  .use(LanguageDetector) // 自动检测用户浏览器语言
  .use(initReactI18next) // 传入 i18n 实例给 react-i18next
  .init({
    resources,
    fallbackLng: 'zh', // 如果当前语言没有翻译，则回退到中文
    interpolation: {
      escapeValue: false, // react 已经自带 xss 防护
    },
    detection: {
      order: ['navigator'], // 优先使用浏览器语言检测
      caches: ['localStorage'], // 将用户选择的语言缓存到 localStorage
    },
  });

export default i18n;