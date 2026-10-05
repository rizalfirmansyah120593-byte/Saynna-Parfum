<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$apiKey = getenv('KOMERCE_SHIPPING_API_KEY') ?: '';
$search = trim((string)($_GET['search'] ?? ''));
if ($apiKey === '' || mb_strlen($search) < 3) {
  http_response_code(400);
  echo json_encode(['error' => 'Masukkan minimal 3 karakter lokasi.']);
  exit;
}

$url = 'https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?' . http_build_query(['search' => $search, 'limit' => 20, 'offset' => 0]);
$ch = curl_init($url);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15, CURLOPT_HTTPHEADER => ['key: ' . $apiKey]]);
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
http_response_code($status ?: 200);
echo $response ?: json_encode(['error' => 'Lokasi tidak ditemukan.']);
