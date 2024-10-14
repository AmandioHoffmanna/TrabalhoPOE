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
let dispositivos = {
    luzSalaOn: false,
    luzCozinhaOn: false,
    luzQuartoOn: false,
    arCondicionadoOn: false,
    temperaturaArCondicionado: 18, // temperatura inicial
    tvSalaOn: false,
    canalAtual: null as string | null, // Permite que canalAtual seja string ou null
    canais: ['Canal 1', 'Canal 2', 'Canal 3', 'Canal 4'], // Canais pré-definidos
    geladeiraOn: false, // Geladeira inicialmente desligada
    temperaturaGeladeira: 4, // Temperatura inicial da geladeira
    fogaoOn: false,
    potenciaFogao: 1,
    ventiladorOn: false,
    velocidadeVentilador: 1, // Velocidade inicial do Ventilador
    cortinasAbertas: false,
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

    socket.on('acenderLuz', () => {
        dispositivos.luzCozinhaOn = !dispositivos.luzCozinhaOn;
        io.emit('estadoAltera', dispositivos);
    });

    socket.on('acenderLuz', () => {
        dispositivos.luzQuartoOn = !dispositivos.luzQuartoOn;
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
            dispositivos.tvSalaOn = true; // Liga a TV
            dispositivos.canalAtual = dispositivos.canais[0]; // Liga no canal 1 por padrão
        } else if (acao === 'desligar') {
            dispositivos.tvSalaOn = false; // Desliga a TV
            dispositivos.canalAtual = null; // Reseta o canal
        }
        io.emit('estadoAltera', dispositivos);
    });

    // Evento para mudar de canal
    socket.on('mudarCanal', (canal) => {
        if (dispositivos.tvSalaOn && dispositivos.canais.includes(canal)) {
            dispositivos.canalAtual = canal; // Muda para o canal especificado
        }
        io.emit('estadoAltera', dispositivos);
    });

    // Evento para controlar o Fogão
    socket.on('controlarFogao', (acao) => {
        if (acao === 'ligar') {
            dispositivos.fogaoOn = true; // Liga o ar-condicionado
        } else if (acao === 'desligar') {
            dispositivos.fogaoOn = false; // Desliga o ar-condicionado
        }
        io.emit('estadoAltera', dispositivos);
    });
    // Evento para ajustar a potência do Fogão 
    socket.on('ajustarPotenciaFogao', (potencia) => {
        if (dispositivos.fogaoOn) { // Só permite ajuste se o Fogão estiver ligado
            dispositivos.potenciaFogao = potencia;
            io.emit('estadoAltera', dispositivos);
        }
    });

    // Evento para ajustar a temperatura da geladeira
    socket.on('ajustarTemperaturaGeladeira', (temperatura) => {
        if (dispositivos.geladeiraOn) { // Só permite ajuste se a geladeira estiver ligada
            dispositivos.temperaturaGeladeira = temperatura;
            io.emit('estadoAltera', dispositivos);
        }
    });

    // Evento para controlar a Geladeira
    socket.on('controlarGeladeira', (acao) => {
        if (acao === 'ligar') {
            dispositivos.geladeiraOn = true; // Liga a geladeira
        } else if (acao === 'desligar') {
            dispositivos.geladeiraOn = false; // Desliga a geladeira
        }
        io.emit('estadoAltera', dispositivos);
    });

    // Evento para controlar o ventilador 
    socket.on('controlarVentilador', (acao) => {
        if (acao === 'ligar') {
            dispositivos.ventiladorOn = true; // Liga o ventilador
        } else if (acao === 'desligar') {
            dispositivos.ventiladorOn = false; // Desliga o ventilador
        }
        io.emit('estadoAltera', dispositivos);
    });
    // Evento para ajustar a velocidade do ventilador 
    socket.on('ajustarVelocidadeVentilador', (velocidade) => {
        if (dispositivos.ventiladorOn) { // Só permite ajuste se o ventilador estiver ligado
            dispositivos.velocidadeVentilador = velocidade;
            io.emit('estadoAltera', dispositivos);
        }
    });

    // Evento para controlar as cortinas
    socket.on('controlarCortinas', (acao) => {
        if (acao === 'abrir') {
            dispositivos.cortinasAbertas = true; // Liga o ar-condicionado
        } else if (acao === 'fechar') {
            dispositivos.cortinasAbertas = false; // Desliga o ar-condicionado
        }
        io.emit('estadoAltera', dispositivos);
    });
});

// Iniciar Servidor
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
