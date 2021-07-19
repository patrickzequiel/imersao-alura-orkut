import { SiteClient } from 'datocms-client'

export default async function receberDeRequest(request, response) {
    
    if(request.method === 'POST') {
        const TOKEN = '71b0e0e8ae33e2a944dad1a13914aa';

        const client = new SiteClient(TOKEN);
        
        // IMPORTANTE VALIDAR OS DADOS ANTES DE CADASTRAR
        const registroCriado = await client.items.create({
            itemType: "977457",
            ...request.body,
            // title: "Comunidade de teste",
            // imageUrl: "https://github.com/patrickzequie.png"
        })
    
        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado
        })
        
        return
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST temos!'
    })

}



