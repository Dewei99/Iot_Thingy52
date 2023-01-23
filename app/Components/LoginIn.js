
export function LoginIn(){

    const $login = document.createElement("div")
    $login.classList.add("loginIn");
    $login.innerHTML = `
    <form action="/login" method="POST">
    <label for="email">Email:</label><br>
    <input type="email" name="email" id="email"><br>
    <label for="password">Password</label><br>
    <input type="password" name="password" id="password"><br>
    <input type="submit" value="Enviar"><br>
    </form>
    `;
    //$login.after(Loader());
    return $login;
}