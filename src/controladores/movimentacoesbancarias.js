let {contas, saques, depositos, transferencias } = require('../bancodedados');
const {format} = require('date-fns');

const depositar = (req, res) => {
    const {numero_conta, valor} = req.body;

    if(!numero_conta || !valor){
        return res.status(400).json({ mensagem : 'O número da conta e o valor são obrigatórios'});
    }

    if(valor <= 0){
        return res.status(400).json({ mensagem : 'O valor não pode ser menor ou igual a zero' });
    }

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta));

    if(!contaEncontrada){
        return res.status(404).json({ mensagem :'O número da conta não foi encontrado'});
    }

    contaEncontrada.saldo += valor;

    const registroDeposito ={
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor,
    }

    depositos.push(registroDeposito);

    return res.status(201).send();    
}

const sacar = (req, res) => {
    const {numero_conta, valor, senha} = req.body;

    if(!numero_conta || !valor ||!senha){
        return res.status(400).json({ mensagem : 'O número da conta, do valor e da senha são obrigatórios'});
    }

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta));

    if(!contaEncontrada){
        return res.status(404).json({ mensagem :'O número da conta não foi encontrado'});
    }

    if(contaEncontrada.usuario.senha !== senha){
        return res.status(400).json({ mensagem : 'Usuário com senha inválida' });
    }

    if(contaEncontrada.saldo < valor){
        return res.status(403).json({ mensagem : 'Saldo insuficiente' });
    }

    contaEncontrada.saldo -= valor;

    const registroDeposito ={
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor,
    }

    saques.push(registroDeposito);

    return res.status(201).send();   
}

const transferir = (req, res) => {
    const {numero_conta_origem, numero_conta_destino, valor, senha} = req.body;

    if(!numero_conta_origem || !numero_conta_destino || !valor || !senha){
        return res.status(400).json({ mensagem : 'O número da conta de origem, de destino, valor e senha são obrigatórios'});
    }

    const contaEncontradaOrigem = contas.find(conta => Number(conta.numero) === Number(numero_conta_origem));

    if(!contaEncontradaOrigem){
        return res.status(404).json({ mensagem :'O número da conta de origem não foi encontrado'});
    }

    const contaEncontradaDestino = contas.find(conta => Number(conta.numero) === Number(numero_conta_destino));

    if(!contaEncontradaDestino){
        return res.status(404).json({ mensagem :'O número da conta de destino não foi encontrado'});
    }

    if(contaEncontradaOrigem.usuario.senha !== senha){
        return res.status(400).json({ mensagem : 'Senha inválida' });
    }

    if(contaEncontradaOrigem.saldo < valor){
        return res.status(403).json({ mensagem : 'Saldo insuficiente' });
    }

    contaEncontradaOrigem.saldo -= valor;
    contaEncontradaDestino.saldo += valor;

    const registroDeposito ={
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor,
    }

    transferencias.push(registroDeposito);
    return res.status(201).send();  
}

module.exports = {
    depositar,
    sacar,
    transferir
}