<?php
header("Content-Type: application/json; charset=UTF-8");

$file = __DIR__ . "/todos.json";

if (!file_exists($file)) {
    echo json_encode([]);
    exit;
}

$data = json_decode(file_get_contents($file), true);

if (!is_array($data)) {
    $data = [];
}

echo json_encode($data, JSON_UNESCAPED_UNICODE);