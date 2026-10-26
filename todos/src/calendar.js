import * as display from "./UI/display.js";
import * as storage  from "./storage.js";

const calendarEl = document.getElementById('calendar');
const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',//最初にどのカレンダーを表示するか
    locale:"ja",//カレンダーの表示言語
    timeZone: 'Asia/Tokyo',//タイムゾーンの設定
    firstDay: 1,//何曜日始まりか。0 → 日曜日。
    weekends: true,//土日を表示するか
    expandRows: true,//行をコンテナいっぱいに広げて表示するか
    dayMaxEvents: 3,//１日に表示する最大イベント数
    moreLinkClick: 'popover',//省略されたイベントクリック時の動作。該当箇所へ遷移させる"week"などもある。
    fixedWeekCount: false,//月の表示を必ず６週間で固定するか
    showNonCurrentDates: true,//現在の月以外の日付も表示するか。(例:31 1 2～)
    scrollTime: '09:00:00',//時間表示時に何時から開くか
    slotDuration: '00:30:00',//時間表示時に何分ごとに表示するか
    slotEventOverlap: false,//時間が重なるイベントを重ねて表示するか
    allDaySlot: true,//時間表示時に終日イベントを表示するか
    allDayText: '終日',//終日イベント表示時のラベル名
    eventDisplay: 'block',//イベントの表示方法。[auto,block,list-item,background,inverse-background,none]
    eventOrder: 'start,-duration,title',//イベントの並び順
    eventOverlap: false,//イベントの重複を許可するか
    selectable: true,//日付の範囲をドラッグで選択できるか
    dragScroll: true,//ドラッグ中に自動スクロールするか
    unselectAuto: true,//カレンダー外をクリックしたときに自動でドラッグ範囲を選択解除するか
    editable: false,//イベントをドラッグで操作可能にするか
    nowIndicator: true,//現在時刻を赤線で表示するか
    borderless: false,//表の枠線を消すか
    headerToolbarClass: 'calendar-toolbar',//ツールバーのクラス設定
    toolbarSectionClass: 'calendar-toolbar-section',//ツールバーの中の要素に対するクラス設定
    
    headerToolbar: { //ヘッダーに表示する設定
        left: 'today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listYear'
    },
    footerToolbar: { //フッターに表示する設定
        center: "prev,next",
    },
    titleFormat: { //表のタイトルの表示形式
        month: "numeric",//numeric(最小の表示→9),2-digit(2桁表示→09),short(9月・Sepのような表示)
        day: "numeric",
    },
    buttons: { //ボタンに関する設定（Ver.7から実装）
        prev: { className: "calendar-prev" },
        next: { className: "calendar-next" },
        today: { text: 'Today' },
        dayGridMonth: { text: '月' },
        timeGridWeek: { text: '週'},
        timeGridDay: { text: '日' },
        listYear: { text: '一覧' },
    },
    views: { //カレンダー毎の表示に対する個別設定
        dayGridMonth: {
            titleFormat: {//月のみの表示にする
                month: 'long',
            }
        },
        listYear:{
            titleFormat: {//年のみの表示にする
                year: 'numeric',
            }
        },
    },
    
    eventClick:async (info)=> { //イベントをクリックしたときの動作
        const ev = info.event;
        const date = new Date(ev.start);
        const todo = {
            id: ev.id,
            title: ev.title,
            completed: !ev.extendedProps.completed,
            dueDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`,
            dueTime: `${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}`,
            allDay: ev.allDay,
        };

        await storage.update([todo]);
        await display.show();
    },
    eventMouseEnter: (info)=> { //イベントにマウスホバーした時の動作
        //マウスカーソルにタイトルを表示する
        info.el.setAttribute('title', info.event.title);
    },
    eventMouseLeave: (info) => { //イベントのマウスホバーが外れた時の動作

    },
    eventDidMount: (info)=> { //新規イベントDOMが作成された時の動作
        // console.log(info.el);
        if(info.event.extendedProps.completed === true){
            info.el.classList.add("event-completed");
        }
    },
    dateClick: (info)=> { //日付クリック時の動作
        // console.log(info.dateStr);
    },
    select: (info)=> { //ドラッグで選択された時の動作。1つ(クリック)でも動作する。
        // console.log(info.start);
        // console.log(info.end);
    },
    unselect: ()=> { //範囲が選択解除された時の動作。範囲を選択した状態で新規範囲を選択したときにも発火する。
        // document.querySelector(".event-tooltip")?.remove();
    },
    datesSet: (info)=> { //表示している期間を変更したときの動作
        // document.querySelector(".event-tooltip")?.remove();
    },
    dayHeaderContent: (info)=> { //曜日ヘッダーの内容
        return {
            html: `<b>${info.text}</b>`
        };
    },
    dayHeaderClass: (info)=>{//曜日ヘッダーのクラス設定
        switch(info.dow){
            case 0: return "calendar-header-sun";
            case 6: return "calendar-header-sat";
            default: return "calendar-header";
        }
    },
});


export function render(){
    calendar.render();
}

export function addEvent(todos){
    todos.forEach(todo => {
        const id = String(todo.id);//idを文字列として扱う
        if(calendar.getEventById(id)) return;//重複イベントは追加しない
        
        calendar.addEvent({
            id: id,
            title: todo.title,
            start: `${todo.dueDate}T${todo.dueTime}`,
            allDay: todo.allDay,

            extendedProps: {//イベントに関係ないフィールドを格納
                completed: todo.completed,
                createdAt: todo.createdAt
            }
        });
    });
}

export function removeEvent(id){
    calendar.getEvents().forEach(e=>{
        if(!id || id === e.id) e.remove();
    });
}