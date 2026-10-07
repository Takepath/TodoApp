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
$newTodos = [];
$deleted = false;

foreach ($todos as $todo) {
    if ($todo["id"] == $data["id"]) {
        $deleted = true;
        continue;
    }
    $newTodos[] = $todo;
}

if (!$deleted) {
    http_response_code(404);
    echo json_encode(["message" => "ToDoが見つかりません。"], JSON_UNESCAPED_UNICODE);
    exit;
}

file_put_contents($file, json_encode($newTodos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

echo json_encode(["message" => "削除しました。"], JSON_UNESCAPED_UNICODE);