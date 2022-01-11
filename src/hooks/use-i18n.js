import { useContext } from 'react';

import { I18nContext } from '../contexts/i18n-context';


function useI18n() {
    const { i18n, setI18n } = useContext(I18nContext);

    return {
        i18n: (key) => i18n.currentLang?.dict[key] ?? key,
        setLang: (lang) => {
            setI18n({ ...i18n, currentLang: i18n.langs[lang] });
        },
        lang: i18n.currentLang
    };
}

export default useI18n;