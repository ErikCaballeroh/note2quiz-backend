export const generatePasswordResetEmail = (code: string): string => {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recupera tu contraseña — Note2Quiz</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DM Sans', 'Segoe UI', Tahoma, sans-serif;
            background-color: #f4f3f8;
            color: #1e1a2e;
            -webkit-font-smoothing: antialiased;
        }

        .wrapper {
            padding: 40px 16px;
        }

        .container {
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(109, 40, 217, 0.08), 0 8px 24px rgba(109, 40, 217, 0.06);
        }

        /* Header */
        .header {
            background-color: #7c3aed;
            padding: 36px 40px 32px;
            position: relative;
        }

        .header-eyebrow {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.6);
            margin-bottom: 8px;
        }

        .header h1 {
            font-size: 22px;
            font-weight: 600;
            color: #ffffff;
            letter-spacing: -0.02em;
            line-height: 1.3;
        }

        .header-rule {
            width: 32px;
            height: 2px;
            background-color: rgba(255,255,255,0.3);
            margin-top: 16px;
            border-radius: 2px;
        }

        /* Body */
        .body {
            padding: 36px 40px;
        }

        .body p {
            font-size: 15px;
            line-height: 1.65;
            color: #4b4468;
            margin-bottom: 16px;
        }

        .body p strong {
            color: #1e1a2e;
            font-weight: 600;
        }

        /* Code block */
        .code-wrapper {
            margin: 28px 0;
            background-color: #faf9ff;
            border: 1px solid #ede9fe;
            border-radius: 10px;
            padding: 28px 24px 20px;
            text-align: center;
        }

        .code-label {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #a78bfa;
            margin-bottom: 14px;
        }

        .code-value {
            font-family: 'DM Mono', 'Courier New', monospace;
            font-size: 36px;
            font-weight: 500;
            color: #7c3aed;
            letter-spacing: 10px;
            line-height: 1;
        }

        .code-expiry {
            margin-top: 14px;
            font-size: 12px;
            color: #9ca3af;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }

        .code-expiry svg {
            flex-shrink: 0;
        }

        /* Divider */
        .divider {
            border: none;
            border-top: 1px solid #f0edfb;
            margin: 28px 0;
        }

        /* Warning */
        .warning {
            background-color: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 8px;
            padding: 14px 16px;
            font-size: 13px;
            color: #92400e;
            line-height: 1.55;
            margin: 24px 0;
        }

        .warning strong {
            color: #78350f;
        }

        /* List */
        .body ul {
            padding-left: 0;
            list-style: none;
            margin: 4px 0 16px;
        }

        .body ul li {
            font-size: 14px;
            color: #6b7280;
            padding: 5px 0 5px 20px;
            position: relative;
            line-height: 1.5;
        }

        .body ul li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 13px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #c4b5fd;
        }

        /* Footer */
        .footer {
            background-color: #faf9ff;
            border-top: 1px solid #f0edfb;
            padding: 24px 40px;
            text-align: center;
        }

        .footer-brand {
            font-size: 13px;
            font-weight: 600;
            color: #7c3aed;
            letter-spacing: -0.01em;
            margin-bottom: 6px;
        }

        .footer p {
            font-size: 11px;
            color: #b5b0c8;
            line-height: 1.6;
            margin-bottom: 2px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">

            <div class="header">
                <div class="header-eyebrow">Seguridad de cuenta</div>
                <h1>Recuperación de contraseña</h1>
                <div class="header-rule"></div>
            </div>

            <div class="body">
                <p>Hola,</p>
                <p>
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Note2Quiz</strong>.
                    Usa el siguiente código para continuar con el proceso:
                </p>

                <div class="code-wrapper">
                    <div class="code-label">Tu código de verificación</div>
                    <div class="code-value">${code}</div>
                    <div class="code-expiry">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="6" cy="6" r="5" stroke="#9ca3af" stroke-width="1.2"/>
                            <path d="M6 3.5V6L7.5 7.5" stroke="#9ca3af" stroke-width="1.2" stroke-linecap="round"/>
                        </svg>
                        Expira en 10 minutos
                    </div>
                </div>

                <p>Ingresa este código en la aplicación para completar el restablecimiento de tu contraseña.</p>

                <hr class="divider">

                <div class="warning">
                    <strong>Aviso de seguridad:</strong> Si no solicitaste este cambio, ignora este mensaje o comunícate con nuestro equipo de soporte. Tu cuenta permanece segura.
                </div>

                <p>Si tienes inconvenientes, puedes:</p>
                <ul>
                    <li>Verificar que el código esté escrito correctamente</li>
                    <li>Solicitar un nuevo código si este ya expiró</li>
                    <li>Contactar a nuestro equipo de soporte</li>
                </ul>
            </div>

            <div class="footer">
                <div class="footer-brand">Note2Quiz</div>
                <p>&copy; 2026 Note2Quiz. Todos los derechos reservados.</p>
                <p>Este es un mensaje automático. Por favor, no respondas a este correo.</p>
            </div>

        </div>
    </div>
</body>
</html>
    `;
};
