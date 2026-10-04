// ServGui - Loja de bebidas (HTML, CSS e JavaScript puro)

const form = document.querySelector("#form-produto");
const inputNome = document.querySelector("#nome");
const inputPreco = document.querySelector("#preco");
const inputQuantidade = document.querySelector("#quantidade");
const botaoForm = document.querySelector("#botao-form");
const botaoCancelar = document.querySelector("#botao-cancelar");
const tituloForm = document.querySelector("#titulo-formulario");
const mensagem = document.querySelector("#mensagem");
const lista = document.querySelector("#lista-produtos");
const contador = document.querySelector("#contador");
const listaVazia = document.querySelector("#lista-vazia");

// Item da lista que está sendo editado (null = modo "adicionar")
let itemEmEdicao = null;

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function montarTexto(produto) {
  return produto.nome + " - " + formatarPreco(produto.preco) + " (" + produto.quantidade + " un.)";
}

function mostrarErro(texto) {
  mensagem.textContent = texto;
}

function limparErro() {
  mensagem.textContent = "";
}

// Bônus 1 e 2: contador e mensagem de lista vazia
function atualizarResumo() {
  const total = lista.children.length;
  contador.textContent = "Produtos cadastrados: " + total;
  listaVazia.hidden = total > 0;
}

// Volta o formulário ao estado normal (Parte 4)
function sairDoModoEdicao() {
  if (itemEmEdicao) {
    itemEmEdicao.classList.remove("editando");
  }
  itemEmEdicao = null;
  form.reset();
  tituloForm.textContent = "Cadastrar produto";
  botaoForm.textContent = "Adicionar produto";
  botaoCancelar.hidden = true;
  limparErro();
}

function entrarNoModoEdicao(item) {
  if (itemEmEdicao) {
    itemEmEdicao.classList.remove("editando");
  }
  itemEmEdicao = item;
  item.classList.add("editando");

  inputNome.value = item.dataset.nome;
  inputPreco.value = item.dataset.preco;
  inputQuantidade.value = item.dataset.quantidade;

  tituloForm.textContent = "Editar produto";
  botaoForm.textContent = "Salvar alterações";
  botaoCancelar.hidden = false;
  limparErro();
  inputNome.focus();
}

// Guarda os dados no item e atualiza apenas o texto (não recria o item)
function preencherItem(item, produto) {
  item.dataset.nome = produto.nome;
  item.dataset.preco = produto.preco;
  item.dataset.quantidade = produto.quantidade;
  item.querySelector(".item-texto").textContent = montarTexto(produto);
}

function adicionarProduto(produto) {
  const item = document.createElement("li");
  item.className = "item";

  const texto = document.createElement("span");
  texto.className = "item-texto";

  const area = document.createElement("div");
  area.className = "item-botoes";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.className = "btn btn-editar";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", function () {
    entrarNoModoEdicao(item);
  });

  const botaoRemover = document.createElement("button");
  botaoRemover.type = "button";
  botaoRemover.className = "btn btn-remover";
  botaoRemover.textContent = "Remover";
  botaoRemover.addEventListener("click", function () {
    // Se removeu o item que estava sendo editado, não pode sobrar "edição fantasma"
    if (item === itemEmEdicao) {
      sairDoModoEdicao();
    }
    item.remove();
    atualizarResumo();
  });

  area.appendChild(botaoEditar);
  area.appendChild(botaoRemover);
  item.appendChild(texto);
  item.appendChild(area);
  preencherItem(item, produto);

  lista.appendChild(item);
  atualizarResumo();
}

// Bônus 3 + outras validações
function lerEValidarFormulario() {
  const nome = inputNome.value.trim();
  const precoTexto = inputPreco.value.trim().replace(",", ".");
  const quantidadeTexto = inputQuantidade.value.trim();

  if (nome === "") {
    mostrarErro("Informe o nome do produto.");
    inputNome.focus();
    return null;
  }

  const preco = Number(precoTexto);
  if (precoTexto === "" || !Number.isFinite(preco) || preco <= 0) {
    mostrarErro("O preço deve ser um número maior que zero.");
    inputPreco.focus();
    return null;
  }

  const quantidade = Number(quantidadeTexto);
  if (quantidadeTexto === "" || !Number.isFinite(quantidade)) {
    mostrarErro("Informe a quantidade.");
    inputQuantidade.focus();
    return null;
  }
  if (quantidade <= 0) {
    mostrarErro("A quantidade deve ser maior que zero.");
    inputQuantidade.focus();
    return null;
  }
  if (!Number.isInteger(quantidade)) {
    mostrarErro("A quantidade deve ser um número inteiro.");
    inputQuantidade.focus();
    return null;
  }

  return { nome: nome, preco: Math.round(preco * 100) / 100, quantidade: quantidade };
}

form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const produto = lerEValidarFormulario();
  if (!produto) {
    return;
  }

  if (itemEmEdicao) {
    preencherItem(itemEmEdicao, produto); // atualiza o existente
  } else {
    adicionarProduto(produto);
  }

  sairDoModoEdicao();
  inputNome.focus();
});

botaoCancelar.addEventListener("click", sairDoModoEdicao);

// Produtos iniciais da loja
[
  { nome: "Cerveja Pilsen 600 ml", preco: 9.9, quantidade: 48 },
  { nome: "Cerveja IPA Long Neck", preco: 12.5, quantidade: 30 },
  { nome: "Cerveja Lata 350 ml", preco: 4.49, quantidade: 120 },
  { nome: "Vinho Tinto Seco 750 ml", preco: 39.9, quantidade: 15 },
  { nome: "Refrigerante Cola 2 L", preco: 9.5, quantidade: 40 },
  { nome: "Água com Gás 500 ml", preco: 3.2, quantidade: 60 }
].forEach(adicionarProduto);

atualizarResumo();
