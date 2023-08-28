// $ indica q é um elemento html
let data = new Date()
let dia = data.getDate()
let mes = data.getMonth()
let ano = data.getFullYear()
let momento = `${dia}/0${mes + 1}/${ano}`

const projeto = {
    transacoes: [
        {
            id: 1,
            descricao: "Nubank",
            valor: 129,
            tipo: 'Saida',
            data,
        }
    ],
    // cria transacao
    adicionarTransacao(dados, htmlOnly = false) {
        // cria transacao na memoria(array/obj)
        if(!htmlOnly) {
            projeto.transacoes.push({
                id: projeto.transacoes.length + 1,
                descricao: dados.descricao,
                valor: dados.valor,
                tipo: dados.tipo
            })
        }

        // cria transacao no html
        let $tabela = document.getElementById('corpoTabela')
        $tabela.insertAdjacentHTML('afterbegin', 
        `<tr>
            <td>${dados.descricao}</td>
            <td>${dados.valor}</td>
            <td>Entrada</td>
            <td>${momento}</td>
            <td class="btns">
                <i class="bi bi-pen-fill"></i>
                <i class="bi bi-trash3-fill"></i>
            </td>
        </tr>`
    )
    }
}
// projeto.adicionarTransacao({descricao: 'feira', valor: 123, tipo: 'Saida'})
// projeto.adicionarTransacao({descricao: 'asd', valor: 2, tipo: 'Saida'})
// projeto.adicionarTransacao({descricao: '22asd', valor: 44, tipo: 'Saida'})
// projeto.adicionarTransacao({descricao: '2123', valor: 11, tipo: 'Saida'})

console.log(projeto.transacoes)

//CRUD [READ]
projeto.transacoes.forEach(({descricao, valor, tipo, data}) => {
    projeto.adicionarTransacao({descricao: descricao, valor: valor, tipo: tipo, data: data}, true)
})

// CRUD [CREATE]
const $meuform = document.querySelector('form')
$meuform.addEventListener('submit', function adicionarTransacao(dados) {
    dados.preventDefault()
    let $descricao = document.getElementById('form-desc')
    let $valor = document.getElementById('form-valor')
    // input tipo fazer com inspíracao no projeto antigo
    let $tipo = document.querySelector('input[type="radio"]')

    projeto.adicionarTransacao({descricao: $descricao.value, valor: $valor.value, tipo: "Entrada", data: momento })

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