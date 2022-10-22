const { TTScraper } = require("./dist/main");

const scraper = new TTScraper();

(async () => {
  const test = await scraper.video("https://vm.tiktok.com/ZMNcstcjU/", true);
  console.log(test);
})();
