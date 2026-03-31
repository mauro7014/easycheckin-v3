const btnRegister = document.getElementById("btn-register");
const msg = document.getElementById("msg");

btnRegister.addEventListener("click", async () => {
    const full_name = document.getElementById("full_name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!full_name || !email || !password) {
        msg.textContent = "Todos los campos son obligatorios.";
        return;
    }

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { full_name: full_name }
        }
    });

    if (error) {
        msg.textContent = `Error: ${error.message}`;
    } else {
        msg.textContent = "Registro exitoso. Revisa tu correo para confirmar.";
        console.log("Usuario registrado:", data.user);
    }
});