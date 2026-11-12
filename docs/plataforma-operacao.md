# Elass Cerimonial — plataforma integrada

## Arquitetura e execução

O site institucional HTML foi preservado e atualizado. `/api/app` é uma função Node na Vercel. O painel e portal usam o mesmo cliente ESM, compilado com esbuild. O banco Lakebase Postgres/Neon é acessado exclusivamente pelo servidor. Neon Managed Better Auth cuida de cadastro, senhas, verificação de e-mail, recuperação e Google OAuth; a aplicação não armazena senhas.

```
npm ci
node --env-file=.env scripts/migrate.mjs
npm run build
npm run dev
npm test
```

Variáveis (nunca colocar valores secretos no Git): `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `APP_ORIGIN`; `EXTRA_ORIGINS` é uma lista opcional de origens exatas autorizadas. Os domínios reais também precisam constar no allowlist do provedor de autenticação. A Vercel fornece `VERCEL_URL` e `VERCEL_BRANCH_URL` para as origens de cada implantação.

## Acesso e autorização

`/admin` e `/portal` exibem login. O cadastro por si só não autoriza leitura. É necessário e-mail verificado e uma concessão ativa em `access_grants`. O administrador inicial foi autorizado com o e-mail do responsável TECLEX já informado no projeto; nenhuma senha padrão foi criada. O titular pode usar Google com o mesmo e-mail ou cadastrar sua senha e verificar o código de e-mail.

Na área Equipe e acessos, o administrador informa o e-mail, perfil e eventos autorizados. Compartilha manualmente `/portal` ou `/admin`. Não há disparo automático de convites. Administrador e coordenador têm acesso global à operação; o coordenador não gerencia permissões nem auditoria. Equipe e recepção recebem escopo por evento. O casal só recebe campos e registros compartilhados do próprio evento. As permissões são verificadas novamente no servidor.

O JWT é validado com emissor e audiência do host Neon e as chaves públicas da mesma instância, consultadas no schema gerenciado `neon_auth.jwks` e mantidas em memória por até 60 segundos. Nunca consultamos as chaves privadas. Tokens do provedor expiram em aproximadamente 15 minutos; desativar a concessão bloqueia a API imediatamente. Sair encerra a sessão do navegador, mas não revoga retroativamente um JWT já emitido antes de sua expiração.

## Fluxo operacional

1. O formulário público grava um lead, consentimento e notificação. Somente depois oferece continuar no WhatsApp.
2. CRM: editar, pesquisar, filtrar, alternar funil/lista, registrar interações e próximas atividades, cadastrar propostas e converter para cliente sem duplicação.
3. Cadastrar o evento vinculado ao cliente. Escolher o evento no topo para administrar tarefas, cronograma, contratações, contratos, convidados, mesas, documentos, recados e briefing.
4. Aplicar checklists com prazos relativos à data do evento.
5. Autorizar o e-mail do casal no evento. O formulário tem cinco grupos, rascunho, conclusão e controle de versão. Salvar é explícito; não há autosave silencioso.
6. Cadastrar convite individual ou de grupo. Gerar link privado de RSVP. Regenerar invalida o link anterior; só o hash do token é persistido. Um grupo guarda os nomes dos membros em campo textual e confirma uma quantidade total autorizada.
7. Mesas são alocadas por grupo e a capacidade é validada no banco. O check-in aceita apenas grupos confirmados, preserva operador e horário e impede repetição. O check-in atual registra a chegada total do grupo uma única vez, sem chegadas fracionadas.
8. CMS: textos configurados da home, serviços, FAQ, histórias autorizadas, depoimentos e parceiros. Publicar determina o que fica disponível na API pública. Textos e links são renderizados sem HTML arbitrário.

## Financeiro

Contratos ativos geram receita contratada; pagamentos registram caixa efetivo. Rascunhos/cancelados/arquivados não compõem contratado. Adiantamentos são identificados como tal. Estornos mantêm o histórico. A operação atômica `add_payment` trava o contrato, valida saldo e usa chave de idempotência para evitar duplicidade. Não há botão para apagar pagamentos.

Exemplo validado: contrato de R$ 2.000, adiantamento R$ 350, saldo R$ 1.650, evento em Planejamento. Situação financeira e situação operacional são independentes. As despesas distinguem previstas, pagas e canceladas. Parcelas registram vencimentos, enquanto recebimentos são lançados por contrato; esta versão não concilia um pagamento automaticamente com uma parcela específica.

## Arquivos

PDF, PNG e JPEG de até 2 MB, com validação de assinatura binária. Armazenamento privado em bytea, adequado para esta primeira versão de volume reduzido. Download exige autenticação e autorização por evento. Reenviar com o mesmo título preserva versões. Arquivos são baixados como anexos, sem execução no domínio. Não há assinatura eletrônica integrada. O CMS recebe URLs HTTPS de imagens; upload de galeria pública ainda depende de armazenamento de mídia específico.

## Banco e recuperação

Projeto: `weathered-water-11959679`; produção: `br-raspy-sea-beye3vya`. As migrações são aditivas e versionadas em `migrations`. O estado anterior do site permanece no commit `5c6c1f042756244d24296aad3ff530fa5a8ce17b`.

O projeto tem janela de histórico de 24 horas. Antes de alteração estrutural, criar uma branch Neon a partir do ponto desejado. Para recuperar dados, criar uma branch de recuperação a partir do ponto no tempo dentro da janela, verificar os registros e exportar/restaurar apenas o necessário. Não substituir ou excluir produção automaticamente. Para cópia externa, usar `pg_dump --format=custom` com `DATABASE_URL` injetada por ambiente em um canal privado e guardar o arquivo de forma criptografada; nenhum dump com dados reais é publicado no repositório. A restauração exige validação e autorização específica se puder sobrescrever dados reais.

## Validação

`npm test`: regras monetárias, validação, permissões e filtragem de campos. `tests/integration.test.mjs`: fluxo HTTP real, autenticação assinada, CRM, conversão idempotente, eventos, adiantamento, bloqueio de saldo excedente, isolamento de casal, briefing, capacidade de mesas, RSVP, check-in duplicado, documentos, CMS e conflitos de edição. Dados de teste permanecem apenas na branch de validação. A produção não recebe clientes ou eventos de demonstração.

Para executar a integração, usar banco e autenticação exclusivos de teste em `.env.test`, preparar credenciais locais protegidas e rodar `node scripts/run-integration.mjs`. O script `scripts/test-auth.mjs` é somente uma fixture de validação: cria usuário fictício e confirma e-mail diretamente no banco de teste. Nunca usá-lo no ambiente de produção.

## Limitações e próximas entregas

- Google OAuth e autenticação gerenciada configurados. O SMTP compartilhado é o inicial do provedor; SMTP próprio da marca requer credenciais e validação de entrega. A aplicação não afirma que o e-mail chegou ao destinatário.
- Sem disparos automáticos de WhatsApp, assinatura eletrônica, cobrança online ou sincronização de calendário externo.
- Sem importação em lote, editor de layout de mesas, QR Code ou chegadas parciais por grupo.
- Histórico comercial e propostas são registros operacionais; não há gerador de documento comercial diagramado nesta versão.
- As buscas são por módulo; a busca do cabeçalho direciona ao CRM. Não é busca cruzada por toda a plataforma.
- As exportações operacionais refletem a página filtrada visível. O financeiro exporta até 500 movimentações recentes.
- Há política informativa de privacidade; não há rotina automatizada de retenção/exclusão nem garantia de conformidade jurídica integral. Solicitações dos titulares são tratadas pela administração.
- Telas, regras e persistência formam um núcleo operacional; a lista ampliada do prompt continua sendo evolução de produto, não uma alegação de equivalência integral ao software de referência.
