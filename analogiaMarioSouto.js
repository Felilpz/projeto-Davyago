// acompanhar série de crud do Mario Souto
// https://www.youtube.com/watch?v=5I4W0Mtcfqo

// https://www.youtube.com/watch?v=tRcnPcSbGrI

// instalar extensao quokka (ctrl shit p (dps))

const projeto = {
    // dentro do projeto eu terei descrição, valor e entrada/saida
    transacoes: [
        {
            id: 1,
            descricao: "Nubank",
            valor: 129,
            tipo: 'Saida'
        }
    ]
}

//funcao principal
function adicionarTransacao(dados) {
    projeto.transacoes.push({
        id: projeto.transacoes.length + 1,
        descricao: dados.descricao,
        valor: dados.valor,
        tipo: dados.tipo
    })
}

adicionarTransacao({descricao: 'bradesco', valor: 130, tipo: 'Entrada'})
adicionarTransacao({descricao: 'feira', valor: 150, tipo: 'Saida'})
// console.log(projeto.transacoes)

//ler
function pegaTransacoes() {
    return projeto.transacoes
}
// console.log(pegaTransacoes())

//atualizar
function atualizarTransacao(id, atualizacao) {
    const transacaoAtualizada = pegaTransacoes().find((valor) => {
        return valor.id === id
    })
    console.log(transacaoAtualizada)
    transacaoAtualizada.valor = atualizacao
}
atualizarTransacao(1, 150000)
console.log(pegaTransacoes())

//deletar
function apagarTransacao(id) {
    const transacoesAtualizada = pegaTransacoes().filter((transacaoAtual) => {
        return transacaoAtual.id !== id
    })
    // console.log(transacoesAtualizada)
    projeto.transacoes = transacoesAtualizada
}

// apagarTransacao(1)
apagarTransacao(2)
apagarTransacao(1)
console.log(pegaTransacoes())



// $ indica q é um elemento html
//funcao para formatar a data da maneira certa
function formatarData(numero) {
    if(numero <= 9) {
        return "0" + numero
    } else {
        return numero
    }
}

let dataAtual = new Date()
let dataFormatada = (formatarData(dataAtual.getDate().toString()) + "/" + (formatarData(dataAtual.getMonth()+1).toString()) + "/" + dataAtual.getFullYear())
console.log(dataFormatada)


let $proventos = document.getElementById('proventos')
let $gastos = document.getElementById('gastos')
let $saldo = document.getElementById('saldo')

const projeto = {
    transacoes: [
        // {
        //     //date.now usado para sair dos problemas de apagar um id q ja tinha sido apagado/ainda nao foi criado por conta da "auto atribuição"
        //     id: Date.now(),
        //     descricao: "Teste",
        //     valor: 0,
        //     tipo: 'Saida',
        //     data: dataFormatada,
        // }
    ],
    //ler transacao
    lerTransacao() {
        projeto.transacoes.forEach(({ id, descricao, valor, tipo, data }) => {
            projeto.adicionarTransacao({ id, descricao: descricao, valor: valor, tipo: tipo, data: data }, true)
        })

    },

    // cria transacao
    adicionarTransacao(dados, htmlOnly = false) {
        const idInterno = dados.id || Date.now()
        if (!htmlOnly) {
            projeto.transacoes.push({
                id: dados.id || idInterno,
                descricao: dados.descricao,
                valor: dados.valor,
                tipo: dados.tipo,
                data: dados.data
            })
            salvarProjetoNoLocalStorage()
            atualizarGPS()
        }

        // cria transacao no html
        let $tabela = document.getElementById('corpoTabela')
        $tabela.insertAdjacentHTML('afterbegin',
            `<tr data-id="${idInterno}">
                <td><span contenteditable class="descricao">${dados.descricao}</span></td>
                <td>R$ <span contenteditable class="numerico valor-numerico">${dados.valor}</span></td>
                <td class="tipo">
                    <i class="bi ${dados.tipo === 'Entrada' ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}"></i>
                </td>
                <td>${dataFormatada}</td>
                <td class="btns">
                    <i class="bi bi-trash3-fill"></i>
                </td>
            </tr>`
        )
        atualizarGPS()
    },

    // deleta transacao
    deletarTransacao(id) {
        const transacoesAtualizadas = projeto.transacoes.filter(transacaoAtual => {
            return transacaoAtual.id !== Number(id)
        })
        projeto.transacoes = transacoesAtualizadas
        atualizarGPS()
    },

    //atualiza transacao
    atualizarTransacao(id, atualizacao) {
        const transacaoAtualizada = projeto.transacoes.find(valor => {
            return valor.id === Number(id)
        })
        transacaoAtualizada.valor = parseFloat(atualizacao) //|| 0 
        atualizarGPS()
        
    },

    atualizarDescricaoTransacao(id, descricao) {
        const transacaoAtualizada = projeto.transacoes.find(valor => {
            return valor.id === Number(id)
        })
        transacaoAtualizada.descricao = descricao
        atualizarGPS()
        
    },

    atualizarTipoTransacao(id, tipo) {
        const transacaoAtualizada = projeto.transacoes.find(valor => {
            return valor.id === Number(id)
        })
        transacaoAtualizada.tipo = tipo;
        atualizarGPS();
    }
    
}


// CRUD [CREATE]
const $meuform = document.querySelector('form')
$meuform.addEventListener('submit', function adicionarTransacao(dados) {
    dados.preventDefault()

    let $descricao = document.getElementById('form-desc')
    let $valor = document.getElementById('form-valor')
    let $tipo = document.querySelector('input[name="radio"]:checked').value

    projeto.adicionarTransacao({
        descricao: $descricao.value,
        valor: parseFloat($valor.value),
        tipo: $tipo,
        data: dataFormatada
    })
    salvarProjetoNoLocalStorage()
    atualizarGPS()
    
    
    $meuform.reset()
})


// CRUD [DELETE]
document.getElementById('corpoTabela').addEventListener('click', function (infosDaTransacao) {
    const elementoAtual = infosDaTransacao.target
    const deletar = infosDaTransacao.target.classList.contains('bi-trash3-fill')
    if (deletar) {
        const id = elementoAtual.parentNode.parentNode.getAttribute('data-id')

        // Manipula o serverside/Banco de dados/Arquivo/Fonte!
        projeto.deletarTransacao(id)
        // Manipula a View/ o output
        elementoAtual.parentNode.parentNode.remove()
    }
    atualizarGPS()
    salvarProjetoNoLocalStorage()
    
})


// CRUD [UPDATE]
document.getElementById('corpoTabela').addEventListener('input', function (infosDaTransacao) {
    const elementoAtual = infosDaTransacao.target
    const id = elementoAtual.parentNode.parentNode.getAttribute('data-id')

    if (elementoAtual.classList.contains('valor-numerico')) {
        projeto.atualizarTransacao(id, elementoAtual.innerText)
        atualizarGPS()
        salvarProjetoNoLocalStorage()
        
    } else if (elementoAtual.classList.contains('descricao')) {
        const descricao = elementoAtual.innerText
        projeto.atualizarDescricaoTransacao(id, descricao)
        atualizarGPS()
        salvarProjetoNoLocalStorage()
        
    }

})

// Adicione um evento de clique aos ícones de entrada/saída na tabela
document.getElementById('corpoTabela').addEventListener('click', function (infosDaTransacao) {
    const elementoAtual = infosDaTransacao.target;
    
    // Verifique se um ícone de entrada ou saída foi clicado
    if (elementoAtual.classList.contains('bi-caret-up-fill') || elementoAtual.classList.contains('bi-caret-down-fill')) {
        const id = elementoAtual.parentNode.parentNode.getAttribute('data-id');
        const transacao = projeto.transacoes.find(t => t.id === Number(id));
        
        // Salve o valor original da transação
        const valorOriginal = transacao.valor;
        
        // Altere o tipo da transação para o oposto
        if (transacao.tipo === 'Entrada') {
            transacao.tipo = 'Saída';
        } else {
            transacao.tipo = 'Entrada';
        }
        
        // Restaure o valor original da transação
        transacao.valor = valorOriginal;
        
        // Atualize a classe do ícone na tabela para refletir o novo tipo
        elementoAtual.classList.toggle('bi-caret-up-fill');
        elementoAtual.classList.toggle('bi-caret-down-fill');
        
        // Atualize o objeto de transação no projeto com o novo tipo
        projeto.atualizarTipoTransacao(id, transacao.tipo);
        
        // Salve o projeto no LocalStorage após a edição
        salvarProjetoNoLocalStorage();
        
        // Atualize os valores dos cards
        atualizarGPS();
    }
});




// valores dos cards
function calcularGastos() {
    let totalGastos = 0
    projeto.transacoes.forEach(transacao => {
        if (transacao.tipo == 'Saida') {
            totalGastos += parseFloat(transacao.valor) || 0
        }
    })
    return totalGastos
}


function calcularProventos() {
    let totalProventos = 0
    projeto.transacoes.forEach(transacao => {
        if (transacao.tipo == 'Entrada') {
            totalProventos += parseFloat(transacao.valor) || 0
        }
    })
    return totalProventos
}

function atualizarGPS() {
    const totalProventos = calcularProventos() || 0
    const totalGastos = calcularGastos() || 0
    const totalSaldo = totalProventos - totalGastos

    $proventos.innerText = `R$ ${totalProventos.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
    
    $gastos.textContent = `R$  ${totalGastos.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
    
    $saldo.textContent = `R$  ${totalSaldo.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
    valorNegativo()
    salvarProjetoNoLocalStorage()
}


// verifica se ja tem alguma coisa no localStorage, se houver ele vai carrega-lo
const projetoSalvo = localStorage.getItem('projeto')
if (projetoSalvo) {
    projeto.transacoes = JSON.parse(projetoSalvo).transacoes
    projeto.lerTransacao()
    atualizarGPS()
    
}

//funcao pra salvar
function salvarProjetoNoLocalStorage() {
    localStorage.setItem('projeto', JSON.stringify(projeto))
}

//funcao para verificar se o item clicado está sendo atualizado apenas com decimais e inteiros
document.addEventListener('input', function (event) {
    if (event.target.classList.contains('numerico')) {
        let content = event.target.textContent
        content = content.replace(/,/g, '.')

        const isNumeric = /^-?\d+(\.\d*)?(\,\d*)?$/.test(content)

        if (!isNumeric) {
            // Se não for um número válido, restaure o valor anterior
            event.target.textContent = event.target.previousValue || ''
        } else {
            // Se for um número válido, atualize o valor anterior
            event.target.previousValue = content
            atualizarGPS()
            
        }
    }
})

//funcao para adicionar a cor vermelha e icone no saldo caso seja negativo
function valorNegativo() {
    // Remove os primeiros dois caracteres (R$) da string do saldo
    let saldoStr = $saldo.textContent.substring(2);
    
    // Converte a string para um número
    let saldo = parseFloat(saldoStr.replace(',', '.')); 

    let selecionarIcone = document.querySelector('.bi-check-circle-fill');
    let selecionarIcone2 = document.querySelector('.bi-exclamation-triangle-fill');

    if (saldo < 0) {
        $saldo.style.color = "rgb(123, 21, 21)";
        selecionarIcone.style.display = 'none';
        selecionarIcone2.style.display = 'block';
    } else {
        $saldo.style.color = "";
        selecionarIcone.style.display = 'block';
        selecionarIcone2.style.display = 'none';
    }
}
