//función encargado de renderizar el perfil de usuario
export function ProfilePicture(){
    const $profilePicture = document.createElement("img");
    //ruta de la imagen
    $profilePicture.src="/assets/fotoPerfil.png";
    $profilePicture.alt="ProfilePicture...";
    return $profilePicture;
}