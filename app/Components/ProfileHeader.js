import { ProfilePicture } from "./ProfilePicture.js";

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
    $menuUsuario.innerHTML=`
        <a href="/sensors" class="sensorsLink" data-link>Sensores</a>
        <div class="vertical"></div>
        <a href="/database" class="databaseLink" data-link>Base de datos</a>
        <div class="vertical"></div>
        <a href="/realTimeData" class="realTimeDataLink" data-link>Datos tiempo real</a>
    `;
    $loginButton.innerHTML=`<a href="/login" class="nav__link" data-link>logIn</a>`;
    $logOutButton.innerHTML=`<a href="/signout" class="nav__link" data-link>logOut</a>`;
    $profileHeader.appendChild(ProfilePicture());
    $profileHeader.appendChild($username);
    $profileHeader.appendChild($menuUsuario);
    $profileHeader.appendChild($loginButton);
    $profileHeader.appendChild($logOutButton);
    return $profileHeader;
}