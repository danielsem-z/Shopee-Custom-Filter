# Shopee Custom Filter

Este é um script desenvolvido para personalizar e filtrar os resultados de pesquisa no site Shopee.

## Uso:

1. Você deve alterar o seu CEP no script.js
2. Acesse qualquer pagina da Shopee
3. Clique no botão flutuante "Apenas Correios" no lado direito da pagina.
4. Repita o passo 3 ate você ver que não tem mais alteração nos itens disponiveis
5. Os itens que sobrarem são produtos que suportam a entrega pelo Correios

## Funcionalidades:

* O script é projetado para funcionar em qualquer página da Shopee, permitindo que seja executado em diferentes seções do site, como resultados de pesquisa, páginas de categorias, etc.
* O script busca todos os links da página e verifica se eles correspondem a um padrão específico. Ele filtra apenas os links que correspondem a um formato específico, contendo informações relevantes para a verificação de suporte de entrega pelos Correios.
* Ao encontrar links correspondentes, o script extrai os IDs do item e da loja e realiza uma consulta na API da Shopee para verificar se o item oferece suporte à entrega pelos Correios.
* Com base nos resultados da consulta, os itens são destacados ou removidos da página, dependendo do suporte aos Correios. Os itens que não oferecem suporte aos Correios são removidos ou destacados para facilitar a identificação.
* O script adiciona um botão "Apenas Correios" à página, permitindo que o usuário filtre rapidamente os itens que suportam a entrega pelos Correios.

## Observações

* Este script foi desenvolvido com o objetivo de funcionar em várias páginas da Shopee. No entanto, devido à natureza dinâmica dos sites e possíveis mudanças na estrutura ou comportamento da Shopee, pode haver casos em que o script não funcione corretamente ou gere erros não previstos.
