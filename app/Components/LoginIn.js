
export function LoginIn(){

    const $login = document.createElement("div")
    $login.classList.add("loginIn");
    $login.innerHTML = `
    <h1>Iniciar sesión </h1>
    <form action="/login" method="POST">
    <label for="user">Username:</label><br>
    <input type="text" name="username" id="user" placeholder="Username"><br><br>
    <label for="password">Password:</label><br>
    <input type="password" name="password" id="password" placeholder="Password"><br><br>
    <input type="submit" value="Enviar"><br>
    </form>
    `;
    //$login.after(Loader());
    return $login;
}