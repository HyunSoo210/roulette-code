import React, { useEffect, useRef, useState } from 'react';

function Roulette() {
  const canvasRef = useRef(null);
  const [options] = useState([
    "100","200","300","400","500","600","700","800","900","1000","1200","1300","1400","1500",
  ]);
  const [startAngle, setStartAngle] = useState(0);
  const [spinTimeout, setSpinTimeout] = useState(null);
  const [spinTime, setSpinTime] = useState(0);

  const arc = Math.PI / (options.length / 2);

  useEffect(() => {
    drawRouletteWheel();
  }, [startAngle]);

  const byte2Hex = (n) => {
    const nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
  };

  const RGB2Color = (r, g, b) => {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  };

  const getColor = (item, maxitem) => {
    const phase = 0;
    const center = 128;
    const width = 127;
    const frequency = Math.PI * 2 / maxitem;

    const red = Math.sin(frequency * item + 2 + phase) * width + center;
    const green = Math.sin(frequency * item + 0 + phase) * width + center;
    const blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return RGB2Color(red, green, blue);
  };

  const drawRouletteWheel = () => {
    const canvas = canvasRef.current;
    if (canvas.getContext) {
      const outsideRadius = 200;
      const textRadius = 160;
      const insideRadius = 125;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 500, 500);

      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;

      ctx.font = 'bold 12px Helvetica, Arial';

      for (let i = 0; i < options.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = getColor(i, options.length);

        ctx.beginPath();
        ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
        ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
        ctx.stroke();
        ctx.fill();

        ctx.save();
        ctx.shadowOffsetX = -1;
        ctx.shadowOffsetY = -1;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "rgb(220,220,220)";
        ctx.fillStyle = "black";
        ctx.translate(
          250 + Math.cos(angle + arc / 2) * textRadius,
          250 + Math.sin(angle + arc / 2) * textRadius
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        const text = options[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
      }

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
      ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
      ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
      ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
      ctx.fill();
    }
  };

  const spin = () => {
    clearTimeout(spinTimeout);
    setSpinTime(0);
    const spinAngleStart = Math.random() * 10 + 15;
    const spinTimeTotal = Math.random() * 3 + 4 * 5000;
    const totalRotations = 50;
  
    const rotateWheel = () => {
      setSpinTime((prevSpinTime) => {
        const newSpinTime = prevSpinTime + 20;
        if (newSpinTime >= spinTimeTotal) {
          stopRotateWheel();
          return prevSpinTime;
        }
        const spinAngle = (spinAngleStart - easeOut(newSpinTime, 0, spinAngleStart, spinTimeTotal)) * totalRotations;
        setStartAngle((prevStartAngle) => prevStartAngle + (spinAngle * Math.PI / 180));
        setSpinTimeout(setTimeout(rotateWheel, 50));
        return newSpinTime;
      });
    };
  
    rotateWheel();
  };
  
  const easeOut = (t, b, c, d) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  };
  
  const stopRotateWheel = () => {
    clearTimeout(spinTimeout);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.font = '30px "Nanum Gothic"';
    ctx.fillStyle = 'black';
    const text = "꽝";
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    ctx.restore();
  };

  return (
    <div className='max-w-[1440px] w-full mx-auto flex justify-center items-center min-h-screen'>
      <div className='flex flex-col items-center'>
        <canvas 
          id="canvas" 
          ref={canvasRef} 
          width="500" 
          height="500"
        >
        </canvas>
        <button 
          id="spin" 
          onClick={spin}
          className='mt-8 font-bold text-4xl text-gray-400 hover:text-gray-700'
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Roulette;
