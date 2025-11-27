# Intuitive

![Java](https://img.shields.io/badge/Java-17-red)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)
![Expo](https://img.shields.io/badge/Expo-54.0-000020)

## 📖 Sobre o Projeto

O **Intuitive** é um aplicativo mobile desenvolvido para promover uma relação mais consciente e saudável com a alimentação. Diferente dos aplicativos tradicionais focados em contagem de calorias e dietas restritivas, o Intuitive prioriza a autorreflexão, a escuta dos sinais corporais e o bem-estar emocional.

## 🎯 Objetivos

**Objetivo Geral:**
Desenvolver um aplicativo de alimentação intuitiva que auxilie os usuários a refletirem sobre seus hábitos alimentares, emoções e motivações, promovendo uma relação saudável com a comida.

**Objetivos Específicos:**
- Criar um sistema de cadastro e login de usuários
- Implementar registros de refeições que incluam aspectos emocionais e contextuais
- Disponibilizar relatórios que ofereçam insights sobre a alimentação do usuário

### 💡 Problema e Solução

**Problema:**
- Desconexão das pessoas com seus sinais internos de fome e saciedade
- Influência negativa de redes sociais e conteúdos não confiáveis sobre alimentação
- Predominância de aplicativos focados apenas em métricas quantitativas (calorias)
- Abordagens restritivas que podem gerar ansiedade e comportamentos alimentares disfuncionais

**Solução:**
- Aplicativo centrado na **alimentação intuitiva** e **consciente**
- Registro de refeições com contexto emocional e ambiental
- Relatórios que facilitam a identificação de padrões comportamentais
- Abordagem não-prescritiva e focada no autoconhecimento

## 👥 Público-Alvo

Pessoas que:
- Buscam uma relação mais saudável com a comida
- Desejam compreender seus padrões alimentares emocionais
- Preferem uma abordagem não-restritiva da alimentação

## ✨ Funcionalidades Principais

### 🎯 Essenciais (MVP)
- **Sistema de Conta** - Cadastro, login e gestão de perfil
- **Registro de Refeições** - Com data/hora, tipo de refeição, dados emocionais e contextuais
- **Histórico de Refeições** - Visualização e gestão dos registros  
- **Dashboard de Relatórios** - Análise de padrões dos últimos 7 e 30 dias

### 📊 Relatórios Disponíveis
- Média de refeições diárias
- Média de fome antes das refeições
- Média de saciedade depois das refeições
- Percentual de distrações durante as refeições
- Análise de emoções antes e após as refeições

## 🛠 Tecnologias Utilizadas

### **Frontend (Mobile)**
- **React Native 0.81.5** com **Expo 54.0.25**
- **TypeScript 5.9.2**
- **Expo Router** para navegação
- **Axios** para consumo de API

### **Backend**  
- **Java 17**
- **Spring Boot 3.5.5**
- **Spring Data JPA** para persistência
- **Spring Web** para API REST

### **Banco de Dados**
- **MySQL 8.0**

### **Ferramentas e Plataformas**
- **Figma** para prototipação
- **Postman** para testes de API
- **Android Studio** para desenvolvimento
- **Expo Go** para testes em dispositivos
- **Git e GitHub** para versionamento e controle de código
- **Railway** para deployment

## 👥 Equipe

| Nome | LinkedIn |
|------|----------|
| Debora Cavalcante Santos | *[[LinkedIn]](https://www.linkedin.com/in/debora-cavalcante-santos-1a2451211/)* |
| Isabella de Paula Albuquerque | *[[LinkedIn]](https://www.linkedin.com/in/isabella-albuquerqueque-/)* |
| Katia de Souza Martins | *[[LinkedIn]](https://www.linkedin.com/in/martinskatia/)* |

## 🚀 Como Executar

### **Pré-requisitos**
- Node.js 18+ 
- Java 17
- MySQL 8.0+
- Expo CLI
- Git
- **Para execução do app mobile:**
  - Android Studio (para emulador) **OU**
  - Smartphone com Expo Go instalado

### **Backend**

```bash
# Entre na pasta do backend
cd backend

# Configure o banco de dados no arquivo application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/intuitive
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# Execute a aplicação Spring Boot
./mvnw spring-boot:run
```

### **Frontend**

```bash
# Entre na pasta do frontend
cd frontend/intuitiveapp

# Instale as dependências
npm install

# Configure a URL da API no arquivo .env
API_BASE_URL=http://localhost:8080

# Execute o projeto
npx expo start

# Após executar, você pode:
# - Escanear o QR code com Expo Go no smartphone
# - Ou pressionar 'a' para abrir no emulador Android
# - Ou pressionar 'w' para abrir no navegador web
```

## 📁 Estrutura do Projeto

**Backend (Spring Boot)**
- `src/main/java/com/intuitive/app/`
  - `business/` - Lógica de negócio
  - `controller/` - Controladores REST  
  - `DTO/` - Objetos de transferência de dados
  - `entitys/` - Entidades JPA
  - `repository/` - Repositórios de dados
- `src/main/resources/`
  - `application.properties` - Configurações do banco
- `pom.xml` - Dependências Maven

**Frontend (React Native)**
- `src/`
  - `app/` - Navegação e telas
  - `components/` - Componentes reutilizáveis
  - `services/` - Serviços de API
  - `hooks/` - Hooks customizados
  - `constants/` - Constantes e configurações
- `assets/` - Imagens e recursos
- `package.json` - Dependências Node.js

## 🚀 Deploy

O projeto está deployado na plataforma **Railway**:
- **Backend**: Disponível via Railway
- **Frontend**: Build APK via Expo EAS
- **Banco de Dados**: MySQL hospedado no Railway

## 📊 Status do Projeto

✅ **MVP Concluído** - Versão funcional para apresentação do TCC

### Funcionalidades Implementadas
- [x] CRUD completo de usuários
- [x] CRUD completo de refeições
- [x] Dashboard com relatórios de hábitos alimentares
- [x] API RESTful 
- [x] Deploy em produção

### Próximos Passos Planejados
- [ ] Recuperação de senha por e-mail
- [ ] Implementação do timer para alimentação consciente
- [ ] Novos tipos de relatórios e insights
- [ ] Sistema de notificações e lembretes

**Trabalho de Conclusão de Curso**  
Fatec Ipiranga - Análise e Desenvolvimento de Sistemas - 2025

*Promovendo uma relação mais consciente e saudável com a alimentação*

