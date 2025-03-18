const link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = chrome.runtime.getURL("./dist/index.css");
(document.head || document.documentElement).appendChild(link);

const script = document.createElement("script");
script.src = chrome.runtime.getURL("./dist/index.js");
(document.head || document.documentElement).appendChild(script);

setTimeout(() => {
  console.log("TIMEOUT", window.SDK);
}, 5000);
