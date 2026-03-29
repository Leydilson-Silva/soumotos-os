export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "") // 1. Remove tudo que não é número
    .replace(/^(\d{2})(\d)/g, "$1  $2") // 2. Coloca parênteses em volta do DDD
    .replace(/(\d{5})(\d)/, "$1-$2") // 3. Adiciona o hífen após os 5 primeiros dígitos do corpo
    .substring(0, 15); // 4. Limita o tamanho total
};

export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "") // 1. Remove tudo que não é número
    .replace(/(\d{3})(\d)/, "$1.$2") // 2. Adiciona o primeiro ponto
    .replace(/(\d{3})(\d)/, "$1.$2") // 3. Adiciona o segundo ponto
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // 4. Adiciona o hífen
    .substring(0, 14); // 5. Limita o tamanho total
};