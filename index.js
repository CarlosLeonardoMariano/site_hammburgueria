const btnAbrirCarrinho = document.getElementById("cart-btn")
const menuLanche = document.getElementById('menu')
const modal = document.getElementById("modal")
const btnFecharModal = document.getElementById("btn-model-fechar")
const bntFinalizar = document.getElementById('bnt-finalizar')
const endereco = document.getElementById('endereco')
const enderecoErro = document.getElementById("endereco_erro");
const itensCarrinho = document.getElementById('cart-itens')
const totalValor = document.getElementById('cart-total')
const ContarItens = document.getElementById('cart-count')
const horario = document.getElementById("date-span")
const enderecoNumero = document.getElementById("endereco_numero")
const endereco_nome =  document.getElementById("endereco_nome")
const referencia = document.getElementById("endereco_referencia")

let carrinho = []


// função para abrir meu modal
btnAbrirCarrinho.addEventListener("click", () =>{
    updateModal()
    modal.style.display = 'flex'
});


// função para fechar meu modal clicando no botão fechar
btnFecharModal.addEventListener('click', ()=>{
  modal.style.display = 'none'
});


// função para fechar meu modal clicando em qualquer lugar da tela
modal.addEventListener('click',function(evento){
if(evento.target === modal){
    modal.style.display = 'none'}})





menuLanche.addEventListener('click', function(evt) {
    let parentButton = evt.target.closest(".add-lanches-btn");
    if (parentButton) {
        const parentDiv = parentButton.closest(".flex.items-center");
        const dataName = parentDiv.getAttribute('data-name');
        const dataPrice = parseFloat(parentDiv.getAttribute('data-price'));
       addItemCarrinho(dataName,dataPrice)
    }
});




function addItemCarrinho(dataName,dataPrice){
    const verItemExistente = carrinho.find(item => item.dataName === dataName)

    if(verItemExistente){ // comeco do if
        // se item ja estiver no carrinho ele vai aumentar a quantidade
        verItemExistente.quantidade +=1;} // final do if

else {  // comeco do else

    carrinho.push({ // comeco do objeto
    dataName,
    dataPrice,
    quantidade:1,
}) // final do objeto
} // final do else
updateModal()

} // final da funcão








//função para aparecer os itens no modal




function updateModal() {
    itensCarrinho.innerHTML = "";
    let total = 0; // Total definido aqui

    const modalConteudo = document.createElement('div');
    modalConteudo.classList.add('modal-conteudo', 'max-h-60', 'overflow-y-auto');

    carrinho.forEach(item => {
        const cartElementoNovo = document.createElement('div');
        cartElementoNovo.classList.add('flex', 'justify-between', 'mb-4', 'flex-col');
        cartElementoNovo.innerHTML = `
            <div class="flex items-center justify-between px-1 mt-0">
                <div>
                    <p class="font-bold">${item.dataName}</p>
                    <p class="font-medium">QTD: ${item.quantidade}</p>
                    <p class="font-semibold mt-1 mb-1">R$ ${item.dataPrice.toFixed(2)}</p>
                </div>
                <button class="py-1 px-1 border-none bg-red-600 text-white rounded-full justify-center items-center remove_btn" data-name="${item.dataName}">
                    <img src= './imagens_cardapio/delete_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png'  class="w-8 h-8" >
                </button>
            </div>`;

        total += item.dataPrice * item.quantidade; // Acumula o total
        modalConteudo.appendChild(cartElementoNovo);
    });

    itensCarrinho.appendChild(modalConteudo); // Adiciona ao modal apenas uma vez

    // Atualizar a contagem de itens no carrinho
    ContarItens.innerHTML = carrinho.length;

    // Exibir total formatado
    totalValor.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // Adicionando evento de clique para remover item
    const removeButtons = document.querySelectorAll('.remove_btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.dataset.name;
            // Chame uma função para remover o item do carrinho
            removeItemFromCart(itemName);
        });
    });
}

function removeItemFromCart(itemName) {
    // Lógica para remover o item do carrinho
    carrinho = carrinho.filter(item => item.dataName !== itemName);
    updateModal(); // Atualiza o modal após remoção
}


// Função para remover dentro do carrinho
itensCarrinho.addEventListener('click', function(evt) {
    if (evt.target.classList.contains("remove_btn")) {
        const name = evt.target.getAttribute("data-name");
        removeItemCard(name); // Passa o nome do item para a função
    }
});

function removeItemCard(name) {
    const index = carrinho.findIndex(item => item.dataName === name);

    if (index !== -1) {
        const item = carrinho[index];

        if (item.quantidade > 1) {
            item.quantidade -= 1;
        } else {
            carrinho.splice(index, 1);
        }
        
        updateModal(); // Atualiza o modal após a remoção
    }
}


// Validação do nome do endereço
endereco_nome.addEventListener('input', function(evt) { 
    let inputName = evt.target.value;

    // Se o input não estiver vazio, remova a borda vermelha e esconda a mensagem de erro
    if (inputName !== "") {
        endereco_nome.classList.remove('border-red-500');
        enderecoErro.classList.add("hidden");
    } else {
        // Se o campo estiver vazio, mantenha a borda vermelha
        endereco_nome.classList.add('border-red-500');
        enderecoErro.classList.remove("hidden");
    }
});

// Validação do endereço
endereco.addEventListener('input', function(evento) {
    let inputValue = evento.target.value;

    // Se o input não estiver vazio, remova a borda vermelha e esconda a mensagem de erro
    if (inputValue !== "") {
        endereco.classList.remove('border-red-500');
        enderecoErro.classList.add("hidden");
    } else {
        // Se o campo estiver vazio, mantenha a borda vermelha
        endereco.classList.add('border-red-500');
        enderecoErro.classList.remove("hidden");
    }
});


enderecoNumero.addEventListener('input', function(evento){
    let inputNumero = evento.target.value;
        if(inputNumero !== ""){
            enderecoNumero.classList.remove("border-red-500");
                enderecoErro.classList.add("hidden");
    }
})

// Finalizando o pedido
bntFinalizar.addEventListener('click', () => {
    // Verifica se o restaurante está aberto
    const verificarAberto = horarioRestaurante();
    if (!verificarAberto) { 
        Toastify({
            text: "RESTAURANTE FECHADO",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) return;

    // Verifica se o endereço está preenchido
    if (endereco.value === "") {
        enderecoErro.classList.remove("hidden");
        endereco.classList.add('border-red-500');
        return;
    }

    // Verifica se o nome do endereço está preenchido
    if (endereco_nome.value === "") {
        enderecoErro.classList.remove('hidden');
        endereco_nome.classList.add('border-red-500');
        return;
    }

    if(enderecoNumero.value === ""){
        enderecoErro.classList.remove('hidden');
        enderecoNumero.classList.add("border-red-500");
        return;
    
    }

    







        // Enviar Via Whatsapp
        const whatsapp = carrinho.map((item) => {
            return `PEDIDOS: ${item.dataName}\nQUANTIDADE: ${item.quantidade}\nPreço: R$ ${item.dataPrice}\n-------------------------------------------------\n`;
          }).join("");
          
          const msg = encodeURIComponent(`${whatsapp}\n NOME: ${endereco_nome.value}\n ENDEREÇO: ${endereco.value}\n NUMERO: ${enderecoNumero.value}\n PONTO DE REFERENCIA: ${referencia.value}\n VALOR TOTAL: R$ ${totalValor.textContent}`);
            const phone = "+5511973245437";
                window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
                    carrinho.length = 0;
                        updateModal();
          
})
  



                // FUNÇÃO HORARIO 
function horarioRestaurante(){
    const data = new Date();
        const hora = data.getHours();
            return hora >= 1 && hora < 24;  // verdadeiro se estiver aberto
}

                const horario_Aberto = horarioRestaurante();
                    if (horario_Aberto) {
                        horario.classList.remove('bg-red-600');
                            horario.classList.add('bg-green-600');
                                } else {
                            horario.classList.remove('bg-green-600');
                        horario.classList.add('bg-red-600');
                    }



                    const panel = document.getElementById('panel');
    const closeButton = document.getElementById('close-button');
    const dateSpan = document.getElementById('date-span');

    dateSpan.addEventListener('click', () => {
        panel.classList.toggle('-translate-y-full'); // Mostra o painel
        panel.classList.toggle('translate-y-1/5'); // Mover para baixo até a metade
    });

    closeButton.addEventListener('click', () => {
        panel.classList.add('-translate-y-full'); // Oculta o painel
        panel.classList.remove('translate-y-1/5'); // Reseta a posição
    });

