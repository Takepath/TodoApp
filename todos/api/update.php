<?php
header("Content-Type: application/json; charset=UTF-8");

$file = __DIR__ . "/todos.json";
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    http_response_code(400);
    echo json_encode(["message" => "IDがありません。"], JSON_UNESCAPED_UNICODE);
    exit;
}

$todos = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
$updated = false;

foreach ($todos as &$todo) {
    if ($todo["id"] == $data["id"]) {
        if (isset($data["title"])) $todo["title"] = $data["title"];
        if (isset($data["completed"])) $todo["completed"] = $data["completed"];
        if (isset($data["dueDate"])) $todo["dueDate"] = $data["dueDate"];
        if (isset($data["dueTime"])) $todo["dueTime"] = $data["dueTime"];
        if (isset($data["allDay"])) $todo["allDay"] = $data["allDay"];
        $updated = true;
        break;
    }
}
    
unset($todo);

if (!$updated) {
    http_response_code(404);
    echo json_encode(["message" => "ToDoが見つかりません。"], JSON_UNESCAPED_UNICODE);
    exit;
}

file_put_contents($file, json_encode($todos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

echo json_encode($todos, JSON_UNESCAPED_UNICODE);