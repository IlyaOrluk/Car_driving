import {
  Engine,
  World,
  Bodies,
  Constraint,
  Render,
  Mouse,
  MouseConstraint,
  Events,
  Body,
} from "matter-js";

document.body.style.margin = 0;
document.body.style.padding = 0;

// create an engine
let engine = Engine.create(),
  world = engine.world,
  // create a renderer
  render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth * 0.9,
      height: window.innerHeight * 0.9,
      background: "#666",
      // showBroadphase: true,
      showAxes: true,
      // showCollisions: true,
      // showConvexHulls: true,
      // showVelocity: true,
      wireframes: false, // <-- important
    },
  });

engine.world.gravity.y = 0;
engine.world.gravity.x = 0;

const bridge = Bodies.rectangle(3800, -20, 100, 1800, { isStatic: false });
// add bodies
World.add(world, [
  // walls
  Bodies.rectangle(2000, 1000, 4000, 100, { isStatic: true }),
  Bodies.rectangle(2000, -1000, 4000, 100, { isStatic: true }),
  Bodies.rectangle(7000, 1000, 4000, 100, { isStatic: true }),
  Bodies.rectangle(0, 0, 100, 2000, { isStatic: true }),
  bridge,
  Constraint.create({
    bodyB: bridge,
    pointB: { x: 0, y: 670 },
    pointA: { x: bridge.position.x, y: bridge.position.y + 670 },
    stiffness: 0.5,
  }),
]);


const carOptions = {
  density: 0.001,
  restitution: 0.1,
  friction: 2,
  frictionAir: 0.01,
  slop: 0,
  render: {
    sprite: {
      texture: "http://www.clker.com/cliparts/4/2/n/E/D/M/p-car-top-view.svg",
      xScale: 0.5,
      yScale: 0.5,
      flip: false,
    },
  },
};

let car = Bodies.rectangle(400, 300, 300, 128, carOptions);
console.log(car);
World.add(world, [car]);


var tire = Bodies.circle(2490, 190, 300, {
  isStatic: false,
  render: {
    sprite: {
      texture: "https://opengameart.org/sites/default/files/Tire.png",
      xScale: 3.15,
      yScale: 3.15,
    },
  },
});
World.add(world, tire);

let carIsCollision = false;
let go = false,
  back = false,
  left = false,
  right = false;

window.addEventListener("keypress", (e) => {
  if (e.keyCode === 32) {
    // Body.setPosition(platform,);
    carIsCollision && Body.setVelocity(car, { x: car.velocity.x, y: -15 });
  }
});

let speed = 0;
window.addEventListener("keydown", (e) => {
  // console.log(e);
  if (e.code === "KeyD") {
    right = true;
  }

  if (e.code === "KeyA") {
    left = true;
  }
  if (e.code === "KeyW") {
    go = true;
  }

  if (e.code === "KeyS") {
    back = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "KeyD") {
    right = false;
    Body.setAngularVelocity(car, 0);
  }

  if (e.code === "KeyA") {
    left = false;
    Body.setAngularVelocity(car, 0);
  }

  if (e.code === "KeyW") {
    go = false;
  }

  if (e.code === "KeyD") {
    back = false;
  }
});

Events.on(engine, "beforeTick", function () {
  Render.lookAt(
    render,
    { x: car.position.x, y: car.position.y },
    {
      x: 360 * 2,
      y: 580 * 2,
    },
    true
  );

  if (go) {
    if (speed <= 4) {
      speed += 0.1;
    }
    // Body.setAngularVelocity(car, speed);

    console.log(car.speed);
    if (car.speed > 27) {
      if (car.angularVelocity < 0) {
        Body.setVelocity(car, {
          x: speed * 5 * Math.cos(car.angle + car.speed / 25),
          y: speed * 5 * Math.sin(car.angle + car.speed / 25),
        });
      }
      if (car.angularVelocity > 0) {
        Body.setVelocity(car, {
          x: speed * 5 * Math.cos(car.angle - car.speed / 25),
          y: speed * 5 * Math.sin(car.angle - car.speed / 25),
        });
      }
    }

    if (car.angularVelocity === 0) {
      Body.setVelocity(car, {
        x: speed * 5 * Math.cos(car.angle),
        y: speed * 5 * Math.sin(car.angle),
      });
    }
    // Body.setVelocity(car, {
    //   x: speed * 5 * Math.cos(car.angle+(car.speed/25)),
    //   y: speed * 5 * Math.sin(car.angle+(car.speed/25)),
    // });
    // Body.setVelocity(car, {
    //   x: (speed * 5) * Math.cos(car.angle),
    //   y: (speed * 5) * Math.sin(car.angle),
    // });
  }

  if (back) {
    if (speed !== 0) {
      car.speed -= 0.05;
    }
  }
  if (left) {
    Body.setAngularVelocity(car, -car.speed / 300);
    Body.setVelocity(car, {
      x: car.speed * Math.cos(car.angle),
      y: car.speed * Math.sin(car.angle),
    });
  }
  if (right) {
    Body.setAngularVelocity(car, car.speed / 300);
    Body.setVelocity(car, {
      x: car.speed * Math.cos(car.angle),
      y: car.speed * Math.sin(car.angle),
    });
  }
});

Events.on(engine, "collisionStart", function (event) {
  // console.log(car)
  var pairs = event.pairs;
  pairs.forEach((item) => {
    if (item.bodyB.id === car.id || item.bodyA.id === car.id) {
      carIsCollision = true;
    }
  });
});

Events.on(engine, "collisionEnd", function (event) {
  // console.log(car)
  var pairs = event.pairs;
  pairs.forEach((item) => {
    if (item.bodyB.id === car.id || item.bodyA.id === car.id) {
      carIsCollision = false;
    }
  });
});

// add mouse control
let mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
