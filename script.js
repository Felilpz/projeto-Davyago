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

    $proventos.textContent = `${totalProventos.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
    
    $gastos.textContent = `${totalGastos.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
    
    $saldo.textContent = `${totalSaldo.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
    salvarProjetoNoLocalStorage()

    valorNegativo()
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

//funcao para adicionar a cor vermelha no saldo caso seja negativo
function valorNegativo() {
    let saldo = parseFloat($saldo.textContent.replace(',', '.')); // Converte o saldo para um número

    if (saldo < 0) {
        $saldo.style.color = "rgb(123, 21, 21)";
    } else {
        $saldo.style.color = "";
    }
}
