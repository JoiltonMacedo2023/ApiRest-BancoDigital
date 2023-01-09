const express = require('express');
const contas = require('./controladores/contas');
const transacoes = require('./controladores/movimentacoesbancarias');

const rotas = express();

rotas.get('/contas', contas.listarContas);
rotas.post('/contas', contas.criarConta);
rotas.put('/contas/:numeroConta/usuario', contas.atualizarUsuarioConta);
rotas.delete('/contas/:numeroConta', contas.excluirConta);
rotas.post('/transacoes/depositar', transacoes.depositar);
rotas.post('/transacoes/sacar', transacoes.sacar);
rotas.post('/transacoes/transferir',transacoes.transferir);
rotas.get('/contas/saldo',contas.consultarSaldo);
rotas.get('/contas/extrato',contas.consultarExtrato);

module.exports = rotas;