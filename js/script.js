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

// Given an icon asset, its index in the cycle, and the delay in time between icons, make a new ring.
function makeRing(icon, i, delay) {

    // Create the ring and give it an appropriate delay.
    let ring = $(`<div class="dynamic-ring" data-icon="${icon[1]}">`);
    ring.attr("style", `--anim-delay: ${i*delay}ms`);
    ring.appendTo('.dynamic-tools'); // Append the ring to the container.

    // Create the icon and give it an appropriate delay.
    let img = $(`<img class="icon-tool" alt="${icon[1]}">`);
    img.attr("style", `--anim-delay: ${i*delay}ms`);
    img.attr('src', icon[0]);
    img.appendTo($(ring)); // Append the icon to the ring.

    // Once the ring completes its orbit, destroy it.
    console.log(icon[0] + ": waiting " + delay*(ICON_TOOLS.length+i));
    setTimeout(() => {
        console.log(icon[0] + " removed!");
        $(ring).remove();
    }, delay*(ICON_TOOLS.length+i) );

}

// Given an icon asset, its index in the cycle, the delay in time between icons, and a prewarm number, make a new ring.
function makeWarmRing(icon, i, delay, pre) {
    // In the call, subtract the prewarm number from the index to progress the animation ahead if needed.
    makeRing(icon, i-pre, delay);
}

// Create multiple orbiting icons given a time delay between icons and a prewarm number to start the animation in progress when opened.
function createTools(prewarm, delay) {

    // Create the prewarm rings and icons.
    ICON_TOOLS.forEach((icon, i) => {
        makeWarmRing(icon, i, delay, prewarm)
    });

    // Wait for the prewarm rings to finish their cycle around the orbit.
    setTimeout(() =>
        {
            // Once finished waiting, create a new set of rings and icons.
            ICON_TOOLS.forEach((icon, i) => {makeRing(icon, i, delay)});

            // Once every cycle finishes from now on, create a new set of rings and icons.
            setInterval(
                ()=> {
                    ICON_TOOLS.forEach((icon, i) => {makeRing(icon, i, delay)});
                }, ICON_TOOLS.length * delay
            );

        }, (ICON_TOOLS.length-prewarm) * delay
    );

}

// When the document begins, start any animations.
$('document').ready(function() {

    // Create the dynamic tool animation.
    createTools(7, 1200);
});