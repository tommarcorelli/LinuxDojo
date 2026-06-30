// sw-register.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then(() => console.log("[LinuxDojo] Service Worker enregistré"))
      .catch(e => console.warn("[LinuxDojo] SW non enregistré :", e));
  });
}
