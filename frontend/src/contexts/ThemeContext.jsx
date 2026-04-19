import { createContext, useContext, useState, useEffect } from 'react';

const dark = {
  isDark: true,
  bg:                  '#080510',
  bgSidebar:           'linear-gradient(180deg, #0d0818 0%, #100520 50%, #0a0312 100%)',
  bgTopbar:            'rgba(10,4,20,0.85)',
  bgCard:              'rgba(255,255,255,0.03)',
  bgCardHeader:        'rgba(147,51,234,0.06)',
  bgInput:             'rgba(255,255,255,0.05)',
  bgHover:             'rgba(236,72,153,0.05)',
  bgInactiveFilter:    'rgba(255,255,255,0.04)',
  bgTopicHover:        'rgba(236,72,153,0.06)',
  bgStatPill:          'rgba(147,51,234,0.1)',
  border:              'rgba(236,72,153,0.1)',
  borderInput:         'rgba(236,72,153,0.2)',
  borderSubtle:        'rgba(147,51,234,0.1)',
  borderTopbar:        'rgba(236,72,153,0.2)',
  borderSidebar:       'rgba(147,51,234,0.2)',
  borderStatPill:      'rgba(236,72,153,0.2)',
  textPrimary:         '#f5e6ff',
  textSecondary:       '#c084fc',
  textMuted:           '#9333ea',
  textLabel:           '#7c3aed',
  textTopicInactive:   '#d8b4fe',
  textHeading:         '#fdf4ff',
  rowBorder:           'rgba(236,72,153,0.07)',
  progressTrack:       'rgba(147,51,234,0.12)',
  progressTrackSide:   'rgba(147,51,234,0.1)',
  modalBg:             'linear-gradient(135deg, rgba(13,8,24,0.98), rgba(20,5,35,0.98))',
  modalOverlay:        'rgba(0,0,0,0.8)',
  cancelBtn:           'rgba(147,51,234,0.08)',
  cancelBtnBorder:     'rgba(147,51,234,0.15)',
  cancelBtnText:       '#c084fc',
  cancelBtnHover:      '#f0abfc',
  inactiveDiffBtn:     'rgba(255,255,255,0.04)',
  inactiveDiffBtnBorder: 'rgba(236,72,153,0.1)',
  hamburgerBg:         'rgba(236,72,153,0.1)',
  hamburgerColor:      '#f472b6',
  emptyText:           '#9333ea',
  loadingColor:        '#ec4899',
  tableHeaderText:     '#9333ea',
  scrollbarClass:      'scrollbar-dark',
};

const light = {
  isDark: false,
  bg:                  '#fdf2f8',
  bgSidebar:           'linear-gradient(180deg, #1a0533 0%, #2d0a4e 50%, #1a0533 100%)',
  bgTopbar:            'rgba(255,255,255,0.92)',
  bgCard:              'rgba(255,255,255,0.97)',
  bgCardHeader:        'rgba(147,51,234,0.05)',
  bgInput:             'rgba(255,255,255,0.9)',
  bgHover:             'rgba(236,72,153,0.05)',
  bgInactiveFilter:    'rgba(147,51,234,0.06)',
  bgTopicHover:        'rgba(255,255,255,0.08)',
  bgStatPill:          'rgba(236,72,153,0.12)',
  border:              'rgba(147,51,234,0.15)',
  borderInput:         'rgba(147,51,234,0.3)',
  borderSubtle:        'rgba(147,51,234,0.1)',
  borderTopbar:        'rgba(147,51,234,0.15)',
  borderSidebar:       'rgba(236,72,153,0.25)',
  borderStatPill:      'rgba(236,72,153,0.3)',
  textPrimary:         '#2e0352',
  textSecondary:       '#7c3aed',
  textMuted:           '#a855f7',
  textLabel:           '#9333ea',
  textTopicInactive:   'rgba(255,255,255,0.75)',
  textHeading:         '#2e0352',
  rowBorder:           'rgba(147,51,234,0.08)',
  progressTrack:       'rgba(147,51,234,0.1)',
  progressTrackSide:   'rgba(236,72,153,0.15)',
  modalBg:             'linear-gradient(135deg, rgba(255,255,255,0.99), rgba(253,242,248,0.99))',
  modalOverlay:        'rgba(20,5,40,0.5)',
  cancelBtn:           'rgba(147,51,234,0.06)',
  cancelBtnBorder:     'rgba(147,51,234,0.2)',
  cancelBtnText:       '#9333ea',
  cancelBtnHover:      '#2e0352',
  inactiveDiffBtn:     'rgba(147,51,234,0.06)',
  inactiveDiffBtnBorder: 'rgba(147,51,234,0.18)',
  hamburgerBg:         'rgba(147,51,234,0.1)',
  hamburgerColor:      '#9333ea',
  emptyText:           '#a855f7',
  loadingColor:        '#ec4899',
  tableHeaderText:     '#c084fc',
  scrollbarClass:      'scrollbar-light',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('dsa-theme') !== 'light'; }
    catch { return true; }
  });

  useEffect(() => {
    try { localStorage.setItem('dsa-theme', isDark ? 'dark' : 'light'); }
    catch {}
    document.body.classList.toggle('theme-light', !isDark);
  }, [isDark]);

  const toggle = () => setIsDark((d) => !d);
  const t = isDark ? dark : light;

  return (
    <ThemeContext.Provider value={{ isDark, toggle, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
