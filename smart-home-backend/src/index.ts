import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
    }
});

// Estado inicial dos dispositivos
let dispositivos = {
    luzSalaOn: false,
    luzCozinhaOn: false,
    luzQuartoOn: false,
    arCondicionadoOn: false,
    temperaturaArCondicionado: 18, 
    tvSalaOn: false,
    canalAtual: null as string | null, 
    canais: ['Canal 1', 'Canal 2', 'Canal 3', 'Canal 4', 'Canal 5'],
    geladeiraOn: false, 
    temperaturaGeladeira: 4, 
    fogaoOn: false,
    potenciaFogao: 1,
    ventiladorOn: false,
    velocidadeVentilador: 1,
    cortinasAbertas: false,
};

// eventos de conexão do socket
io.on('connection', (socket) => {
    console.log('Cliente conectado', socket.id);

    socket.emit('estadoInicial', dispositivos);

   
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

    
    socket.on('controlarArCondicionado', (acao) => {
        if (acao === 'ligar') {
            dispositivos.arCondicionadoOn = true; 
        } else if (acao === 'desligar') {
            dispositivos.arCondicionadoOn = false;
        }
        io.emit('estadoAltera', dispositivos);
    });

    
    socket.on('ajustarTemperaturaAr', (temperatura) => {
        dispositivos.temperaturaArCondicionado = temperatura;
        io.emit('estadoAltera', dispositivos);
    });
    socket.on('controlarTV', (acao) => {
        if (acao === 'ligar') {
            dispositivos.tvSalaOn = true; 
            dispositivos.canalAtual = dispositivos.canais[0]; 
        } else if (acao === 'desligar') {
            dispositivos.tvSalaOn = false; 
            dispositivos.canalAtual = null; 
        }
        io.emit('estadoAltera', dispositivos);
    });

    
    socket.on('ajustarCanal', (canal) => {
        if (dispositivos.tvSalaOn && dispositivos.canais.includes(canal)) {
            dispositivos.canalAtual = canal; 
        }
        io.emit('estadoAltera', dispositivos);
    });

   
    socket.on('controlarFogao', (acao) => {
        if (acao === 'ligar') {
            dispositivos.fogaoOn = true; 
        } else if (acao === 'desligar') {
            dispositivos.fogaoOn = false; 
        }
        io.emit('estadoAltera', dispositivos);
    });
    
    socket.on('ajustarPotenciaFogao', (potencia) => {
        if (dispositivos.fogaoOn) {
            dispositivos.potenciaFogao = potencia;
            io.emit('estadoAltera', dispositivos);
        }
    });

   
    socket.on('ajustarTemperaturaGeladeira', (temperatura) => {
        if (dispositivos.geladeiraOn) { 
            dispositivos.temperaturaGeladeira = temperatura;
            io.emit('estadoAltera', dispositivos);
        }
    });

    
    socket.on('controlarGeladeira', (acao) => {
        if (acao === 'ligar') {
            dispositivos.geladeiraOn = true;
        } else if (acao === 'desligar') {
            dispositivos.geladeiraOn = false; 
        }
        io.emit('estadoAltera', dispositivos);
    });

    
    socket.on('controlarVentilador', (acao) => {
        if (acao === 'ligar') {
            dispositivos.ventiladorOn = true; 
        } else if (acao === 'desligar') {
            dispositivos.ventiladorOn = false; 
        }
        io.emit('estadoAltera', dispositivos);
    });
    
    socket.on('ajustarVelocidadeVentilador', (velocidade) => {
        if (dispositivos.ventiladorOn) { 
            dispositivos.velocidadeVentilador = velocidade;
            io.emit('estadoAltera', dispositivos);
        }
    });

   
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
