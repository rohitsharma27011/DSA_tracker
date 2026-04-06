import { createContext, useContext, useState, useEffect } from 'react';

const dark = {
  isDark: true,
  bg:                  '#0a0a0f',
  bgSidebar:           'linear-gradient(180deg, #0d0d1a 0%, #0a0a14 100%)',
  bgTopbar:            'rgba(15,15,26,0.8)',
  bgCard:              'rgba(255,255,255,0.03)',
  bgCardHeader:        'rgba(0,0,0,0.2)',
  bgInput:             'rgba(255,255,255,0.05)',
  bgHover:             'rgba(255,255,255,0.03)',
  bgInactiveFilter:    'rgba(255,255,255,0.04)',
  bgTopicHover:        'rgba(255,255,255,0.04)',
  bgStatPill:          'rgba(124,58,237,0.08)',
  border:              'rgba(255,255,255,0.07)',
  borderInput:         'rgba(255,255,255,0.1)',
  borderSubtle:        'rgba(255,255,255,0.05)',
  borderTopbar:        'rgba(124,58,237,0.15)',
  borderSidebar:       'rgba(124,58,237,0.15)',
  borderStatPill:      'rgba(124,58,237,0.15)',
  textPrimary:         '#e2e8f0',
  textSecondary:       '#9ca3af',
  textMuted:           '#6b7280',
  textLabel:           '#4b5563',
  textTopicInactive:   '#9ca3af',
  textHeading:         '#e2e8f0',
  rowBorder:           'rgba(255,255,255,0.04)',
  progressTrack:       'rgba(255,255,255,0.07)',
  progressTrackSide:   'rgba(255,255,255,0.06)',
  modalBg:             'linear-gradient(135deg, rgba(15,15,26,0.97), rgba(20,15,35,0.97))',
  modalOverlay:        'rgba(0,0,0,0.7)',
  cancelBtn:           'rgba(255,255,255,0.05)',
  cancelBtnBorder:     'rgba(255,255,255,0.08)',
  cancelBtnText:       '#6b7280',
  cancelBtnHover:      '#e2e8f0',
  inactiveDiffBtn:     'rgba(255,255,255,0.04)',
  inactiveDiffBtnBorder: 'rgba(255,255,255,0.08)',
  hamburgerBg:         'rgba(124,58,237,0.1)',
  hamburgerColor:      '#a78bfa',
  emptyText:           '#6b7280',
  loadingColor:        '#7c3aed',
  tableHeaderText:     '#4b5563',
  scrollbarClass:      'scrollbar-dark',
};

const light = {
  isDark: false,
  bg:                  '#f5f3ff',
  bgSidebar:           'linear-gradient(180deg, #1e1b4b 0%, #2e1065 100%)',
  bgTopbar:            'rgba(255,255,255,0.9)',
  bgCard:              'rgba(255,255,255,0.95)',
  bgCardHeader:        'rgba(124,58,237,0.04)',
  bgInput:             'rgba(255,255,255,0.9)',
  bgHover:             'rgba(124,58,237,0.04)',
  bgInactiveFilter:    'rgba(124,58,237,0.06)',
  bgTopicHover:        'rgba(255,255,255,0.07)',
  bgStatPill:          'rgba(167,139,250,0.15)',
  border:              'rgba(124,58,237,0.12)',
  borderInput:         'rgba(124,58,237,0.25)',
  borderSubtle:        'rgba(124,58,237,0.1)',
  borderTopbar:        'rgba(124,58,237,0.15)',
  borderSidebar:       'rgba(124,58,237,0.2)',
  borderStatPill:      'rgba(167,139,250,0.3)',
  textPrimary:         '#1e1b4b',
  textSecondary:       '#6b7280',
  textMuted:           '#9ca3af',
  textLabel:           '#7c3aed',
  textTopicInactive:   'rgba(255,255,255,0.65)',
  textHeading:         '#1e1b4b',
  rowBorder:           'rgba(124,58,237,0.07)',
  progressTrack:       'rgba(124,58,237,0.1)',
  progressTrackSide:   'rgba(167,139,250,0.15)',
  modalBg:             'linear-gradient(135deg, rgba(255,255,255,0.99), rgba(245,243,255,0.99))',
  modalOverlay:        'rgba(15,10,40,0.45)',
  cancelBtn:           'rgba(124,58,237,0.06)',
  cancelBtnBorder:     'rgba(124,58,237,0.15)',
  cancelBtnText:       '#7c3aed',
  cancelBtnHover:      '#4c1d95',
  inactiveDiffBtn:     'rgba(124,58,237,0.06)',
  inactiveDiffBtnBorder: 'rgba(124,58,237,0.15)',
  hamburgerBg:         'rgba(124,58,237,0.1)',
  hamburgerColor:      '#7c3aed',
  emptyText:           '#9ca3af',
  loadingColor:        '#7c3aed',
  tableHeaderText:     '#a78bfa',
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
