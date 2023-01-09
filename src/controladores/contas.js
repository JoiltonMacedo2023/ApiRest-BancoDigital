let {banco, contas, proximoNumero, depositos, saques, transferencias} = require('../bancodedados');   

const listarContas =  ( req, res ) => {
    const {senha_banco } = req.query;

    if(!senha_banco){
        return res.status(400).json({ mensagem :' A senha do banco informado é obrigatória!'});
    }

    if(senha_banco !== banco.senha){ 
        return res.status(400).json({ mensagem :' A senha do banco informado é inválida!'});
    }

    return res.status(200).json(contas); 
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem : 'É obrigatório o preenchimento de todos os campos!'});
    }    

    const contaExistente = contas.find(conta => {
        return conta.usuario.cpf === cpf || conta.usuario.email === email
    });

    if(contaExistente) {
        return res.status(400).json({ mensagem : 'Cpf ou Email já existente'});
    }

    const cadastrarContaNova = {
        numero: proximoNumero++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }    
    }

    contas.push(cadastrarContaNova);
    return res.status(201).send();
}

const atualizarUsuarioConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const {numeroConta} = req.params;

    if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem : 'É obrigatório o preenchimento de todos os campos!'});
    }  
    
    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numeroConta));
    
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem : 'Esta conta não existe'});
    }

    if(cpf !== contaEncontrada.usuario.cpf) {
        const cpfEhExistente = contas.find(conta => conta.usuario.cpf === cpf);

        if(cpfEhExistente){
            return res.status(400).json({ mensagem : ' O cpf cadastrado já existe!'});
        }
    }

    if(email !== contaEncontrada.usuario.email) {
        const emailEhExistente = contas.find(conta => conta.usuario.email === email);

        if(emailEhExistente){
            return res.status(400).json({ mensagem : ' O email cadastrado já existe!'});
        }
    }

    contaEncontrada.usuario = { 
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    }

    return res.status(204).send();    
}

const excluirConta = (req, res) => {
    const {numeroConta} = req.params;

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numeroConta));
    
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem : 'Esta conta não existe'});
    }

    if(contaEncontrada.saldo > 0) {
        return res.status(404).json({ mensagem : 'Esta conta só poderá ser excluída caso o saldo seja zero'});
    }

    contas = contas.filter(conta => Number(conta.numero) !== Number(numeroConta));

    return res.status(204).send();    
}

const consultarSaldo = (req, res) => {
    const {numero_conta, senha} = req.query;

    if(!numero_conta || !senha){
        return res.status(400).json({ mensagem : 'O número da conta e a senha são obrigatórios'});
    }

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta));
    
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem : 'Conta inexistente'});
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem : 'Senha inválida'});
    }

    return res.status(200).json({ saldo : contaEncontrada.saldo});
}

const consultarExtrato = (req, res) => {
    const {numero_conta, senha} = req.query;

    if(!numero_conta || !senha){
        return res.status(400).json({ mensagem : 'O número da conta e a senha são obrigatórios'});
    }

    const contaEncontrada = contas.find(conta => Number(conta.numero) === Number(numero_conta));
    
    if (!contaEncontrada) {
        return res.status(404).json({ mensagem : 'Conta inexistente'});
    }

    if (contaEncontrada.usuario.senha !== senha) {
        return res.status(400).json({ mensagem : 'Senha inválida'});
    }

    const depositosExtrato = depositos.filter(deposito => Number(deposito.numero_conta) === Number(contaEncontrada.numero));
    
    const saquesExtrato = saques.filter(saque => Number(saque.numero_conta) === Number(contaEncontrada.numero));

    const transferenciasEnviadas = transferencias.filter(transferencia => Number(transferencia.numero_conta_origem) === Number(contaEncontrada.numero));

    const transferenciasRecebidas = transferencias.filter(transferencia => Number(transferencia.numero_conta_destino) === Number(contaEncontrada.numero));
    
    return res.status(200).json({ 
        depositos : depositosExtrato,
        saques : saquesExtrato,
        transferenciasEnviadas,
        transferenciasRecebidas
     });
}

module.exports ={
    listarContas,
    criarConta,
    atualizarUsuarioConta,
    excluirConta,
    consultarSaldo,
    consultarExtrato
}   