<style>


    .card-header{
        padding:18px 24px;
        border-bottom:1px solid #edf0f5 !important;
    }

    .card-body{
        padding:24px;
    }



    .form-control:focus,
    .form-select:focus{
        box-shadow:0 0 0 .25rem rgba(13,110,253,.15);
    }

    .upload-area{
        background:#fafbff;
        transition:.3s;
        cursor:pointer;
    }

    .upload-area:hover{
        background:#f0f4ff;
        border-color:#0d6efd !important;
    }
</style>

<main class="p-4 flex-grow-1">
    <div class="row">
        <div class="col-lg-12">
            <div class="mb-4">
                <h2 class="fw-bold mb-1"></h2>
                <p class="text-muted mb-0">
                    Processo
                </p>
            </div>
        </div>
    </div>
    <div class="row mb-3">
        <div class="col-lg-12">
            <div class="card border-0 shadow-sm h-100 bg-white bg-dark">
                <div class="card-header bg-transparent border-0">
                    Cadastro
                </div>
                <div class="card-body">
                    <form action="principal.php" method="get" class="mb-5">

                        <!--
                        <div class="row">
                            <div class="col-lg-2">
                                <div class="form-floating mb-3">
                                    <input type="date" class="form-control" id="data" placeholder="">
                                    <label for="data">Data</label>
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="form-floating">
                                    <select class="form-select" id="origem">
                                        <option value="1">Tecnologia da informação</option>
                                        <option value="2">Financeiro</option>
                                        <option value="3">Operacional</option>
                                    </select>
                                    <label for="origem">Origem</label>
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="form-floating">
                                    <select class="form-select" id="user-permission">
                                        <option value="1">Alicia Vasconcelos</option>
                                        <option value="2">Antônio Sabino</option>
                                        <option value="3">Annie Clivia Costa de Castro</option>
                                    </select>
                                    <label for="user-permission">Restringir processo aos usuários</label>
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="form-floating">
                                    <select class="form-select" id="assunto">
                                        <option value="1">CARTA DE MANUTENÇÃO DE INDICE</option>
                                        <option value="2">AÇÃO DIA DOS PAIS</option>
                                    </select>
                                    <label for="assunto">Assunto</label>
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="form-floating">
                                    <select class="form-select" id="pessoa-processo">
                                        <option value="1">Aristófanes Canamary  - 06157530359</option>
                                        <option value="2">Jose Haroldo de Sousa  - 64335852000112</option>
                                    </select>
                                    <label for="pessoa-processo">Pessoa / Interessado</label>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class="form-floating">
                                    <select class="form-select" id="empresa">
                                        <option value="1">Cafaz</option>
                                        <option value="2">Cafaz Corretora</option>
                                    </select>
                                    <label for="empresa">Empresa</label>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class="form-floating mb-3">
                                    <input type="date" class="form-control" id="previsao" placeholder="">
                                    <label for="previsao">Previsão</label>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class="form-floating mb-3">
                                    <input type="date" class="form-control" id="agenda-financeira" placeholder="">
                                    <label for="agenda-financeira">Agenda Financeira</label>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="valor-processo" placeholder="">
                                    <label for="valor-processo">Valor</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-floating">
                                    <textarea class="form-control" placeholder="Leave a comment here" id="descricao" style="height: 100px"></textarea>
                                    <label for="descricao">Descrição</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label for="arquivos" class="form-label">Arquivos</label>
                                    <input class="form-control" type="file" id="arquivos">
                                </div>
                            </div>
                        </div>
                        -->

                        <div class="card border-0 shadow-sm mb-4 bg-white bg-dark">
                            <div class="card-header bg-white bg-dark">
                                <h5 class="mb-0">
                                    <i class="bi bi-file-earmark-text me-2"></i>
                                    Informações Gerais
                                </h5>
                            </div>

                            <div class="card-body">
                                <div class="row g-3">

                                    <div class="col-md-3">
                                        <div class="form-floating">
                                            <input type="date" class="form-control" id="data">
                                            <label>Data do Processo</label>
                                        </div>
                                    </div>

                                    <div class="col-md-3">
                                        <div class="form-floating">
                                            <input type="date" class="form-control" id="previsao">
                                            <label>Previsão</label>
                                        </div>
                                    </div>

                                    <div class="col-md-3">
                                        <div class="form-floating">
                                            <input type="date" class="form-control" id="agenda-financeira">
                                            <label>Agenda Financeira</label>
                                        </div>
                                    </div>

                                    <div class="col-md-3">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="valor-processo">
                                            <label>Valor</label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="card border-0 shadow-sm mb-4 bg-white bg-dark">
                            <div class="card-header bg-white bg-dark">
                                <h5 class="mb-0">
                                    <i class="bi bi-diagram-3 me-2"></i>
                                    Classificação
                                </h5>
                            </div>

                            <div class="card-body">
                                <div class="row g-3">

                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <select class="form-select" id="origem">
                                                ...
                                            </select>
                                            <label>Origem</label>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <select class="form-select" id="assunto">
                                                ...
                                            </select>
                                            <label>Assunto</label>
                                        </div>
                                    </div>

                                    <div class="col-md-4">
                                        <div class="form-floating">
                                            <select class="form-select" id="empresa">
                                                ...
                                            </select>
                                            <label>Empresa</label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="card border-0 shadow-sm mb-4 bg-white bg-dark">
                            <div class="card-header bg-white bg-dark">
                                <h5 class="mb-0">
                                    <i class="bi bi-people me-2"></i>
                                    Participantes
                                </h5>
                            </div>

                            <div class="card-body">
                                <div class="row g-3">

                                    <div class="col-md-6">
                                        <div class="form-floating">
                                            <select class="form-select">
                                                ...
                                            </select>
                                            <label>Usuários com acesso</label>
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="form-floating">
                                            <select class="form-select">
                                                ...
                                            </select>
                                            <label>Pessoa / Interessado</label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="card border-0 shadow-sm mb-4 bg-white bg-dark">
                            <div class="card-header bg-white bg-dark">
                                <h5 class="mb-0">
                                    <i class="bi bi-chat-left-text me-2"></i>
                                    Descrição e Documentos
                                </h5>
                            </div>

                            <div class="card-body">

                                <div class="form-floating mb-4">
                                    <textarea
                                        class="form-control"
                                        id="descricao"
                                        style="height:150px"></textarea>

                                    <label>Descrição do Processo</label>
                                </div>

                                <div class="upload-area border border-2 border-dashed rounded p-5 text-center">
                                    <i class="bi bi-cloud-arrow-up fs-1 text-primary"></i>

                                    <h6 class="mt-3">
                                        Arraste arquivos aqui
                                    </h6>

                                    <p class="text-muted">
                                         clique para selecionar
                                    </p>

                                    <input type="file"
                                           class="form-control"
                                           multiple>
                                </div>

                            </div>
                        </div>
                        <div class="d-flex justify-content-end gap-2">

                            <button type="button"
                                    class="btn btn-light btn-modo-dark">
                                Cancelar
                            </button>

                            <button type="submit"
                                    class="btn btn-success px-4 btn-modo-dark">
                                <i class="bi bi-check-circle me-1"></i>
                                Salvar Processo
                            </button>

                        </div>








                    </form>
                </div>
            </div>
        </div>
    </div>
</main>