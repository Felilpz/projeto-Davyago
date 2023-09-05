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
        const transacoesAtualizadas = projeto.transacoes.filter(transacaoAtual => {
            return transacaoAtual.id !== Number(id)
        })
        projeto.transacoes = transacoesAtualizadas
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
    const id = elementoAtual.parentNode.parentNode.getAttribute('data-id')

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

function atualizarPGS() {
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