//入力時エスケープ処理
export function escapeHTML(text) {   
    return text
    .replaceAll(/&/g, "&amp;")     
    .replaceAll(/</g, "&lt;")     
    .replaceAll(/>/g, "&gt;")     
    .replaceAll(/"/g, "&quot;")     
    .replaceAll(/'/g, "&#039;"); 
}

//各ステータス状況
export const STATE = {
    filter: "all",  // all , non , fin
    deadline: "all-dead",//all-dead , within , expired
    sort: "addition", // addition , long , short
    keyword: "", //絞り込み用キーワード
    display: true, //container要素を表示するかのフラグ
};

//日本の祝日イベントまとめてtodoオブジェクトとして取得
const MAXYEAR = new Date().getFullYear() + 1;
export async function jpHolidays(year){
    const result = [];
    let url = "";
    if(!year || year > MAXYEAR || year < 1955){ //全件取得
        url = `https://holiday.omikuji.dev/api/v1/holidays.json`;
    }else{ //特定年数取得
        url = `https://holiday.omikuji.dev/api/v1/${year}.json`;
    }
    
    return fetch(url)
    .then(res=>{
        if(res.ok)return res.json();
        else throw new Error("祝日サイトへの接続が失敗しました");
    })
    .then(data=>{
        return Object.entries(data).map(([key, value])=> ({
            title: value,
            completed: false,
            dueDate: key,
            dueTime: "00:00",
            allDay: true,
        }));
    })
    .catch(e=>console.error(e));
}