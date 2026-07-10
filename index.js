// Mapeamento dos elementos

let filtroAtual = 'todas';

// -- Mapeamento dos elementos do HTML
const inputTarefa = document.getElementById("textNovaTarefa");
const btnAdicionar = document.getElementById("btnAdicionar");
const listaTarefas = document.getElementById("listaTarefas");
const contadorTarefas = document.getElementById("contadorTarefas");
const btnLimparConcluidas = document.getElementById("btnLimparTodas");

// -- Mapeamento dos botões de filtro
const btnTodas = document.getElementById('btnFiltroTodas');
const btnPendentes = document.getElementById('btnFiltroPendentes');
const btnConcluidas = document.getElementById('btnFiltroConcluidas');

// -- Recupera as tarefas do LocalStorage ou inicializa como um array vazio
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// Funções para adicionar nova tela
function renderizarTarefas() {
    listaTarefas.innerHTML = "";

    tarefas.forEach((tarefa, index) => {

        if (filtroAtual === 'pendentes' && tarefa.concluida) return;
        if (filtroAtual === 'concluidas' && !tarefa.concluida) return;

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <div class="form-check m-0">
                <input class="form-check-input" type="checkbox" id="check-${index}" ${tarefa.concluida ? "checked" : ''} onchange="alternarTarefa(${index})">
                <label class="form-check-label ${tarefa.concluida ? 'concluida' : ''}" for="check-${index}">
                    ${tarefa.texto}
                </label>
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="deletarTarefa(${index})">
            &times;
            </button>
        `;
        listaTarefas.appendChild(li);
    });

    atualizarContador();
}

// Criar a função para alternar o status da tarefa

// -- Função para adicionar nova tarefa
function adicionarTarefa() {
    const texto = inputTarefa.value.trim();

    // -- SweetAlert2 para exibir uma mensagem de erro se o campo estiver vazio
    if (texto === '') {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Por favor, digite uma nova tarefa!",
            confirmButtonColor: "#0d6efd"
        });
        return;
    }

    const novaTarefa = {
        texto: texto,
        concluida: false
    };

    tarefas.push(novaTarefa);

    salvarNoLocalStorage();

    renderizarTarefas();
    inputTarefa.value = '';
    inputTarefa.focus();
}

function salvarNoLocalStorage() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Função para atualizar o contador de pendências

// -- Função para marcar como concluída ou não uma tarefa
window.alternarTarefa = function(index) {
    tarefas[index].concluida = !tarefas[index].concluida;
    salvarNoLocalStorage();
    renderizarTarefas();
}

// Função para deletar uma tarefa específica
window.deletarTarefa = function(index) {
    tarefas.splice(index, 1); // remove a tarefa do array
    salvarNoLocalStorage();
    renderizarTarefas();
}

// Atualiza o contador do card-footer, que é a lista lá embaixo
function atualizarContador() {
    const pendentes = tarefas.filter(t => !t.concluida).length;
    contadorTarefas.textContent = `${pendentes} Tarefa${pendentes !== 1 ? 's' : ''} Pendente${pendentes !== 1 ? 's' : ''}`;
    }

// Função para alternar a cor cinza escuro (active) do Bootstrap entre eles
function atualizarEstiloBotoes(botaoAtivo) {
    btnTodas.classList.remove('active');
    btnPendentes.classList.remove('active');
    btnConcluidas.classList.remove('active');
    botaoAtivo.classList.add('active');
}

// Criar o evento de clique para cada um
btnTodas.addEventListener('click', () => {
    filtroAtual = 'todas';
    atualizarEstiloBotoes(btnTodas);
    renderizarTarefas(); // Recarrega a lista aplicando o filtro
});

btnPendentes.addEventListener('click', () => {
    filtroAtual = 'pendentes';
    atualizarEstiloBotoes(btnPendentes);
    renderizarTarefas();
});

btnConcluidas.addEventListener('click', () => {
    filtroAtual = 'concluidas';
    atualizarEstiloBotoes(btnConcluidas);
    renderizarTarefas();
});

btnLimparConcluidas.addEventListener('click', (e) => {
    e.preventDefault();
    tarefas = tarefas.filter(tarefa => !tarefa.concluida);
    salvarNoLocalStorage();
    renderizarTarefas();
});

document.getElementById('form1').addEventListener('submit', (e) => {
    e.preventDefault(); 
    adicionarTarefa();
});

btnAdicionar.addEventListener('click', adicionarTarefa);

renderizarTarefas();