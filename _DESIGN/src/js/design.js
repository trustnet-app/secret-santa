(function () {
  'use strict';

  var root = document.documentElement;
  var STYLE_KEY = 'design-style';
  var THEME_KEY = 'design-theme';
  var STYLES = ['v1', 'v2'];
  var THEMES = ['light', 'dark'];

  function read(key, allowed, fallback) {
    try {
      var value = localStorage.getItem(key);
      return allowed.indexOf(value) !== -1 ? value : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function applyStyle(style) {
    root.setAttribute('data-style', style);
    var label = document.querySelector('[data-style-label]');
    if (label) label.textContent = style;
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var label = document.querySelector('[data-theme-label]');
    if (label) label.textContent = theme;
  }

  function cycle(list, current) {
    return list[(list.indexOf(current) + 1) % list.length];
  }

  var style = read(STYLE_KEY, STYLES, root.getAttribute('data-style') || 'v2');
  var theme = read(THEME_KEY, THEMES, root.getAttribute('data-theme') || 'light');
  applyStyle(style);
  applyTheme(theme);

  var styleButton = document.querySelector('[data-toggle="style"]');
  if (styleButton) {
    styleButton.addEventListener('click', function () {
      style = cycle(STYLES, style);
      applyStyle(style);
      write(STYLE_KEY, style);
    });
  }

  var themeButton = document.querySelector('[data-toggle="theme"]');
  if (themeButton) {
    themeButton.addEventListener('click', function () {
      theme = cycle(THEMES, theme);
      applyTheme(theme);
      write(THEME_KEY, theme);
    });
  }
})();
