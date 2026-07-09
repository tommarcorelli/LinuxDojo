// sw-register.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // La page était-elle déjà pilotée par un SW ? (sinon = toute première visite,
    // pas besoin de bannière : il n'y a rien à "mettre à jour" pour l'utilisateur)
    const hadController = !!navigator.serviceWorker.controller;
    let refreshing = false;

    const showUpdateBanner = (reg) => {
      const banner = document.getElementById("update-banner");
      if (!banner) return; // sécurité si l'élément n'existe pas encore
      banner.style.display = "flex";
      const btn = document.getElementById("update-banner-btn");
      const dismiss = document.getElementById("update-banner-dismiss");
      btn.onclick = () => {
        btn.disabled = true;
        btn.textContent = "Rechargement…";
        if (reg.waiting) reg.waiting.postMessage("SKIP_WAITING");
      };
      dismiss.onclick = () => { banner.style.display = "none"; };
    };

    const watchInstalling = (reg, worker) => {
      worker.addEventListener("statechange", () => {
        // "installed" + un contrôleur déjà présent = vraie mise à jour (pas 1re install)
        if (worker.state === "installed" && hadController) showUpdateBanner(reg);
      });
    };

    navigator.serviceWorker.register("sw.js")
      .then(reg => {
        reg.update(); // vérif de mise à jour à chaque chargement
        if (reg.waiting && hadController) showUpdateBanner(reg);
        if (reg.installing) watchInstalling(reg, reg.installing);
        reg.addEventListener("updatefound", () => { if (reg.installing) watchInstalling(reg, reg.installing); });
        console.log("[LinuxDojo] Service Worker enregistré");
      })
      .catch(e => console.warn("[LinuxDojo] SW non enregistré :", e));

    // Le nouveau SW prend le contrôle (après clic sur "Recharger") → on recharge.
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}
