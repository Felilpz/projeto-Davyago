// $ indica q é um elemento html
let data = new Date()
let dia = data.getDate()
let mes = data.getMonth()
let ano = data.getFullYear()
let momento = `${dia}/0${mes + 1}/${ano}`

const projeto = {
    transacoes: [
        {
            //date.now usado para sair dos problemas de apagar um id q ja tinha sido apagado/ainda nao foi criado por conta da "auto atribuição"
            id: Date.now(),
            descricao: "Nubank",
            valor: 129,
            tipo: 'Saida',
            data: momento,
        }
    ],
    //ler transacao
    lerTransacao() {
        projeto.transacoes.forEach(({ id, descricao, valor, tipo, data }) => {
            projeto.adicionarTransacao({ id, descricao: descricao, valor: valor, tipo: tipo, data: data }, true)
        })
    },

    // cria transacao
    adicionarTransacao(dados, htmlOnly = false) {
        // cria transacao na memoria(array/obj)
        // const id = projeto.transacoes.length
        const idInterno = Date.now()
        if (!htmlOnly) {
            projeto.transacoes.push({
                id: dados.id || idInterno,
                descricao: dados.descricao,
                valor: dados.valor,
                tipo: dados.tipo,
                data: dados.data
            })
        }

        // cria transacao no html
        let $tabela = document.getElementById('corpoTabela')
        $tabela.insertAdjacentHTML('afterbegin',
            `<tr data-id="${idInterno}">
                <td><span contenteditable>${dados.descricao}</span></td>
                <td>R$ <span contenteditable>${dados.valor}</span></td>
                <td class="tipo">
                    <i class="bi bi-caret-up-fill"></i>
                </td>
                <td>${momento}</td>
                <td class="btns">
                    <i class="bi bi-trash3-fill"></i>
                </td>
            </tr>`
        )

    },

    // deleta transacao
    deletarTransacao(id) {
        const transacoesAtualizada = projeto.transacoes.filter((transacaoAtual) => {
            return transacaoAtual.id !== Number(id)
        })
        // console.log(transacoesAtualizada)
        projeto.transacoes = transacoesAtualizada
    },
    //atualiza transacao
    atualizarTransacao(id, atualizacao) {
        const transacaoAtualizada = projeto.transacoes.find((valor) => {
            return valor.id === Number(id)
        })
        console.log(transacaoAtualizada)
        transacaoAtualizada.valor = atualizacao
    }
}
// projeto.adicionarTransacao({descricao: 'feira', valor: 123, tipo: 'Saida'})
// projeto.adicionarTransacao({descricao: 'asd', valor: 2, tipo: 'Saida'})
// projeto.adicionarTransacao({descricao: '22asd', valor: 44, tipo: 'Saida'})
// projeto.adicionarTransacao({descricao: '2123', valor: 11, tipo: 'Saida'})


// CRUD [CREATE]
const $meuform = document.querySelector('form')
$meuform.addEventListener('submit', function adicionarTransacao(dados) {
    dados.preventDefault()
    let $descricao = document.getElementById('form-desc')
    let $valor = document.getElementById('form-valor')
    // input tipo fazer com inspíracao no projeto antigo
    let $tipo = document.querySelector('input[type="radio"]')

    projeto.adicionarTransacao({ descricao: $descricao.value, valor: $valor.value, tipo: "Entrada", data: momento })

    // <tr>
    //     <td>Freelance</td>
    //     <td>R$ 1.300,00</td>
    //     <td>Entrada</td>
    //     <td>27/01/2001</td>
    //     <td class="btns">
    //         <i class="bi bi-pen-fill"></i>
    //         <i class="bi bi-trash3-fill"></i>
    //     </td>
    // </tr>
})

// CRUD [DELETE]
document.getElementById('corpoTabela').addEventListener('click', function (infosDaTransacao) {
    console.log('click')
    const elementoAtual = infosDaTransacao.target
    const deletar = infosDaTransacao.target.classList.contains('bi-trash3-fill')
    if (deletar) {
        const id = elementoAtual.parentNode.parentNode.getAttribute('data-id')

        // Manipula o serverside/Banco de dados/Arquivo/Fonte!
        projeto.deletarTransacao(id)
        // Manipula a View/ o output
        elementoAtual.parentNode.parentNode.remove()
        console.log(projeto.transacoes)
    }
})

// CRUD [UPDATE]
document.getElementById('corpoTabela').addEventListener('input', function (infosDaTransacao) {
    console.log('Alteracao')
    const elementoAtual = infosDaTransacao.target
    const id = elementoAtual.parentNode.parentNode.getAttribute('data-id')
    console.log("id: " + id)

    projeto.atualizarTransacao(id, elementoAtual.innerText)
})