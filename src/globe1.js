export default function planetaryjs(canvas) {
    let planet = window.planetaryjs.planet()

		planet.loadPlugin(autorotate(10))
    //planet.loadPlugin(animate())
		planet.loadPlugin(window.planetaryjs.plugins.pings())
		planet.loadPlugin(window.planetaryjs.plugins.zoom())
		planet.loadPlugin(window.planetaryjs.plugins.drag())
    planet.loadPlugin(window.planetaryjs.plugins.earth({
      oceans:   { fill:   '#BBEEFF' },
      land:     { fill:   '#DDDDDD' },
      borders:  { stroke: '#269F05' }      
    }))

    planet.projection.scale(400).translate([120, 250]).rotate([0, -30, 0])

    var colors = ['red', 'yellow', 'white', 'orange', 'green', 'cyan', 'pink'];
    setInterval(function() {
    var lat = Math.random() * 170 - 85;
    var lng = Math.random() * 360 - 180;
    var color = colors[Math.floor(Math.random() * colors.length)];
    planet.plugins.pings.add(lng, lat, { color: color, ttl: 2000, angle: Math.random() * 10 });
  }, 150);


	  if (window.devicePixelRatio === 2) {
      canvas.width = 800;
      canvas.height = 800;
      const context = canvas.getContext('2d');
      context.scale(2, 2);
    }

    try {
      planet.draw(canvas)
      return planet
    } catch (e) {
      console.log('No globe', e)
    }
}

function autorotate(degPerSec) {
  return planet => {
    let lastTick = null
    let paused = false

    planet.plugins.autorotate = {
      pause:  () => { paused = true;  },
      resume: () => { paused = false; }
    }

    planet.onDraw(() => {
      if (paused || !lastTick) {
        lastTick = new Date()
      } else {
        let now = new Date()
        let delta = now - lastTick
        const rotation = planet.projection.rotate()
        rotation[0] += degPerSec * delta / 1000
        if (rotation[0] >= 180) rotation[0] -= 360

        planet.projection.rotate(rotation)
        lastTick = now
      }
    })
  }
}

/*function distance(a, b) {
  return Math.sqrt(Math.pow(a - b, 2))
}

function animate() {
  return planet => {
    let xDeg= 0
    let yDeg= 0
    let active = false
    let step = 1
    let xStep = 1
    let yStep = 1

    planet.plugins.animate = {
      jump: (x, y) => { 
        active = true
        xDeg = x
        yDeg = y
        const r = planet.projection.rotate()
        xStep = distance(r[0], xDeg) / 3000
        xStep = distance(r[1], yDeg) / 3000
      }
    }

    planet.onDraw(() => {
      let rotation = planet.projection.rotate()
      rotation = [parseInt(rotation[0]), parseInt(rotation[1]), 0 ]
      if (active) {
        if (distance(rotation[0] + xStep, xDeg) < distance(rotation[0] - xStep, xDeg)) {
          rotation[0]+= step
        } else {
          rotation[0]-= step
        }

        if (distance(rotation[1] + 1, yDeg) < distance(rotation[1] - 1, yDeg)) {
          rotation[1]+= step
        } else {
          rotation[1]-= step
        }

        console.log(...rotation)

        if (rotation[0] >= 180) rotation[0] -= 360
        if (rotation[1] !== yDeg) rotation[1]++

        if ((distance(rotation[0], xDeg) < 1) && (distance(rotation[1], yDeg) < 1) ) {
          active = false
          console.log("!active")
        }
        planet.projection.rotate(rotation)
      }
    })
  }
}*/

