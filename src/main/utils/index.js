function generateErrorLogMessage(app, os, electron, errStack) {
  return `App: ${app}\n\tOS: ${os}\n\tElectron: ${electron}\n\tError: ${errStack}`;
}

function translate(locale, selector, resources) {
  const selectors = selector.split('.');
  let nowData = resources[locale];
  for (const selector of selectors) {
    if (nowData[selector]) {
      nowData = nowData[selector];
    }
  }
  return nowData;
}

export {
  generateErrorLogMessage,
  translate,
};
