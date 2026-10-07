import * as display from "./UI/display.js"

//ページ読み込み時動作
document.addEventListener("DOMContentLoaded",async()=>{
    try{
        const mediaQuery = window.matchMedia("(max-width: 1023px)");
        mediaQuery.addEventListener("change",await display.changeMedia);
        await display.show();
        await display.changeMedia(mediaQuery);
    }catch(e){
        display.err(e);
    }
});