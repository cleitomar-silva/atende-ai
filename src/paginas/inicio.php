



<main class="p-4 flex-grow-1">

    <div class="row">
        <div class="col-lg-12">
            <div class="mb-4">
                <h2 class="fw-bold mb-1">Sistema de Protocolo</h2>
                <p class="text-muted mb-0">
                    Gerencie processos, acompanhe pendências e monitore as atividades do sistema.
                </p>
            </div>
        </div>
    </div>

    <div class="row mb-4">

        <div class="col-md-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <small class="text-muted">Pendentes</small>
                    <h3 class="fw-bold mb-0">124</h3>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <small class="text-muted">Em Andamento</small>
                    <h3 class="fw-bold mb-0">89</h3>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <small class="text-muted">Bloqueados</small>
                    <h3 class="fw-bold mb-0">560</h3>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <small class="text-muted">Recebidos hoje</small>
                    <h3 class="fw-bold mb-0">12</h3>
                </div>
            </div>
        </div>
    </div>


    <div class="row mb-3">
        <div class="col-lg-5">
            <div class="card border-0 shadow-sm h-100 bg-white bg-dark">
                <div class="card-header bg-transparent border-0">
                    Buscar
                </div>
                <div class="card-body">
                    <form action="principal.php" method="get" class="mb-5">
                        <div class="input-group">
                            <input type="text" name="" placeholder="Pesquisar processo, assunto ou Pessoa" class="form-control" required="true">

                            <button type="submit" class="btn btn-info btn-modo-dark text-light">
                                <i class="fa-solid fa-magnifying-glass"></i>
                                Pesquisar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-lg-7">
            <div class="card shadow-sm bg-white bg-dark " >
                <div class="card-body">
                    <h5>Recebidos</h5>

                    <canvas id="graficoLinha" height="150" ></canvas>
                </div>
            </div>
        </div>
    </div>


    <div class="row">
        <div class="col-lg-4">
            <div class="card shadow-sm bg-white bg-dark">
                <div class="card-body" >
                    <h5>Situação</h5>

                    <canvas id="graficoRosca" height="100"></canvas>
                </div>
            </div>
        </div>

        <div class="col-lg-8">
            <div class="card bg-white bg-dark border-0  h-100   rounded shadow-sm mb-4">
                <div class="card-header bg-transparent border-0">
                    <h6 class="mb-0 fw-semibold">
                       <!-- <i class="fa-solid fa-clock "></i> -->
                        Processos Pendentes
                    </h6>
                </div>
                <div class="card-body">
                    <table class="table table-hover text-black txt-white">
                        <thead>
                        <tr>
                            <th scope="col">Nº Processo</th>
                            <th scope="col">Assunto</th>
                            <th scope="col">Pessoa</th>
                            <th scope="col">Localização</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        </tbody>


                    </table>
                    <nav aria-label="Page navigation example" class="d-flex justify-content-end">
                        <ul class="pagination">
                            <li class="page-item"><a class="page-link text-black " href="#">Previous</a></li>
                            <li class="page-item"><a class="page-link text-black " href="#">1</a></li>
                            <li class="page-item"><a class="page-link text-black" href="#">2</a></li>
                            <li class="page-item"><a class="page-link text-black " href="#">3</a></li>
                            <li class="page-item"><a class="page-link text-black " href="#">Next</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-lg-12">
            <div class="card bg-white bg-dark border-0  h-100 rounded shadow-sm mb-4">
                <div class="card-header bg-transparent border-0">
                    <h6 class="mb-0 fw-semibold">
                       <!-- <i class="fa-solid fa-hourglass-half"></i> --> Processos em andamento
                    </h6>

                </div>
                <div class="card-body">
                    <table class="table table-hover text-black txt-white">
                        <thead>
                        <tr>
                            <th scope="col">Nº Processo</th>
                            <th scope="col">Assunto</th>
                            <th scope="col">Pessoa</th>
                            <th scope="col">Origem</th>
                            <th scope="col">Localização</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td colspan="2">Larry the Bird</td>
                            <td>@twitter</td>
                            <td>@mdo</td>
                        </tr>
                        </tbody>


                    </table>
                    <nav aria-label="Page navigation example" class="d-flex justify-content-end">
                        <ul class="pagination">
                            <li class="page-item"><a class="page-link text-black " href="#">Previous</a></li>
                            <li class="page-item"><a class="page-link text-black " href="#">1</a></li>
                            <li class="page-item"><a class="page-link text-black" href="#">2</a></li>
                            <li class="page-item"><a class="page-link text-black " href="#">3</a></li>
                            <li class="page-item"><a class="page-link text-black " href="#">Next</a></li>
                        </ul>
                    </nav>
                </div>
            </div>

        </div>
    </div>
</main>

<script src="node_modules/chart.js/dist/chart.umd.js"></script>
<script>
    $(document).ready(function() {
        const ctx = document.getElementById('graficoLinha');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan','Fev','Mar','Abr','Mai','Jun'],
                datasets: [{
                    label: 'Processos',
                    data: [20,40,30,80,25,70],
                    borderColor: '#5b21b6',
                    tension: 0.4,
                    fill: false
                }]
            }
        });

        const ctx2 = document.getElementById('graficoRosca');

        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: [
                    'Pendentes',
                    'Andamento',
                    'Bloqueados',
                    'Cancelados'
                ],
                datasets: [{
                    data: [15, 25, 45, 15],
                    backgroundColor: [
                        '#f59e0b',
                        '#22c55e',
                        '#3b82f6',
                        '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,

                cutout: '85%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 8,
                            boxHeight: 8,
                            padding: 15
                        }
                    }
                }
            }
        });



    });

</script>