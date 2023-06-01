//definir las posibles configuraciones del Led RGB del dispositivo Thingy 52
const blueLed = {
    mode: "breathe",//"breathe"
    color: 4,//blue
    intensity: 80,
    delay: 1000,
}

const greenLed = {
    mode: "breathe",
    color: 2,//green
    intensity: 80,
    delay: 1000,
}

const yellowLed = {
    mode: "breathe",
    color: 3,//yellow
    intensity: 100,
    delay: 500,
}

const redLed = {
    mode: "breathe",
    color: 1,//red
    intensity: 90,
    delay: 200,
}

const purpleLed = {
    mode: "breathe",
    color: 5,//purple
    intensity: 90,
    delay: 400,
}

export default{
    blueLed,
    greenLed,
    yellowLed,
    redLed,
    purpleLed
};