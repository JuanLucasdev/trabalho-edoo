# 🏥 Sistema de Monitoramento Hospitalar

Este repositório contém a implementação de um sistema hospitalar integrado desenvolvido para a disciplina **Engenharia e Desenvolvimento Orientado a Objetos (EDOO)**.  
O projeto aplica de forma prática os conceitos de **Encapsulamento**, **Herança**, **Polimorfismo** e **Abstração**, integrando **C++ (backend)** e **React (frontend)** em um ambiente que simula o gerenciamento de um hospital — com controle de pacientes, médicos e leitos.



## 🚀 Funcionalidades

- Cadastro e listagem de pacientes  
- Cadastro e listagem de médicos  
- Visualização e controle de leitos hospitalares  
- Internação e alta de pacientes  
- Reset completo do sistema hospitalar  
- Geração de relatório em formato JSON  
- Interface web interativa para visualização e controle  



## 🛠 Tecnologias Utilizadas

### 🔹 Backend (C++)
- Linguagem: **C++17**  
- Paradigma: **Programação Orientada a Objetos**  
- Estruturas da STL: `vector`, `string`, `fstream`, `sstream`  
- Compilador: **g++ (MinGW ou GCC)**  
- Servidor HTTP simples implementado em C++  

### 🔹 Frontend (React)
- Framework: **React + Vite**  
- Estilo: **CSS modular**  
- Componentização: **JSX**  
- Gerenciamento de estado: **Context API (HospitalContext.jsx)**  
- Estrutura modular por componentes e páginas  



## 📂 Estrutura do Projeto
```
TRABALHO-EDOO/
├── .vscode/
│   ├── c_cpp_properties.json
│   └── settings.json
├── dashbord/
│   ├── public/
│   │   └── vite.svg
│   └── src/
│       ├── assets/
│       │   └── react.svg
│       ├── components/
│       │   ├── BedMap.jsx
│       │   ├── DischargeModal.jsx
│       │   ├── EvaluateModal.jsx
│       │   ├── HistoryModal.jsx
│       │   ├── Modal.jsx
│       │   └── Sidebar.jsx
│       ├── context/
│       │   └── HospitalContext.jsx
│       ├── css/
│       │   ├── bedmap.css
│       │   ├── dashboard.css
│       │   ├── doctors.css
│       │   ├── modal.css
│       │   ├── patients.css
│       │   ├── reports.css
│       │   └── sidebar.css
│       └── pages/
│           ├── Dashbord.jsx
│           ├── Doctors.jsx
│           └── Patients.jsx
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── .gitignore
├── .eslintrc.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
├── a.exe
├── backend.cpp
├── hospital.exe
├── hospital.h
├── main.cpp
├── Medico.h
├── Paciente.h
├── pessoa.h
└── relatorio.json

```

## 📖 Conceitos de POO Aplicados

### 🧩 Encapsulamento
Os dados das classes (`Pessoa`, `Medico`, `Paciente`, `Hospital`) são protegidos por meio de **atributos privados**, com acesso controlado via **métodos getters e setters**.

### 🧬 Herança
As classes `Medico` e `Paciente` **herdam** de `Pessoa`, compartilhando atributos e comportamentos comuns, reduzindo redundâncias e aumentando a coesão do código.

### 🌀 Polimorfismo
A arquitetura do projeto permite **especializações de métodos entre subclasses**, possibilitando comportamentos distintos para objetos derivados da mesma classe base.

### 🧠 Abstração
O sistema representa de forma **simplificada e realista** um ambiente hospitalar, modelando entidades como pessoas, médicos, pacientes e leitos em classes específicas, com métodos que simulam suas ações.


## 🌐 Comunicação Frontend ↔ Backend

| Método | Rota        | Descrição                    |
|--------|--------------|------------------------------|
| GET    | /pacientes   | Retorna lista de pacientes   |
| POST   | /pacientes   | Cadastra um novo paciente    |
| GET    | /medicos     | Retorna lista de médicos     |
| POST   | /medicos     | Cadastra um novo médico      |
| GET    | /leitos      | Retorna status dos leitos    |
| POST   | /internar    | Interna um paciente          |
| POST   | /avaliar     | Dá alta a um paciente        |
| DELETE | /resetar     | Reseta o sistema             |
| GET    | /exportar    | Gera o arquivo `relatorio.json` |

## 💡 Arquitetura do Projeto
Este projeto foi concebido com uma arquitetura de duas camadas, onde o backend e o frontend operam de forma independente, mas complementar.

### Core do Projeto (Backend em C++)
O coração deste projeto existe de forma autônoma e é implementado puramente em C++.

Esta parte é responsável por toda a lógica de negócio, gestão de dados (incluindo os arquivos .h e o relatorio.json), e por executar as operações essenciais do sistema hospitalar. O executável (hospital.exe ou backend.cpp) pode ser executado separadamente, comprovando que a funcionalidade principal do sistema opera independentemente de qualquer interface gráfica.

### Frontend (Interface em React/Vite)
O diretório dashbord/ representa o complemento visual do projeto, desenvolvido com React e Vite.

Ele serve como uma Interface de Usuário (UI) moderna e amigável para interagir com o backend. O frontend tem como objetivo visualizar o estado do sistema, enviar comandos e apresentar os relatórios de forma intuitiva, mas não contém a lógica primária do sistema. Ele apenas consome os dados e funcionalidades providas pela camada de backend em C++.

## ⚙️ Como Executar o Projeto

### 🩺 Backend (C++)
```
g++ -o hospital backend.cpp
./hospital
```
Servidor disponível em:

👉 http://localhost:8080

### 💻 Frontend (React)
```
cd trabalho
npm install
npm run dev
```
Sistema acessível em:

👉 http://localhost:5173



## 👥 Autores
Juan Lucas

Matheus Silva

Willian Santos



## 📢 Agradecimentos
Agradecimentos ao professor Francisco Paulo Magalhães Simões e à equipe de monitoria da disciplina EDOO pelo suporte técnico e acadêmico durante o desenvolvimento do projeto.


