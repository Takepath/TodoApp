import { STATE, escapeHTML } from "../util.js";
import * as todoArea from "./todoArea.js";

//フィルター欄生成
export function create(){
    container.insertAdjacentHTML("beforeEnd",`
        <div id="filterArea" class="card topMargin">
            <div class="card-header">
                検索・絞り込み・並び替え
            </div>
            
            <div class="d-flex justify-content-around">
            <label id="keywordArea">
                キーワード<br>
                <input id="keyword" class="form-control" type="text">
            </label>
            <label>
                状態<br>
                <select id="filter" class="form-select">
                    <option value="all" >すべて</option>
                    <option value="non" >未完了</option>
                    <option value="fin" >完了</option>
                </select>
            </label>
            <label>
                期限<br>
                <select id="deadline" class="form-select">
                    <option value="all-dead">すべて</option>
                    <option value="within">期限内</option>
                    <option value="expired">期限切れ</option>
                </select>
            </label>
            <label>
                並び順<br>
                <select id="sort" class="form-select">
                    <option value="addition" >追加順</option>
                    <option value="long" >期日長い順</option>
                    <option value="short" >期日短い順</option>
                </select>
            </label>
            </div>
        </div>
    `);
}

export function addEvent(todos){
    ["keyword","filter","sort","deadline"].forEach(v=>{
        const tmp = document.getElementById(v);
        tmp.addEventListener("change",()=>{
            STATE[v] = escapeHTML(tmp.value);
            todoArea.reflesh(todos);
        });
    });
}

export function getData(todos){
    return sortData(filterData(todos));
}

//表示されるtodoデータを切り替える
function filterData(todos){
    let tmpArr;
    switch(STATE.filter){
        case "non": tmpArr = todos.filter(e=>!e.completed);
        break;
        
        case "fin": tmpArr = todos.filter(e=>e.completed);
        break;
        
        default : tmpArr = todos;
    }

    switch(STATE.deadline){
        case "within": tmpArr = tmpArr.filter(e=> new Date(`${e.dueDate}T${e.dueTime}`) > Date.now());
        break;

        case "expired": tmpArr = tmpArr.filter(e=> new Date(`${e.dueDate}T${e.dueTime}`) < Date.now());
        break;
    }

    return tmpArr.filter(v=> v.title.includes(STATE.keyword));
}

//表示されるtodoデータを並び替える
function sortData(todos){
    const tmp = todos;
    
    switch(STATE.sort){
        case "long":return tmp.sort((a,b) => {
            const aDate = new Date(`${a.dueDate}T${a.dueTime}`);
            const bDate = new Date(`${b.dueDate}T${b.dueTime}`);
            return bDate - aDate;
        });
        
        case "short":return tmp.sort((a,b) => {
            const aDate = new Date(`${a.dueDate}T${a.dueTime}`);
            const bDate = new Date(`${b.dueDate}T${b.dueTime}`);
            return aDate - bDate;
        });
        
        default : return todos;
    }
}