
export function LogIn(){

    const $login = document.createElement("div")
    $login.classList.add("loginPanel");
    $login.innerHTML = `
    <h1>Iniciar sesión </h1>
    <form action="/login" class="login" method="POST">
    <label for="user">Username:</label><br>
    <input type="text" name="username" id="user" placeholder="Username"><br><br>
    <label for="password">Password:</label><br>
    <input type="password" name="password" id="password" placeholder="Password"><br><br>
    <input type="submit" value="SIGN IN"><br>
    </form>
    <span class="error">Contraseña o nombre de usuario incorrecto"</span>
    `;
    

    //$login.after(Loader());
    return $login;
}