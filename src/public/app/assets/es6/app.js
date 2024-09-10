import Core from "./core/core";
import ThemeConfigurator from "./theme-configurator/theme-configurator";

export default class Aism extends Core {
  constructor() {
    super();
    this.initThemeConfig();
  }

  initThemeConfig() {
    ThemeConfigurator.themeConfigurator();
  }
}

$(() => {
  window.Aism = new Aism();
});
