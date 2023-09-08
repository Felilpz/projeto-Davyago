// $ indica q é um elemento html
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
    ],
    //ler transacao
    lerTransacao() {
        const transacoesFormatadas = projeto.transacoes.map(({ id, descricao, valor, tipo, data }) => ({
            id: id || Date.now(),
            descricao: descricao,
            valor: valor,
            tipo: tipo,
            data: data
        }))
    
        transacoesFormatadas.forEach((transacao) => {
            projeto.adicionarTransacao(transacao, true)
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
            atualizarPGS()
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
        atualizarPGS()
    },

    // deleta transacao
    deletarTransacao(id) {
        projeto.transacoes = projeto.transacoes.filter((transacaoAtual) => {
            return transacaoAtual.id !== Number(id)
        })
        atualizarPGS()
    },    

    //atualiza transacao
    atualizarTransacao(id, atualizacao) {
        const transacaoAtualizada = projeto.transacoes.find(valor => {
            return valor.id === Number(id)
        })
        transacaoAtualizada.valor = parseFloat(atualizacao) || 0 
        atualizarPGS()
        
    },

    atualizarDescricaoTransacao(id, descricao) {
        const transacaoAtualizada = projeto.transacoes.find(valor => {
            return valor.id === Number(id)
        })
        transacaoAtualizada.descricao = descricao
        atualizarPGS()
        
    },

    atualizarTipoTransacao(id, tipo) {
        const transacaoAtualizada = projeto.transacoes.find(valor => {
            return valor.id === Number(id)
        })
        transacaoAtualizada.tipo = tipo
        atualizarPGS()
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
    atualizarPGS()
    
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
    atualizarPGS()
    salvarProjetoNoLocalStorage()
    
})


// CRUD [UPDATE]
document.getElementById('corpoTabela').addEventListener('input', function (infosDaTransacao) {
    const elementoAtual = infosDaTransacao.target
    const id = elementoAtual.parentNode.parentNode.getAttribute('data-id') //so um parentNode vai fazer com que 

    if (elementoAtual.classList.contains('valor-numerico')) {
        projeto.atualizarTransacao(id, elementoAtual.innerText)
        atualizarPGS()
        salvarProjetoNoLocalStorage()
        
    } else if (elementoAtual.classList.contains('descricao')) {
        const descricao = elementoAtual.innerText
        projeto.atualizarDescricaoTransacao(id, descricao)
        atualizarPGS()
        salvarProjetoNoLocalStorage()

    }

})

document.getElementById('corpoTabela').addEventListener('click', function (infosDaTransacao) {
    const elementoAtual = infosDaTransacao.target

    if (elementoAtual.classList.contains('bi-caret-up-fill') || elementoAtual.classList.contains('bi-caret-down-fill')) {
        const id = elementoAtual.parentNode.parentNode.getAttribute('data-id')

        // Encontre a transação correspondente pelo ID
        const transacao = projeto.transacoes.find(t => t.id === Number(id))

        if (transacao.tipo === 'Entrada') {
            transacao.tipo = 'Saida'
        } else {
            transacao.tipo = 'Entrada'
        }

        // Atualize a classe do ícone na tabela para refletir o novo tipo
        elementoAtual.classList.toggle('bi-caret-up-fill')
        elementoAtual.classList.toggle('bi-caret-down-fill')

        // Atualize o objeto de transação no projeto com o novo tipo
        projeto.atualizarTipoTransacao(id, transacao.tipo)

        salvarProjetoNoLocalStorage()
        atualizarPGS()
    }
})

// valores dos cards
function calcularTipo(tipo) {
    return projeto.transacoes.reduce((total, transacao) => {
        if (transacao.tipo === tipo) {
            return total + parseFloat(transacao.valor) || 0
        }
        return total
    }, 0)
}

function calcularProventos() {
    return calcularTipo('Entrada')
}

function calcularGastos() {
    return calcularTipo('Saida')
}

function atualizarPGS() {
    const totalProventos = calcularProventos() || 0
    const totalGastos = calcularGastos() || 0
    const totalSaldo = totalProventos - totalGastos

    $proventos.innerText = formatarMoeda(totalProventos)
    $gastos.textContent = formatarMoeda(totalGastos)
    $saldo.textContent = formatarMoeda(totalSaldo)

    valorNegativo()
    salvarProjetoNoLocalStorage()
    atualizarFonteSize()
}

// verifica se ja tem alguma coisa no localStorage, se houver ele vai carrega-lo
const projetoSalvo = localStorage.getItem('projeto')
if (projetoSalvo) {
    projeto.transacoes = JSON.parse(projetoSalvo).transacoes
    projeto.lerTransacao()
    atualizarPGS()
    
}

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
            event.target.textContent = event.target.previousValue || ''
        } else {
            event.target.previousValue = content
            atualizarPGS()
            
        }
    }
})

//funcao para adicionar a cor vermelha e icone no saldo caso seja negativo
function valorNegativo() {
    let saldoStr = $saldo.textContent.substring(2)
    
    // Converte a string para um número
    let saldo = parseFloat(saldoStr.replace(',', '.')) 

    let selecionarIcone = document.querySelector('.bi-check-circle-fill')
    let selecionarIcone2 = document.querySelector('.bi-exclamation-triangle-fill')

    if (saldo < 0) {
        $saldo.style.color = "rgb(123, 21, 21)"
        selecionarIcone.style.display = 'none'
        selecionarIcone2.style.display = 'block'
    } else {
        $saldo.style.color = ""
        selecionarIcone.style.display = 'block'
        selecionarIcone2.style.display = 'none'
    }
}

function atualizarFonteSize() {
    let $comprimentoProventos = $proventos.textContent.length
    let $comprimentoGastos = $gastos.textContent.length
    let $comprimentoSaldo = $saldo.textContent.length

    if ($comprimentoProventos > 17 || $comprimentoGastos > 17 || $comprimentoSaldo > 17) {
        $proventos.style.fontSize = '21px'
        $gastos.style.fontSize = '21px'
        $saldo.style.fontSize = '21px'

        console.log($comprimentoSaldo)
    // } else if ($comprimentoProventos > 21 || $comprimentoGastos > 21 || $comprimentoSaldo > 21) {
    //     $proventos.style.fontSize = '18px'
    //     $gastos.style.fontSize = '18px'
    //     $saldo.style.fontSize = '18px'
     } else {
        $proventos.style.fontSize = '24px'
        $gastos.style.fontSize = '24px'
        $saldo.style.fontSize = '24px'
    }
}

function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`
}