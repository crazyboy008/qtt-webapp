module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    // "transform-runtime",
    // "transform-decorators-legacy",
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant'],
    ["import", {
      "libraryName": "mand-mobile",
      "libraryDirectory": "lib",
      // "style": true
    }]
  ]
}
