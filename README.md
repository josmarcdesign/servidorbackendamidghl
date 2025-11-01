# API de Submissão de Formulário GHL

Este projeto é um serviço de API backend, construído para ser implantado como uma **Serverless Function** na Vercel. Ele recebe dados de um formulário (nome, email, telefone) e os encaminha de forma segura para um endpoint do GoHighLevel (GHL).

## Parte 1: Implantação da API no Vercel

Siga estes passos para colocar sua API no ar.

### Pré-requisitos

1.  **Conta no GitHub:** [github.com](https://github.com)
2.  **Conta na Vercel:** [vercel.com](https://vercel.com) (conectada à sua conta do GitHub)
3.  **Git instalado:** [git-scm.com](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Passo a Passo

**1. Crie um Repositório no GitHub**

*   Vá até o [GitHub](https://github.com/new) e crie um novo repositório (público ou privado).
*   Siga as instruções para "push an existing repository from the command line":

```bash
# Na pasta do seu projeto local
git init
git add .
git commit -m "Inicia API para formulário GHL"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```

**2. Implante com a Vercel**

*   Acesse seu [Dashboard da Vercel](https://vercel.com/dashboard).
*   Clique em "**Add New...**" -> "**Project**".
*   Importe o repositório do GitHub que você acabou de criar.
*   A Vercel deve detectar a configuração automaticamente. Nenhuma alteração de configuração é necessária.
*   Clique em "**Deploy**".
*   Após a implantação, a Vercel fornecerá uma URL de produção. Sua API estará disponível em:
    `https://SEU-PROJETO.vercel.app/api/submit`

**Guarde esta URL!** Ela é o endpoint que seu site React irá chamar.

---

## Parte 2: Chamar a API a partir do seu Site React

No seu formulário React existente, na função que lida com o envio (`handleSubmit`), use o código abaixo para enviar os dados para a sua nova API na Vercel.

```jsx
// Exemplo de como chamar a API no seu componente de formulário React

const YourReactFormComponent = () => {
  // Seus states para nome, email, telefone, etc.
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // A URL da sua API que a Vercel gerou
    const apiUrl = 'https://SEU-PROJETO.vercel.app/api/submit';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Se a API retornar um erro (ex: 400, 500)
        throw new Error(result.message || 'Ocorreu um erro ao enviar.');
      }

      // Sucesso!
      setSubmitMessage('Formulário enviado com sucesso!');
      // Limpe os campos do formulário aqui, se desejar
      setFullName('');
      setEmail('');
      setPhone('');

    } catch (error) {
      console.error('Falha no envio:', error);
      setSubmitMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // O JSX do seu formulário vai aqui...
  // <form onSubmit={handleSubmit}> ... </form>
  
  return (
    <form onSubmit={handleSubmit}>
        {/* Seus campos de input */}
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nome Completo" required />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefone" required />
        
        <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>

        {submitMessage && <p>{submitMessage}</p>}
    </form>
  );
};
```

### O que o código faz:

1.  **Define `apiUrl`**: Coloque a URL da sua API Vercel aqui.
2.  **`fetch`**: Faz uma requisição `POST` para a sua API.
3.  **`headers`**: Informa à API que estamos enviando dados no formato JSON.
4.  **`body`**: Converte o estado do seu formulário (um objeto JavaScript) em uma string JSON para envio.
5.  **Tratamento de Resposta**: Verifica se a resposta foi bem-sucedida (`response.ok`) e exibe mensagens de sucesso ou erro para o usuário.
# servidorbackendamidghl
