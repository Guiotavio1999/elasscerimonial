# Elass Cerimonial — entrega administrativa de 12/11/2026

**Status: PUBLICADO COM PENDÊNCIAS.** O núcleo de gestão está publicado, conectado ao Neon e protegido por autenticação. O escopo ampliado ainda não está 100% concluído. Não houve cadastro de clientes ou eventos fictícios em produção.

## Entrega e diagnóstico

A restauração do visual original também havia removido os arquivos do administrativo, backend, rotas e build. O banco e as configurações da Vercel permaneceram disponíveis. O formulário público havia voltado a abrir o WhatsApp sem gravar o contato, e as URLs canônicas apontavam para um endereço antigo.

O sistema foi recuperado sem substituir os capítulos, a narrativa, as fontes e as fotografias do site aprovado. Foram reconectados formulário, CRM e CMS e acrescentadas funções operacionais.

| Área | Implementação entregue |
|---|---|
| Site público | Visual aprovado preservado, URLs canônicas corrigidas, links de portal/equipe e formulário persistente antes de oferecer WhatsApp |
| Administrativo | Navegação por módulos, seleção de evento, cadastro/edição, arquivamento confirmado, carregamento e mensagens de erro |
| CRM | Contatos manuais e do site, funil/lista, etapas, responsáveis, próxima atividade, interações, propostas e conversão em cliente |
| Banco | Postgres no Neon, APIs no servidor, migrações versionadas e branch de QA separada |
| Clientes e eventos | Cadastro, vínculo entre cliente e casamento, datas, locais, dados operacionais e espaço do evento |
| Tarefas e cronograma | Responsáveis, prazos, situação, compartilhamento, modelos de checklist e filtros de hoje/semana/atraso |
| Fornecedores | Cadastro central e contratações por evento, valores, situação, chegada e instruções |
| Financeiro | Contratado separado de recebido, adiantamentos, parcelas, estornos, saldo, despesas por evento, caixa e exportação |
| Cobrança | Alocação dos recebimentos líquidos nas parcelas com vencimento mais antigo; saldo vencido apresentado explicitamente |
| Contratos e arquivos | Cadastro de contratos e documentos privados de até 2 MB; download autorizado e versões por título |
| Portal dos noivos | Acesso limitado ao evento, formulário em seções, rascunho/conclusão, tarefas e documentos compartilhados |
| Convidados | Grupos, capacidade, RSVP por token imprevisível, mesas com limite de ocupação e importação com revisão de duplicados |
| Check-in | Recepção restrita ao evento, chegadas parciais, contagem acumulada, operador e proteção contra repetição do mesmo envio |
| Equipe | Cadastro de profissionais, atribuições por evento e permissões por e-mail/perfil/evento |
| Conteúdo do site | Textos configuráveis, serviços, histórias, depoimentos, parceiros e FAQ; publicação controlada |
| Imagens | Biblioteca de JPEG, PNG e WebP de até 2 MB, separada dos documentos privados, com publicação e URL para o CMS |
| Produtividade | Busca global, agenda, ordenação e exportação de todas as páginas filtradas |
| Segurança | Verificação de JWT, e-mail verificado, concessão ativa, autorização no backend, validação e auditoria |
| Publicação | Preview e produção na Vercel; migrações 004/005 aditivas verificadas em QA antes da aplicação em produção |

## Evidências de validação

Os testes usam uma branch isolada do Neon e contas fictícias de QA; não há contas de demonstração na produção.

- Build de produção concluído.
- Roteiro integral de APIs aprovado: contato → CRM → cliente → evento → contrato/adiantamento → portal/briefing → RSVP → check-in → CMS, com persistência e testes de acesso indevido.
- Segunda parcela e estorno aprovados: R$ 350 + R$ 650 − R$ 200 = R$ 800 líquidos, saldo de R$ 1.200 em contrato de R$ 2.000, sem alterar o evento em Planejamento. Recebimento acima do saldo foi recusado.
- Seis testes de domínio aprovados: valores, permissões, dados inválidos, importação CSV, datas/horários e alocação por vencimento.
- Integração de extensões aprovada: busca, filtros, equipe, imagens publicadas/privadas, revogação e reativação de acesso.
- Regressão de release aprovada: financeiro, isolamento entre casais, documentos privados, CMS, conflitos de edição e check-in parcial idempotente.
- O cenário de R$ 2.000 contratados e R$ 350 recebidos preserva o evento em Planejamento e o saldo de R$ 1.650.
- Testes de RSVP verificaram convite válido/inválido, limite de pessoas e persistência; check-in excedente e acesso da recepção ao financeiro foram recusados.
- Produção: tela de login aberta no navegador; configuração e conteúdo público responderam HTTP 200; API privada sem login respondeu HTTP 401.
- Não foram encontrados logs de erro/fatal da implantação funcional no intervalo consultado após a publicação.

As primeiras reexecuções do roteiro completo revelaram problemas da própria rotina de QA: tempo insuficiente, token de teste expirado e tentativa de recriar a chave única de uma seção do CMS. A rotina foi ajustada para renovar o token e editar a seção existente com controle de versão. Isso não exigiu enfraquecer a autenticação da aplicação.

**Não executado:** homologação visual autenticada de todas as telas em desktop, tablet, iPhone e Android; primeiro login da conta real do proprietário; confirmação de entrega de e-mail ao proprietário; integrações externas não configuradas. Os testes de APIs e banco não substituem essa homologação visual.

## Infraestrutura

| Item | Referência |
|---|---|
| Repositório | https://github.com/Guiotavio1999/elasscerimonial |
| Branch de produção | `main` |
| Branch de implementação | `feature/admin-operacional-20261112` |
| Integração funcional | PR #3 — https://github.com/Guiotavio1999/elasscerimonial/pull/3 |
| Commit funcional publicado | `f1099eeb03d9aafec7fc38442842dc1786468ad4` |
| Implantação funcional | `dpl_AJZHPj6mPXVTLUD6iuhnvDCd23J6` — READY |
| Preview funcional | https://elasscerimonial-btf80gook-guilherme-ramos-projects1.vercel.app |
| Site | https://elasscerimonial.vercel.app |
| Admin | https://elasscerimonial.vercel.app/admin |
| Portal | https://elasscerimonial.vercel.app/portal |
| Banco | Neon — projeto `weathered-water-11959679`, banco `elass` |
| Migrações aplicadas | 001, 002, 003, 004 e 005 |

Atualizações posteriores de testes e deste relatório são separadas da implementação funcional acima. Nenhuma senha ou string de conexão deve ser copiada para este documento.

## O que ainda falta

| Prioridade | Pendência e consequência |
|---|---|
| Crítica | Nenhuma falha crítica conhecida nos fluxos verificados; isso não equivale a garantia de ausência de falhas |
| Alta | Primeiro acesso real e homologação visual autenticada em desktop/mobile, especialmente formulários, seleção de evento e navegação |
| Alta | Cadastrar os clientes, eventos, equipe, fornecedores e materiais reais; substituir os exemplos ilustrativos do portfólio por conteúdo autorizado |
| Alta | Completar a gestão de configurações e de todas as imagens/seções do site; o CMS atual cobre os campos e coleções descritos acima |
| Média | Despesas gerais sem vínculo com evento, relatórios analíticos e filtros financeiros/comerciais mais amplos; vínculo explícito de cada recebimento a uma parcela, além da alocação atual por vencimento |
| Média | Modelos de checklist editáveis, formulários adicionais, documentos comerciais diagramados e alertas internos avançados |
| Média | Política de retenção configurável, atendimento de solicitações de titulares e cópias externas automatizadas; recuperação atual usa o histórico Neon e o procedimento documentado |
| Baixa | QR Code, editor visual de mesas/assentos e outras melhorias complementares de produtividade |
| Serviço externo | Assinatura eletrônica, cobrança online, envio automático de WhatsApp, calendário externo e SMTP próprio da marca dependem de provedores e configuração real |

Uma imagem despublicada pode permanecer em cache por até cinco minutos. Arquivos grandes e vídeos não fazem parte da biblioteca atual. Não há envio automático de convites de acesso; o painel prepara uma mensagem para copiar e compartilhar.

## Ações que dependem do proprietário

1. Acessar o admin com `ramos.guilherme1999@gmail.com`, já autorizado como administrador. A conta real ainda não havia sido criada na conferência de produção.
2. Usar **Entrar com Google** com esse mesmo e-mail, ou **Primeiro acesso**, criar a própria senha com pelo menos oito caracteres e confirmar o e-mail. A senha pode ser composta somente por números; não há senha padrão publicada.
3. Fornecer/cadastrar os dados reais e materiais autorizados da Elass e liberar o e-mail de cada casal apenas no evento correspondente.
4. Para as integrações externas, escolher e configurar as contas dos provedores desejados. Não enviar credenciais por mensagens ou registrar segredos no GitHub.

A documentação técnica de execução, segurança, backup e limitações complementares está em `docs/plataforma-operacao.md`.
