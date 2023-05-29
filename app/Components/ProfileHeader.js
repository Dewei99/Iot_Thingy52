import { ProfilePicture } from "./ProfilePicture.js";
//renderiza la parte derecha de la cabecera
export function ProfileHeader(){
    const d=document,$profileHeader = d.createElement("div"),$username = d.createElement("div"),
    $loginButton = d.createElement("div"),$logOutButton = d.createElement("div"),
    $menuUsuario=d.createElement("div");
    $profileHeader.classList.add("profileHeader");
    $username.classList.add("username");
    $loginButton.classList.add("logInButton");
    $logOutButton.classList.add("logOutButton");
    $menuUsuario.classList.add("userMenu");

    $username.innerHTML=`username`;
    //definir menú utilizado para cambiar la vista
    $menuUsuario.innerHTML=`
        <a href="/sensors" class="sensorsLink" data-link>Sensores</a>
        <div class="vertical"></div>
        <a href="/database" class="databaseLink" data-link>Base de datos</a>
        <div class="vertical"></div>
        <a href="/remote" class="realTimeDataLink" data-link>Modo Remoto</a>
    `;
    $loginButton.innerHTML=`<a href="/login" class="nav__link" data-link>logIn</a>`;
    $logOutButton.innerHTML=`<a href="/signout" class="nav__link" data-link>logOut</a>`;
    //renderizar imagen de perfil
    $profileHeader.appendChild(ProfilePicture());
    //renderizar nombre de usuario
    $profileHeader.appendChild($username);
    //renderizar menu para cambiar de vista
    $profileHeader.appendChild($menuUsuario);
    //renderizar botón de login
    $profileHeader.appendChild($loginButton);
    //renderizar botón de logout
    $profileHeader.appendChild($logOutButton);
    return $profileHeader;
}