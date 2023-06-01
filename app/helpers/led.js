//función encargado de cambiar la configuración de led
export async function led(device, newLedConfiguration){
    await device.led.write(newLedConfiguration); 
}