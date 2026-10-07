import * as storage from "../storage.js";
import * as inputArea from "./inputArea.js"
import * as filter from "./filter.js";
import * as countArea from "./countArea.js";
import * as todoArea from "./todoArea.js";
import * as calendar from "../calendar.js";
import { STATE } from "../util.js";

export async function show(){
    //container配下の要素をすべて削除
    document.getElementById("container")?.replaceChildren();
    const todos = await storage.get();

    if(STATE.display){
        inputArea.create();
        inputArea.addEvent();

        filter.create();
        filter.addEvent(todos);
        
        countArea.create(todos);
        
        todoArea.create(todos);
        todoArea.addEvent(todos,todos);
    }
    
    //renderは一度だけ実行
    if(!document.querySelector("#calendar > div")){
        calendar.render();
    }
    calendar.removeEvent();
    calendar.addEvent(todos);
}

//ページサイズによって非表示ボタンの表示を切り替える
//resizeイベントは発火回数が多くなるので特定の大きさのみで発火させる
export async function changeMedia(event){
    const target = document.querySelector("header");
    if(event.matches){
        //スマホ・タブレット表示
        const img = document.createElement("img");
        const flg = STATE.display;
        img.src = flg? "imgs/up.png" : "imgs/down.png";
        img.id = flg? "upBtn" : "downBtn";
        img.title = flg? "収納" : "表示";
        img.tabIndex = 0;
        
        img.addEventListener("click",async()=> {
            STATE.display = !STATE.display;
            const flg = STATE.display;
            img.src = flg? "imgs/up.png" : "imgs/down.png";
            img.id = flg? "upBtn" : "downBtn";
            img.title = flg? "収納" : "表示";
            show();
        });
        
        //Enterキーでもクリックイベントを発火するように
        img.addEventListener("keydown", e=> {
            if (e.key === "Enter") img.click();
        });
        
        target.append(img);
        target.classList.add("topMargin");
    }else{
        //PC表示
        STATE.display = true;
        target.removeChild(target.lastChild);
        target.classList.remove("topMargin");
        show();
    }
}

export function err(e){
    console.error(e);
    document.getElementById("container").innerHTML = `
        <p style="color:red; 
                  font-size: 32px;
                  font-weight: bold;">
            エラーが発生しました。<br>
            お急ぎの場合は管理者へ連絡してください。
        </p>
        `;
}