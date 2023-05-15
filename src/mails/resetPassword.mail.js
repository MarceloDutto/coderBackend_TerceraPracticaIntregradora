export const generateResetPasswordMail  = (user, link) => {
    return `<div style="background-color: #F7F8F3; padding-top: 20px; padding-bottom: 20px;">
    <div style="max-width: 640px; margin: 0 auto; border-radius: 4px; overflow: hidden;">
        <div style="margin: 0 auto; max-width: 640px; background-color: #ffffff; padding-bottom: 30px;">
            <div style=" display: inline-block; text-align: left; vertical-align: top; direction: ltr; padding: 40px 50px; font-family: Arial, Helvetica, sans-serif; font-size: 16px;">
                <h2 style="font-family: Arial, Helvetica, sans-serif; font-weight: 500; font-size: 20px; color: #012C3D; letter-spacing: 0.27px;">Hola, ${user.first_name}</h2>
                <p style="line-height: 24px; text-align: left;">Haz clic en el siguiente botón para restablecer tu contraseña. Si no has solicitado una nueva contraseña, ignora este correo.</p>
            </div>
            <div style=" display: flex; justify-content: center; padding: 10px 25px; padding-top: 20px;">
                <div style="vertical-align: middle; border: none; border-radius: 3px; color: #F7F8F3;">
                    <a href="${link}" target="_blank" style="text-decoration: none; line-height: 100%; background-color: rgb(88, 101, 242); font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: normal; color: #F7F8F3; text-transform: none; padding: 19px;">Reestablecer contraseña</a>
                </div>
             </div>
        </div>

    </div>
</div>`
};