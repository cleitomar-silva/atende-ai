<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atende Aí</title>

    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="node_modules/@fortawesome/fontawesome-free/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">

    <!-- script -->
    <script src="node_modules/jquery/dist/jquery.min.js"></script>
</head>
<body>
<!-- Container Principal -->
<div class="d-flex">
    <!-- Menu Lateral -->
    <aside id="sidebar" class="text-white">
        <!-- Cabeçalho -->
        <div class="p-4 border-bottom border-secondary d-flex align-items-center gap-3 flex-shrink-0">
            <a href="./" class="bg-info p-2 rounded text-decoration-none text-light">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
            </a>
            <div>
                <h1 class="h5 fw-bold text-white-50">
                    <a href="./" class="text-decoration-none text-light">Atende Aí</a>
                </h1>
                <p class="small text-white-50 mb-0">v1.0</p>
            </div>
        </div>

        <!-- Opções do Menu -->
        <nav class="menu-nav-container menu-scrollbar">
            <ul class="list-unstyled space-y-2">
                <li><a href="#" data-menu="processo" class="menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><polyline points="7 8 9 10 13 6"></polyline><line x1="7" y1="14" x2="17" y2="14"></line><line x1="7" y1="18" x2="17" y2="18"></line></svg><span>Processo</span></a></li>
                <li><a href="#" data-menu="chamado" class="menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg><span>Chamado</span></a></li>
                <li><a href="#" data-menu="configuracoes" class="menu-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg><span>Configurações</span></a></li>
            </ul>
        </nav>

        <!-- Rodapé -->
        <div class="p-3 border-top border-secondary small text-white-50 flex-shrink-0">
            <p class="mb-0">© 2023 SistemaGestão</p>
            <p class="mb-0">Todos os direitos reservados</p>
        </div>
    </aside>

    <!-- Submenus -->
    <div id="submenu-container">
        <div id="submenu-processo" class="submenu">
            <div class="p-4 border-bottom border-secondary">
                <h2 class="h5 fw-bold">Processo</h2>
                <p class="small text-white-50 mb-0">Gerencie seus processos</p>
            </div>
            <nav class="p-3 menu-scrollbar overflow-auto">
                <ul class="list-unstyled space-y-2">
                    <li><a href="processo-novo" class="submenu-item"><i class="fa-solid fa-plus fa-fw w-6"></i><span>Novo</span></a></li>
                    <li><a href="processo" class="submenu-item"><i class="fa-solid fa-magnifying-glass fa-fw w-6"></i><span>Pesquisa</span></a></li>
                    <li><a href="#" class="submenu-item"><i class="fa-solid fa-book"></i><span>Plano de contas</span></a></li>
                    <li><a href="#" class="submenu-item"><i class="fas fa-exchange-alt fa-fw w-6"></i><span>Movimentação em massa</span></a></li>
                    <li><a href="#" class="submenu-item"><i class="fas fa-chart-bar fa-fw w-6"></i><span>Relatório</span></a></li>
                </ul>
            </nav>
        </div>
        <div id="submenu-chamado" class="submenu">
            <div class="p-4 border-bottom border-secondary">
                <h2 class="h5 fw-bold">Chamado</h2>
                <p class="small text-white-50 mb-0">Gerencie seus chamados</p>
            </div>
            <nav class="p-3 menu-scrollbar overflow-auto">
                <ul class="list-unstyled space-y-2">
                    <li><a href="#" class="submenu-item"><i class="fas fa-plus fa-fw w-6"></i><span>Novo</span></a></li>
                    <li><a href="chamados" class="submenu-item"><i class="fas fa-search fa-fw w-6"></i><span>Pesquisa</span></a></li>
                    <li><a href="#" class="submenu-item"><i class="fas fa-chart-line fa-fw w-6"></i><span>Indicadores</span></a></li>
                    <li><a href="#" class="submenu-item"><i class="fas fa-tags fa-fw w-6"></i><span>Tipos de chamado</span></a></li>
                    <li><a href="#" class="submenu-item"><i class="fas fa-info-circle fa-fw w-6"></i><span>Situação de Chamado</span></a></li>
                    <li><a href="#" class="submenu-item"><i class="fas fa-clock fa-fw w-6"></i><span>Tipo de apontamento</span></a></li>
                </ul>
            </nav>
        </div>
        <div id="submenu-configuracoes" class="submenu">
            <div class="p-4 border-bottom border-secondary">
                <h2 class="h5 fw-bold">Configurações</h2>
                <p class="small text-white-50 mb-0">Configurações do sistema</p>
            </div>
            <nav class="p-3 menu-scrollbar overflow-auto">
                <ul class="list-unstyled space-y-2">
                    <li><a href="#" class="submenu-item"><i class="fas fa-user fa-fw w-6"></i><span>Usuários</span></a></li>
                    <li><a href="#" class="submenu-item"><i class="fas fa-building fa-fw w-6"></i><span>Setor</span></a></li>
                    <li><a href="#" class="submenu-item"><i class="fas fa-sticky-note fa-fw w-6"></i><span>Assunto</span></a></li>
                </ul>
            </nav>
        </div>
    </div>

    <!-- Conteúdo Principal -->
    <div id="main-content">
        <header class="bg-blur p-3 d-flex align-items-center justify-content-between sticky-top">
            <div class="d-flex align-items-center gap-3">
                <button id="menu-toggle" class="btn btn-link text-secondary p-2 rounded-lg" style="color: #5b6879;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div class="d-flex align-items-center">
                    <button id="search-toggle" class="btn btn-link text-secondary p-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                    <div id="search-container" class="d-none ms-2">
                        <input type="text" placeholder="Digite sua pesquisa..." class="search-input">
                    </div>
                </div>
            </div>

            <div class="flex-grow-1 text-center">
                <h1 class="h5 mb-0 text-dark dark-mode:text-white"></h1>
            </div>

            <div class="d-flex align-items-center gap-3">
                <!-- Tema -->
                <div class="position-relative">
                    <button id="theme-toggle" class="btn btn-link text-secondary p-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    </button>
                    <div id="theme-menu" class="dropdown-menu-custom">
                        <a href="#" data-theme="dark" class="theme-option"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg><span>Escuro</span></a>
                        <a href="#" data-theme="light" class="theme-option"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg><span>Claro</span></a>
                    </div>
                </div>

                <!-- Notificação -->
                <div class="position-relative">
                    <button class="btn btn-link text-secondary p-2 position-relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        <span class="notification-badge">3</span>
                    </button>
                </div>

                <!-- Usuário -->
                <div class="position-relative">
                    <button id="user-menu-toggle" class="btn btn-link text-secondary p-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </button>
                    <div id="user-menu" class="dropdown-menu-custom" style="width: 16rem;">
                        <div class="bg-info p-3 d-flex gap-3">
                            <div class="bg-white rounded-circle d-flex align-items-center justify-content-center" style="width:48px;height:48px;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#04a9f5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <div><h6 class="fw-bold text-white">João Silva</h6><p class="small text-white-50 mb-0">joao.silva@empresa.com</p></div>
                        </div>
                        <div class="py-2">
                            <a href="#" class="user-option"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg><span>Mudar Senha</span></a>
                            <a href="#" class="user-option"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg><span>Minha Conta</span></a>
                            <a href="#" class="user-option border-top"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg><span class="fw-medium">Sair do Sistema</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- conteudo pagina -->
        <?php include $conteudo; ?>


    </div>

</div>


<!-- script global -->
<script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
<script>
    // Mesmo JavaScript original, adaptado para as novas classes CSS
    let menuVisible = true;
    let submenuVisible = false;
    let activeMenu = null;
    let searchVisible = false;
    let darkMode = false;

    const sidebar = document.getElementById('sidebar');
    const submenuContainer = document.getElementById('submenu-container');
    const mainContent = document.getElementById('main-content');
    const menuToggle = document.getElementById('menu-toggle');
    const searchToggle = document.getElementById('search-toggle');
    const searchContainer = document.getElementById('search-container');
    const themeToggle = document.getElementById('theme-toggle');
    const themeMenu = document.getElementById('theme-menu');
    const userMenuToggle = document.getElementById('user-menu-toggle');
    const userMenu = document.getElementById('user-menu');
    const menuItems = document.querySelectorAll('.menu-item');
    const submenus = document.querySelectorAll('.submenu');
    const themeOptions = document.querySelectorAll('.theme-option');
    const body = document.body;

    // toggle menu hamburger
    menuToggle.addEventListener('click', () => {
        menuVisible = !menuVisible;
        if (menuVisible) {
            body.classList.remove('menu-collapsed');
            submenuContainer.style.left = '16rem';
            mainContent.style.marginLeft = '16rem';
            if (activeMenu) {
                submenuContainer.classList.add('opacity-100');
                submenuContainer.classList.remove('opacity-0');
            }
        } else {
            body.classList.add('menu-collapsed');
            submenuContainer.style.left = '0';
            mainContent.style.marginLeft = '0';
            submenuContainer.classList.remove('opacity-100');
            submenuContainer.classList.add('opacity-0');
            submenus.forEach(s => s.classList.remove('active-submenu'));
            menuItems.forEach(m => m.classList.remove('active-menu-item'));
            activeMenu = null;
            submenuVisible = false;
        }
    });

    // busca toggle
    searchToggle.addEventListener('click', () => {
        searchVisible = !searchVisible;
        if (searchVisible) {
            searchContainer.classList.remove('d-none');
            searchContainer.classList.add('d-block');
            setTimeout(() => searchContainer.querySelector('input').focus(), 100);
        } else {
            searchContainer.classList.add('d-none');
            searchContainer.classList.remove('d-block');
        }
    });

    // temas
    themeToggle.addEventListener('click', (e) => { e.stopPropagation(); themeMenu.classList.toggle('show'); });
    userMenuToggle.addEventListener('click', (e) => { e.stopPropagation(); userMenu.classList.toggle('show'); });

    document.addEventListener('click', (e) => {
        if (!themeToggle.contains(e.target) && !themeMenu.contains(e.target)) themeMenu.classList.remove('show');
        if (!userMenuToggle.contains(e.target) && !userMenu.contains(e.target)) userMenu.classList.remove('show');
    });

    // menu items -> submenu
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const menuType = item.getAttribute('data-menu');
            menuItems.forEach(m => m.classList.remove('active-menu-item'));

            if (activeMenu === menuType) {
                submenuContainer.classList.remove('opacity-100');
                submenuContainer.classList.add('opacity-0');
                submenus.forEach(s => s.classList.remove('active-submenu'));
                activeMenu = null;
                submenuVisible = false;
                return;
            }

            submenus.forEach(s => s.classList.remove('active-submenu'));
            const target = document.getElementById(`submenu-${menuType}`);
            if (target) target.classList.add('active-submenu');

            item.classList.add('active-menu-item');
            activeMenu = menuType;
            submenuContainer.classList.add('opacity-100');
            submenuContainer.classList.remove('opacity-0');
            submenuVisible = true;
        });
    });

    // troca tema
    themeOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const theme = opt.getAttribute('data-theme');
            if (theme === 'dark') {
                body.classList.add('dark-mode');
                darkMode = true;
                themeToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
            } else {
                body.classList.remove('dark-mode');
                darkMode = false;
                themeToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
            }
            themeMenu.classList.remove('show');
        });
    });

    // fechar submenu clicando fora
    document.addEventListener('click', (e) => {
        if (submenuVisible && !sidebar.contains(e.target) && !submenuContainer.contains(e.target)) {
            submenuContainer.classList.remove('opacity-100');
            submenuContainer.classList.add('opacity-0');
            submenus.forEach(s => s.classList.remove('active-submenu'));
            menuItems.forEach(m => m.classList.remove('active-menu-item'));
            activeMenu = null;
            submenuVisible = false;
        }
    });

    // inicial
    submenuContainer.style.left = '16rem';
</script>
</body>
</html>