const ICON_TOOLS = [
    ["/icon/icon_ue.png", "Unreal Engine icon"],
    ["/icon/icon_unity.png", "Unity icon"], // Clear, unity.com
    ["/icon/icon_blender.png", "Blender icon"],
    ["/icon/icon_python.png", "Python icon"], // Clear, python.org
    ["/icon/icon_duke.png", "Duke icon"], // Clear, oracle.com
    ["/icon/icon_rust.png", "Rust icon"], // Clear, rust-lang.org
    ["/icon/icon_cpp.png", "C++ icon"], // Clear, isocpp.org
    ["/icon/icon_csharp.png", "C# icon"],
    ["/icon/icon_html.png", "HTML icon"],
    ["/icon/icon_css.png", "CSS icon"],
    ["/icon/icon_js.png", "JS icon"],
    ["/icon/icon_node.png", "NodeJS icon"],
    ["/icon/icon_vscode.png", "Visual Studio Code icon"],
    ["/icon/icon_idea.png", "IntelliJ IDEA icon"]
];

let start, t, dt;

let animations = {
    tools: {
        playing: true,
        spawnTime: 0,
        cycleTime: 0,
        iconIndex: 0
    }
};

let objects = {
    tools_rings: []
};

let timers = {
    tools_ringSpawn: 0
};

class Ring {

    // Create a Ring with a lifetime and icon child.
    constructor(self, child, lifetime) {
        this.age = 0.0;
        this.elderly = false;
        this.lifetime = lifetime;

        this.self = self;
        this.child = child;
        this.dead = false;
    }

    // Destroy the ring and its child.
    destroy() {
        this.dead = true;
        $(this.self).remove();
    }

    // Animate this frame for the ring.
    #animateMe() {
        $(this.self).css({ // Rotate the ring.
            transform: `translate(-50%, -50%) rotate(${this.age/this.lifetime*360}deg)`
        });
    }

    // Animate this frame for the icon.
    #animateChild() {
        $(this.child).css({ // Rotate the icon.
            transform: `translate(-50%, 0%) rotate(${-this.age/this.lifetime*360}deg)`
        });
    }

    // Animate this frame.
    animate() {
        this.#animateMe();
        this.#animateChild();
    }

    // Age the Ring.
    mature(dt) {
        if(!dt || typeof dt != "number") return;

        this.age += dt; // Increment the age.
        if(this.lifetime * 0.80 <= this.age && !this.elderly) this.#close(); // Run any closing animations before lifetime ends.
        if(this.age > this.lifetime) this.destroy(); // Destroy the Ring when life finishes.
    }

    // Run any starting animations.
    start() {

        // Expand ring.
        $(this.self).css({width: "1rem", height: "1rem"});
        $(this.self).animate({
            width: "100%",
            height: "100%"
        }, this.lifetime * 0.20, 'easeOutQuad');

        // Fade in icon.
        $(this.child).css({opacity: 0});
        $(this.child).animate({
            opacity: 1
        }, this.lifetime * 0.20, 'linear');

    }

    #close() {
        this.elderly = true; // Make elderly.

        // Fade out and shrink icon.
        $(this.child).animate({
            opacity: 0,
            width: 0
        }, this.lifetime * 0.20, 'easeInQuad');
    }
}

function stepTools(dt) {
    if(!animations["tools"].playing) return;

    // Spawn another Ring on a timer.
    if(timers["tools_ringSpawn"] <= 0) {
        timers["tools_ringSpawn"] = animations["tools"].spawnTime; // Reset timer.

        let iconIndex = animations["tools"].iconIndex;
        let ring = makeRing(ICON_TOOLS[iconIndex], animations["tools"].cycleTime); // Make new ring.
        ring.start(); // Run any starting Ring animations.

        animations["tools"].iconIndex = (iconIndex + 1) % ICON_TOOLS.length; // Increment the icon index.
    } else {
        // Decrease time left on timer.
        timers["tools_ringSpawn"] -= dt;
    }

    // For every Ring, animate it and age it.
    objects["tools_rings"].forEach((ring, i) => {
        if(!ring) return;

        // Remove the Ring from the array if dead.
        if(ring.dead) {
            objects["tools_rings"].splice(i,1);
            return;
        }

        // Animate and age the Ring.
        ring.animate();
        ring.mature(dt);
    });
}

function step(timestamp) {
    if (start === undefined) start = timestamp;

    // Update time and delta time.
    dt = timestamp - t - start;
    t = timestamp - start;

    //console.log("ts: " + timestamp, "\nstart: " + start, "\nt: " + t, "\ndt: " + dt);

    // Ensure delta time is ready.
    if(!dt || typeof dt != "number") {
        requestAnimationFrame(step);
        return;
    }

    // Step the tool animation.
    stepTools(dt);

    requestAnimationFrame(step);
}

function makeRing(icon, lifetime) {

    // Create a ring object.
    let ring = $(`<div class="dynamic-ring" data-icon="${icon[1]}">`);
    ring.appendTo('.dynamic-tools'); // Append the ring to the container.

    // Create an icon object.
    let img = $(`<img class="icon-tool" alt="${icon[1]}">`);
    img.attr('src', icon[0]);
    img.appendTo($(ring)); // Append the icon to the ring.

    let ringObject = new Ring($(ring), $(img), lifetime);
    objects["tools_rings"].push(ringObject); // Add the Ring to an array.

    // Return the created Ring object.
    return ringObject;

}

function createTools(prewarm, delay, cycleTime) {
    $(".outer-tools").css("--anim-time", `${cycleTime}ms`);
    animations["tools"].spawnTime = delay;
    animations["tools"].cycleTime = cycleTime;
    requestAnimationFrame(step);
}

// When the document begins, start any animations.
$('document').ready(function() {

    // Create the dynamic tool animation.
    createTools(7, 1200, 10000);

});

// TODO
// Refactor tools animation
// Enable and disable animation through button toggle presses.
// Add text below the pause/play button displaying the current tool.
// Add a debug keybind.
// Comments!!