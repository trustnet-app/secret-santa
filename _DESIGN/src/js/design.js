(function () {
  'use strict';

  var root = document.documentElement;
  var STYLE_KEY = 'design-style';
  var THEME_KEY = 'design-theme';
  var STYLES = ['v1', 'v2', 'v3'];
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

  var styleLock = root.getAttribute('data-style-lock');
  var style = styleLock || read(STYLE_KEY, STYLES, root.getAttribute('data-style') || 'v2');
  var theme = read(THEME_KEY, THEMES, root.getAttribute('data-theme') || 'light');
  applyStyle(style);
  applyTheme(theme);

  var styleButton = document.querySelector('[data-toggle="style"]');
  if (styleButton) {
    if (styleLock) {
      styleButton.disabled = true;
      styleButton.title = 'This screen uses a locked style';
    } else {
      styleButton.addEventListener('click', function () {
        style = cycle(STYLES, style);
        applyStyle(style);
        write(STYLE_KEY, style);
      });
    }
  }

  var themeButton = document.querySelector('[data-toggle="theme"]');
  if (themeButton) {
    themeButton.addEventListener('click', function () {
      theme = cycle(THEMES, theme);
      applyTheme(theme);
      write(THEME_KEY, theme);
    });
  }

  // Screen states are review-only: the bar toggles panels, organiser/member
  // views, and the nav auth action without leaving the catalogue page.
  var statebar = document.querySelector('[data-state-switcher]');
  if (statebar) {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-state-panel]'));
    var stateButtons = Array.prototype.slice.call(statebar.querySelectorAll('[data-state-target]'));

    function applyState(target) {
      var active = null;
      stateButtons.forEach(function (button) {
        var on = button.getAttribute('data-state-target') === target;
        button.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on) active = button;
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-state-panel') !== target;
      });
      if (!active) return;

      var view = active.getAttribute('data-view');
      if (view) root.setAttribute('data-view', view);

      var navState = active.getAttribute('data-nav-state');
      if (navState) {
        Array.prototype.forEach.call(document.querySelectorAll('[data-nav-for]'), function (item) {
          item.hidden = item.getAttribute('data-nav-for') !== navState;
        });
      }
    }

    stateButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        applyState(button.getAttribute('data-state-target'));
      });
    });

    if (stateButtons.length) {
      applyState(stateButtons[0].getAttribute('data-state-target'));
    }
  }
})();
