//falta edit
// $ indica q é um elemento html
let data = new Date()
let dia = data.getDate()
let mes = data.getMonth()
let ano = data.getFullYear()
let momento = `0${dia}/0${mes + 1}/${ano}`

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
        //     data: momento,
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
                <td><span contenteditable>${dados.descricao}</span></td>
                <td>R$ <span contenteditable class="numerico">${dados.valor}</span></td>
                <td class="tipo">
                    <i class="bi ${dados.tipo === 'Entrada' ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}"></i>
                </td>
                <td>${momento}</td>
                <td class="btns">
                    <i class="bi bi-trash3-fill"></i>
                </td>
            </tr>`
        );
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
        transacaoAtualizada.valor = parseFloat(atualizacao) || 0
        atualizarGPS()
    }

}



// CRUD [CREATE]
const $meuform = document.querySelector('form')
$meuform.addEventListener('submit', function adicionarTransacao(dados) {
    dados.preventDefault()

    let $descricao = document.getElementById('form-desc')
    let $valor = document.getElementById('form-valor')
    // input tipo fazer com inspíracao no projeto antigo
    let $tipo = document.querySelector('input[name="radio"]:checked').value
    // console.log($tipo)

    projeto.adicionarTransacao({
        descricao: $descricao.value,
        valor: parseFloat($valor.value),
        tipo: $tipo,
        data: momento
    })
    salvarProjetoNoLocalStorage()
    atualizarGPS()
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

    projeto.atualizarTransacao(id, elementoAtual.innerText)
    atualizarGPS()
    salvarProjetoNoLocalStorage()
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

    $proventos.textContent = `${totalProventos.toFixed(2)}`
    $gastos.textContent = `${totalGastos.toFixed(2)}`
    $saldo.textContent = `${totalSaldo.toFixed(2)}`
    salvarProjetoNoLocalStorage()
}

// verifica se ja tem alguma coisa no localStorage, se houver ele vai carrega-lo
const projetoSalvo = localStorage.getItem('projeto');
if (projetoSalvo) {
    projeto.transacoes = JSON.parse(projetoSalvo).transacoes;
    projeto.lerTransacao()
    atualizarGPS()
}

//funcao pra salvar
function salvarProjetoNoLocalStorage() {
    localStorage.setItem('projeto', JSON.stringify(projeto));
}

document.addEventListener('input', function (event) {
    if (event.target.classList.contains('numerico')) {
        let content = event.target.textContent
        content = content.replace(/,/g, '.')

        const isNumeric = /^-?\d+(\.\d*)?(\,\d*)?$/.test(content);

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
