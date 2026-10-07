import * as storage from "../storage.js";
import * as modal from "./modal.js";
import * as countArea from "./countArea.js";
import * as filter from "./filter.js";
import * as calendar from "../calendar.js";
import { jpHolidays } from "../util.js";

//ｔｏｄｏ一覧を表示する場所を生成
export function create(todos){
    const container = document.getElementById("container");
    container.insertAdjacentHTML("beforeEnd",`
        <table id="todoArea">
            <thead>
                <tr>
                    <th id="title">todo一覧</th>
                    <th id="btn-space">
                        <label >
                            年(祝日)<br>
                            <input 
                                id="holidayYear" 
                                class="form-control" 
                                type="number" 
                                min="1955" 
                                max="${new Date().getFullYear() + 1}" 
                                step="1" 
                                value="${new Date().getFullYear()}"
                            >
                        </label>
                        <div class="d-flex flex-column">
                            <button id="holiday" class="btn btn-outline-info" type="button">
                                追加
                            </button>
                            <button id="delHoliday" class="btn btn-outline-danger" type="button">
                                削除
                            </button>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                ${todos.map(todo=>{
                    return `
                    <tr>
                        <td class="text">
                            ${todo.title}
                            ${new Date(`${todo.dueDate}T${todo.dueTime}`) > Date.now()?
                            `<p class="limit">期限 :`:
                            `<p class="limit redText">期限切れ :`
                        }
                             ${todo.dueDate} ${todo.dueTime}</p>
                        </td>
                        <td class="btns">
                            <button class="finish" type="button">
                                ${todo.completed ? "未完了" :"完了"}
                            </button>
                            <button class="edit btn btn-primary" type="button">編集</button>
                            <button class="delete btn btn-danger" type="button">削除</button>
                        </td>
                    </tr>`;
                }).join("")}
                
            </tbody>
        </table>
    `);
}

export function addEvent(displayTodos,allTodos){
    //祝日イベント追加ボタン動作
    document.getElementById("holiday").addEventListener("click",async()=>{
        const todos = await jpHolidays(document.getElementById("holidayYear").value);
        for (const todo of todos) {//mapで処理していたがawaitを待たないのでエラー
            await storage.create(todo);
        }
        await reflesh();
    });

    //祝日イベント削除ボタン動作
    document.getElementById("delHoliday").addEventListener("click",async()=>{
        const year = document.getElementById("holidayYear").value;
        const holidayTodos = await jpHolidays(year);
        const todos = await storage.get();

        for(const htodo of holidayTodos){
            for(const todo of todos){
                if(todo.title === htodo.title && todo.dueDate === htodo.dueDate){
                    await storage.remove(todo.id);
                }
            }
        } 
        console.log(`${year}年の祝日を削除しました。`);
        await reflesh();
    });
    
    //完了・未完了ボタン切り替え動作
    const finishes = Array.from(document.getElementsByClassName("finish"));
    const text = document.querySelectorAll(".text");
    finishes.forEach((btn,i)=>{
        text[i].classList.toggle("lineThrough",displayTodos[i].completed);
        btn.classList.add("btn",(displayTodos[i].completed)?"btn-warning":"btn-success");
        
        btn.addEventListener("click",async()=>{
            const todo = displayTodos[i];
            const target = allTodos.find(e => e.id === todo.id);

            target.completed = !target.completed;
            btn.textContent =(!target.completed)? "完了":"未完了";
            text[i].classList.toggle("lineThrough");
            btn.classList.toggle("btn-success");
            btn.classList.toggle("btn-warning");

            allTodos = await storage.update(allTodos);
            await reflesh();
        });
    });

    //削除ボタン動作
    const deletes = Array.from(document.getElementsByClassName("delete"));
    deletes.forEach((btn,i)=>{
        btn.addEventListener("click",async()=>{
            if(confirm("本当に削除しますか？")){
                const todo = displayTodos[i];
                
                console.log(await storage.remove(todo.id));
                await reflesh();
            }
        });
    });

    //編集ボタン動作
    const edits = Array.from(document.getElementsByClassName("edit"));
    edits.forEach((btn,i)=>{
        btn.addEventListener("click",()=>{
            const todo = displayTodos[i];
            const target = allTodos.find(e => e.id === todo.id);
            modal.create(target);
            modal.addEvent(target);
        });
    });
}


export async function reflesh(){
    const todos = await storage.get();
    document.getElementById("todoArea")?.remove();
    const filterTodo = filter.getData(todos);
    create(filterTodo);
    addEvent(filterTodo , todos);
    await countArea.reflesh();
    calendar.removeEvent();
    calendar.addEvent(todos);
}