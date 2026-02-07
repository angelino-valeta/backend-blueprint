export const emailTemplates = {
    welcome: (username: string) => ({
        subject: 'Bem-vindo ao Backend Blueprint!',
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bem-vindo!</h1>
            </div>
            <div class="content">
              <h2>Olá, ${username}!</h2>
              <p>Sua conta foi criada com sucesso no Backend Blueprint.</p>
              <p>Comece a explorar todas as funcionalidades disponíveis.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Backend Blueprint. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    }),

    passwordReset: (username: string, resetLink: string) => ({
        subject: 'Redefinição de Senha',
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .button { display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Redefinição de Senha</h1>
            </div>
            <div class="content">
              <h2>Olá, ${username}!</h2>
              <p>Recebemos uma solicitação para redefinir sua senha.</p>
              <p>Clique no botão abaixo para redefinir:</p>
              <p style="text-align: center;">
                <a href="${resetLink}" class="button">Redefinir Senha</a>
              </p>
              <p>Se você não solicitou esta redefinição, ignore este email.</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Backend Blueprint. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    }),

    notification: (title: string, message: string) => ({
        subject: title,
        html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title}</h1>
            </div>
            <div class="content">
              <p>${message}</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 Backend Blueprint. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    }),
};
