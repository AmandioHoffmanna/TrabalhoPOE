import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

// Criar servidor http
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // URL do Front-End React
        methods: ["GET", "POST"],
    }
});

// Estado inicial dos dispositivos
// Estado inicial dos dispositivos
let dispositivos = {
    luzSalaOn: false,
    arCondicionadoOn: false,
    temperaturaArCondicionado: 18, // temperatura inicial
    tvOn: false,
    canalAtual: null as string | null, // Permite que canalAtual seja string ou null
    canais: ['Canal 1', 'Canal 2', 'Canal 3', 'Canal 4'], // Canais pré-definidos
};

// Escuta os eventos de conexão do socket
io.on('connection', (socket) => {
    console.log('Cliente conectado', socket.id);

    // Enviando o estado inicial dos dispositivos para o cliente
    socket.emit('estadoInicial', dispositivos);

    // Manipulando os eventos e mudanças do estado dos dispositivos
    socket.on('acenderLuz', () => {
        dispositivos.luzSalaOn = !dispositivos.luzSalaOn;
        io.emit('estadoAltera', dispositivos);
    });

    // Evento para controlar o ar-condicionado
    socket.on('controlarArCondicionado', (acao) => {
        if (acao === 'ligar') {
            dispositivos.arCondicionadoOn = true; // Liga o ar-condicionado
        } else if (acao === 'desligar') {
            dispositivos.arCondicionadoOn = false; // Desliga o ar-condicionado
        }
        io.emit('estadoAltera', dispositivos);
    });

    // Evento para ajustar a temperatura do ar-condicionado
    socket.on('ajustarTemperaturaAr', (temperatura) => {
        dispositivos.temperaturaArCondicionado = temperatura;
        io.emit('estadoAltera', dispositivos);
    });

    // Evento para controlar a TV
    socket.on('controlarTV', (acao) => {
        if (acao === 'ligar') {
            dispositivos.tvOn = true; // Liga a TV
            dispositivos.canalAtual = dispositivos.canais[0]; // Liga no canal 1 por padrão
        } else if (acao === 'desligar') {
            dispositivos.tvOn = false; // Desliga a TV
            dispositivos.canalAtual = null; // Reseta o canal
        }
        io.emit('estadoAltera', dispositivos);
    });

    // Evento para mudar de canal
    socket.on('mudarCanal', (canal) => {
        if (dispositivos.tvOn && dispositivos.canais.includes(canal)) {
            dispositivos.canalAtual = canal; // Muda para o canal especificado
        }
        io.emit('estadoAltera', dispositivos);
    });
});

// Iniciar Servidor
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
