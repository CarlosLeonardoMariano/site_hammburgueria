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
    let total = 0;

    // Criar a div que terá a classe para rolagem
    const modalConteudo = document.createElement('div');
    modalConteudo.classList.add('modal-conteudo', 'max-h-60', 'overflow-y-auto'); // Use Tailwind para altura e rolagem

    carrinho.forEach(item => {
        const cartElementoNovo = document.createElement('div');
        cartElementoNovo.classList.add('flex', 'justify-between', 'mb-4', 'flex-col');
        cartElementoNovo.innerHTML = `
            <div class="flex items-center justify-between border-black border-2 px-2 mt-0">
                <div>
                    <p class="font-bold">${item.dataName}</p>
                    <p class="font-medium">QTD: ${item.quantidade}</p>
                    <p class="font-semibold mt-2 mb-2">R$ ${item.dataPrice.toFixed(2)}</p>
                </div>
                <button class="py-2 px-2 bg-red-600 text-white rounded-lg justify-center items-center remove_btn" data-name="${item.dataName}">REMOVER ITENS</button>
            </div>`;

        total += item.dataPrice * item.quantidade;
        modalConteudo.appendChild(cartElementoNovo);
    });

    // Exibir total formatado
    totalValor.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // Adicionar o modalConteudo ao itensCarrinho
    itensCarrinho.appendChild(modalConteudo);

    // Atualizar a contagem de itens no carrinho
    ContarItens.innerHTML = carrinho.length;
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



// validando a entrega
endereco.addEventListener('input', function(evento){
    let inputValue = evento.target.value;

    if(inputValue !== ""){
        endereco.classList.remove('border-red-500')
        enderecoErro.classList.add("hidden")
    }})






  // se eu clicar e nao tiver nada no carrinho vai colocar a borda vermelha // FINALIZANDO O PEDIDO
bntFinalizar.addEventListener('click', ()=>{
    const verificarAberto = horarioRestaurante()
    if(!verificarAberto){ // !SIGNIFICA DIFERENÇA SE NAO TIVER ABERTO

        Toastify({
            text: "RESTAURANTE FECHADO",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Ele nao vai apagr enquanto o mouse estiver em cima
            style: {
              background: "#ef4444",},
        }).showToast();

        return;
    }
    if(carrinho.length === 0)return;
         if(endereco.value === ""){
            enderecoErro.classList.remove("hidden")
                endereco.classList.add('border-red-500')
                 return;}




        // Enviar Via Whatsapp
        const whatsapp = carrinho.map((item) => {
            return `PEDIDOS: ${item.dataName}\nQUANTIDADE: ${item.quantidade}\nPreço: R$ ${item.dataPrice}\n-------------------------------------------------\n`;
          }).join("");
          
          const msg = encodeURIComponent(`${whatsapp}\nEndereço: ${endereco.value}\nVALOR TOTAL: R$ ${totalValor.textContent}`);
            const phone = "+5511973245437";
                window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
                    carrinho.length = 0;
                        updateModal();
          
})
                // FUNÇÃO HORARIO 
function horarioRestaurante(){
    const data = new Date();
        const hora = data.getHours();
            return hora >= 18 && hora < 24;  // verdadeiro se estiver aberto
}

                const horario_Aberto = horarioRestaurante();
                    if (horario_Aberto) {
                        horario.classList.remove('bg-red-600');
                            horario.classList.add('bg-green-600');
                                } else {
                            horario.classList.remove('bg-green-600');
                        horario.classList.add('bg-red-600');
                    }



