
<link rel="stylesheet" href="node_modules/bootstrap-icons/font/bootstrap-icons.css">
<style>

    :root{
        --sidebar-width: 17rem;
    }

    main{
        overflow: hidden;
    }

    .kanban-container{
        width: calc(100vw - var(--sidebar-width));
        max-width: 100%;
        overflow: hidden;
        transition: width .3s ease;
    }

    .kanban-wrapper{
        display: flex;
        gap: 10px;
        overflow-x: auto;
        align-items: flex-start;
        height: calc(100vh - 180px);
    }

    .kanban-column {
        /*
        min-width: 340px;
        background: #f5f6f8;
        border-radius: 12px;
        padding: 12px;
        flex-shrink: 0;*/

        min-width: 340px;
        max-width: 340px;
        background: #f5f6f8;
        border-radius: 12px;
        /* padding: 12px; */
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
    }

    /* Desktop grande */
    @media (min-width: 1200px){
        .kanban-column{
            min-width: 340px;
        }
    }

    /* Notebook */
    @media (max-width: 1199px){
        .kanban-column{
            min-width: 300px;
        }
    }

    /* Tablet */
    @media (max-width: 991px){

        :root{
            --sidebar-width: 0px;
        }

        .kanban-container{
            width: 100%;
        }

        .kanban-column{
            min-width: 280px;
        }
    }

    /* Celular */
    @media (max-width: 576px){

        .kanban-wrapper{
            gap: 10px;
        }

        .kanban-column{
            min-width: 85vw;
        }

        .kanban-card{
            padding: 12px;
        }

        .kanban-header{
            padding: 10px;
            font-size: .9rem;
        }
    }

    .kanban-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        margin-bottom: 15px;
        background: #fff;
        border-radius: 2px;
        border-top: 4px solid;
        font-weight: 600;
    }

    .kanban-list {
        /*
        min-height: 500px;
        transition: all .2s ease;
        */
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        min-height: 300px;
        max-height: calc(100vh - 290px);

        padding-right: 4px;
        scrollbar-width: thin;
    }

    .kanban-card {
        background: #fff;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,.06);
        cursor: grab;
        transition: .2s;
    }

    .kanban-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,.10);
    }

    .kanban-card:active {
        cursor: grabbing;
    }

    .sortable-ghost {
        /* opacity: .4; */
        opacity: 1;

    }

    .sortable-drag {
        transform: rotate(3deg);
    }

    .drag-over {
        border: 2px dashed #0d6efd;
        border-radius: 10px;
        background: rgba(13,110,253,.05);
    }

    .border-success {
        border-color: #20c997 !important;
    }

    .border-warning {
        border-color: #fd7e14 !important;
    }

    .border-secondary {
        border-color: #83878a !important;

    }

    .border-primary {
        border-color: #6f42c1 !important;
    }
    .fs-14
    {
        font-size: 14px;
    }

    .fs-12
    {
        font-size: 12px;
    }

    .text-warning
    {
        color: #fd7e14 !important;
    }
    .text-primary
    {
        color: #6f42c1 !important;
    }
    .text-success {
        color: #20c997 !important;
    }
    /*
        MENU
    */
    .topbar {
        height: 70px;
        width: 100%;
        background: #ffffff;
        border-bottom: 1px solid #e5e7eb;

        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 0 24px;
    }

    .menu-left {
        display: flex;
        align-items: center;
        gap: 28px;
    }

    .logo-area {
        height: 70px;
        display: flex;
        align-items: center;
        gap: 10px;

        padding: 0 8px;
        font-weight: 600;
        cursor: pointer;

        position: relative;
    }

    .logo-area.active::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;
        height: 3px;

        background: #111827;
    }

    .top-menu {
        display: flex;
        gap: 24px;
    }

    .menu-item-c {
        text-decoration: none;
        color: #6b7280;

        display: flex;
        align-items: center;
        gap: 8px;

        font-size: 15px;
        /* transition: .2s; */

        position: relative;

        padding: 24px 0;
        transition: color .25s ease;
    }

    .menu-item-c::after {
        content: "";

        position: absolute;
        left: 50%;
        bottom: 0;

        width: 0;
        height: 3px;

        background: #111827;
        border-radius: 999px;

        transform: translateX(-50%);
        transition: width .25s ease;
    }

    .menu-item-c:hover {
        color: #111827!important;



    }
    .menu-item-c:hover::after {
        width: 100%;
    }



    .menu-right {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .search-box {
        width: 280px;
        height: 42px;
        border-radius: 24px;
        background: #f3f4f6;

        display: flex;
        align-items: center;

        padding: 0 14px;
        gap: 10px;
    }

    .search-box input {
        border: none;
        background: transparent;
        outline: none;
        width: 100%;
    }

    .small-icon {
        font-size: 12px;
    }
    @media (max-width: 900px) {
        .top-menu {
            display: none;
        }

        .search-box {
            width: 180px;
        }
    }

    .search-btn {
        border: none;
        background: transparent;
        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0;
        font-size: 16px;
    }
    .filter-btn{
        width: 42px;
        height: 42px;

        border: none;
        border-radius: 12px;

        background: #f3f4f6;
        color: #4b5563;

        display: flex;
        align-items: center;
        justify-content: center;

        cursor: pointer;
        transition: all .2s ease;
    }

    .filter-btn i{
        font-size: 18px;
    }

    .filter-btn:hover{
        background: #e5e7eb;
        color: #111827;
        transform: translateY(-1px);
    }

    .filter-btn:active{
        transform: scale(.97);
    }


    .custom-file-upload {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 14px 24px;
        border: 2px dashed #0d6efd;
        border-radius: 12px;
        background: #f8f9fa;
        cursor: pointer;
        transition: 0.3s;
        font-weight: 500;
    }

    .custom-file-upload:hover {
        background: #e9f2ff;
        transform: translateY(-2px);
    }

    .custom-file-upload i {
        font-size: 24px;
        color: #0d6efd;
    }


</style>
<!-- css modal -->
<style>
    .filter-modal .modal-content{

        box-shadow: 0 25px 60px rgba(0,0,0,.15);
        height: calc(100vh - 32px);
        border: none;
        border-radius: 24px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .filter-modal .modal-header{
        padding: 24px 28px 16px;
        border-bottom: 1px solid #edf0f2;
    }

    .filter-modal .modal-body{
        background: #f8fafc;
        padding: 24px 28px;
        max-height: 70vh;
        flex: 1;
        overflow-y: auto;
    }

    .filter-modal .modal-footer{
        padding: 18px 28px;
        border-top: 1px solid #edf0f2;
        background: #fff;
    }

    .filter-title{
        font-size: 13px;
        font-weight: 700;
        letter-spacing: .04em;
        color: #64748b;
        margin-bottom: 18px;
        text-transform: uppercase;
    }

    .filter-section{
        background: white;
        border-radius: 18px;
        padding: 22px;
        margin-bottom: 20px;
        border: 1px solid #e2e8f0;
    }

    .filter-modal .form-label{
        font-size: 13px;
        font-weight: 600;
        color: #475569;
        margin-bottom: 8px;
    }

    .filter-modal .form-control,
    .filter-modal .form-select{
        height: 46px;
        border-radius: 12px;
        border: 1px solid #dbe2ea;
    }

    .filter-modal .form-control:focus,
    .filter-modal .form-select:focus{
        box-shadow: 0 0 0 .2rem rgba(13,110,253,.15);
        border-color: #86b7fe;
    }

    .range-divider{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 46px;
        font-size: 18px;
        color: #94a3b8;
    }

    .btn-soft{
        background: #f1f5f9;
        border: none;
        color: #475569;
    }

    .btn-soft:hover{
        background: #e2e8f0;
    }

    .filter-modal .modal-dialog {
        height: 100vh;
        max-height: 100vh;
        margin: 0 auto;
        padding: 16px;
    }
</style>
<!-- modal conteudo -->
<style>

    .modal-processo .modal-full-custom{
        width: calc(100vw - 40px);
        max-width: none;
        height: calc(100vh - 20px);
        margin: 10px auto;
    }

    .modal-processo .modal-content{
        height: 100%;
        border: none;
        border-radius: 18px;
        overflow: hidden;
        position: relative;
    }

    .modal-processo .modal-close{
        position: absolute;
        top: 24px;
        right: 24px;
        z-index: 20;
    }

    .process-layout{
        display: grid;
        grid-template-columns: 44% 36% 20%;
        height: 100%;
    }

    .process-left,
    .process-center,
    .process-right{
        overflow-y: auto;
        height: 100%;
    }

    .process-left{
        background: white;
    }

    .process-center{
        background: #ffffff;
        border-left: 1px solid #e5e7eb;
    }

    .process-right{
        background: #ffffff;
        border-left: 1px solid #e5e7eb;
    }

    .form-control,
    .form-select{
        height: 48px;
        border-radius: 12px;
    }

    textarea.form-control{
        height: auto;
    }

    .btn-phase{
        height: 50px;
        border-radius: 999px;
        border: 1px solid #c4b5fd;
        background: #ede9fe;
        color: #5b21b6;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .btn-phase-danger{
        height: 50px;
        border-radius: 999px;
        border: 1px solid #fecaca;
        background: #fef2f2;
        color: #dc2626;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* mobile */
    @media (max-width: 992px){
        .process-layout{
            grid-template-columns: 1fr;
        }

        .process-right,
        .process-center{
            border-left: none;
            border-top: 1px solid #e5e7eb;
        }
    }

    .history-card{
        border: 1px solid #d9e2ec;
        border-radius: 10px;
        padding: 18px;
        margin-bottom: 14px;
        background: #fff;
    }

    .history-badge{
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
    }

    .history-badge.warning{
        background: #fff7ed;
        color: #f59e0b;
    }

    .history-badge.primary{
        background: #eff6ff;
        color: #0d6efd;
    }

    .upload-box{
        border: 2px dashed #cbd5e1;
        border-radius: 12px;
        /* padding: 60px 30px; */
        padding: 20px;
        background: #fafcff;
        transition: .2s;
        cursor: pointer;
    }

    .upload-box:hover{
        border-color: #0d6efd;
        background: #f8fbff;
    }

    .upload-icon{
        width: 90px;
        height: 90px;
        margin: auto;
        border-radius: 50%;
        background: #eff6ff;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .upload-icon i{
        font-size: 42px;
        color: #0d6efd;
    }

    .file-list {
        margin-top: 20px;
        text-align: left;
    }

    .file-item {
        background: #f5f5f5;
        border-left: 4px solid #ff5e3a;
        padding: 10px;
        margin-bottom: 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .decoration-tr {
        border-left: 4px solid #2b8705;
        background: #f5f5f5;
        padding: 0.75rem;
        margin-bottom: 8px;
        border-radius: 4px;
        display: flex;
        border-top: 1px solid #e3e6ec;
    }


    .fs-20
    {
        font-size: 20px;
    }

    .fs-16
    {
        font-size: 16px;
    }

    .info-grid{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        margin-top: 24px;
    }

    .info-card{
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        padding: 16px;
        transition: .25s;
    }

    .info-card:hover{
        box-shadow: 0 8px 24px rgba(0,0,0,.06);
        transform: translateY(-2px);
    }

    .info-label{
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        margin-bottom: 8px;

        display: flex;
        align-items: center;
        gap: 6px;
    }

    .info-value{
        font-size: 14px;
        color: #0f172a;
        font-weight: 600;
    }

    .status-badge{
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: 999px;
        background: #fff7ed;
        color: #ea580c;
        font-weight: 600;
        font-size: 13px;
    }

    .description-box{
        margin-top: 20px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 20px;
    }

    .section-title{
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 18px;
    }

    .process-header{
        /* background: linear-gradient(135deg,#4f46e5,#7c3aed); */
        background: linear-gradient(135deg, #ffffff, #ffffff);
        /* color: white; */
        color: #000000;
        padding: 24px;
        border-radius: 20px;
        margin-bottom: 20px;
        box-shadow: 0 12px 30px rgba(79,70,229,.18);
    }

    .process-subtitle
    {
        color: rgb(0 0 0 / 80%);
        /* color: rgba(255,255,255,.8); */
        font-size: 14px;
    }
</style>

<header class="topbar bg-white bg-dark">
    <div class="menu-left">

        <nav class="top-menu">
            <a href="#" class="menu-item-c">
                <i class="bi bi-grid"></i>
                Relatórios
            </a>

            <a href="#" class="menu-item-c">
                <i class="bi bi-card-list"></i>
                Novo
            </a>
            <!--
            <a href="#" class="menu-item-c">
                <i class="bi bi-arrow-left-right"></i>
                Movimentação
            </a>

            <a href="#" class="menu-item-c">
                <i class="bi bi-pie-chart"></i>
                Painéis
            </a> -->
        </nav>
    </div>

    <div class="menu-right">
        <form class="search-box" action="">
            <input type="text"  placeholder="Nº chamado">
            <button type="submit" class="search-btn" >
                <i class="bi bi-search"></i>
            </button>
        </form>
        <button type="button" class="filter-btn" title="Filtros" id="filter-btn">
            <i class="bi bi-funnel-fill"></i>
        </button>
    </div>
</header>
<main class="container-fluid p-4 pt-2 kanban-container ">
    <div class="kanban-wrapper">

        <!-- Pendente -->
        <div class="kanban-column">

            <div class="kanban-header border-primary">
                <span class="fs-14 text-primary">
                    Pendente (<span class="count">2</span>)
                </span>
            </div>

            <div class="kanban-list" data-status="pendente">
                <div class="kanban-card" data-id="1">
                    <h6 class="fw-bold fs-14">Desenho das telas do sistema para contas a receber</h6>
                    <small class="text-muted">
                        Nº
                    </small>
                    <span class="badge bg-light text-dark">
                        202402070036
                    </span>
                    <div class="mt-2 fs-12">
                        <small class="text-muted">
                            SETOR / USUÁRIO SOLICITANTE
                        </small>
                        <p><strong>Financeiro</strong> - <strong>Angela Smith</strong></p>
                    </div>
                    <div class=" fs-12">
                        <small class="text-muted">
                            DESIGNADO
                        </small>
                        <p><strong>Angela Smith</strong></p>
                    </div>
                </div>
                <div class="kanban-card" data-id="2">
                    <h6 class="fw-bold fs-14">Avaliação de Lentidão</h6>
                    <small class="text-muted">
                        Nº
                    </small>
                    <span class="badge bg-light text-dark">
                        202402070036
                    </span>
                    <div class="mt-2 fs-12">
                        <small class="text-muted">
                            SETOR / USUÁRIO SOLICITANTE
                        </small>
                        <p><strong>Ouvidoria</strong> - <strong>Joao Coelho</strong></p>
                    </div>
                    <div class=" fs-12">
                        <small class="text-muted">
                            DESIGNADO
                        </small>
                        <p><strong>Anna mille</strong></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Em andamento -->
        <div class="kanban-column">

            <div class="kanban-header border-warning">
                <span class="fs-14 text-warning">
                    Em andamento (<span class="count">2</span>)
                </span>
            </div>
            <div class="kanban-list" data-status="em-andamento">
                <div class="kanban-card" data-id="3">
                    <h6 class="fw-bold fs-14">Impressora do comercial sem funcionar</h6>
                    <small class="text-muted">
                        Nº
                    </small>
                    <span class="badge bg-light text-dark">
                        2024020700558
                    </span>
                    <div class="mt-2 fs-12">
                        <small class="text-muted">
                            SETOR / USUÁRIO SOLICITANTE
                        </small>
                        <p><strong>Recursos Humanos</strong> - <strong>Juliana Coelho</strong></p>
                    </div>
                    <div class=" fs-12">
                        <small class="text-muted">
                            DESIGNADO
                        </small>
                        <p><strong>Richard vasconcelos</strong></p>
                    </div>
                </div>
                <div class="kanban-card" data-id="4">
                    <h6 class="fw-bold fs-14">Erro na URA - Cliente sem Direcionamento </h6>
                    <small class="text-muted">
                        Nº
                    </small>
                    <span class="badge bg-light text-dark">
                        2024020704574
                    </span>
                    <div class="mt-2 fs-12">
                        <small class="text-muted">
                            SETOR / USUÁRIO SOLICITANTE
                        </small>
                        <p><strong>TI</strong> - <strong>Inês pedro</strong></p>
                    </div>
                    <div class=" fs-12">
                        <small class="text-muted">
                            DESIGNADO
                        </small>
                        <p><strong>Roger fernandes</strong></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Aguardando validação -->
        <div class="kanban-column">

            <div class="kanban-header border-danger">
                <span class="fs-14 text-danger">
                    Aguardando Validação (<span class="count">2</span>)
                </span>
            </div>

            <div class="kanban-list" data-status="bloqueado">
                <div class="kanban-card" data-id="5">
                    <h6 class="fw-bold fs-14">IMPORTAÇÃO DE ARQUIVO</h6>
                    <small class="text-muted">
                        Nº
                    </small>
                    <span class="badge bg-light text-dark">
                        2024020704587
                    </span>
                    <div class="mt-2 fs-12">
                        <small class="text-muted">
                            SETOR / USUÁRIO SOLICITANTE
                        </small>
                        <p><strong>Comercial</strong> - <strong>Allan Silva</strong></p>
                    </div>
                    <div class=" fs-12">
                        <small class="text-muted">
                            DESIGNADO
                        </small>
                        <p><strong>Pedro fernandes</strong></p>
                    </div>
                </div>
                <div class="kanban-card" data-id="6">
                    <h6 class="fw-bold fs-14">Configuração e disparo de mensagens ou campanhas</h6>
                    <small class="text-muted">
                        Nº
                    </small>
                    <span class="badge bg-light text-dark">
                        2024020704580
                    </span>
                    <div class="mt-2 fs-12">
                        <small class="text-muted">
                            SETOR / USUÁRIO SOLICITANTE
                        </small>
                        <p><strong>Atendimento</strong> - <strong>Alice Sampaio</strong></p>
                    </div>
                    <div class=" fs-12">
                        <small class="text-muted">
                            DESIGNADO
                        </small>
                        <p><strong>Fernando oliveira</strong></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Finalizado -->
        <div class="kanban-column">
            <div class="kanban-header border-success">
                <span class="fs-14 text-success">
                    Concluído (<span class="count">2</span>)
                </span>
            </div>
            <div class="kanban-list" data-status="finalizado">
                <div class="kanban-card" data-id="7">
                    <h6 class="fw-bold fs-14">Ajuste nos dados</h6>
                    <small class="text-muted">
                        Nº
                    </small>
                    <span class="badge bg-light text-dark">
                        2024020704581
                    </span>
                    <div class="mt-2 fs-12">
                        <small class="text-muted">
                            SETOR / USUÁRIO SOLICITANTE
                        </small>
                        <p><strong>Atendimento</strong> - <strong>Alice Sampaio</strong></p>
                    </div>
                    <div class=" fs-12">
                        <small class="text-muted">
                            DESIGNADO
                        </small>
                        <p><strong>Fernando oliveira</strong></p>
                    </div>
                </div>
                <div class="kanban-card" data-id="8">
                    <h6 class="fw-bold fs-14">Configuração e disparo de mensagens ou campanhas</h6>
                    <small class="text-muted">
                        Nº
                    </small>
                    <span class="badge bg-light text-dark">
                        2024020704580
                    </span>
                    <div class="mt-2 fs-12">
                        <small class="text-muted">
                            SETOR / USUÁRIO SOLICITANTE
                        </small>
                        <p><strong>Atendimento</strong> - <strong>Alice Sampaio</strong></p>
                    </div>
                    <div class=" fs-12">
                        <small class="text-muted">
                            DESIGNADO
                        </small>
                        <p><strong>Fernando oliveira</strong></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Cancelado -->
        <div class="kanban-column">
            <div class="kanban-header border-secondary">
                <span class="fs-14 text-secondary">
                    Cancelado (<span class="count">2</span>)
                </span>
            </div>
            <div class="kanban-list" data-status="cancelado">
                <div class="kanban-card" data-id="9">
                    <h6 class="fw-bold fs-14">Erro de ergonomia na posição do botão</h6>
                    <small class="text-muted">
                        Nº
                    </small>
                    <span class="badge bg-light text-dark">
                        2024020704585
                    </span>
                    <div class="mt-2 fs-12">
                        <small class="text-muted">
                            SETOR / USUÁRIO SOLICITANTE
                        </small>
                        <p><strong>Atendimento</strong> - <strong>Alice Sampaio</strong></p>
                    </div>
                    <div class=" fs-12">
                        <small class="text-muted">
                            DESIGNADO
                        </small>
                        <p><strong>Fernando oliveira</strong></p>
                    </div>
                </div>
                <div class="kanban-card" data-id="10">
                    <h6 class="fw-bold fs-14">Arquivos de Retorno (Atualização)</h6>
                    <small class="text-muted">
                        Nº
                    </small>
                    <span class="badge bg-light text-dark">
                        2024020704588
                    </span>
                    <div class="mt-2 fs-12">
                        <small class="text-muted">
                            SETOR / USUÁRIO SOLICITANTE
                        </small>
                        <p><strong>Atendimento</strong> - <strong>Alice Sampaio</strong></p>
                    </div>
                    <div class=" fs-12">
                        <small class="text-muted">
                            DESIGNADO
                        </small>
                        <p><strong>Fernando oliveira</strong></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- MODAL PESQUISA -->
<div class="modal fade filter-modal" id="modal-pesquisa" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">

            <div class="modal-header">
                <div>
                    <h4 class="fw-bold mb-1 d-flex align-items-center gap-2">
                        <i class="bi bi-funnel-fill text-primary"></i>
                        Filtrar Chamados
                    </h4>
                    <small class="text-muted">
                        Refine sua busca usando um ou mais filtros
                    </small>
                </div>

                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <form id="form-filtro">

                    <!-- Períodos -->
                    <div class="filter-section">
                        <div class="filter-title">Períodos</div>

                        <div class="row g-3">
                            <div class="col-lg-5">
                                <label class="form-label">Abertura (de)</label>
                                <input type="date" class="form-control">
                            </div>

                            <div class="col-lg-2">
                                <div class="range-divider">
                                    <i class="bi bi-arrow-right"></i>
                                </div>
                            </div>

                            <div class="col-lg-5">
                                <label class="form-label">Abertura (até)</label>
                                <input type="date" class="form-control">
                            </div>

                            <div class="col-lg-5">
                                <label class="form-label">Apontamento (de)</label>
                                <input type="date" class="form-control">
                            </div>

                            <div class="col-lg-2">
                                <div class="range-divider">
                                    <i class="bi bi-arrow-right"></i>
                                </div>
                            </div>
                            <div class="col-lg-5">
                                <label class="form-label">Apontamento (até)</label>
                                <input type="date" class="form-control">
                            </div>

                            <!--
                            <div class="col-lg-5">
                                <label class="form-label">Agenda Financeira (de)</label>
                                <input type="date" class="form-control">
                            </div>

                            <div class="col-lg-2">
                                <div class="range-divider">
                                    <i class="bi bi-arrow-right"></i>
                                </div>
                            </div>

                            <div class="col-lg-5">
                                <label class="form-label">Agenda Financeira (até)</label>
                                <input type="date" class="form-control">
                            </div>
                            -->

                        </div>
                    </div>

                    <!-- Chamado -->
                    <div class="filter-section">
                        <div class="filter-title">Dados do Processo</div>

                        <div class="row g-3">
                            <div class="col-lg-3">
                                <label class="form-label">Nº Chamado</label>
                                <input type="number" class="form-control">
                            </div>
                            <div class="col-lg-3">
                                <label class="form-label">Situação</label>
                                <select class="form-select">
                                    <option selected disabled>Selecione</option>
                                    <option>Bloqueado</option>
                                    <option>Cancelado</option>
                                    <option>Em andamento</option>
                                    <option>Finalizado</option>
                                </select>
                            </div>
                            <div class="col-lg-6">
                                <label class="form-label">Tipo de chamado</label>
                                <select class="form-select">
                                    <option selected disabled>Selecione</option>
                                    <option>CARTA DE MANUTENÇÃO DE INDICE</option>
                                    <option>ACORDO COLETIVO 2018</option>
                                    <option>ALTERAÇÃO DA FORMA DE PAGAMENTO</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Relacionamentos -->
                    <div class="filter-section">
                        <div class="filter-title">Relacionamentos</div>

                        <div class="row g-3">
                            <div class="col-lg-4">
                                <label class="form-label">Setor Solicitante</label>
                                <select class="form-select">
                                    <option selected disabled>Selecione</option>
                                    <option>Auditoria de Enfermagem</option>
                                    <option>Cadastro</option>
                                    <option>Normas e Regulamentação</option>
                                </select>
                            </div>
                            <div class="col-lg-4">
                                <label class="form-label">Usuário Solicitante</label>
                                <select class="form-select">
                                    <option selected disabled>Selecione</option>
                                    <option>Maria da Cunha Alves</option>
                                    <option>José Mario Silva</option>
                                    <option>Igor Machado Souza</option>
                                </select>
                            </div>

                            <div class="col-lg-4">
                                <label class="form-label">Usuário Designado</label>
                                <select class="form-select">
                                    <option selected disabled>Selecione</option>
                                    <option>Auditoria de Enfermagem</option>
                                    <option>Cadastro</option>
                                    <option>Normas e Regulamentação</option>
                                </select>
                            </div>


                        </div>
                    </div>

                </form>
            </div>

            <div class="modal-footer">
                <button type="reset" class="btn btn-soft px-4" form="form-filtro">
                    <i class="bi bi-eraser me-1"></i>
                    Limpar
                </button>

                <button type="submit" class="btn btn-primary px-4" form="form-filtro">
                    <i class="bi bi-search me-1"></i>
                    Aplicar filtros
                </button>
            </div>

        </div>
    </div>
</div>

<!-- MODAL CONTEUDO CARD -->
<div class="modal fade modal-processo" id="modal-detalhe" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-full-custom">
        <div class="modal-content">

            <button class="btn-close modal-close" data-bs-dismiss="modal"></button>

            <div class="process-layout">

                <!-- COLUNA ESQUERDA -->
                <div class="process-left">
                    <div class="p-4">

                        <!-- HEADER -->
                        <div class="process-header">
                            <h3 class="fw-bold mb-2 fs-20">
                                Lista de Assinaturas - Assembléia Alteração do Estatuto
                            </h3>

                            <div class="process-subtitle">
                                Criado por Cleiton Rodrigues • 18/06/2026 16:14
                            </div>
                        </div>
                        <!-- STATUS -->
                        <div class="mb-4">
                            <span class="status-badge">
                                <i class="bi bi-kanban"></i>
                                Em andamento
                            </span>
                        </div>
                        <!-- GRID -->
                        <div class="info-grid">
                            <div class="info-card">
                                <div class="info-label">
                                    <i class="bi bi-hash"></i> Nº Chamado
                                </div>
                                <div class="info-value">202402070036</div>
                            </div>
                            <div class="info-card">
                                <div class="info-label">
                                    <i class="bi-person-plus"></i> Solicitante
                                </div>
                                <div class="info-value">Diretoria - Alice macedo</div>
                            </div>
                            <div class="info-card">
                                <div class="info-label">
                                    <i class="bi bi-tag"></i> Tipo de Chamado
                                </div>
                                <div class="info-value">Solicitação de Melhoria ou Nova Funcionalidade</div>
                            </div>

                            <div class="info-card">
                                <div class="info-label">
                                    <i class="bi-person-workspace"></i> Demandado
                                </div>
                                <div class="info-value">Tecnologia da Informação / Roger watts</div>
                            </div>

                        </div>

                        <!-- DESCRIÇÃO -->
                        <div class="description-box">


                            <div class="text-muted">
                                <div class="mb-3">
                                    <label for="" class="form-label">
                                        <div class="section-title txt-white">
                                            <i class="bi bi-card-text"></i>
                                            Descrição
                                        </div>
                                    </label>
                                    <textarea style="resize: none;" class="form-control" id="" rows="7">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966,</textarea>
                                </div>
                            </div>
                        </div>
                        <!-- ATTACHMENTS -->
                        <div class="mt-5">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h4 class="fw-bold mb-0 fs-16">Anexo</h4>
                               <!--
                                <button class="btn btn-sm">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                -->
                            </div>

                            <table class="table table-hover w-100">

                                <tbody id="listar-arquivos-salvos">
                                    <tr>
                                        <td class="decoration-tr">
                                            <a href="files/pagamentos/PGTO-202606150006/6a2fff2928ea2.pdf" target="_blank" class="fs-14 text-dark txt-white w-100" style="text-decoration: none">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2b8705" viewBox="0 0 24 24">
                                                    <path d="M16.5 6.5L8.91 14.09a2.5 2.5 0 1 1-3.54-3.54L13 3.91a4 4 0 0 1 5.66 5.66L9.41 18.83a6 6 0 0 1-8.48-8.48l8.49-8.49" fill="none" stroke="#2b8705" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                </svg>
                                                05-2026 - CAFAZ CORRETORA - COFINS.pdf
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="decoration-tr">
                                            <a href="files/pagamentos/PGTO-202606150006/6a2fff292aaaf.pdf" target="_blank" class="fs-14 text-dark txt-white w-100" style="text-decoration: none">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2b8705" viewBox="0 0 24 24">
                                                    <path d="M16.5 6.5L8.91 14.09a2.5 2.5 0 1 1-3.54-3.54L13 3.91a4 4 0 0 1 5.66 5.66L9.41 18.83a6 6 0 0 1-8.48-8.48l8.49-8.49" fill="none" stroke="#2b8705" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                </svg>
                                                05-2026 - CAFAZ CORRETORA - DEMONSTRATIVO DE
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="decoration-tr">
                                            <a href="files/pagamentos/PGTO-202606150006/6a2fff292c50e.xlsx" target="_blank" class="fs-14 text-dark txt-white w-100" style="text-decoration: none">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2b8705" viewBox="0 0 24 24">
                                                    <path d="M16.5 6.5L8.91 14.09a2.5 2.5 0 1 1-3.54-3.54L13 3.91a4 4 0 0 1 5.66 5.66L9.41 18.83a6 6 0 0 1-8.48-8.48l8.49-8.49" fill="none" stroke="#2b8705" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                                </svg>
                                                05-2026 - CAFAZ CORRETORA - DEMONSTRATIVO DE
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="upload-wrapper">
                                <label for="arquivo-insert" class="custom-file-upload text-dark">
                                    <i class="bi bi-cloud-arrow-up"></i>
                                    <span>Selecionar arquivos</span>
                                </label>
                                <input type="file" id="arquivo-insert" multiple hidden
                                       accept=".jpg,.jpeg,.png,.gif,.bmp,
                                                   .pdf,.txt,.rtf,.ret,
                                                   .doc,.docx,.xls,.xlsx,.csv,
                                                   .ppt,.pptx,.pps,
                                                   .odt,.ods,.odp,
                                                   .zip,.rar,.7z
                                                   .mp4">
                            </div>
                            <div id="fileList" class="mt-3"></div>
                            <div id="totalSize" class="mt-2"></div>
                            <div id="errorMsg" class="text-danger fw-bold mt-2"></div>
                        </div>

                        <!-- HISTORY -->
                        <div class="mt-5">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h4 class="fw-bold mb-0 fs-16">Histórico de Alterações</h4>
                            </div>

                            <div class="history-card">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="history-badge warning">Evandro macio</span>
                                    <strong>Jul 12 às 15:23</strong>
                                </div>
                                <div class="text-muted small mb-3">Alterou descrição</div>
                            </div>

                            <div class="history-card">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="history-badge warning">Anna julia</span>
                                    <strong>Jul 30 às 11:01</strong>
                                </div>

                                <div class="text-muted small">Movimentou o chamado para Concluido</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- COLUNA CENTRAL -->
                <div class="process-center">
                    <div class="p-4">
                        <!--
                        <small class="text-primary fw-semibold">
                            From HR Requests - Remote
                        </small> -->

                        <div class="mt-4">
                            <h4 class="fw-bold">

                                <span class="badge bg-primary-subtle text-primary ms-2">
                                    Apontamentos
                                </span>
                            </h4>
                        </div>

                        <hr>
                        <form id="form-apontamentos">
                            <div class="row">
                                <div class="col-lg-12">
                                    <label class="form-label">Tipo de Apontamento</label>
                                    <select class="form-select">
                                        <option selected disabled>Selecione</option>
                                        <option>Em andamento</option>
                                        <option>Concluido</option>
                                        <option>Cancelar</option>
                                        <option>Solicitar validação</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="form-group">
                                        <label class="fw-700-c-black-fs-16" for="comentarios-insert"></label>
                                        <textarea class="form-control" id="comentarios-insert" rows="5" maxlength="500" required></textarea>
                                    </div>
                                </div>
                                <div class="upload-wrapper">
                                    <label for="arquivo-insert-a" class="custom-file-upload text-black" style="padding: 0px 8px; margin-top: 10px;">
                                        <i class="bi bi-cloud-arrow-up"></i>
                                        <span>Selecionar arquivos</span>
                                    </label>
                                    <input type="file" id="arquivo-insert-a" multiple hidden
                                           accept=".jpg,.jpeg,.png,.gif,.bmp,
                                                   .pdf,.txt,.rtf,.ret,
                                                   .doc,.docx,.xls,.xlsx,.csv,
                                                   .ppt,.pptx,.pps,
                                                   .odt,.ods,.odp,
                                                   .zip,.rar,.7z
                                                   .mp4">
                                </div>
                                <div id="fileList-a" class="mt-3"></div>
                                <div id="totalSize-a" class="mt-2"></div>
                                <div id="errorMsg-a" class="text-danger fw-bold mt-2"></div>
                                <div class="mt-1">
                                    <h4></h4>
                                    <button type="submit" class="btn btn-link text-decoration-none p-0 mt-3 mb-3">
                                        + Adicionar Apontamento
                                    </button>
                                </div>
                            </div>
                        </form>



                        <div class=row>
                            <div class="card p-3 mt-4" style="border-left: 6px solid #f0f0f0; border-radius: 12px;">
                                <div class="d-flex align-items-start">
                                    <div>
                                        <strong class="d-block mb-2" style="font-size: 14px;">LEONARDO.GOMES</strong>
                                        <p class="mb-2 text-justify" style="line-height: 1.5;font-size: 13px;">
                                            Referente COFINS, competência 05/2026. Valor: R$ 29.568,16. vencimento 25/06/2026.

                                            BO - 85800000295 2 68160385261 5 76071626162 4 74728902803 6
                                        </p>
                                        <small class="text-muted">15/06/2026 10:33</small>
                                    </div>
                                </div>
                            </div>
                            <div class="card p-3 mt-4" style="border-left: 6px solid #f0f0f0; border-radius: 12px;">
                                <div class="d-flex align-items-start">
                                    <div>
                                        <strong class="d-block mb-2" style="font-size: 14px;">LEONARDO.GOMES</strong>
                                        <p class="mb-2 text-justify" style="line-height: 1.5;font-size: 13px;">
                                            Referente COFINS, competência 05/2026. Valor: R$ 29.568,16. vencimento 25/06/2026.

                                            BO - 85800000295 2 68160385261 5 76071626162 4 74728902803 6
                                        </p>
                                        <small class="text-muted">15/06/2026 10:33</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- COLUNA DIREITA -->
                <div class="process-right">
                   <!--
                    <div class="p-4">
                        <h4 class="fw-bold mb-4">Situação</h4>

                        <button class="btn btn-phase w-100 mb-3">
                            Finalizado
                            <i class="bi bi-arrow-right"></i>
                        </button>

                        <button class="btn btn-phase-danger w-100">
                            Cancelar
                            <i class="bi bi-arrow-right"></i>
                        </button>

                        <hr class="my-4">


                        <div class="d-flex flex-column gap-3">
                            <!- -
                            <a href="#" class="text-decoration-none text-dark txt-white">
                                Movimentar chamado
                            </a> - ->
                            <div class="row">
                                <div class="col-lg-12">
                                    <label class="form-label"></label>
                                    <select class="form-select">
                                        <option selected disabled>Selecione</option>
                                        <option>Em andamento</option>
                                        <option>Finalizado</option>
                                        <option>Solicitar validação</option>
                                        <option>Cancelar</option>
                                    </select>
                                </div>
                            </div>


                        </div>
                    </div> -->
                </div>

            </div>
        </div>
    </div>
</div>


<script src="node_modules/sortablejs/Sortable.min.js"></script>
<script>

    //

    document.addEventListener('DOMContentLoaded', () => {


        function limpar()
        {
            $('#fileList').html('');
            $('#totalSize').html('');
            $('#errorMsg').html('');
            filesArray = [];
            filesArray2 = [];
        }


        $( "#filter-btn" ).on( "click", function() {

            $("#modal-pesquisa").modal("show");

        });

        $(document).on("click", ".kanban-card", function() {

            $("#modal-detalhe").modal("show");
            limpar();

        });

        const lists = document.querySelectorAll('.kanban-list');

        lists.forEach(list => {

            new Sortable(list, {

                group: 'kanban',

                animation: 200,

                ghostClass: 'sortable-ghost',

                dragClass: 'sortable-drag',

                onMove(evt) {

                    document
                        .querySelectorAll('.kanban-list')
                        .forEach(el => el.classList.remove('drag-over'));

                    evt.to.classList.add('drag-over');
                },

                onEnd(evt) {

                    document
                        .querySelectorAll('.kanban-list')
                        .forEach(el => el.classList.remove('drag-over'));

                    atualizarContadores();

                    const cardId = evt.item.dataset.id;
                    const novoStatus = evt.to.dataset.status;
                    const posicao = evt.newIndex;

                    console.log({
                        cardId,
                        novoStatus,
                        posicao
                    });

                    // Exemplo para salvar no backend
                    /*
                    fetch('/processos/mover', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: cardId,
                            status: novoStatus,
                            posicao: posicao
                        })
                    });
                    */
                }

            });

        });

        atualizarContadores();



        // ARQUIVO APONTAMENTOS
        const inputFileApont = document.getElementById("arquivo-insert-a");
        const fileListDivApont = document.getElementById("fileList-a");
        const totalSizeDivApont = document.getElementById("totalSize-a");
        const errorMsgApont = document.getElementById("errorMsg-a");

        const MAX_SIZEApont = 50 * 1024 * 1024;
        let filesArray2 = [];

        inputFileApont.addEventListener("change", () => {
            filesArray2 = [...filesArray2, ...Array.from(inputFileApont.files)];
            renderFileList2();
            inputFileApont.value = "";
        });

        function renderFileList2() {
            fileListDivApont.innerHTML = "";
            let totalSize2 = 0;

            filesArray2.forEach((file, index) => {
                totalSize2 += file.size;

                const fileDiv2 = document.createElement("div");
                fileDiv2.classList.add("file-item", "d-flex", "justify-content-between", "align-items-center");

                fileDiv2.innerHTML = `
                                            <span>${file.name}</span>
                                            <span>${formatBytes(file.size)}</span>
                                            <button type="button" class="btn btn-sm btn-danger ms-2">X</button>
                                          `;

                fileDiv2.querySelector("button").onclick = () => {
                    filesArray2.splice(index, 1);
                    renderFileList();
                };

                fileListDivApont.appendChild(fileDiv2);
            });

            totalSizeDivApont.textContent = "Total: " + formatBytes2(totalSize2);

            if (totalSize2 > MAX_SIZEApont) {
                errorMsgApont.textContent = "O tamanho total dos arquivos ultrapassa o limite de 50 MB!";
            } else {
                errorMsgApont.textContent = "";
            }
        }

        function formatBytes2(bytes) {
            const units = ["B", "KB", "MB", "GB"];
            let i = 0;
            while (bytes >= 1024 && i < units.length - 1) {
                bytes /= 1024;
                i++;
            }
            return bytes.toFixed(2) + " " + units[i];
        }

        // extensões permitidas
        const allowedExtensionsApontamento = [
            "jpg", "jpeg", "png", "gif", "bmp",    // imagens
            "pdf", "txt", "rtf", "ret",           // textos
            "doc", "docx", "xls", "xlsx", "csv",         // Office
            "ppt", "pptx", "pps",                  // PowerPoint
            "odt", "ods", "odp",                   // LibreOffice
            "zip", "rar", "7z",                     // compactados
            "mp4"
        ];
        //END ARQUIVO APONTAMENTOS




        // ARQUIVO HEADER
        const inputFile = document.getElementById("arquivo-insert");
        const fileListDiv = document.getElementById("fileList");
        const totalSizeDiv = document.getElementById("totalSize");
        const errorMsg = document.getElementById("errorMsg");

        const MAX_SIZE = 50 * 1024 * 1024;
        let filesArray = [];

        inputFile.addEventListener("change", () => {
            filesArray = [...filesArray, ...Array.from(inputFile.files)];
            renderFileList();
            inputFile.value = "";
        });

        function renderFileList() {
            fileListDiv.innerHTML = "";
            let totalSize = 0;

            filesArray.forEach((file, index) => {
                totalSize += file.size;

                const fileDiv = document.createElement("div");
                fileDiv.classList.add("file-item", "d-flex", "justify-content-between", "align-items-center");

                fileDiv.innerHTML = `
                                            <span>${file.name}</span>
                                            <span>${formatBytes(file.size)}</span>
                                            <button type="button" class="btn btn-sm btn-danger ms-2">X</button>
                                          `;

                fileDiv.querySelector("button").onclick = () => {
                    filesArray.splice(index, 1);
                    renderFileList();
                };

                fileListDiv.appendChild(fileDiv);
            });

            totalSizeDiv.textContent = "Total: " + formatBytes(totalSize);

            if (totalSize > MAX_SIZE) {
                errorMsg.textContent = "O tamanho total dos arquivos ultrapassa o limite de 50 MB!";
            } else {
                errorMsg.textContent = "";
            }
        }

        function formatBytes(bytes) {
            const units = ["B", "KB", "MB", "GB"];
            let i = 0;
            while (bytes >= 1024 && i < units.length - 1) {
                bytes /= 1024;
                i++;
            }
            return bytes.toFixed(2) + " " + units[i];
        }

        // extensões permitidas
        const allowedExtensions = [
            "jpg", "jpeg", "png", "gif", "bmp",    // imagens
            "pdf", "txt", "rtf", "ret",           // textos
            "doc", "docx", "xls", "xlsx", "csv",         // Office
            "ppt", "pptx", "pps",                  // PowerPoint
            "odt", "ods", "odp",                   // LibreOffice
            "zip", "rar", "7z",                     // compactados
            "mp4"
        ];
        //END ARQUIVO


        // form submit
        $( "#target" ).on( "click", function( event ) {
            event.preventDefault();


            let totalSize = filesArray.reduce((sum, file) => sum + file.size, 0);
            if (totalSize > MAX_SIZE) {

                Swal.fire({
                    icon: 'info',
                    title: '',
                    text: "O tamanho total dos arquivos ultrapassa o limite de 50 MB! Não é possível gravar.",
                    confirmButtonText: 'Fechar'
                    //footer: '<a href>Why do I have this issue?</a>'
                })
                return;
            }

            //  valida extensões
            for (let file of filesArray) {
                let ext = file.name.split('.').pop().toLowerCase();
                if (!allowedExtensions.includes(ext)) {
                    Swal.fire({
                        icon: 'info',
                        text: `A Extensão do arquivo "${file.name}" não é permitida. `,
                        confirmButtonText: 'Fechar'
                    });
                    return;
                }
            }


            let formData = new FormData();

            filesArray.forEach((file) => {
                formData.append("arquivos[]", file);
                console.log(file);
            });

            // TODO



        });




    });

    function atualizarContadores() {

        document
            .querySelectorAll('.kanban-column')
            .forEach(coluna => {

                const total =
                    coluna.querySelectorAll('.kanban-card').length;

                coluna.querySelector('.count').textContent = total;

            });
    }

</script>

