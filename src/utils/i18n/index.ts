import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import { en, zh } from './locales'

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        react: {
            // 是否需要在最外层加入Suspense标签
            useSuspense: false
        },
        // 默认语言
        lng: 'en',
        fallbackLng: 'en',
        // 开启调试
        debug: true,
        // Backend 设置
        backend: {

        },
        interpolation: {
            escapeValue: false // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: en
            },
            zh: {
                translation: zh
            }
        }
    }, function (err, t) {
        console.log("国际化插件初始化完毕!", err)
    });

export default i18n