export function ProfilePicture(){
    const $profilePicture = document.createElement("img");
    //$profilePicture.src="../app/assets/fotoPerfil.png";
    $profilePicture.src="/assets/fotoPerfil.png";
    $profilePicture.alt="ProfilePicture...";
    return $profilePicture;
}