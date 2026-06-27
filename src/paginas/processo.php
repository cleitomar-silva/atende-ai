
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





    /*
       display: flex;
       gap: 16px;
       overflow-x: auto;
       padding-bottom: 10px;

       max-width: calc(100vw - 16rem);


    .kanban-wrapper {

        display: flex;
        gap: 16px;
        overflow-x: auto;
        padding-bottom: 20px;

        max-width: calc(100vw - 16rem);
    }

*/



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
        padding: 60px 30px;
        background: #fafcff;
        transition: .2s;
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

            <a href="#" class="menu-item-c">
                <i class="bi bi-arrow-left-right"></i>
                Movimentação
            </a>

            <a href="#" class="menu-item-c">
                <i class="bi bi-pie-chart"></i>
                Painéis
            </a>
        </nav>
    </div>

    <div class="menu-right">
        <form class="search-box" action="">
            <input type="text"  placeholder="Nº processo">
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
                    <h6 class="fw-bold fs-14">Recurso de Glosa</h6>
                    <span class="badge bg-light text-dark">
                        202402070036
                    </span>
                    <div class="mt-2 fs-12">
                        <small class="text-muted">
                            SETOR
                        </small>
                        <p><strong>Financeiro</strong></p>
                    </div>
                    <div class=" fs-12">
                        <small class="text-muted">
                            PESSOA
                        </small>
                        <p><strong>Angela Smith</strong></p>
                    </div>
                </div>
                <div class="kanban-card" data-id="2">
                    <h6 class="fw-bold fs-14">João Coelho</h6>
                    <span class="badge bg-light text-dark">
                        Comercial
                    </span>
                    <div class="mt-3 fs-12">
                        <small class="text-muted">
                            VALOR
                        </small>
                        <p><strong>R$ 7.000,00</strong></p>
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
                    <h6 class="fw-bold fs-14">Douglas Splitter</h6>
                    <span class="badge bg-light text-dark">
                        Comercial
                    </span>
                    <div class="mt-3 fs-12">
                        <small class="text-muted">VALOR</small>
                        <p><strong>R$ 2.000,00</strong></p>
                    </div>
                </div>
                <div class="kanban-card" data-id="4">
                    <h6 class="fw-bold fs-14">Patricia Meyer</h6>
                    <span class="badge bg-light text-dark">
                        Financeiro
                    </span>
                    <div class="mt-3 fs-12">
                        <small class="text-muted">VALOR</small>
                        <p><strong>R$ 8.000,00</strong></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bloqueado -->
        <div class="kanban-column">

            <div class="kanban-header border-danger">
                <span class="fs-14 text-danger">
                    Bloqueado (<span class="count">2</span>)
                </span>
            </div>

            <div class="kanban-list" data-status="bloqueado">
                <div class="kanban-card" data-id="5">
                    <h6 class="fw-bold fs-14">Lucas Memphis</h6>
                    <span class="badge bg-light text-dark">
                        Logistica
                    </span>
                    <div class="mt-3 fs-12">
                        <p><strong>R$ 3.000,00</strong></p>
                    </div>
                </div>
                <div class="kanban-card" data-id="6">
                    <h6 class="fw-bold fs-14">Angela Duarte</h6>
                    <span class="badge bg-light text-dark">
                        Contas medicas
                    </span>
                    <div class="mt-3 fs-12">
                        <p><strong>R$ 9.000,00</strong></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Finalizado -->
        <div class="kanban-column">
            <div class="kanban-header border-success">
                <span class="fs-14 text-success">
                    Finalizado (<span class="count">2</span>)
                </span>
            </div>
            <div class="kanban-list" data-status="finalizado">
                <div class="kanban-card" data-id="7">
                    <h6 class="fw-bold fs-14">Anna Miller</h6>
                    <span class="badge bg-light text-dark">
                        Tecnologia da informação
                    </span>
                    <div class="mt-3 fs-12">
                        <p><strong>$ 4.000,00</strong></p>
                    </div>
                </div>
                <div class="kanban-card" data-id="8">
                    <h6 class="fw-bold fs-14">Marcia Torres</h6>
                    <span class="badge bg-light text-dark">
                        Operacional
                    </span>
                    <div class="mt-3 fs-12">
                        <p> <strong>R$ 10.000,00</strong></p>
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
                    <h6 class="fw-bold fs-14">Walter Chang</h6>
                    <span class="badge bg-light text-dark">
                        RH
                    </span>
                    <div class="mt-3 fs-12">
                        <p> <strong>R$ 5.000,00</strong></p>
                    </div>
                </div>
                <div class="kanban-card" data-id="10">
                    <h6 class="fw-bold">Luiza Maria</h6>
                    <span class="badge bg-light text-dark">
                        Atendimento
                    </span>
                    <div class="mt-3">
                        <h6>R$ 11.000,00</h6>
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
                        Filtrar Processos
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
                                <label class="form-label">Previsão (de)</label>
                                <input type="date" class="form-control">
                            </div>

                            <div class="col-lg-2">
                                <div class="range-divider">
                                    <i class="bi bi-arrow-right"></i>
                                </div>
                            </div>

                            <div class="col-lg-5">
                                <label class="form-label">Previsão (até)</label>
                                <input type="date" class="form-control">
                            </div>

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
                        </div>
                    </div>

                    <!-- Processo -->
                    <div class="filter-section">
                        <div class="filter-title">Dados do Processo</div>

                        <div class="row g-3">
                            <div class="col-lg-3">
                                <label class="form-label">Nº Processo</label>
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
                                <label class="form-label">Assunto</label>
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
                                <label class="form-label">Pessoa / Interessado</label>
                                <select class="form-select">
                                    <option selected disabled>Selecione</option>
                                    <option>Maria da Cunha Alves</option>
                                    <option>José Mario Silva</option>
                                    <option>Igor Machado Souza</option>
                                </select>
                            </div>

                            <div class="col-lg-4">
                                <label class="form-label">Origem</label>
                                <select class="form-select">
                                    <option selected disabled>Selecione</option>
                                    <option>Auditoria de Enfermagem</option>
                                    <option>Cadastro</option>
                                    <option>Normas e Regulamentação</option>
                                </select>
                            </div>

                            <div class="col-lg-4">
                                <label class="form-label">Localização Atual</label>
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
                                    <i class="bi bi-hash"></i> Processo
                                </div>
                                <div class="info-value">202402070036</div>
                            </div>

                            <div class="info-card">
                                <div class="info-label">
                                    <i class="bi bi-diagram-3"></i> Origem
                                </div>
                                <div class="info-value">Diretoria</div>
                            </div>

                            <div class="info-card">
                                <div class="info-label">
                                    <i class="bi bi-building"></i> Empresa
                                </div>
                                <div class="info-value">CAFAZ Saúde</div>
                            </div>

                            <div class="info-card">
                                <div class="info-label">
                                    <i class="bi bi-calendar-event"></i> Previsão
                                </div>
                                <div class="info-value">20/08/2025</div>
                            </div>

                        </div>

                        <!-- PESSOA -->
                        <div class="description-box">
                            <div class="section-title">
                                <i class="bi bi-person-badge"></i>
                                Pessoa / Interessado
                            </div>

                            <div class="text-muted">
                                TALLOS TECNOLOGIA INTEGRADA E ASSESSORIA EM NEGÓCIOS LTDA -
                                28.688.116/0001-84
                            </div>
                        </div>

                        <!-- DESCRIÇÃO -->
                        <div class="description-box">
                            <div class="section-title">
                                <i class="bi bi-card-text"></i>
                                Descrição
                            </div>

                            <div class="text-muted">
                                Renovação contratual do serviço de Chatbot — Tallos Licença de uso,
                                usuários adicionais, API oficial e serviço de mensageria via WhatsApp.
                                Contrato com vencimento em 22/03/2024.
                            </div>
                        </div>
                        <!-- ATTACHMENTS -->
                        <div class="mt-5">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h4 class="fw-bold mb-0 fs-16">Anexo</h4>
                                <button class="btn btn-sm">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                            </div>
                            <div class="upload-box text-center">
                                <div class="upload-icon mb-4">
                                    <i class="bi bi-cloud-arrow-up"></i>
                                </div>

                                <p class="text-muted mb-4">
                                    Arraste e solte arquivos do seu computador ou selecione-os para anexá-los a este cartão.
                                </p>

                                <input type="file" id="upload-file" hidden multiple>

                                <button class="btn btn-primary px-4"
                                        onclick="document.getElementById('upload-file').click()">
                                    Arquivo
                                </button>
                            </div>
                        </div>
                        <!-- HISTORY -->
                        <div class="mt-5">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h4 class="fw-bold mb-0 fs-16">Histórico</h4>
                            </div>

                            <div class="history-card">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="history-badge warning">Inbox</span>
                                    <strong>Jul 12</strong>
                                </div>

                                <div class="text-muted small mb-3">17 days</div>

                                <button class="btn btn-link p-0 text-decoration-none small">
                                    <i class="bi bi-chevron-down"></i>
                                    Show more
                                </button>
                            </div>

                            <div class="history-card">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="history-badge primary">Approval</span>
                                    <strong>Jul 30</strong>
                                </div>

                                <div class="text-muted small">4 years</div>
                            </div>
                        </div>


                    </div>
                </div>

                <!-- COLUNA CENTRAL -->
                <div class="process-center">
                    <div class="p-4">
                        <small class="text-primary fw-semibold">
                            From HR Requests - Remote
                        </small>

                        <div class="mt-4">
                            <h4 class="fw-bold">
                                Current phase
                                <span class="badge bg-primary-subtle text-primary ms-2">
                                    Approval
                                </span>
                            </h4>
                        </div>

                        <hr>

                        <div class="mt-4">
                            <h4>Approver</h4>

                            <button class="btn btn-link text-decoration-none p-0 mt-3">
                                + Add assignee
                            </button>
                        </div>

                    </div>
                </div>

                <!-- COLUNA DIREITA -->
                <div class="process-right">
                    <div class="p-4">
                        <h4 class="fw-bold mb-4">Move card to phase</h4>

                        <button class="btn btn-phase w-100 mb-3">
                            Doing
                            <i class="bi bi-arrow-right"></i>
                        </button>

                        <button class="btn btn-phase-danger w-100">
                            Archived
                            <i class="bi bi-arrow-right"></i>
                        </button>

                        <hr class="my-4">

                        <button class="btn btn-outline-secondary w-100 mb-4">
                            <i class="bi bi-arrow-left"></i>
                            Inbox
                        </button>

                        <div class="d-flex flex-column gap-3">
                            <a href="#" class="text-decoration-none text-dark">
                                Move card settings
                            </a>

                            <a href="#" class="text-decoration-none">
                                Move cards with AI
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>


<script src="node_modules/sortablejs/Sortable.min.js"></script>
<script>

//

document.addEventListener('DOMContentLoaded', () => {


    $( "#filter-btn" ).on( "click", function() {

        $("#modal-pesquisa").modal("show");

    });

    $(document).on("click", ".kanban-card", function() {

        $("#modal-detalhe").modal("show");

    });

    const uploadBox = document.querySelector('.upload-box');

    uploadBox.addEventListener('dragover', e => {
        e.preventDefault();
        uploadBox.style.borderColor = '#0d6efd';
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.style.borderColor = '#cbd5e1';
    });

    uploadBox.addEventListener('drop', e => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        console.log(files);
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

