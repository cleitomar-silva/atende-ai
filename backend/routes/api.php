<?php

use App\Http\Controllers\Api\AuditController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ClassificationController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\IndicatorController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SectorController;
use App\Http\Controllers\Api\SituationController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Rotas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register/company', [AuthController::class, 'registerCompany']);
Route::post('/register/sector', [AuthController::class, 'registerSector']);
Route::post('/register/user', [AuthController::class, 'registerUser']);

// Rotas autenticadas
Route::middleware(['api.auth'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/search', SearchController::class);

    // Empresa — visualização para todos, edição apenas admin
    Route::get('/company', [CompanyController::class, 'show']);
    Route::put('/company', [CompanyController::class, 'update'])->middleware('api.admin');

    // Listagens para filtros, combos e abertura de chamados (todos autenticados)
    Route::get('/sectors', [SectorController::class, 'index']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/groups', [GroupController::class, 'index']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/situations', [SituationController::class, 'index']);
    Route::get('/classifications', [ClassificationController::class, 'index']);

    // Administração (somente admin); GET de setores/situações/categorias/grupos/
    // classificações permanece acessível para filtros e abertura de chamados.
    Route::middleware(['api.admin'])->group(function () {
        Route::post('/sectors', [SectorController::class, 'store']);
        Route::put('/sectors/{id}', [SectorController::class, 'update']);
        Route::delete('/sectors/{id}', [SectorController::class, 'destroy']);

        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        Route::post('/groups', [GroupController::class, 'store']);
        Route::put('/groups/{id}', [GroupController::class, 'update']);
        Route::delete('/groups/{id}', [GroupController::class, 'destroy']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        Route::post('/situations', [SituationController::class, 'store']);
        Route::put('/situations/{id}', [SituationController::class, 'update']);
        Route::delete('/situations/{id}', [SituationController::class, 'destroy']);

        Route::post('/classifications', [ClassificationController::class, 'store']);
        Route::put('/classifications/{id}', [ClassificationController::class, 'update']);
        Route::delete('/classifications/{id}', [ClassificationController::class, 'destroy']);

        Route::get('/audits', [AuditController::class, 'index']);
        Route::post('/audits/{id}/undo', [AuditController::class, 'undo']);
    });

    // Chamados
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::put('/tickets/{id}', [TicketController::class, 'update']);
    Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);
    Route::post('/tickets/{id}/comments', [TicketController::class, 'addComment']);
    Route::post('/tickets/{id}/situation', [TicketController::class, 'changeSituation']);
    Route::get('/tickets/{id}/attachments/{attachmentId}/download', [TicketController::class, 'downloadAttachment']);
    Route::delete('/tickets/{id}/attachments/{attachmentId}', [TicketController::class, 'destroyAttachment']);

    // Relatório e indicadores
    Route::get('/reports', [ReportController::class, 'overview']);
    Route::get('/indicators', [IndicatorController::class, 'index']);

    // Notificações
    Route::get('/notifications', [AuditController::class, 'notifications']);
    Route::post('/notifications/read-all', [AuditController::class, 'markNotificationsRead']);
});