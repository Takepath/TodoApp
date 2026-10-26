import * as storage from "../storage.js";

//件数表示欄生成
export function create(todos) {
    const container = document.getElementById("container");
    const countArea = document.createElement("div");
    countArea.id = "CountArea";
    countArea.classList.add("topMargin");

    countArea.innerHTML = `
        <div class="bg-secondary bg-opacity-50">
            全て：${todos.length}件
        </div>
        <div class="bg-warning bg-opacity-50">
            未完了：${todos.filter(e => !e.completed).length}件
        </div>
        <div class="bg-success bg-opacity-50">
            完了：${todos.filter(e => e.completed).length}件
        </div>
    `;

    container.insertBefore(countArea, document.getElementById("filterArea"));
}

export async function reflesh(){
    document.getElementById("CountArea")?.remove();
    create(await storage.get());
}