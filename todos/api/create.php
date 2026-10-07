<?php
header("Content-Type: application/json; charset=UTF-8");

$file = __DIR__ . "/todos.json";
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["allDay"],$data["completed"],$data["title"], $data["dueDate"], $data["dueTime"])) {
    http_response_code(400);
    echo json_encode(["message" => "必要なデータがありません。"], JSON_UNESCAPED_UNICODE);
    exit;
}

$todos = [];

if (file_exists($file)) {
    $json = file_get_contents($file);
    $todos = json_decode($json, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($todos)) {
        http_response_code(500);
        echo json_encode([
            "message" => "todos.json のJSONが壊れています。",
            "error" => json_last_error_msg()
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

//インデックス再利用ロジック
$newId = 1;
while (true) {
    $exists = false;

    foreach ($todos as $todo) {
        if ($todo["id"] == $newId) {
            $exists = true;
            break;
        }
    }
    if (!$exists) break;
    $newId++;
}

// 重複削除
foreach ($todos as $existing) {
    if (
        $existing["title"] === $data["title"] &&
        $existing["dueDate"] === $data["dueDate"]
    ) {
        echo json_encode($existing, JSON_UNESCAPED_UNICODE);
        exit;
    }
}

$todo = [
    "id" => $newId,
    "title" => $data["title"],
    "completed" => $data["completed"],
    "dueDate" => $data["dueDate"],
    "dueTime" => $data["dueTime"],
    "allDay" => $data["allDay"],
    "createdAt" => round(microtime(true) * 1000)
];

$todos[] = $todo;

file_put_contents($file, json_encode($todos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);

echo json_encode($todo, JSON_UNESCAPED_UNICODE);