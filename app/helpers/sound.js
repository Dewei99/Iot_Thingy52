export async function led(device, newLedConfiguration){
    await device.led.write(newLedConfiguration); 
}