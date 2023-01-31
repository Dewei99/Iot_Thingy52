import { ProfilePicture } from "./ProfilePicture.js";

export function ProfileHeader(){
    const $profileHeader = document.createElement("div"),$username = document.createElement("div"),
    $loginButton = document.createElement("div"),$userName = document.createElement("div");
    $profileHeader.classList.add("profileHeader");
    $username.classList.add("username");
    $loginButton.classList.add("loginButton");
    $userName.innerHTML=`username`;
    $loginButton.innerHTML=`<a href="/login" class="nav__link" data-link>loginIn</a>`;
    $profileHeader.appendChild(ProfilePicture());
    $profileHeader.appendChild($userName);
    $profileHeader.appendChild($loginButton);
    return $profileHeader;
}