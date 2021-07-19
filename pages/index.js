
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import React, { useEffect, useState } from 'react'

// TODO 
// FAZER IMAGEM RENDERIZAR NO MENU 
// O QUE PRECISA FAZER PARA RENDERIZAR A IMAGEM
// CRIAR UM COMPONENTE PARAR RENDERIZAR AS LISTAS E NÃO DEIXAR PASSAR DE 6
// PROFILEAREA TRANSFORMAR EM SIDEBAR

function ProfileRelationsBox(seguidores) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        Pessoas da comunidade ({seguidores.items.length})
      </h2>

      <ul>
        {seguidores.items.slice(0, 6).map((itemAtual) => {
          return (
            <li key={itemAtual.login}>
              <a href={`https://github.com/${itemAtual.login}`} >
                <img src={`https://github.com/${itemAtual.login}.png`} style={{ borderRadius: '8px' }} />
                <span>{itemAtual.login}</span>
              </a>
            </li>

          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

function ProfileSideBar(propriedades) {
  return (
    <Box as='aside'>
      <a href={`https://github.com/${propriedades.gitHubUser}`} >
        <img src={`https://github.com/${propriedades.gitHubUser}.png`} style={{ borderRadius: '8px' }} />
      </a>
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.gitHubUser}`} >
          @{propriedades.gitHubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

export default function Home() {
  const usuarioX = 'patrickzequiel'
  const [comunidades, setComunidades] = React.useState([{ id: 332432432432432342, title: 'Eu odieo acordar cedo', image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg' }]);
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]
  // 0 - Pegar o array de dados do github
  const [seguidores, setSeguidores] = useState([])

  useEffect(() => {
    fetch('https://api.github.com/users/patrickzequiel/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      })
  }, [])

  useEffect(() => {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '4e4f3d8a518feeb9a31eb3420464a1',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "query": `query {
        allCommunities {
          id
          title
          imageUrl
        }
      }` })
    })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        console.log(comunidadesVindasDoDato);
        setComunidades(comunidadesVindasDoDato)

      }
      )
  }, [])
  // 1 - Criar um box que vai ter um map para buscar esse json

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar gitHubUser={usuarioX} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem Vindo
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={
              function handleCriarComunidade(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                console.log('Campo: ', dadosDoForm.get('title'))
                console.log('Campo: ', dadosDoForm.get('image'))

                const comunidade = {
                  title: dadosDoForm.get('title'),
                  imageUrl: dadosDoForm.get('image'),
                }
                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
                })
                  .then(async (response) => {
                    const dados = await response.json();
                    console.log(dados.registroCriado);
                    const comunidade = dados.registroCriado;
                    const comunidadesAtualizadas = [...comunidades, comunidade];
                    setComunidades(comunidadesAtualizadas)
                  })

              }
            }>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text" />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Colque uma URL para usarmos de capa"
                  type="text" />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>

            <ul>
              {comunidades.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/comunities/${itemAtual.id}`} key={itemAtual.title}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>

                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
        </div>
      </MainGrid>
    </>
  )
}
