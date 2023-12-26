function popstatefunction(event) {
    window.removeEventListener("popstate", popstatefunction);
    if (event?.type != "popstate") return;
    else window.history.go(-1);
    closeallmodals();
    // window.history.go(-2);
}
function closeallmodals() {
    let curloc = new URL(document.location.href);
    curloc.searchParams.delete("pop");
    // curloc.searchParams.append("pop", modalid);
    window.history.replaceState(null, document.title, curloc);
    const dialogs = document.querySelectorAll("dialog");
    dialogs.forEach((dialog) => {
        if (dialog.id != "mini_pop_window") dialog.close();
    });
    return;
}
export function openCloseModal(modalid, action, closemodalid) {
    let curloc = new URL(document.location.href);
    curloc.searchParams.delete("pop");
    if (modalid === "all") {
        popstatefunction("manually closed all!");
        // window.history.back();
        closeallmodals();
        return;
    }
    const modall = document.getElementById(modalid);
    if (action == "close" || action == "exit") {
        popstatefunction("manually closed!");
        window.history.back();
        return modall?.close();
    }
    if (action == "closeopen") {
        curloc.searchParams.append("pop", modalid);
        // document.location.
        window.history.replaceState(null, document.title, curloc);
        const modallclose = document.getElementById(closemodalid);
        window.addEventListener("popstate", popstatefunction);
        modallclose?.close();
        return modall?.showModal();
    }
    if (action == "openmini" || action == "opensmall") {
        curloc.searchParams.append("pop", modalid);
        window.history.pushState(null, document.title, curloc);
        window.addEventListener("popstate", popstatefunction);
        return modall?.show();
    }
    if (modalid) {
        // const dialogs = document.querySelectorAll("dialog");
        // dialogs.forEach((dialog) => dialog.close());
        curloc.searchParams.append("pop", modalid);
        window.history.pushState(null, document.title, curloc);
        modall?.showModal();
        window.addEventListener("popstate", popstatefunction);
    }
}
export function openCloseMiniPop(
    text = null,
    action = "open",
    classNamein = "",
    delay = 2000
) {
    let stamp = Date.now().toString();
    const poptext = document.getElementsByClassName("mini_pop_window_text");
    const pop = document.getElementsByClassName("mini_pop_window");
    const cc = `mini_pop_window open ${classNamein} ${stamp} `;
    if (action == "open") {
        for (let i = 0; i < pop.length; i++) {
            pop[i].className = cc;
            if (text) poptext[i].innerText = text;
        }
        setTimeout(() => {
            const popnow = document.getElementsByClassName("mini_pop_window");
            for (let i = 0; i < pop.length; i++) {
                if (popnow[i].className.includes(cc)) {
                    popnow[i].className = "mini_pop_window ";
                    // poptext[i].innerText = " ... ";
                } else {
                }
            }
        }, delay);
    } else {
        for (let i = 0; i < pop.length; i++) {
            pop[i].className = "mini_pop_window ";
            // poptext[i].innerText = "";
        }
    }
}
