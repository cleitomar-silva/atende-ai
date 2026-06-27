<?php

$rota = $_GET['rota'] ?? '';

$paginas = [
    ''              => 'paginas/inicio.php',
    'inicio'        => 'paginas/inicio.php',
    'processo'      => 'paginas/processo.php',
    'processo-novo' => 'paginas/processo-novo.php',
    'chamados'      => 'paginas/chamados.php',
];

if (isset($paginas[$rota])) {

    $conteudo = $paginas[$rota];
    include 'includes/layout.php';

} else {

    http_response_code(404);
    $conteudo = 'paginas/404.php';
    include $conteudo;

}