// ==========================================
// 4. Proteksi Halaman & Inisialisasi
// ==========================================
document.addEventListener(
    "DOMContentLoaded",
    initSettings
);

async function initSettings(){

    await protectRoute();

    await loadLayout();

    await loadUser();

    initFormNama();

    initFormPassword();

}

// ==========================================
// 5. Tampilkan Data User
// ==========================================
async function loadUser(){

    const user =
        await getCurrentUser();

    if(!user){
        return;
    }

    document.getElementById(
        "nama-user"
    ).textContent =
        user.user_metadata.nama ||
        "-";

    document.getElementById(
        "email-user"
    ).textContent =
        user.email;

}

// ==========================================
// 6. Ubah Nama
// ==========================================
function initFormNama(){

    const form =
        document.getElementById(
            "form-nama"
        );

    form.addEventListener(
        "submit",
        updateNama
    );

}

async function updateNama(
    event
){

    event.preventDefault();

    const nama =
        document
        .getElementById(
            "nama"
        )
        .value
        .trim();

    if(!nama){

        alert(
            "Nama wajib diisi."
        );

        return;
    }

    const {
        error
    } =
    await supabaseClient
        .auth
        .updateUser({

            data:{
                nama
            }

        });

    if(error){

        alert(
            error.message
        );

        return;
    }

    alert(
        "Nama berhasil diubah."
    );

    // Reset input text field setelah berhasil (opsional)
    document.getElementById("nama").value = "";

    await loadUser();

}

// ==========================================
// 7. Ganti Password
// ==========================================
function initFormPassword(){

    const form =
        document.getElementById(
            "form-password"
        );

    form.addEventListener(
        "submit",
        updatePassword
    );

}

async function updatePassword(
    event
){

    event.preventDefault();

    const password =
        document
        .getElementById(
            "password"
        )
        .value
        .trim();

    if(password.length < 6){

        alert(
            "Password minimal 6 karakter."
        );

        return;
    }

    const {
        error
    } =
    await supabaseClient
        .auth
        .updateUser({

            password

        });

    if(error){

        alert(
            error.message
        );

        return;
    }

    alert(
        "Password berhasil diubah."
    );

    document.getElementById(
        "password"
    ).value = "";

}