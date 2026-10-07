import * as display from "./display.js";
import * as storage from "../storage.js";
import { checkInput } from "./inputArea.js";
import { escapeHTML } from "../util.js";

//編集用モーダルウィンドウ生成
export function create(todo){
    const hour = Array.from({ length : 24 }, (_,i) => i);
    const time = Array.from({ length : 12 }, (_,i) => i*5);
    const overlay = document.createElement("div");
    overlay.id = "editModal";
    overlay.classList.add("edit-modal-overlay");
    
    overlay.innerHTML = `
        <div class="edit-modal-window">
            <div class="edit-modal-title">
                Todoを編集
            </div>

            <div class="edit-modal-body">
                <label>
                    タスク名<br>
                    <input id="editTitleInput" class="form-control" type="text" value="${escapeHTML(todo.title)}">
                </label>
                <div id="time-area" class="d-flex justify-content-around">
                    <label>
                        期限日<br>
                        <input type="date" id="editDateInput" class="form-control" value="${todo.dueDate}">
                    </label>
                    <label>
                        期限時間<br>
                        <select class="form-select" id="editTimeInput">
                            <option value="0">時間を選択</option>
                            ${hour.map(h=>{
                                return time.map(t=>{
                                    const time = `${String(h).padStart(2,"0")}:${String(t).padStart(2,"0")}`;
                                    return `
                                    <option value="${time}" ${(time === todo.dueTime)? "selected":""}>
                                        ${time}
                                    </option>`;
                                }).join("");
                            }).join("")}
                        </select>
                    </label>
                </div>
            </div>

            <div class="edit-modal-footer">
                <button id="editCancel" class="btn btn-secondary" type="button">
                    キャンセル
                </button>

                <button id="editConfirm" class="btn btn-primary" type="button">
                    確定
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

export function addEvent(todo){
    const overlay = document.getElementById("editModal");
    const title = document.getElementById("editTitleInput");
    const date = document.getElementById("editDateInput");
    const time = document.getElementById("editTimeInput");
    const cancel = document.getElementById("editCancel");
    const confirmBtn = document.getElementById("editConfirm");

    title.focus();
    title.select();
    cancel.addEventListener("click",()=>overlay.remove());

    confirmBtn.addEventListener("click",async()=>{
        const inputDate = checkInput(title,date,time);
        if(!inputDate) return;

        const newTodo = {
            id: todo.id,
            title: escapeHTML(title.value),
            completed: todo.completed,
            dueDate: date.value,
            dueTime: time.value,
            allDay:todo.allDay,
            createdAt:todo.createdAt,
        };
        await storage.update([newTodo]);
        await display.show();
        overlay.remove();
    });
}