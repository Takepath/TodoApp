const URL = "./api/";

export async function get(){
    const res = await fetch(`${URL}get.php`);
    
    if(!res.ok)throw new Error("Todoの取得に失敗しました");
    return res.json();
}

export async function create(todo){
    const res = await fetch(`${URL}create.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: todo.title,
            completed: todo.completed,
            dueDate: todo.dueDate,
            dueTime: todo.dueTime,
            allDay:todo.allDay,
        }),
    });

    const text = await res.text();
    let result;

    try {
        result = JSON.parse(text);
    } catch (e) {
        console.error("PHPから返されたデータ:", text);
        throw new Error(`サーバーからJSONではないデータが返されました。HTTP ${res.status}`);
    }
    if(!res.ok)throw new Error(result.message);
    return result;
}

export async function remove(id){
    const res = await fetch(`${URL}delete.php`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id}),
    });
    
    if(!res.ok)throw new Error("Todoの削除に失敗しました");
    return `Todo${id}を削除しました`;
}

export async function update(todos){
    let result;
    for(const todo of todos){
        const res = await fetch(`${URL}update.php`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: todo.id,
                title: todo.title,
                completed: todo.completed,
                dueDate: todo.dueDate,
                dueTime: todo.dueTime,
                allDay:todo.allDay,
            }),
        });

        if(!res.ok) throw new Error("Todoの更新に失敗しました");
        result = await res.json();
    }
    return result;
}

//localStorageを使用する場合
//import {Todo} from "./Todo.js";
// const KEY = "todos";
// export function save(todos){
    //     localStorage.setItem(KEY,JSON.stringify(todos));
    // }
    
    // export function get(){
        //     return (localStorage.getItem(KEY))?
        //                 JSON.parse(localStorage.getItem(KEY)):
//                 [new Todo("JavaScriptの勉強")];
// }