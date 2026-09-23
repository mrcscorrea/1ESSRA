// app.js

// 1. Mapeamento dos Elementos do DOM
const campoNome = document.getElementById('campoNome');
const campoCpf = document.getElementById('campoCpf');
const campoEmail = document.getElementById('campoEmail');
const campoCelular = document.getElementById('campoCelular');
const campoArtista = document.getElementById('campoArtista');
const listaArtistas = document.getElementById('listaArtistas');
const btnCadastrar = document.getElementById('btnCadastrar');
const divResultado = document.getElementById('painelResultado');

// 2. FUNÇÃO: Popular o Datalist (Busca Pesquisável de Artistas)
function popularDatalistArtistas(lista) {
    listaArtistas.innerHTML = '';
    lista.forEach((artista) => {
        const option = document.createElement('option');
        // O valor exibido na busca conterá Origem, Nome, Estilo e Dia do Show
        option.value = `[${artista.origem}] ${artista.nome} (${artista.estilo}) - ${artista.dia}`;
        listaArtistas.appendChild(option);
    });
}

// 3. FUNÇÃO: Validação Matemática Algorítmica do CPF
function validarCPF(cpf) {
    // Limpa pontuações mantendo apenas números
    cpf = cpf.replace(/\D/g, '');

    // Verifica tamanho de 11 dígitos ou sequências repetidas
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    // Cálculo do 1º Dígito Verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    // Cálculo do 2º Dígito Verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true; // CPF Válido
}

// 4. Máscaras Dinâmicas (CPF e Celular)
campoCpf.addEventListener('input', function() {
    let valor = campoCpf.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    campoCpf.value = valor;
});

campoCelular.addEventListener('input', function() {
    let valor = campoCelular.value.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    campoCelular.value = valor;
});

// 6. Processamento do Formulário ao Clicar no Botão
btnCadastrar.addEventListener('click', function() {
    // Array com os campos estritamente OBRIGATÓRIOS (Celular mantido fora)
    const camposObrigatorios = [campoNome, campoCpf, campoEmail, campoArtista];
    let temCampoVazio = false;

    // Validação de Preenchimento Obrigatório
    camposObrigatorios.forEach(campo => {
        if (campo.value.trim() === '') {
            campo.classList.add('campo-erro');
            temCampoVazio = true;
        } else {
            campo.classList.remove('campo-erro');
        }
    });

    if (temCampoVazio) {
        divResultado.className = 'msg-erro';
        divResultado.innerText = 'Atenção: Preencha todos os campos obrigatórios em destaque!';
        return;
    }
    
    // Validação Matemática do CPF
    if (!validarCPF(campoCpf.value)) {
        campoCpf.classList.add('campo-erro');
        divResultado.className = 'msg-erro';
        divResultado.innerText = 'Atenção: O CPF digitado é inválido!';
        return;
    }

    // Objeto com os dados para salvar
    const dadosReserva = {
        nome: campoNome.value.trim(),
        cpf: campoCpf.value.trim(),
        email: campoEmail.value.trim(),
        celular: campoCelular.value.trim(), // OPCIONAL
        artista: campoArtista.value.trim()
    };

    const comprovante = `
    === PRÉ-CADASTRO DE INGRESSO ROCK IN RIO ===
    Nome: ${dadosReserva.nome}
    CPF: ${dadosReserva.cpf}
    E-mail: ${dadosReserva.email}
    Celular: ${dadosReserva.celular}
    Atração Selecionada: ${dadosReserva.artista}
    ===========================================
    `;

    // Nome dinâmico do arquivo
    const nomeArquivo = `ingresso_${dadosReserva.nome
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')}.txt`;

    // Gera e baixa o comprovante
    exportTxtFile(nomeArquivo, comprovante);

    // Mensagem de Sucesso na Tela
    divResultado.className = 'msg-sucesso';
    divResultado.innerText = `Intenção de compra registrada com sucesso para: ${dadosReserva.artista}! Comprovante exportado.`;
});

// Inicialização: Carrega os dados de artistasData.js dentro do Datalist
    popularDatalistArtistas(artistasData);