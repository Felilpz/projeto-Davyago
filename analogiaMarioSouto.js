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