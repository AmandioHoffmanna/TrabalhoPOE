import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

interface EstadoDispositivos {
  luzSalaOn: boolean;
  luzCozinhaOn: boolean;
  luzQuartoOn: boolean;
  tvSalaOn: boolean;
  canalTV: string | null;
  arCondicionadoOn: boolean;
  temperaturaArCondicionado: number;
  ventiladorOn: boolean;
  velocidadeVentilador: number;
  fogaoOn: boolean;
  potenciaFogao: number;
  cortinasAbertas: boolean;
  temperaturaGeladeira: number;
  alertaGeladeira: boolean;
}

const canaisDisponiveis = ['Canal 1', 'Canal 2', 'Canal 3', 'Canal 4', 'Canal 5'];

const App: React.FC = () => {
  const [dispositivos, setDispositivos] = useState<EstadoDispositivos>({
    luzSalaOn: false,
    luzCozinhaOn: false,
    luzQuartoOn: false,
    tvSalaOn: false,
    canalTV: null,
    arCondicionadoOn: false,
    temperaturaArCondicionado: 18,
    ventiladorOn: false,
    velocidadeVentilador: 1,
    fogaoOn: false,
    potenciaFogao: 1,
    cortinasAbertas: false,
    temperaturaGeladeira: 4,
    alertaGeladeira: false,
  });

  useEffect(() => {
    socket.on('estadoInicial', (estadoDispositivos: EstadoDispositivos) => {
      setDispositivos(estadoDispositivos);
    });
    socket.on('estadoAltera', (novoEstado: EstadoDispositivos) => {
      setDispositivos(novoEstado);
    });
    return () => {
      socket.off('estadoInicial');
      socket.off('estadoAltera');
    };
  }, []);

  const acenderLuz = (comodo: string) => {
    socket.emit('acenderLuz', comodo);
  };

  const controlarTv = () => {
    const acao = dispositivos.tvSalaOn ? 'desligar' : 'ligar';
    socket.emit('controlarTV', acao);
  };

  const ajustarCanal = (canal: string) => {
    socket.emit('mudarCanal', canal);
  };

  const controlarArCondicionado = () => {
    const acao = dispositivos.arCondicionadoOn ? 'desligar' : 'ligar';
    socket.emit('controlarArCondicionado', acao);
  };

  const ajustarTemperaturaAr = (temperatura: number) => {
    socket.emit('ajustarTemperaturaAr', temperatura);
  };

  const controlarVentilador = () => {
    const acao = dispositivos.ventiladorOn ? 'desligar' : 'ligar';
    socket.emit('controlarVentilador', acao);
  };

  const ajustarVelocidadeVentilador = (velocidade: number) => {
    socket.emit('ajustarVelocidadeVentilador', velocidade);
  };

  const controlarFogao = () => {
    const acao = dispositivos.fogaoOn ? 'desligar' : 'ligar';
    socket.emit('controlarFogao', acao);
  };

  const ajustarPotenciaFogao = (potencia: number) => {
    socket.emit('ajustarPotenciaFogao', potencia);
  };

  const controlarCortinas = () => {
    const acao = dispositivos.cortinasAbertas ? 'fechar' : 'abrir';
    socket.emit('controlarCortinas', acao);
  };

  return (
    <div className="casa">
      <h1>Casa Inteligente</h1>

      {/* Sala de Estar */}
      <section className="comodo sala">
        <h2>Sala de Estar</h2>
        <div className="dispositivo luz">
          <h3>Luz</h3>
          <button onClick={() => acenderLuz('Sala')}>
            {dispositivos.luzSalaOn ? 'Desligar Luz' : 'Ligar Luz'}
          </button>
          <img
            src={dispositivos.luzSalaOn ? '/imgs/luz_on.png' : '/imgs/luz_off.png'}
            alt="Luz da Sala"
          />
        </div>
        <div className="dispositivo tv">
          <h3>Televisão</h3>
          <button onClick={controlarTv}>
            {dispositivos.tvSalaOn ? 'Desligar TV' : 'Ligar TV'}
          </button>
          {dispositivos.tvSalaOn && (
            <div className="tv-controles">
              <p>Canal Atual: <strong>{dispositivos.canalTV}</strong></p>
              <h4>Mudar Canal:</h4>
              {canaisDisponiveis.map(canal => (
                <button key={canal} onClick={() => ajustarCanal(canal)}>
                  {canal}
                </button>
              ))}
            </div>
          )}
          <img
            src={dispositivos.tvSalaOn ? '/imgs/tv_on.png' : '/imgs/tv_off.png'}
            alt="TV da Sala"
          />
        </div>
        <div className="dispositivo ar-condicionado">
          <h3>Ar-Condicionado</h3>
          <button onClick={controlarArCondicionado}>
            {dispositivos.arCondicionadoOn ? 'Desligar Ar' : 'Ligar Ar'}
          </button>
          {dispositivos.arCondicionadoOn && (
            <div className="ajustes">
              <p>Temperatura Atual: <strong>{dispositivos.temperaturaArCondicionado}°C</strong></p>
              <input
                type="range"
                min="18"
                max="30"
                value={dispositivos.temperaturaArCondicionado}
                onChange={(e) => ajustarTemperaturaAr(Number(e.target.value))}
              />
            </div>
          )}
          <img
            src={dispositivos.arCondicionadoOn ? '/imgs/ar_on.png' : '/imgs/ar_off.png'}
            alt="Ar-Condicionado"
          />
        </div>
      </section>

      {/* Cozinha */}
      <section className="comodo cozinha">
        <h2>Cozinha</h2>
        <div className="dispositivo luz">
          <h3>Luz</h3>
          <button onClick={() => acenderLuz('Cozinha')}>
            {dispositivos.luzCozinhaOn ? 'Desligar Luz' : 'Ligar Luz'}
          </button>
          <img
            src={dispositivos.luzCozinhaOn ? '/imgs/luz_on.png' : '/imgs/luz_off.png'}
            alt="Luz da Cozinha"
          />
        </div>
        <div className="dispositivo geladeira">
          <h3>Geladeira Inteligente</h3>
          <p>Temperatura: {dispositivos.temperaturaGeladeira}°C</p>
          {dispositivos.alertaGeladeira && (
            <p className="alerta">⚠️ Alerta: Temperatura alta!</p>
          )}
          <img src="/imgs/geladeira.png" alt="Geladeira" />
        </div>
        <div className="dispositivo fogao">
          <h3>Fogão Elétrico</h3>
          <button onClick={controlarFogao}>
            {dispositivos.fogaoOn ? 'Desligar Fogão' : 'Ligar Fogão'}
          </button>
          {dispositivos.fogaoOn && (
            <div className="ajustes">
              <p>Potência: {dispositivos.potenciaFogao}</p>
              <input
                type="range"
                min="1"
                max="5"
                value={dispositivos.potenciaFogao}
                onChange={(e) => ajustarPotenciaFogao(Number(e.target.value))}
              />
            </div>
          )}
          <img
            src={dispositivos.fogaoOn ? '/imgs/fogao_on.png' : '/imgs/fogao_off.png'}
            alt="Fogão"
          />
        </div>
      </section>

      {/* Quarto */}
      <section className="comodo quarto">
        <h2>Quarto</h2>
        <div className="dispositivo luz">
          <h3>Luz</h3>
          <button onClick={() => acenderLuz('Quarto')}>
            {dispositivos.luzQuartoOn ? 'Desligar Luz' : 'Ligar Luz'}
          </button>
          <img
            src={dispositivos.luzQuartoOn ? '/imgs/luz_on.png' : '/imgs/luz_off.png'}
            alt="Luz do Quarto"
          />
        </div>
        <div className="dispositivo ventilador">
          <h3>Ventilador</h3>
          <button onClick={controlarVentilador}>
            {dispositivos.ventiladorOn ? 'Desligar Ventilador' : 'Ligar Ventilador'}
          </button>
          {dispositivos.ventiladorOn && (
            <div className="ajustes">
              <p>Velocidade: {dispositivos.velocidadeVentilador}</p>
              <input
                type="range"
                min="1"
                max="3"
                value={dispositivos.velocidadeVentilador}
                onChange={(e) => ajustarVelocidadeVentilador(Number(e.target.value))}
              />
            </div>
          )}
          <img
            src={dispositivos.ventiladorOn ? '/imgs/ventilador_on.png' : '/imgs/ventilador_off.png'}
            alt="Ventilador"
          />
        </div>
        <div className="dispositivo cortinas">
          <h3>Cortinas</h3>
          <button onClick={controlarCortinas}>
            {dispositivos.cortinasAbertas ? 'Fechar Cortinas' : 'Abrir Cortinas'}
          </button>
          <img
            src={dispositivos.cortinasAbertas ? '/imgs/cortinas_abertas.png' : '/imgs/cortinas_fechadas.png'}
            alt="Cortinas"
          />
        </div>
      </section>
    </div>
  );
};

export default App;
