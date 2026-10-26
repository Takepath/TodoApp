import { Todo } from "../Todo.js";
import { escapeHTML } from "../util.js";
import * as storage from "../storage.js";
import * as todoArea from "./todoArea.js";
import * as countArea from "./countArea.js";

//入力欄生成
export function create(){
    const container = document.getElementById("container");
    const hour = Array.from({ length : 24 }, (_,i) => i);
    const time = Array.from({ length : 12 }, (_,i) => i*5);

    container.insertAdjacentHTML("beforeEnd", `
    <div id="inputArea" class="card topMargin">
        <div class="card-header">ToDo登録</div>
        <label id="task-area" >
            タスク名<br>
            <input type="text" id="task-input" class="form-control">
        </label>
        <div id="time-area" class="d-flex justify-content-around">
            <label>
                期限日<br>
                <input type="date" id="date" class="form-control">
            </label>
            <label>
                期限時間<br>
                <select class="form-select" id="time">
                    <option value="0">時間を選択</option>
                    ${hour.map(h=>{
                        return time.map(t=>{return `
                            <option value="${String(h).padStart(2,"0")}:${String(t).padStart(2,"0")}">
                                ${String(h).padStart(2,"0")}:${String(t).padStart(2,"0")}
                            </option>`;
                        }).join("");
                    }).join("")}
                </select>
            </label>
        </div>
        <button type="button" id="input-btn">追加</button>
    </div>
    `);
}

export function addEvent(){
    //入力場所
    const title = document.getElementById("task-input");
    const date = document.getElementById("date");
    const time = document.getElementById("time");
    
    //追加ボタン
    const btn = document.getElementById("input-btn");
    btn.classList.add("btn","btn-primary");
    
    btn.addEventListener("click",async()=>{
        const inputDate = checkInput(title,date,time);
        if(!inputDate) return;
        
        await storage.create(
            new Todo(
                escapeHTML(title.value),
                inputDate
            )
        );
        await countArea.reflesh();
        await todoArea.reflesh();
        title.value = "";
        date.value = "";
        time.value = "0";
    });
}

export function checkInput(title,date,time){
    //すべての項目が入力されていなければ動作させない
    if(!date.value || time.value == 0 || title.value === ""){
        window.alert("すべての項目を埋めてください");
        return false;
    }
    
    const now = new Date();
    const inputDate = new Date(`${date.value}T${time.value}`);
    if(inputDate - now < 0){
        window.alert("設定期限が過去の日付になっています");
        return false;
    }
    
    return inputDate;
}