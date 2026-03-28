const btnAction = document.getElementById('btn-auth-action');
const nameInput = document.getElementById('full_name');
let isLogin = true;

document.getElementById('toggle-auth-mode').onclick = () => {
    isLogin = !isLogin;
    nameInput.style.display = isLogin ? "none" : "block";
    btnAction.innerText = isLogin ? "Entrar" : "Registrarse";
};

btnAction.onclick = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    btnAction.disabled = true;

    try {
        if (isLogin) {
            const { error } = await window.sb.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            window.location.href = 'dashboard.html';

        } else {
            const { data, error } = await window.sb.auth.signUp({
                email,
                password
            });

            if (error) throw error;

            await window.sb.from('owners').insert([{
                user_id: data.user.id,
                full_name: nameInput.value,
                email: email
            }]);

            alert("Registrado. Confirmá el email y entrá.");
            location.reload();
        }

    } catch (err) {
        alert(err.message);
        btnAction.disabled = false;
    }
};