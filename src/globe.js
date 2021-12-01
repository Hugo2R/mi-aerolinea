export default function planetaryjs(canvas) {
  let planet = window.planetaryjs.planet()

  planet.loadPlugin(autorotate(10));
  planet.loadPlugin(window.planetaryjs.plugins.earth({
    oceans:   { fill:   '#BBEEFF' },
    land:     { fill:   '#CCCCCC' },
    borders:  { stroke: '#05989F' }
  }));

  planet.loadPlugin(window.planetaryjs.plugins.pings());

  planet.projection.scale(400).translate([120, 250]).rotate([0, -30, 0]);

  if (window.devicePixelRatio === 2) {
    const context = canvas.getContext('2d');
    context.scale(2, 2);
  }

  planet.draw(canvas)
  return planet

  function autorotate(degPerSec) {
    return planet => {
      let lastTick = null;
      let paused = false;
      planet.plugins.autorotate = {
        pause:  () =>{ paused = true;  },
        resume: () => { paused = false; }
      };
      planet.onDraw(() => {

        if (paused || !lastTick) {
          lastTick = new Date();
        } else {
          const now = new Date();
          let delta = now - lastTick;

          var rotation = planet.projection.rotate();
          rotation[0] += degPerSec * delta / 1000;
          if (rotation[0] >= 180) rotation[0] -= 360;
          planet.projection.rotate(rotation);
          lastTick = now;
        }
      });
    };
  };
}

