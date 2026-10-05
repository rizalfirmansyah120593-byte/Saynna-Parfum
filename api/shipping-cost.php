<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$apiKey = getenv('KOMERCE_SHIPPING_API_KEY') ?: '';
$origin = getenv('KOMERCE_ORIGIN_ID') ?: '';
$destination = filter_input(INPUT_GET, 'destination', FILTER_VALIDATE_INT);
$weight = filter_input(INPUT_GET, 'weight', FILTER_VALIDATE_INT) ?: 300;
$courier = preg_replace('/[^a-z0-9,]/', '', strtolower((string)($_GET['courier'] ?? 'jne,jnt')));

if ($apiKey === '' || $origin === '' || !$destination || $weight < 1) {
  http_response_code(400);
  echo json_encode(['error' => 'Konfigurasi ongkir belum lengkap. Isi API key, origin ID, destination ID, dan berat paket.']);
  exit;
}

$payload = http_build_query([
  'origin' => $origin,
  'destination' => $destination,
  'weight' => $weight,
  'courier' => $courier,
  'price' => 'lowest'
]);

$ch = curl_init('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost');
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_POSTFIELDS => $payload,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 15,
  CURLOPT_HTTPHEADER => ['key: ' . $apiKey, 'Content-Type: application/x-www-form-urlencoded']
]);
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($response === false || $error) {
  http_response_code(502);
  echo json_encode(['error' => 'Layanan ongkir sedang tidak tersedia.']);
  exit;
}

http_response_code($status ?: 200);
echo $response;
